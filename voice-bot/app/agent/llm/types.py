from typing import Any, Literal
from dataclasses import dataclass
from pydantic import Field


StopReason = Literal["stop", "tool_calls", "length", "content_filter", "error"]


@dataclass(frozen=True, slots=True)
class TextDelta:
    text: str =Field(description="Incremental chunk of generated text.")


@dataclass(frozen=True, slots=True)
class ToolCall:
    id: str = Field(description="Id for a complete tool call requested by the model.")
    name: str = Field(description="Tool name requested by the model.")
    args: str = Field(description="`args` is the raw JSON string exactly as the model produced it.")


@dataclass(frozen=True, slots=True)
class Usage:
    prompt_tokens: int = 0
    completion_tokens: int = 0

    @property
    def total_tokens(self) -> int:
        return self.prompt_tokens + self.completion_tokens


@dataclass(frozen=True, slots=True)
class Done:
    stop_reason: StopReason


LLMEvent = TextDelta | ToolCall | Usage | Done


@dataclass(frozen=True, slots=True)
class SystemMessage:
    content: str


@dataclass(frozen=True, slots=True)
class UserMessage:
    content: str


@dataclass(frozen=True, slots=True)
class AssistantMessage:
    content: str = Field(default="", description="Optional message.")
    tool_calls: tuple[ToolCall, ...] = Field(default=(), description="Optional tool call.")


@dataclass(frozen=True, slots=True)
class ToolMessage:
    tool_call_id: str
    content: str = Field(description="Result of executing one tool call, fed back to the model.")
    is_error: bool = False


Message = SystemMessage | UserMessage | AssistantMessage | ToolMessage


@dataclass(frozen=True, slots=True)
class ToolSpec:
    name: str
    description: str = Field(description="Description of tool as shown to the model.")
    parameters: dict[str, Any] = Field(description="A JSON Schema object, generated from the tool's Pydantic args model by the registry.")


@dataclass(frozen=True, slots=True)
class GenerationParams:
    temperature: float | None = None
    max_output_tokens: int | None = None