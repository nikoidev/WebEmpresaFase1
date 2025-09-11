"""
Modelos para información de empresa y mensajes de contacto
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class CompanyInfo(Base):
    """Modelo de información de la empresa (singleton)"""
    __tablename__ = "website_content_companyinfo"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Información básica
    company_name = Column(String(200), nullable=False)
    tagline = Column(String(255), default="")
    description = Column(Text, default="")
    
    # Información de contacto
    email = Column(String(254), nullable=False)
    phone = Column(String(20), default="")
    address = Column(Text, default="")
    
    # Redes sociales
    website = Column(String(200), default="")
    linkedin = Column(String(200), default="")
    twitter = Column(String(200), default="")
    facebook = Column(String(200), default="")
    instagram = Column(String(200), default="")
    
    # Imágenes
    logo = Column(String(255), nullable=True)  # URL o path del logo
    hero_image = Column(String(255), nullable=True)  # Imagen principal
    
    # SEO
    meta_title = Column(String(60), default="")
    meta_description = Column(String(160), default="")
    
    def __repr__(self):
        return f"<CompanyInfo {self.company_name}>"


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
