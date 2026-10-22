"""Sliding-window trimming of conversation history to a token budget.

Pure functions: no I/O, inputs are never mutated.

History is split into *turn blocks*. A block starts at a UserMessage and runs up
to the next UserMessage, so it contains the user message, any assistant tool
calls, their ToolMessages, and the final reply. Blocks are dropped whole, oldest
first, which guarantees a tool call is never separated from its results.
"""

import json
from collections.abc import Callable, Sequence
from dataclasses import dataclass

import structlog

from app.agent.llm.types import (
    AssistantMessage,
    Message,
    SystemMessage,
    ToolMessage,
    ToolSpec,
    UserMessage,
)

log = structlog.get_logger(__name__)

TokenCounter = Callable[[str], int]

PER_MESSAGE_OVERHEAD = 4


class ContextBudgetError(Exception):
    """The fixed parts (system prompt, tools) or the latest turn alone exceed the budget."""


@dataclass(frozen=True, slots=True)
class TrimResult:
    messages: list[Message]  # system message first, then the surviving history
    tokens: int  # estimated total, including tool specs
    dropped_blocks: int


def estimate_tokens(text: str) -> int:
    """Swap in a vendor tokenizer later by passing a different `count_tokens`."""
    return len(text) // 3 + 1


def _message_tokens(message: Message, count: TokenCounter) -> int:
    match message:
        case SystemMessage(content) | UserMessage(content):
            body = count(content)
        case AssistantMessage(content, tool_calls):
            body = count(content) + sum(
                count(c.name) + count(c.args) + count(c.id) for c in tool_calls
            )
        case ToolMessage(tool_call_id, content, _):
            body = count(tool_call_id) + count(content)
    return body + PER_MESSAGE_OVERHEAD


def _tools_tokens(tools: Sequence[ToolSpec], count: TokenCounter) -> int:
    return sum(
        count(t.name) + count(t.description) + count(json.dumps(t.parameters))
        for t in tools
    )


def split_blocks(history: Sequence[Message]) -> list[list[Message]]:
    """Group history into turn blocks. System messages are ignored (the system
    prompt is passed separately) and leading messages before the first
    UserMessage are skipped, since a window must never start mid-turn."""
    blocks: list[list[Message]] = []
    for message in history:
        if isinstance(message, SystemMessage):
            continue
        if isinstance(message, UserMessage):
            blocks.append([message])
        elif blocks:
            blocks[-1].append(message)
        else:
            log.warning("history_orphan_message_skipped", type=type(message).__name__)
    return blocks


def trim_context(
    system_prompt: str,
    history: Sequence[Message],
    tools: Sequence[ToolSpec] = (),
    *,
    max_tokens: int,
    count_tokens: TokenCounter = estimate_tokens,
) -> TrimResult:
    """Return the messages to send: the system prompt plus the newest turn
    blocks that fit in `max_tokens`.

    `max_tokens` is the INPUT budget. Subtract the tokens you reserve for the
    model's output before passing it in.

    The newest block is never dropped, even when it is an unfinished tool-call
    round in the middle of an agent loop. If it cannot fit, raises
    `ContextBudgetError` instead of silently sending a broken context.
    """
    system = SystemMessage(system_prompt)
    fixed = _message_tokens(system, count_tokens) + _tools_tokens(tools, count_tokens)
    budget = max_tokens - fixed
    if budget <= 0:
        raise ContextBudgetError(
            f"System prompt and tools use {fixed} tokens, budget is {max_tokens}"
        )

    blocks = split_blocks(history)
    kept: list[list[Message]] = []
    used = 0

    # Newest to oldest; stop at the first block that doesn't fit so the kept
    # window stays contiguous.
    for block in reversed(blocks):
        
        cost = sum(_message_tokens(m, count_tokens) for m in block)

        if used + cost > budget:
            if not kept:
                raise ContextBudgetError(
                    f"Latest turn needs {cost} tokens, only {budget} available"
                )
            break

        kept.append(block)
        used += cost

    kept.reverse()
    dropped = len(blocks) - len(kept)
    if dropped:
        log.info(
            "context_trimmed",
            dropped_blocks=dropped,
            kept_blocks=len(kept),
            tokens=fixed + used,
            max_tokens=max_tokens,
        )

    messages: list[Message] = [system]
    for block in kept:
        messages.extend(block)
    return TrimResult(messages=messages, tokens=fixed + used, dropped_blocks=dropped)