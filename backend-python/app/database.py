"""
MindCare AI — Async MongoDB Connection (Motor)
Mirrors the Node.js backend's connection logic with in-memory fallback tracking.
"""

import motor.motor_asyncio
from .config import settings

# Module-level state
client: motor.motor_asyncio.AsyncIOMotorClient | None = None
db = None
is_db_connected: bool = False


async def connect_db():
    """Attempt to connect to MongoDB. Sets is_db_connected flag."""
    global client, db, is_db_connected
    uri = settings.mongodb_uri
    try:
        client = motor.motor_asyncio.AsyncIOMotorClient(
            uri,
            serverSelectionTimeoutMS=5000,
        )
        # Ping to verify the connection actually works
        await client.admin.command("ping")

        # Resolve database handle safely (Atlas URIs may or may not specify default db)
        try:
            db = client.get_default_database()
        except Exception:
            db = None

        if db is None:
            uri_path = uri.split("?")[0]
            db_name = uri_path.rsplit("/", 1)[-1] if "/" in uri_path else "mindcare_ai"
            if not db_name or db_name.startswith("mongodb"):
                db_name = "mindcare_ai"
            db = client[db_name]

        is_db_connected = True

        # Mask credentials in logs to keep secrets secure
        masked_uri = uri
        if "@" in uri:
            scheme_and_auth, host_part = uri.split("@", 1)
            scheme = scheme_and_auth.split("://")[0] if "://" in scheme_and_auth else "mongodb"
            masked_uri = f"{scheme}://****:****@{host_part}"
        print(f"✅ MongoDB Connected Successfully to: {masked_uri}")
    except Exception as e:
        is_db_connected = False
        print("⚠️ MongoDB Connection Failed or Offline. Backend operating in memory-fallback mode.")
        print(f"   Error details: {e}")


async def close_db():
    """Close the MongoDB connection."""
    global client, is_db_connected
    if client:
        client.close()
        is_db_connected = False
        print("🔌 MongoDB connection closed.")


def get_db():
    """Return the database handle."""
    return db


def get_connection_status() -> bool:
    """Return whether MongoDB is connected."""
    return is_db_connected
