from functools import lru_cache
from pathlib import Path
from typing import Annotated, Any

from pydantic import AnyHttpUrl, PostgresDsn, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict

# app/core/config.py -> core/ -> app/ -> voice-bot/
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE_PATH = BASE_DIR / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ENV_FILE_PATH,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    DATABASE_URL: PostgresDsn

    # NoDecode: hand the raw env string to the validator instead of JSON-parsing it first
    BACKEND_CORS_ORIGINS: Annotated[list[AnyHttpUrl], NoDecode] = []

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def split_cors_origins(cls, v: Any):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v


@lru_cache
def get_settings() -> Settings:
    # Pylance false positive: required fields are filled from the environment at runtime
    return Settings()  # pyright: ignore[reportCallIssue]