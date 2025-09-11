"""
Esquemas para autenticación y usuarios
"""

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class LoginRequest(BaseModel):
    """Esquema para solicitud de login"""
    username: str
    password: str

class Token(BaseModel):
    """Esquema para respuesta de token"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int

class TokenData(BaseModel):
    """Datos decodificados del token"""
    username: Optional[str] = None
    user_id: Optional[int] = None

class UserCreate(BaseModel):
    """Esquema para crear usuario"""
    username: str
    email: EmailStr
    first_name: Optional[str] = ""
    last_name: Optional[str] = ""
    password: str
    is_staff: Optional[bool] = False
    is_superuser: Optional[bool] = False

class UserResponse(BaseModel):
    """Esquema para respuesta de usuario"""
    id: int
    username: str
    email: str
    first_name: str
    last_name: str
    is_active: bool
    is_staff: bool
    is_superuser: bool
    date_joined: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    """Esquema para actualizar usuario"""
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: Optional[bool] = None
    is_staff: Optional[bool] = None
