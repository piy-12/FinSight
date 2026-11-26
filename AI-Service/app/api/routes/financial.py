from fastapi import APIRouter, Header, HTTPException
import httpx

from app.graphs import run_financial_chat
from app.schemas.financial import ChatRequest, ChatResponse
from app.services.financial_data_service import financial_data_service

router = APIRouter()


@router.get("/context")
async def get_financial_context(
    authorization: str | None = Header(default=None)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")

    try:
        context = await financial_data_service.get_financial_context(authorization)
        return {"success": True, "data": context}
    except httpx.HTTPStatusError as error:
        status_code = error.response.status_code
        if status_code == 401:
            raise HTTPException(status_code=401, detail="Invalid or expired authentication token")
        if status_code == 404:
            raise HTTPException(status_code=404, detail="User profile not found")
        raise HTTPException(status_code=502, detail="Unable to retrieve financial information")
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="FinSight backend is unavailable")


@router.post("/chat", response_model=ChatResponse)
async def chat_with_financial_advisor(
    payload: ChatRequest,
    authorization: str | None = Header(default=None)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")

    try:
        reply, thread_id = await run_financial_chat(
            message=payload.message,
            access_token=authorization,
            thread_id=payload.thread_id,
        )
        return ChatResponse(success=True, reply=reply, thread_id=thread_id)
    except httpx.HTTPStatusError as error:
        if error.response.status_code == 401:
            raise HTTPException(status_code=401, detail="Invalid or expired authentication token")
        raise HTTPException(status_code=502, detail="Unable to retrieve financial information from backend")
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="FinSight backend is unavailable")
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"AI Advisor error: {str(error)}")