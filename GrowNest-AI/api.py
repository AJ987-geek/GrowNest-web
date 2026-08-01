from fastapi import APIRouter
from models import ChatRequest
from rag_service import RAGService
from fastapi.responses import StreamingResponse
router = APIRouter()
rag = RAGService()

@router.post("/chat")
def chat(request: ChatRequest):

    return StreamingResponse(
        rag.chat(request.message, request.child_context),

        media_type="text/plain"

    )