"""
MindCare AI — Python Backend Server Launcher
Run with: python run.py
"""

import sys
import os
from pathlib import Path

# Ensure backend-python root is in sys.path
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

if __name__ == "__main__":
    import uvicorn
    from app.config import settings

    print(f"==================================================")
    print(f"🌿 MindCare AI — FastAPI Backend Server")
    print(f"==================================================")
    print(f"🚀 Starting on port {settings.PORT}...")
    print(f"📚 Interactive Swagger Docs: http://localhost:{settings.PORT}/docs")
    print(f"🩺 Health Check Endpoint: http://localhost:{settings.PORT}/api/health")
    print(f"==================================================")

    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
