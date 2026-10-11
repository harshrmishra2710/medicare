"""Pydantic schemas for Activity — mirrors Mongoose Activity model."""

from pydantic import BaseModel
from typing import List, Optional


class ActivityResponse(BaseModel):
    title: str
    moods: List[str] = []
    durationMinutes: int
    category: str
    description: str
    steps: List[str] = []
