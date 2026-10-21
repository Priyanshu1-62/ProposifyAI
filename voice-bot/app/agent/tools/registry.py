"""Turns a model-requested ToolCall into a ToolMessage.

`ToolRegistry.execute` never raises for tool-level failures: whatever it
returns can be appended to the history as-is. The one exception is
`asyncio.CancelledError`, which is deliberately not caught so barge-in works.
"""

import asyncio
import time
from collections.abc import Collection
from dataclasses import dataclass
from typing import Any, Literal

import structlog
from pydantic import ValidationError

from app.agent.llm.types import ToolCall, ToolMessage, ToolSpec
from app.agent.tools.base import Tool, ToolContext, ToolError

AnyTool = Tool[Any]

log = structlog.get_logger(__name__)

ToolStatus = Literal[
    "ok", "tool_error", "unknown_tool", "denied", "invalid_args", "timeout", "crashed"
]

DEFAULT_MAX_RESULT_CHARS = 2000


@dataclass(frozen=True, slots=True)
class ToolResult:
    """Message for the model plus audit info for the `tool_calls` table."""

    message: ToolMessage
    status: ToolStatus
    duration_s: float


class ToolRegistry:
    def __init__(self, max_result_chars: int = DEFAULT_MAX_RESULT_CHARS) -> None:
        self._tools: dict[str, AnyTool] = {}
        self._max_result_chars = max_result_chars

    def register(self, tool: AnyTool) -> None:
        if tool.name in self._tools:
            raise ValueError(f"Tool already registered: {tool.name}")
        self._tools[tool.name] = tool

    def specs_for(self, scopes: Collection[str]) -> list[ToolSpec]:
        """Specs of the tools these scopes may use, to show to the model."""
        return [
            tool.to_spec()
            for tool in self._tools.values()
            if tool.required_scope in scopes
        ]

    async def execute(self, call: ToolCall, ctx: ToolContext) -> ToolResult:
        start = time.monotonic()

        def result(status: ToolStatus, content: str) -> ToolResult:
            message = ToolMessage(call.id, content, is_error=status != "ok")
            duration = time.monotonic() - start
            log.info(
                "tool_call",
                tool=call.name,
                call_id=call.id,
                status=status,
                duration_s=round(duration, 3),
            )
            return ToolResult(message, status, duration)

        tool = self._tools.get(call.name)
        if tool is None:
            return result("unknown_tool", f"Unknown tool: {call.name}")

        # Re-check even though specs_for filtered: never trust the model to
        # call only what it was shown.
        if tool.required_scope not in ctx.scopes:
            return result("denied", f"Not permitted to use tool: {call.name}")

        try:
            args = tool.args_model.model_validate_json(call.args)
        except ValidationError as exc:
            problems = "; ".join(
                f"{'.'.join(str(p) for p in e['loc']) or 'arguments'}: {e['msg']}"
                for e in exc.errors(include_url=False, include_context=False, include_input=False)
            )
            return result("invalid_args", f"Invalid arguments: {problems}")

        try:
            async with asyncio.timeout(tool.timeout_s):
                output = await tool.execute(args, ctx)
        except TimeoutError:
            return result("timeout", f"Tool timed out after {tool.timeout_s} seconds")
        except ToolError as exc:
            return result("tool_error", str(exc))
        except Exception:
            # Bug or infrastructure failure: keep details in logs, not in the model's context.
            log.exception("tool_crashed", tool=call.name, call_id=call.id)
            return result("crashed", "Tool failed unexpectedly")
        # CancelledError is a BaseException, so it is not caught above and propagates.

        if len(output) > self._max_result_chars:
            output = output[: self._max_result_chars] + " ...[truncated]"
        return result("ok", output)