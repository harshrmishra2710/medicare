"""
MindCare AI — Activities Route (GET /api/activities)
Direct port of backend/routes/activities.js
"""

from fastapi import APIRouter

from ..database import get_db, get_connection_status
from ..data.seed_activities import activities_data

router = APIRouter(prefix="/api/activities", tags=["Activities"])


def _serialize(doc: dict) -> dict:
    """Convert MongoDB document to JSON-safe dict."""
    doc["_id"] = str(doc["_id"])
    return doc


@router.get("/")
async def get_activities():
    """Fetch all coping toolkit predefined activities."""
    try:
        if get_connection_status():
            db = get_db()
            activities = []
            async for doc in db.activities.find():
                activities.append(_serialize(doc))

            if not activities:
                # Seed initial activities if collection is empty
                await db.activities.insert_many(
                    [dict(a) for a in activities_data]
                )
                activities = []
                async for doc in db.activities.find():
                    activities.append(_serialize(doc))

            return {"success": True, "data": activities, "isDbConnected": True}
        else:
            return {
                "success": True,
                "data": activities_data,
                "isDbConnected": False,
                "message": "Loaded coping activities from fallback dataset.",
            }
    except Exception as e:
        print(f"GET /api/activities error: {e}")
        return {"success": False, "error": "Failed to fetch coping activities."}
