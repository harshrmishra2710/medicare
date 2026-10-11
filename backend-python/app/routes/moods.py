"""
MindCare AI — Moods Route (GET/POST/DELETE /api/moods)
Direct port of backend/routes/moods.js
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from bson import ObjectId

from ..database import get_db, get_connection_status

router = APIRouter(prefix="/api/moods", tags=["Moods"])

# In-memory fallback if MongoDB is not connected
memory_moods = [
    {
        "_id": "mem_1",
        "mood": "Calm",
        "note": "Took a morning walk in the park.",
        "createdAt": datetime.utcnow().isoformat(),
    },
    {
        "_id": "mem_2",
        "mood": "Stressed",
        "note": "College assignments pending, practicing box breathing.",
        "createdAt": datetime.utcnow().isoformat(),
    },
]

VALID_MOODS = ["Happy", "Calm", "Okay", "Sad", "Anxious", "Stressed"]


class MoodCreateRequest(BaseModel):
    mood: str
    note: Optional[str] = ""


def _serialize_mood(doc: dict) -> dict:
    """Convert MongoDB document to JSON-safe dict."""
    doc["_id"] = str(doc["_id"])
    if isinstance(doc.get("createdAt"), datetime):
        doc["createdAt"] = doc["createdAt"].isoformat()
    return doc


# ── GET /api/moods ────────────────────────────────────────────────
@router.get("/")
async def get_moods():
    try:
        if get_connection_status():
            db = get_db()
            cursor = db.moods.find().sort("createdAt", -1)
            moods = []
            async for doc in cursor:
                moods.append(_serialize_mood(doc))
            return {"success": True, "data": moods, "isDbConnected": True}
        else:
            return {
                "success": True,
                "data": memory_moods,
                "isDbConnected": False,
                "message": "Running in memory storage mode (MongoDB not connected).",
            }
    except Exception as e:
        print(f"GET /api/moods error: {e}")
        return {"success": False, "error": "Failed to fetch mood entries."}


# ── POST /api/moods ───────────────────────────────────────────────
@router.post("/", status_code=201)
async def create_mood(req: MoodCreateRequest):
    try:
        if req.mood not in VALID_MOODS:
            return {
                "success": False,
                "error": "Please select a valid mood option (Happy, Calm, Okay, Sad, Anxious, Stressed).",
            }

        trimmed_note = (req.note or "").strip()[:300]

        if get_connection_status():
            db = get_db()
            doc = {
                "mood": req.mood,
                "note": trimmed_note,
                "createdAt": datetime.utcnow(),
            }
            result = await db.moods.insert_one(doc)
            doc["_id"] = str(result.inserted_id)
            doc["createdAt"] = doc["createdAt"].isoformat()
            return {"success": True, "data": doc}
        else:
            new_entry = {
                "_id": f"mem_{int(datetime.utcnow().timestamp() * 1000)}",
                "mood": req.mood,
                "note": trimmed_note,
                "createdAt": datetime.utcnow().isoformat(),
            }
            memory_moods.insert(0, new_entry)
            return {
                "success": True,
                "data": new_entry,
                "isDbConnected": False,
                "message": "Saved to session storage (MongoDB offline).",
            }
    except Exception as e:
        print(f"POST /api/moods error: {e}")
        return {"success": False, "error": "Failed to save mood entry."}


# ── DELETE /api/moods/{id} ────────────────────────────────────────
@router.delete("/{mood_id}")
async def delete_mood(mood_id: str):
    global memory_moods
    try:
        if get_connection_status():
            db = get_db()
            try:
                result = await db.moods.delete_one({"_id": ObjectId(mood_id)})
            except Exception:
                result = await db.moods.delete_one({"_id": mood_id})

            if result.deleted_count == 0:
                return {"success": False, "error": "Mood entry not found."}
            return {"success": True, "message": "Mood entry deleted successfully."}
        else:
            memory_moods = [m for m in memory_moods if m["_id"] != mood_id]
            return {"success": True, "message": "Mood entry removed from session."}
    except Exception as e:
        print(f"DELETE /api/moods/{mood_id} error: {e}")
        return {"success": False, "error": "Failed to delete mood entry."}
