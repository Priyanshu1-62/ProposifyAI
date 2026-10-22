"""The agent loop: build context -> stream the LLM -> run tools -> repeat -> final answer.

The agent knows nothing about WebSockets, TTS or the database. It yields events;
the session manager decides what to do with them. It never mutates the history it
is given: `TurnDone.new_messages` is everything this turn added, for the caller to
append (on barge-in the caller substitutes what was actually spoken, and no
`TurnDone` is produced because the turn was cancelled).

Never catches `CancelledError`: cancellation (barge-in) must propagate.
"""

import asyncio
import random
import time
from collections.abc import AsyncGenerator, AsyncIterator, Sequence
from contextlib import aclosing
from dataclasses import dataclass, field
from typing import Literal

import structlog

from app.agent.context import ContextBudgetError, trim_context
from app.agent.llm.base import LLMProvider
from app.agent.llm.errors import (
    LLMError,
    LLMRateLimitError,
    LLMServerError,
    LLMTimeoutError,
)
from app.agent.llm.types import (
    AssistantMessage,
    Done,
    GenerationParams,
    LLMEvent,
    Message,
    StopReason,
    TextDelta,
    ToolCall,
    ToolSpec,
    Usage,
    UserMessage,
)
from app.agent.tools.base import ToolContext
from app.agent.tools.registry import ToolRegistry, ToolStatus

log = structlog.get_logger(__name__)

# --------------------------------------------------------------------------- #
# Events yielded to the caller
# --------------------------------------------------------------------------- #

EndReason = Literal["completed", "iteration_cap", "llm_error", "budget", "timeout"]


@dataclass(frozen=True, slots=True)
class TextChunk:
    text: str


@dataclass(frozen=True, slots=True)
class ToolStarted:
    name: str
    call_id: str


@dataclass(frozen=True, slots=True)
class ToolFinished:
    name: str
    call_id: str
    status: ToolStatus


@dataclass(frozen=True, slots=True)
class TurnDone:
    new_messages: tuple[Message, ...]
    usage: Usage
    iterations: int
    end_reason: EndReason


AgentEvent = TextChunk | ToolStarted | ToolFinished | TurnDone

# --------------------------------------------------------------------------- #
# Config
# --------------------------------------------------------------------------- #


@dataclass(frozen=True, slots=True)
class AgentConfig:
    system_prompt: str
    prompt_version: str
    context_max_tokens: int  # input budget; subtract reserved output tokens first
    max_iterations: int = 5
    first_token_timeout_s: float = 8.0
    total_timeout_s: float = 60.0  # wall-clock deadline for the whole turn
    max_llm_attempts: int = 3
    retry_base_delay_s: float = 0.3
    params: GenerationParams = GenerationParams()
    fallback_text: str = "Sorry, I ran into a problem. Could you say that again?"


# --------------------------------------------------------------------------- #
# Internals
# --------------------------------------------------------------------------- #


@dataclass
class _CallResult:
    """Filled in while one LLM call streams, so the caller can read what arrived
    even if the stream fails midway."""

    text_parts: list[str] = field(default_factory=lambda: [])
    tool_calls: list[ToolCall] = field(default_factory=lambda: [])
    usage: Usage = Usage()
    stop_reason: StopReason | None = None
    ttft_s: float | None = None

    @property
    def text(self) -> str:
        return "".join(self.text_parts)


async def _next_event(
    stream: AsyncGenerator[LLMEvent, None],
    deadline: float,
    first_token_timeout_s: float | None = None,
) -> LLMEvent | None:
    """Next event, or None when the stream has ended. The timeout only covers
    this await, never the consumer's time between events."""
    limit = deadline
    if first_token_timeout_s is not None:
        limit = min(limit, asyncio.get_running_loop().time() + first_token_timeout_s)
    try:
        async with asyncio.timeout_at(limit):
            return await anext(stream)
    except StopAsyncIteration:
        return None
    except TimeoutError:
        raise LLMTimeoutError("Timed out waiting for LLM output") from None


