"""
Modelo de preguntas frecuentes (FAQ)
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base

class FAQ(Base):
    """Modelo de pregunta frecuente"""
    __tablename__ = "website_content_faq"
    
    id = Column(Integer, primary_key=True, index=True)
    question = Column(String(300), nullable=False, index=True)
    answer = Column(Text, nullable=False)
    
    # Categorización
    category = Column(String(50), default="general", index=True)  
    # Valores: general, pricing, technical, support, billing
    
    # Estado y métricas
    is_active = Column(Boolean, default=True, index=True)
    display_order = Column(Integer, default=0, index=True)
    views_count = Column(Integer, default=0)
    helpful_votes = Column(Integer, default=0)
    
    # Fechas
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<FAQ {self.question[:50]}...>"
    
    @property
    def category_display(self):
        """Nombre de categoría para mostrar"""
        categories = {
            "general": "General",
            "pricing": "Precios",
            "technical": "Técnico", 
            "support": "Soporte",
            "billing": "Facturación"
        }
        return categories.get(self.category, "General")
    
    def increment_views(self):
        """Incrementa el contador de vistas"""
        self.views_count += 1
    
    def add_helpful_vote(self):
        """Incrementa votos útiles"""
        self.helpful_votes += 1
