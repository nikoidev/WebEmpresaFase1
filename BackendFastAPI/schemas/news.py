"""
Esquemas para artículos de noticias
"""

from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime
from slugify import slugify

class NewsArticleBase(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = ""
    meta_description: Optional[str] = ""
    meta_keywords: Optional[str] = ""
    status: Optional[str] = "draft"
    featured: Optional[bool] = False
    featured_image: Optional[str] = None

class NewsArticleCreate(NewsArticleBase):
    @validator('title')
    def validate_title(cls, v):
        if len(v) < 5:
            raise ValueError('Title must be at least 5 characters')
        return v

class NewsArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    status: Optional[str] = None
    featured: Optional[bool] = None
    featured_image: Optional[str] = None

class NewsArticleResponse(NewsArticleBase):
    id: int
    slug: str
    views_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    published_at: Optional[datetime] = None
    author_id: Optional[int] = None
    
    class Config:
        from_attributes = True

class NewsArticlePublic(BaseModel):
    """Esquema público (sin campos sensibles)"""
    id: int
    title: str
    slug: str
    content: str
    excerpt: str
    featured_image: Optional[str] = None
    featured: bool
    views_count: int
    published_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
