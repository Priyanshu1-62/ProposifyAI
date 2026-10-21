from abc import ABC, abstractmethod
from collections.abc import AsyncIterator, Sequence

from app.agent.llm.types import (
    GenerationParams,
    LLMEvent,
    Message,
    ToolSpec,
)


class LLMProvider(ABC):
    """Contract for implementations:
    
      - Yield events following the stream contract in `types.py`: complete
        `ToolCall`s only, `Usage` at most once, `Done` always last.
      - Be cancellation-safe: on `asyncio.CancelledError`, close the underlying
        HTTP stream in a `finally` block and let the error propagate.
      - Raise only normalized `LLMError` subclasses (see `errors.py`), never
        vendor SDK exceptions. Use `raise ... from exc` to keep the cause.
      - Do not retry internally. Retries live in the caller and apply only
        before the first event has been emitted.
      - Configure HTTP-level timeouts on the client and map them to
        `LLMTimeoutError`. First-token and total-call deadlines are enforced
        by the caller with `asyncio.timeout`.
    """

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Stable provider id, e.g. for the `llm_calls` table."""

    @property
    @abstractmethod
    def model(self) -> str:
        """Model identifier in use, e.g. for the `llm_calls` table."""

    @abstractmethod
    def generate_stream(
        self,
        messages: Sequence[Message],
        tools: Sequence[ToolSpec] = (),
        params: GenerationParams = GenerationParams(),
    ) -> AsyncIterator[LLMEvent]:

        pass
    

    async def aclose(self) -> None:
        """Release resources (e.g. an httpx.AsyncClient). Default: nothing to do."""
        return None