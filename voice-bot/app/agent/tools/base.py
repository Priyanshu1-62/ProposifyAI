from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Generic, TypeVar

from pydantic import BaseModel

from app.agent.llm.types import ToolSpec


class ToolError(Exception):
    """An expected tool failure. The message is shown to the model, so keep it
    short, factual and free of internals."""


@dataclass(frozen=True, slots=True)
class ToolContext:
    """Per-session identity handed to every tool, taken from the verified JWT.
    Tools must use this, never identity supplied by the model in its arguments."""

    user_id: str
    session_id: str
    scopes: frozenset[str] = frozenset()


ArgsT = TypeVar("ArgsT", bound=BaseModel)


class Tool(ABC, Generic[ArgsT]):
    """Definition of one tool. Subclasses set the attributes below at class level
    and implement `execute`. Lookup, auth, validation and timeouts are the
    registry's job, not this class's."""

    name: str
    description: str
    args_model: type[ArgsT]
    required_scope: str
    timeout_s: float
    has_side_effects: bool

    @abstractmethod
    async def execute(self, args: ArgsT, ctx: ToolContext) -> str:
        """Run the tool with already-validated args. Return text for the model.
        Raise `ToolError` for expected failures."""

    def to_spec(self) -> ToolSpec:
        schema = self.args_model.model_json_schema()
        schema.pop("title", None)  # Pydantic adds the class name; just noise for the model
        return ToolSpec(
            name=self.name,
            description=self.description,
            parameters=schema,
        )