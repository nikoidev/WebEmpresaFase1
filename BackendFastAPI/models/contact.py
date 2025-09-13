"""
Modelo de mensajes de contacto
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.base import Base

class ContactMessage(Base):
    """Modelo de mensaje de contacto"""
    __tablename__ = "website_content_contactmessage"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Información del contacto
    name = Column(String(100), nullable=False)
    email = Column(String(254), nullable=False)
    phone = Column(String(20), default="")
    company = Column(String(150), default="")
    
    # Mensaje
    subject = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    
    # Estado del mensaje
    status = Column(String(20), default="new", index=True)
    # Valores: new, in_progress, responded, closed
    
    # Respuesta del administrador
    admin_response = Column(Text, default="")
    responded_at = Column(DateTime(timezone=True), nullable=True)
    
    # Usuario asignado (opcional)
    assigned_to_id = Column(Integer, ForeignKey("auth_user.id"), nullable=True)
    assigned_to = relationship("User", backref="assigned_contacts")
    
    # Fechas
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<ContactMessage {self.name} - {self.subject}>"
    
    @property
    def status_display(self):
        """Estado para mostrar"""
        statuses = {
            "new": "Nuevo",
            "in_progress": "En Proceso", 
            "responded": "Respondido",
            "closed": "Cerrado"
        }
        return statuses.get(self.status, "Nuevo")
    
    @property
    def is_pending(self):
        """Verifica si el mensaje está pendiente"""
        return self.status in ["new", "in_progress"]
