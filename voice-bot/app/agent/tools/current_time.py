from datetime import UTC, datetime

from pydantic import BaseModel

from app.agent.tools.base import Tool, ToolContext


class CurrentTimeArgs(BaseModel):
    """No arguments."""


class CurrentTimeTool(Tool[CurrentTimeArgs]):
    name = "get_current_time"
    description = "Get the current date and time in UTC."
    args_model = CurrentTimeArgs
    required_scope = "tools:basic"
    timeout_s = 2.0
    has_side_effects = False

    async def execute(self, args: CurrentTimeArgs, ctx: ToolContext) -> str:
        return datetime.now(UTC).strftime("%A, %d %B %Y, %H:%M UTC")