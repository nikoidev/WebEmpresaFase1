"""
Modelos para gestión de archivos multimedia
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, LargeBinary
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class MediaFile(Base):
    """Modelo para archivos multimedia (imágenes, videos, documentos)"""
    __tablename__ = "media_files"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Información del archivo
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)  # image, video, document
    mime_type = Column(String(100), nullable=False)  # image/jpeg, video/mp4, etc.
    file_size = Column(Integer, nullable=False)  # en bytes
    
    # Almacenamiento
    storage_type = Column(String(20), default="database")  # database, url, local
    file_data = Column(LargeBinary, nullable=True)  # archivo en base64 si es database
    file_url = Column(String(500), nullable=True)  # URL si es external
    file_path = Column(String(500), nullable=True)  # path local si es local
    
    # Metadatos
    alt_text = Column(String(255), default="")  # texto alternativo para imágenes
    description = Column(Text, default="")
    width = Column(Integer, nullable=True)  # para imágenes
    height = Column(Integer, nullable=True)  # para imágenes
    duration = Column(Integer, nullable=True)  # para videos (en segundos)
    
    # Estado
    is_active = Column(Boolean, default=True)
    is_public = Column(Boolean, default=True)
    
    # Usuario que subió el archivo
    uploaded_by_id = Column(Integer, ForeignKey("auth_user.id"), nullable=True)
    uploaded_by = relationship("User", backref="uploaded_files")
    
    # Fechas
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<MediaFile {self.filename} - {self.file_type}>"
    
    @property
    def file_extension(self):
        """Obtener extensión del archivo"""
        return self.filename.split('.')[-1].lower() if '.' in self.filename else ''
    
    @property
    def is_image(self):
        """Verificar si es imagen"""
        return self.file_type == 'image'
    
    @property
    def is_video(self):
        """Verificar si es video"""
        return self.file_type == 'video'
    
    @property
    def public_url(self):
        """URL pública para acceder al archivo"""
        if self.storage_type == "url":
            return self.file_url
        elif self.storage_type == "database":
            return f"/api/media/{self.id}"
        elif self.storage_type == "local":
            return f"/api/media/local/{self.id}"
        return None
    
    @property
    def size_formatted(self):
        """Tamaño formateado en KB/MB"""
        if self.file_size < 1024:
            return f"{self.file_size} B"
        elif self.file_size < 1024 * 1024:
            return f"{self.file_size / 1024:.1f} KB"
        else:
            return f"{self.file_size / (1024 * 1024):.1f} MB"


class MediaCategory(Base):
    """Categorías para organizar archivos multimedia"""
    __tablename__ = "media_categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text, default="")
    icon = Column(String(50), default="Folder")
    color = Column(String(7), default="#3B82F6")  # hex color
    
    # Estado
    is_active = Column(Boolean, default=True)
    
    # Fechas
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<MediaCategory {self.name}>"


# Tabla de relación muchos a muchos entre archivos y categorías
from sqlalchemy import Table
media_file_categories = Table(
    'media_file_categories',
    Base.metadata,
    Column('media_file_id', Integer, ForeignKey('media_files.id'), primary_key=True),
    Column('category_id', Integer, ForeignKey('media_categories.id'), primary_key=True)
)

# Agregar la relación a MediaFile
MediaFile.categories = relationship(
    "MediaCategory",
    secondary=media_file_categories,
    backref="files"
)
