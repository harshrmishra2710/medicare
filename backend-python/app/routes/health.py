"""
MindCare AI — Health & Debug Routes
Ports: GET /, GET /api/health, GET /api/list-models from server.js
"""

from fastapi import APIRouter
from fastapi.responses import PlainTextResponse
from datetime import datetime
import httpx

from ..config import settings
from ..database import get_connection_status

router = APIRouter(tags=["Health"])


@router.get("/", response_class=PlainTextResponse)
async def root():
    return "MindCare AI Backend API is running smoothly. Use /api/health to inspect system status."


@router.get("/health")
@router.get("/api/health")
async def health_check():
    return {
        "status": "OK",
        "app": "MindCare AI Backend Service",
        "team": ["Harsh", "Sandeep", "Shakti", "Yusuf"],
        "timestamp": datetime.utcnow().isoformat(),
        "database": "Connected (MongoDB)" if get_connection_status() else "Memory Fallback Mode (MongoDB Offline)",
        "geminiKeyConfigured": bool(settings.gemini_key),
        "geminiModel": settings.gemini_model,
        "openAiKeyConfigured": bool(
            settings.OPENAI_API_KEY and len(settings.OPENAI_API_KEY.strip()) > 10
        ),
    }


@router.get("/api/list-models")
async def list_models():
    """Debug: List available Gemini models for the configured API key."""
    key = settings.gemini_key
    if not key:
        return {"error": "No GEMINI_API_KEY set in .env"}

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            r = await client.get(
                f"https://generativelanguage.googleapis.com/v1beta/models?key={key}"
            )
            data = r.json()
            if r.status_code != 200:
                return {"httpStatus": r.status_code, "error": data}
            names = [m["name"] for m in data.get("models", [])]
            return {"total": len(names), "models": names}
    except Exception as e:
        return {"error": str(e)}
