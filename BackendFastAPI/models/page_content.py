"""
Modelo para contenido de páginas editables
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON
from sqlalchemy.sql import func
from db.base import Base

class PageContent(Base):
    """Modelo para contenido editable de páginas"""
    __tablename__ = "website_page_content"
    
    id = Column(Integer, primary_key=True, index=True)
    page_key = Column(String(100), unique=True, index=True, nullable=False)  # 'homepage', 'about', 'history'
    title = Column(String(200), nullable=False)
    
    # Contenido estructurado como JSON
    content_json = Column(JSON, default={})
    
    # Meta información
    meta_title = Column(String(200), default="")
    meta_description = Column(String(300), default="")
    meta_keywords = Column(String(255), default="")
    
    # Estado
    is_active = Column(Boolean, default=True, index=True)
    
    # Fechas
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<PageContent {self.page_key}: {self.title}>"
