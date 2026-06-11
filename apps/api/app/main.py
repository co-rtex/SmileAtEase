from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes.assessments import router as assessments_router
from app.routes.health import router as health_router
from app.routes.plans import router as plans_router


def create_app() -> FastAPI:
  app = FastAPI(title="SmileAtEase API", version="0.1.0")

  app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
  )

  app.include_router(health_router, prefix="/api")
  app.include_router(assessments_router, prefix="/api")
  app.include_router(plans_router, prefix="/api")

  return app


app = create_app()
