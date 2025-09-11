from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class CompanyInfoUpdate(BaseModel):
    company_name: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None
    facebook: Optional[str] = None
    instagram: Optional[str] = None
    logo: Optional[str] = None
    hero_image: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None

class CompanyInfoResponse(BaseModel):
    id: int
    company_name: str
    tagline: str
    description: str
    email: str
    phone: str
    address: str
    website: str
    linkedin: str
    twitter: str
    facebook: str
    instagram: str
    logo: Optional[str] = None
    hero_image: Optional[str] = None
    meta_title: str
    meta_description: str
    
    class Config:
        from_attributes = True

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    company: Optional[str] = ""
    subject: str
    message: str

class ContactMessageUpdate(BaseModel):
    status: Optional[str] = None
    admin_response: Optional[str] = None

class ContactMessageResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    company: str
    subject: str
    message: str
    status: str
    admin_response: str
    responded_at: Optional[datetime] = None
    assigned_to_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
