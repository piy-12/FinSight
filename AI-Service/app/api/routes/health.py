from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():

    return {
        "status": "healthy",
        "service": "FinSight AI",
        "message": "AI Service is running successfully"
    }