"""
MindCare AI — FastAPI Application Entry Point
Replaces backend/server.js
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import connect_db, close_db

# Import all routers
from .routes.health import router as health_router
from .routes.chat import router as chat_router
from .routes.moods import router as moods_router
from .routes.resources import router as resources_router
from .routes.activities import router as activities_router
from .routes.coping_plan import router as coping_plan_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: connect to MongoDB. Shutdown: close connection."""
    await connect_db()
    print(f"🚀 MindCare AI Server running on port {settings.PORT}")
    print(f"📍 Health Check: http://localhost:{settings.PORT}/api/health")
    print(f"📚 API Docs: http://localhost:{settings.PORT}/docs")
    yield
    await close_db()


app = FastAPI(
    title="MindCare AI",
    description="MindCare AI Backend Service — Python FastAPI",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow local dev servers, configured FRONTEND_URL, and Vercel deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_origin_regex=r"^https:\/\/.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(health_router)
app.include_router(chat_router)
app.include_router(moods_router)
app.include_router(resources_router)
app.include_router(activities_router)
app.include_router(coping_plan_router)
