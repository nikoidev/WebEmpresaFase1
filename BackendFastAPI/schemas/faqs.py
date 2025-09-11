from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FAQBase(BaseModel):
    question: str
    answer: str
    category: str = "general"
    is_active: bool = True
    display_order: int = 0

class FAQCreate(FAQBase):
    pass

class FAQUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    category: Optional[str] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None

class FAQResponse(FAQBase):
    id: int
    views_count: int
    helpful_votes: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
