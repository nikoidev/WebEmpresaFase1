"""
Modelo de Usuario para autenticación
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base

class User(Base):
    """Modelo de usuario equivalente al User de Django"""
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
        return self.is_staff or self.is_superuser
