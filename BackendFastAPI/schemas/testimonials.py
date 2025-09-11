from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TestimonialBase(BaseModel):
    client_name: str
    client_position: str = ""
    client_company: str = ""
    client_photo: Optional[str] = None
    content: str
    rating: int = 5
    is_active: bool = True
    is_featured: bool = False
    display_order: int = 0

class TestimonialCreate(TestimonialBase):
    pass

class TestimonialUpdate(BaseModel):
    client_name: Optional[str] = None
    client_position: Optional[str] = None
    client_company: Optional[str] = None
    client_photo: Optional[str] = None
    content: Optional[str] = None
    rating: Optional[int] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    display_order: Optional[int] = None

class TestimonialResponse(TestimonialBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
