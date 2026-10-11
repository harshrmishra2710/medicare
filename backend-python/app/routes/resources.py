"""
MindCare AI — Resources Route (GET /api/resources)
Direct port of backend/routes/resources.js
"""

from fastapi import APIRouter

from ..database import get_db, get_connection_status
from ..data.seed_resources import resources_data

router = APIRouter(prefix="/api/resources", tags=["Resources"])


def _serialize(doc: dict) -> dict:
    """Convert MongoDB document to JSON-safe dict."""
    doc["_id"] = str(doc["_id"])
    return doc


@router.get("/")
async def get_resources():
    """Fetch all verified mental health resources."""
    try:
        if get_connection_status():
            db = get_db()
            resources = []
            async for doc in db.resources.find():
                resources.append(_serialize(doc))

            if not resources:
                # Seed initial resources if collection is empty
                await db.resources.insert_many(
                    [dict(r) for r in resources_data]
                )
                resources = []
                async for doc in db.resources.find():
                    resources.append(_serialize(doc))

            return {"success": True, "data": resources, "isDbConnected": True}
        else:
            return {
                "success": True,
                "data": resources_data,
                "isDbConnected": False,
                "message": "Loaded verified resources from fallback dataset.",
            }
    except Exception as e:
        print(f"GET /api/resources error: {e}")
        return {"success": False, "error": "Failed to fetch resources."}
