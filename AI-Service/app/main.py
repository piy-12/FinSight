from fastapi import FastAPI

from app.core.config import settings

from app.api.routes import health, financial


app = FastAPI(

    title=settings.APP_NAME,

    version=settings.APP_VERSION,

    description="Agentic AI Financial Intelligence Platform"

)

app.include_router(
    health.router,
    prefix="/api/v1",
    tags=["Health"]
)


app.include_router(
    financial.router,
    prefix="/api/v1/financial",
    tags=["Financial Intelligence"]
)


@app.get("/")
async def root():

    return {
        "application": "FinSight",
        "service": "AI Microservice",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT
    }