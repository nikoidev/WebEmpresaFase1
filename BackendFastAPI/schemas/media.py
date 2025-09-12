"""
Schemas para archivos multimedia
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class MediaFileBase(BaseModel):
    filename: str = Field(..., min_length=1, max_length=255)
    file_type: str = Field(..., pattern="^(image|video|document)$")
    alt_text: Optional[str] = Field("", max_length=255)
    description: Optional[str] = ""
    is_public: bool = True

class MediaFileCreate(MediaFileBase):
    original_filename: str
    mime_type: str
    file_size: int
    storage_type: str = Field("database", pattern="^(database|url|local)$")
    file_data: Optional[bytes] = None
    file_url: Optional[str] = Field(None, max_length=500)
    file_path: Optional[str] = Field(None, max_length=500)
    width: Optional[int] = None
    height: Optional[int] = None
    duration: Optional[int] = None

class MediaFileUpdate(BaseModel):
    filename: Optional[str] = Field(None, min_length=1, max_length=255)
    alt_text: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    is_public: Optional[bool] = None
    is_active: Optional[bool] = None

class MediaFileResponse(MediaFileBase):
    id: int
    original_filename: str
    mime_type: str
    file_size: int
    storage_type: str
    file_url: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    duration: Optional[int] = None
    is_active: bool
    public_url: Optional[str] = None
    size_formatted: str
    file_extension: str
    is_image: bool
    is_video: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class MediaFileList(BaseModel):
    files: List[MediaFileResponse]
    total: int
    page: int
    per_page: int
    total_pages: int

# URL Schema para cuando el usuario quiere usar URL externa
class MediaURLCreate(BaseModel):
    url: str = Field(..., max_length=500)
    filename: str = Field(..., min_length=1, max_length=255)
    file_type: str = Field(..., pattern="^(image|video)$")
    alt_text: Optional[str] = Field("", max_length=255)
    description: Optional[str] = ""

# Upload Schema para archivos subidos
class MediaUploadResponse(BaseModel):
    id: int
    filename: str
    public_url: str
    file_type: str
    file_size: int
    size_formatted: str
    
    class Config:
        from_attributes = True

# Category Schemas
class MediaCategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = ""
    icon: str = Field("Folder", max_length=50)
    color: str = Field("#3B82F6", pattern="^#[0-9A-Fa-f]{6}$")

class MediaCategoryCreate(MediaCategoryBase):
    pass

class MediaCategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    icon: Optional[str] = Field(None, max_length=50)
    color: Optional[str] = Field(None, pattern="^#[0-9A-Fa-f]{6}$")
    is_active: Optional[bool] = None

class MediaCategoryResponse(MediaCategoryBase):
    id: int
    is_active: bool
    created_at: datetime
    file_count: Optional[int] = 0
    
    class Config:
        from_attributes = True
