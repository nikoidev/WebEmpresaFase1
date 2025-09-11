"""
Esquemas para contenido de páginas editables
"""

from pydantic import BaseModel, validator
from typing import Optional, Dict, Any
from datetime import datetime

class PageContentBase(BaseModel):
    page_key: str
    title: str
    content_data: Dict[str, Any] = {}
    meta_title: Optional[str] = ""
    meta_description: Optional[str] = ""
    meta_keywords: Optional[str] = ""
    is_active: Optional[bool] = True

class PageContentCreate(PageContentBase):
    @validator('page_key')
    def validate_page_key(cls, v):
        allowed_keys = ['homepage', 'about', 'history', 'clients', 'contact']
        if v not in allowed_keys:
            raise ValueError(f'page_key must be one of: {allowed_keys}')
        return v

class PageContentUpdate(BaseModel):
    title: Optional[str] = None
    content_data: Optional[Dict[str, Any]] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    is_active: Optional[bool] = None

class PageContentResponse(PageContentBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Los esquemas para ContactMessage están en schemas/company.py
