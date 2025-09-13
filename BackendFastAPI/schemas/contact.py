"""
Esquemas para mensajes de contacto
"""

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

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
