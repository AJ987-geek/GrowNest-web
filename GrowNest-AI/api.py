from fastapi import APIRouter
from models import ChatRequest
from services import ask_ai
from fastapi.responses import StreamingResponse
router = APIRouter()


@router.post("/chat")
def chat(request: ChatRequest):

    return StreamingResponse(

        ask_ai(request.message),

        media_type="text/plain"

    )