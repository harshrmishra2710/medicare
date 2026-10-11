"""Pydantic schemas for Resource — mirrors Mongoose Resource model."""

from pydantic import BaseModel
from typing import Optional


class ResourceResponse(BaseModel):
    title: str
    category: str
    region: str
    description: str
    contact: str = ""
    url: str
    badge: str = "Verified Resource"
