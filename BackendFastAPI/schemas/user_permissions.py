"""
Esquemas para permisos de usuarios
"""

from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class UserPermissionBase(BaseModel):
    """Esquema base para permisos de usuario"""
    permission: str  # "view", "create", "edit", "delete", "moderate", "manage_users"
    resource: str = "*"  # "news", "users", "pages", "*" (todo)
    is_granted: bool = True

class UserPermissionCreate(UserPermissionBase):
    """Esquema para crear permiso de usuario"""
    user_id: int

class UserPermissionUpdate(BaseModel):
    """Esquema para actualizar permiso de usuario"""
    is_granted: Optional[bool] = None

class UserPermissionResponse(UserPermissionBase):
    """Esquema para respuesta de permiso de usuario"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class UserPermissionsSet(BaseModel):
    """Esquema para establecer múltiples permisos de un usuario"""
    user_id: int
    permissions: List[Dict[str, Any]]  # [{"permission": "view", "resource": "news", "is_granted": true}]

class PermissionDefinition(BaseModel):
    """Definición de un permiso disponible"""
    name: str
    value: str
    description: str
    resources: List[str]  # Recursos a los que aplica

class AvailablePermissions(BaseModel):
    """Esquema para permisos disponibles en el sistema"""
    permissions: List[PermissionDefinition]
    resources: List[str]