class Agent:
    def __init__(
        self, llm: LLMProvider, registry: ToolRegistry, config: AgentConfig
    ) -> None:
        self._llm = llm
        self._registry = registry
        self._config = config

    async def run(
        self, history: Sequence[Message], user_text: str, ctx: ToolContext
    ) -> AsyncIterator[AgentEvent]:
        cfg = self._config
        loop = asyncio.get_running_loop()
        deadline = loop.time() + cfg.total_timeout_s
        tools = self._registry.specs_for(ctx.scopes)
        slog = log.bind(session_id=ctx.session_id, prompt_version=cfg.prompt_version)

        user_message = UserMessage(user_text)
        new_messages: list[Message] = [user_message]
        working: list[Message] = [*history, user_message]
        usage = Usage()
        iterations = 0
        partial = ""  # text already streamed in an iteration that then failed
        end_reason: EndReason = "iteration_cap"

        for iteration in range(1, cfg.max_iterations + 1):
            iterations = iteration

            if loop.time() >= deadline:
                end_reason = "timeout"
                break

            try:
                trimmed = trim_context(
                    cfg.system_prompt,
                    working,
                    tools,
                    max_tokens=cfg.context_max_tokens,
                )
            except ContextBudgetError:
                slog.error("context_budget_exceeded")
                end_reason = "budget"
                break

            result = _CallResult()
            failed = False
            try:
                async for chunk in self._call_llm(
                    trimmed.messages, tools, deadline, result, slog, iteration
                ):
                    yield chunk
            except LLMError as exc:
                slog.warning("llm_failed", error=type(exc).__name__, detail=str(exc))
                failed = True
            except Exception:
                slog.exception("llm_unexpected_error")
                failed = True

            usage = Usage(
                usage.prompt_tokens + result.usage.prompt_tokens,
                usage.completion_tokens + result.usage.completion_tokens,
            )

            if failed or result.stop_reason in ("content_filter", "error"):
                partial = result.text
                end_reason = "llm_error"
                break

            if result.stop_reason == "length":
                slog.warning("llm_output_truncated", iteration=iteration)

            # --- Tool round: run the calls, feed results back, loop again ------
            if result.tool_calls:
                assistant = AssistantMessage(result.text, tuple(result.tool_calls))
                new_messages.append(assistant)
                working.append(assistant)
                for call in result.tool_calls:
                    yield ToolStarted(call.name, call.id)
                    tool_result = await self._registry.execute(call, ctx)
                    new_messages.append(tool_result.message)
                    working.append(tool_result.message)
                    yield ToolFinished(call.name, call.id, tool_result.status)
                continue

            # --- Final answer ----------------------------------------------------
            new_messages.append(AssistantMessage(result.text))
            yield TurnDone(tuple(new_messages), usage, iterations, "completed")
            return

        # Anything that reaches here ended abnormally: speak a fallback line so the
        # caller always gets a clean ending.
        slog.warning("turn_ended_abnormally", end_reason=end_reason, iterations=iterations)
        yield TextChunk(cfg.fallback_text)
        content = f"{partial} {cfg.fallback_text}".strip()
        new_messages.append(AssistantMessage(content))
        yield TurnDone(tuple(new_messages), usage, iterations, end_reason)

    # ------------------------------------------------------------------ #

    async def _call_llm(
        self,
        messages: Sequence[Message],
        tools: Sequence[ToolSpec],
        deadline: float,
        result: _CallResult,
        slog: structlog.stdlib.BoundLogger,
        iteration: int,
    ) -> AsyncIterator[TextChunk]:
        """One streamed LLM call. Yields text as it arrives and records
        everything into `result`."""
        started = time.monotonic()
        stream, first = await self._open_stream(messages, tools, deadline, slog)
        result.ttft_s = time.monotonic() - started

        async with aclosing(stream):  # closes the HTTP stream on error or cancellation
            event: LLMEvent | None = first
            while event is not None:
                match event:
                    case TextDelta(text):
                        if text:
                            result.text_parts.append(text)
                            yield TextChunk(text)
                    case ToolCall():
                        result.tool_calls.append(event)
                    case Usage():
                        result.usage = event
                    case Done(stop_reason):
                        result.stop_reason = stop_reason
                event = await _next_event(stream, deadline)

        if result.stop_reason is None:
            slog.warning("llm_stream_ended_without_done", iteration=iteration)
            result.stop_reason = "stop"

        slog.info(
            "llm_call",
            iteration=iteration,
            provider=self._llm.provider_name,
            model=self._llm.model,
            prompt_tokens=result.usage.prompt_tokens,
            completion_tokens=result.usage.completion_tokens,
            ttft_s=round(result.ttft_s, 3),
            latency_s=round(time.monotonic() - started, 3),
            stop_reason=result.stop_reason,
        )

    async def _open_stream(
        self,
        messages: Sequence[Message],
        tools: Sequence[ToolSpec],
        deadline: float,
        slog: structlog.stdlib.BoundLogger,
    ) -> tuple[AsyncGenerator[LLMEvent, None], LLMEvent]:
        """Open the stream and fetch its first event. Retries (exponential backoff
        with full jitter) happen only here, i.e. only before any output exists."""
        cfg = self._config
        loop = asyncio.get_running_loop()

        for attempt in range(1, cfg.max_llm_attempts + 1):
            stream = self._llm.generate_stream(messages, tools, cfg.params)
            try:
                first = await _next_event(stream, deadline, cfg.first_token_timeout_s)
                if first is None:
                    raise LLMServerError(
                        "LLM stream ended without events",
                        provider=self._llm.provider_name,
                    )
                return stream, first
            except LLMError as exc:
                await stream.aclose()
                delay = random.uniform(0, cfg.retry_base_delay_s * 2 ** (attempt - 1))
                if isinstance(exc, LLMRateLimitError) and exc.retry_after:
                    delay = exc.retry_after
                if (
                    not exc.retryable
                    or attempt == cfg.max_llm_attempts
                    or loop.time() + delay >= deadline
                ):
                    raise
                slog.warning(
                    "llm_retry",
                    attempt=attempt,
                    error=type(exc).__name__,
                    delay_s=round(delay, 2),
                )
                await asyncio.sleep(delay)
            except BaseException:
                await stream.aclose()  # includes CancelledError: clean up, then propagate
                raise

        raise AssertionError("unreachable")