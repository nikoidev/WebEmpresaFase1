"""
Modelo de testimonios
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base

class Testimonial(Base):
    """Modelo de testimonio de cliente"""
    __tablename__ = "website_content_testimonial"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Información del cliente
    client_name = Column(String(100), nullable=False)
    client_position = Column(String(100), default="")
    client_company = Column(String(150), default="")
    client_photo = Column(String(255), nullable=True)  # URL o path de la foto
    
    # Contenido del testimonio
    content = Column(Text, nullable=False)
    rating = Column(Integer, default=5)  # 1-5 estrellas
    
    # Estado y configuración
    is_active = Column(Boolean, default=True, index=True)
    is_featured = Column(Boolean, default=False, index=True)
    display_order = Column(Integer, default=0, index=True)
    
    # Fechas
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Testimonial {self.client_name} - {self.client_company}>"
    
    @property
    def client_info(self):
        """Información completa del cliente"""
        parts = [self.client_name]
        if self.client_position:
            parts.append(self.client_position)
        if self.client_company:
            parts.append(f"en {self.client_company}")
        return " ".join(parts)
    
    @property
    def stars_display(self):
        """Retorna las estrellas como string para display"""
        return "⭐" * self.rating
