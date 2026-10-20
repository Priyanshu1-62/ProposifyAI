"""Normalized LLM errors.

Adapters catch vendor SDK exceptions and re-raise these (use `raise ... from exc`
to keep the original). Retry/fallback logic in the agent depends only on this
hierarchy, never on a vendor's exception classes.

`retryable` says whether the failure is transient. Whether a retry is actually
safe is a separate rule: retry only if no token has been emitted yet.
"""


class LLMError(Exception):
    retryable: bool = False

    def __init__(self, message: str = "", *, provider: str | None = None) -> None:
        super().__init__(message)
        self.provider = provider


# --- Transient: safe to retry (before first token) ---------------------------


class LLMConnectionError(LLMError):
    """Could not reach the provider (DNS, connection reset, etc.)."""

    retryable = True


class LLMTimeoutError(LLMError):
    """No first token, or total call time, exceeded the configured timeout."""

    retryable = True


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
    """Provider-side 5xx / overloaded."""

    retryable = True


# --- Permanent: retrying will not help ---------------------------------------


class LLMAuthError(LLMError):
    """Bad or missing API key / permissions. A config problem, not a call problem."""


class LLMBadRequestError(LLMError):
    """Invalid request (bad params, context too long, malformed messages)."""


class LLMContentFilterError(LLMError):
    """Provider refused or filtered the request or response."""
    