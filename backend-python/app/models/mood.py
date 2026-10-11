"""Pydantic schemas for Mood entries — mirrors Mongoose Mood model."""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class MoodEnum(str, Enum):
    Happy = "Happy"
    Calm = "Calm"
    Okay = "Okay"
    Sad = "Sad"
    Anxious = "Anxious"
    Stressed = "Stressed"


class MoodCreate(BaseModel):
    mood: MoodEnum
    note: Optional[str] = ""


class MoodResponse(BaseModel):
    id: str = Field(alias="_id")
    mood: str
    note: str = ""
    createdAt: datetime

    class Config:
        populate_by_name = True
