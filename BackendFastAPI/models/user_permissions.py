"""
Modelo para permisos específicos de usuarios
"""

from sqlalchemy import Column, Integer, ForeignKey, String, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class UserPermission(Base):
    """Permisos específicos asignados a usuarios"""
    __tablename__ = "user_permissions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("auth_user.id"), nullable=False)
    permission = Column(String(50), nullable=False)  # e.g., "view", "create", "edit", "delete"
    resource = Column(String(50), nullable=True)     # e.g., "news", "users", "pages", "*" para todo
    is_granted = Column(Boolean, default=True)       # True = permitido, False = denegado explícitamente
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relación con el usuario
    user = relationship("User", back_populates="custom_permissions")
    
    def __repr__(self):
        return f"<UserPermission {self.user_id}: {self.permission}:{self.resource}={self.is_granted}>"

    class Meta:
        # Índice único para evitar permisos duplicados
        unique_together = ['user_id', 'permission', 'resource']
