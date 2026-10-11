"""
MindCare AI — Application Configuration
Loads environment variables using pydantic-settings with dotenv fallback.
Supports production environment variables: MONGODB_URI, GEMINI_API_KEY, GEMINI_MODEL, FRONTEND_URL.
"""

from pathlib import Path
import os
from typing import List

# Load .env from backend-python directory or parent
ENV_PATH = Path(__file__).resolve().parent.parent / ".env"

DEFAULT_LOCAL_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


def _parse_origins(frontend_url: str) -> List[str]:
    """Combine default local dev origins with FRONTEND_URL entries."""
    origins = list(DEFAULT_LOCAL_ORIGINS)
    if frontend_url:
        for item in frontend_url.split(","):
            cleaned = item.strip().rstrip("/")
            if cleaned and cleaned not in origins:
                origins.append(cleaned)
    return origins


try:
    from pydantic_settings import BaseSettings, SettingsConfigDict

    class Settings(BaseSettings):
        PORT: int = 8000
        MONGODB_URI: str = ""
        MONGO_URI: str = ""
        GEMINI_API_KEY: str = ""
        GOOGLE_API_KEY: str = ""
        GEMINI_MODEL: str = "gemini-2.5-flash"
        FRONTEND_URL: str = ""
        OPENAI_API_KEY: str = ""

        model_config = SettingsConfigDict(
            env_file=str(ENV_PATH),
            env_file_encoding="utf-8",
            extra="ignore",
        )

        @property
        def mongodb_uri(self) -> str:
            """Return the best available MongoDB URI (prioritizing MONGODB_URI)."""
            return (self.MONGODB_URI or self.MONGO_URI or "mongodb://127.0.0.1:27017/mindcare_ai").strip()

        @property
        def gemini_key(self) -> str:
            """Return the best available Gemini API key."""
            return (self.GEMINI_API_KEY or self.GOOGLE_API_KEY).strip()

        @property
        def gemini_model(self) -> str:
            """Return the configured Gemini model name."""
            return (self.GEMINI_MODEL or "gemini-2.5-flash").strip()

        @property
        def allowed_origins(self) -> List[str]:
            """Return all allowed CORS origins including FRONTEND_URL."""
            return _parse_origins(self.FRONTEND_URL)

    settings = Settings()

except ImportError:
    # Graceful fallback to python-dotenv / os.environ
    try:
        from dotenv import load_dotenv
        load_dotenv(dotenv_path=ENV_PATH)
    except ImportError:
        pass

    class FallbackSettings:
        PORT: int = int(os.environ.get("PORT", "8000"))
        MONGODB_URI: str = os.environ.get("MONGODB_URI", "")
        MONGO_URI: str = os.environ.get("MONGO_URI", "")
        GEMINI_API_KEY: str = os.environ.get("GEMINI_API_KEY", "")
        GOOGLE_API_KEY: str = os.environ.get("GOOGLE_API_KEY", "")
        GEMINI_MODEL: str = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
        FRONTEND_URL: str = os.environ.get("FRONTEND_URL", "")
        OPENAI_API_KEY: str = os.environ.get("OPENAI_API_KEY", "")

        @property
        def mongodb_uri(self) -> str:
            return (self.MONGODB_URI or self.MONGO_URI or "mongodb://127.0.0.1:27017/mindcare_ai").strip()

        @property
        def gemini_key(self) -> str:
            return (self.GEMINI_API_KEY or self.GOOGLE_API_KEY).strip()

        @property
        def gemini_model(self) -> str:
            return (self.GEMINI_MODEL or "gemini-2.5-flash").strip()

        @property
        def allowed_origins(self) -> List[str]:
            return _parse_origins(self.FRONTEND_URL)

    settings = FallbackSettings()
