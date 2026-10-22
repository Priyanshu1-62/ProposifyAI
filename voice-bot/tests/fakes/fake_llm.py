"""Scripted LLMProvider for tests. No network, fully deterministic.

Each call to `generate_stream` consumes the next scripted turn. A turn is a list
of events; an Exception instance in the list is raised when reached, so you can
fail before the first token (retry path) or mid-stream.

    llm = FakeLLMProvider([
        tool_call_turn("c1", "get_current_time"),   # 1st LLM call
        text_turn("It is ", "noon."),               # 2nd LLM call
    ])
"""

import asyncio
from collections.abc import AsyncGenerator, Sequence
from dataclasses import dataclass

from app.agent.llm.base import LLMProvider
from app.agent.llm.types import (
    Done,
    GenerationParams,
    LLMEvent,
    Message,
    TextDelta,
    ToolCall,
    ToolSpec,
    Usage,
)

Script = list[LLMEvent | Exception]


def text_turn(*chunks: str) -> Script:
    """A turn that streams the given text chunks and finishes normally."""
    return [*(TextDelta(c) for c in chunks), Usage(10, len(chunks)), Done("stop")]


def tool_call_turn(call_id: str, name: str, args: str = "{}") -> Script:
    """A turn where the model requests one tool call."""
    return [ToolCall(call_id, name, args), Usage(10, 5), Done("tool_calls")]


@dataclass(frozen=True, slots=True)
class RecordedCall:
    messages: list[Message]
    tools: list[ToolSpec]
    params: GenerationParams


class FakeLLMProvider(LLMProvider):
    def __init__(self, turns: Sequence[Script], *, event_delay: float = 0.0) -> None:
        self._turns: list[Script] = list(turns)
        self._event_delay = event_delay  # seconds before each event; for timeout tests
        self.calls: list[RecordedCall] = []  # what the agent actually sent
        self.closed_streams = 0  # incremented in `finally`; for cancellation tests

    @property
    def provider_name(self) -> str:
        return "fake"

    @property
    def model(self) -> str:
        return "fake-model"

    async def generate_stream(
        self,
        messages: Sequence[Message],
        tools: Sequence[ToolSpec] = (),
        params: GenerationParams = GenerationParams(),
    ) -> AsyncGenerator[LLMEvent]:
        self.calls.append(RecordedCall(list(messages), list(tools), params))
        if not self._turns:
            raise AssertionError(
                f"FakeLLMProvider script exhausted: unexpected LLM call #{len(self.calls)}"
            )
        events = self._turns.pop(0)
        try:
            for event in events:
                if self._event_delay:
                    await asyncio.sleep(self._event_delay)
                if isinstance(event, Exception):
                    raise event
                yield event
        finally:
            self.closed_streams += 1