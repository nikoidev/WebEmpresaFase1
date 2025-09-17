"""
Modelo de Usuario para autenticación
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.base import Base
import enum

class UserRole(enum.Enum):
    """Roles de usuario"""
    SUPER_ADMIN = "super_admin"       # Acceso completo
    ADMIN = "admin"                   # Administrador general
    EDITOR = "editor"                 # Puede editar contenido
    MODERATOR = "moderator"           # Solo puede moderar
    VIEWER = "viewer"                 # Solo lectura

class Permission(enum.Enum):
    """Permisos específicos"""
    VIEW = "view"          # Ver contenido
    CREATE = "create"      # Crear contenido
    EDIT = "edit"          # Editar contenido existente
    DELETE = "delete"      # Eliminar contenido
    MODERATE = "moderate"  # Moderar comentarios/contenido
    MANAGE_USERS = "manage_users"  # Gestionar usuarios

class User(Base):
    """Modelo de usuario con autenticación y permisos"""
    __tablename__ = "auth_user"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(150), unique=True, index=True, nullable=False)
    email = Column(String(254), nullable=False)
    first_name = Column(String(150), default="")
    last_name = Column(String(150), default="")
    
    # Password hash (será hasheado con bcrypt)
    password_hash = Column("password", String(128), nullable=False)
    
    # Permisos
    is_active = Column(Boolean, default=True)
    is_staff = Column(Boolean, default=False) 
    is_superuser = Column(Boolean, default=False)
    
    # Rol del usuario
    role = Column(SQLEnum(UserRole), default=UserRole.VIEWER, nullable=False)
    
    # Fechas
    date_joined = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    
    def __repr__(self):
        return f"<User {self.username}>"
    
    @property
    def full_name(self):
        """Nombre completo del usuario"""
        return f"{self.first_name} {self.last_name}".strip()
    
    @property
    def is_admin(self):
        """Verifica si el usuario es administrador"""
        return self.is_staff or self.is_superuser or self.role in [UserRole.ADMIN, UserRole.SUPER_ADMIN]
    
    def has_permission(self, permission: Permission, resource: str = "*") -> bool:
        """Verifica si el usuario tiene un permiso específico basado en su rol"""
        # Super admins tienen todos los permisos
        if self.is_superuser or self.role == UserRole.SUPER_ADMIN:
            return True
        
        # Usar permisos del rol
        role_permissions = {
            UserRole.ADMIN: [Permission.VIEW, Permission.CREATE, Permission.EDIT, Permission.DELETE, Permission.MODERATE],
            UserRole.EDITOR: [Permission.VIEW, Permission.CREATE, Permission.EDIT],
            UserRole.MODERATOR: [Permission.VIEW, Permission.MODERATE],
            UserRole.VIEWER: [Permission.VIEW]
        }
        
        return permission in role_permissions.get(self.role, [])
        
    def get_all_permissions(self) -> dict:
        """Obtiene todos los permisos del usuario basados en su rol"""
        permissions = {}
        
        # Permisos base del rol
        role_permissions = {
            UserRole.ADMIN: [Permission.VIEW, Permission.CREATE, Permission.EDIT, Permission.DELETE, Permission.MODERATE],
            UserRole.EDITOR: [Permission.VIEW, Permission.CREATE, Permission.EDIT],
            UserRole.MODERATOR: [Permission.VIEW, Permission.MODERATE],
            UserRole.VIEWER: [Permission.VIEW]
        }
        
        # Agregar permisos del rol
        for perm in role_permissions.get(self.role, []):
            permissions[f"{perm.value}:*"] = True
            
        return permissions
    
    def can_manage_users(self) -> bool:
        """Verifica si el usuario puede gestionar otros usuarios"""
        return self.is_superuser or self.role == UserRole.SUPER_ADMIN or self.has_permission(Permission.MANAGE_USERS)
