# pyrefly: ignore [missing-import]
from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    child_context: str | None = None
