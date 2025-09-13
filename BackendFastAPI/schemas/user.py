"""
Esquemas para usuarios y autenticación
"""

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRoleSchema(str, Enum):
    """Esquema para roles de usuario"""
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin" 
    EDITOR = "editor"
    MODERATOR = "moderator"
    VIEWER = "viewer"

class PermissionSchema(str, Enum):
    """Esquema para permisos"""
    VIEW = "view"
    CREATE = "create"
    EDIT = "edit"
    DELETE = "delete"
    MODERATE = "moderate"
    MANAGE_USERS = "manage_users"

class UserCreate(BaseModel):
    """Esquema para crear usuario"""
    email: EmailStr  # El email es lo principal
    first_name: Optional[str] = ""
    last_name: Optional[str] = ""
    password: str
    role: Optional[UserRoleSchema] = UserRoleSchema.VIEWER
    is_staff: Optional[bool] = False
    is_superuser: Optional[bool] = False
    
    # Nota: username se establece automáticamente como email en el backend

class UserResponse(BaseModel):
    """Esquema para respuesta de usuario"""
    id: int
    username: str
    email: str
    first_name: str
    last_name: str
    full_name: str
    role: UserRoleSchema
    is_active: bool
    is_staff: bool
    is_superuser: bool
    is_admin: bool
    date_joined: datetime
    last_login: Optional[datetime] = None
    permissions: List[PermissionSchema] = []
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    """Esquema para actualizar usuario"""
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[UserRoleSchema] = None
    is_active: Optional[bool] = None
    is_staff: Optional[bool] = None
    is_superuser: Optional[bool] = None

class UserListResponse(BaseModel):
    """Esquema para lista de usuarios"""
    users: List[UserResponse]
    total: int
    page: int
    per_page: int
