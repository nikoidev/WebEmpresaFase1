"""
Modelo de artículos de noticias
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class NewsArticle(Base):
    """Modelo de artículo de noticias"""
    __tablename__ = "website_content_newsarticle"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    slug = Column(String(250), unique=True, index=True, nullable=False)
    content = Column(Text, nullable=False)
    excerpt = Column(String(500), default="")
    
    # Meta información
    meta_description = Column(String(160), default="")
    meta_keywords = Column(String(255), default="")
    
    # Estado y configuración
    status = Column(String(20), default="draft", index=True)  # draft, published, archived
    featured = Column(Boolean, default=False, index=True)
    views_count = Column(Integer, default=0)
    
    # Imagen destacada (URL o path)
    featured_image = Column(String(255), nullable=True)
    
    # Fechas
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    published_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relación con autor (usuario)
    author_id = Column(Integer, ForeignKey("auth_user.id"), nullable=True)
    author = relationship("User", backref="articles")
    
    def __repr__(self):
        return f"<NewsArticle {self.title}>"
    
    @property
    def is_published(self):
        """Verifica si el artículo está publicado"""
        return self.status == "published"
    
    @property
    def url_slug(self):
        """Slug para URLs"""
        return self.slug
