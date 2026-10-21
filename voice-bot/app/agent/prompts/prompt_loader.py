from functools import lru_cache
from pathlib import Path

PROMPTS_DIR = Path(__file__).parent


@lru_cache
def load_prompt(version: str = "system_v1") -> str:
    """Return the prompt text. The version is the file stem and is the ID to
    log per turn in `llm_calls`."""
    return (PROMPTS_DIR / f"{version}.md").read_text(encoding="utf-8").strip()