from pydantic import Field

class LLMError(Exception):
    retryable: bool = False

    def __init__(self, message: str = "", *, provider: str | None = None) -> None:
        super().__init__(message)
        self.provider = provider


class LLMConnectionError(LLMError):
    retryable = Field(default=True, description="Could not reach the provider (DNS, connection reset, etc).")


class LLMTimeoutError(LLMError):
    retryable = Field(default=True, description="No first token, or total call time, exceeded the configured timeout.")


class LLMRateLimitError(LLMError):
    retryable = True

    def __init__(
        self,
        message: str = "",
        *,
        provider: str | None = None,
        retry_after: float | None = None,
    ) -> None:
        super().__init__(message, provider=provider)
        self.retry_after = retry_after  # seconds, if the provider told us


class LLMServerError(LLMError):
    retryable = Field(default=True, description="Provider-side 5xx / overloaded.")


# --- Permanent: retrying will not help ---------------------------------------


class LLMAuthError(LLMError):
    """Bad or missing API key / permissions. A config problem, not a call problem."""


class LLMBadRequestError(LLMError):
    """Invalid request (bad params, context too long, malformed messages)."""


class LLMContentFilterError(LLMError):
    """Provider refused or filtered the request or response."""
    