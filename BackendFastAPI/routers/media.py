"""
Rutas para gestión de archivos multimedia
"""

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form, Query, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import base64
import io
import mimetypes
import uuid
from PIL import Image
import requests

from database import get_db
from models.media import MediaFile, MediaCategory
from schemas.media import (
    MediaFileResponse, MediaFileList, MediaFileUpdate, 
    MediaURLCreate, MediaUploadResponse,
    MediaCategoryResponse, MediaCategoryCreate, MediaCategoryUpdate
)
from auth.security import get_current_active_user, get_current_admin_user
from models.user import User

router = APIRouter(prefix="/api/media", tags=["Media"])

# Configuración
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm", "video/ogg"}

@router.post("/upload", response_model=MediaUploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    alt_text: str = Form(""),
    description: str = Form(""),
    storage_type: str = Form("database"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Subir archivo multimedia"""
    
    # Validar tamaño
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="Archivo demasiado grande (máximo 10MB)")
    
    # Validar tipo de archivo
    mime_type = file.content_type
    if mime_type in ALLOWED_IMAGE_TYPES:
        file_type = "image"
    elif mime_type in ALLOWED_VIDEO_TYPES:
        file_type = "video"
    else:
        raise HTTPException(status_code=400, detail="Tipo de archivo no permitido")
    
    # Generar nombre único
    extension = file.filename.split('.')[-1] if '.' in file.filename else ''
    unique_filename = f"{uuid.uuid4()}.{extension}"
    
    # Obtener dimensiones si es imagen
    width, height = None, None
    if file_type == "image":
        try:
            image = Image.open(io.BytesIO(content))
            width, height = image.size
        except Exception:
            pass
    
    # Crear registro en DB
    media_file = MediaFile(
        filename=unique_filename,
        original_filename=file.filename,
        file_type=file_type,
        mime_type=mime_type,
        file_size=len(content),
        storage_type=storage_type,
        file_data=content if storage_type == "database" else None,
        alt_text=alt_text,
        description=description,
        width=width,
        height=height,
        uploaded_by_id=current_user.id
    )
    
    db.add(media_file)
    db.commit()
    db.refresh(media_file)
    
    return MediaUploadResponse(
        id=media_file.id,
        filename=media_file.filename,
        public_url=media_file.public_url,
        file_type=media_file.file_type,
        file_size=media_file.file_size,
        size_formatted=media_file.size_formatted
    )

@router.post("/url", response_model=MediaUploadResponse)
async def add_media_url(
    media_data: MediaURLCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Agregar URL de archivo multimedia externo"""
    
    # Validar URL
    try:
        response = requests.head(media_data.url, timeout=10)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="URL no accesible")
        
        mime_type = response.headers.get('content-type', '').split(';')[0]
        file_size = int(response.headers.get('content-length', 0))
        
    except Exception:
        mime_type = f"{media_data.file_type}/unknown"
        file_size = 0
    
    # Crear registro en DB
    media_file = MediaFile(
        filename=media_data.filename,
        original_filename=media_data.filename,
        file_type=media_data.file_type,
        mime_type=mime_type,
        file_size=file_size,
        storage_type="url",
        file_url=media_data.url,
        alt_text=media_data.alt_text,
        description=media_data.description,
        uploaded_by_id=current_user.id
    )
    
    db.add(media_file)
    db.commit()
    db.refresh(media_file)
    
    return MediaUploadResponse(
        id=media_file.id,
        filename=media_file.filename,
        public_url=media_file.public_url,
        file_type=media_file.file_type,
        file_size=media_file.file_size,
        size_formatted=media_file.size_formatted
    )

@router.get("/", response_model=MediaFileList)
def get_media_files(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    file_type: Optional[str] = Query(None, regex="^(image|video|document)$"),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Listar archivos multimedia"""
    
    query = db.query(MediaFile).filter(MediaFile.is_active == True)
    
    # Filtrar por tipo
    if file_type:
        query = query.filter(MediaFile.file_type == file_type)
    
    # Buscar
    if search:
        query = query.filter(
            MediaFile.filename.contains(search) | 
            MediaFile.alt_text.contains(search) |
            MediaFile.description.contains(search)
        )
    
    # Contar total
    total = query.count()
    
    # Paginar
    files = query.offset((page - 1) * per_page).limit(per_page).all()
    
    return MediaFileList(
        files=files,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=(total + per_page - 1) // per_page
    )

@router.get("/{media_id}")
async def serve_media_file(
    media_id: int,
    db: Session = Depends(get_db)
):
    """Servir archivo multimedia desde la base de datos"""
    
    media_file = db.query(MediaFile).filter(
        MediaFile.id == media_id,
        MediaFile.is_active == True,
        MediaFile.is_public == True
    ).first()
    
    if not media_file:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    
    if media_file.storage_type != "database" or not media_file.file_data:
        raise HTTPException(status_code=400, detail="Archivo no disponible")
    
    return StreamingResponse(
        io.BytesIO(media_file.file_data),
        media_type=media_file.mime_type,
        headers={"Content-Disposition": f"inline; filename={media_file.filename}"}
    )

@router.put("/{media_id}", response_model=MediaFileResponse)
def update_media_file(
    media_id: int,
    media_data: MediaFileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Actualizar información de archivo multimedia"""
    
    media_file = db.query(MediaFile).filter(MediaFile.id == media_id).first()
    if not media_file:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    
    # Actualizar campos
    for field, value in media_data.dict(exclude_unset=True).items():
        setattr(media_file, field, value)
    
    db.commit()
    db.refresh(media_file)
    
    return media_file

@router.delete("/{media_id}")
def delete_media_file(
    media_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Eliminar archivo multimedia (soft delete)"""
    
    media_file = db.query(MediaFile).filter(MediaFile.id == media_id).first()
    if not media_file:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    
    media_file.is_active = False
    db.commit()
    
    return {"message": "Archivo eliminado exitosamente"}

# Rutas para categorías
@router.post("/categories/", response_model=MediaCategoryResponse)
def create_category(
    category_data: MediaCategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Crear categoría de medios"""
    
    category = MediaCategory(**category_data.dict())
    db.add(category)
    db.commit()
    db.refresh(category)
    
    return category

@router.get("/categories/", response_model=List[MediaCategoryResponse])
def get_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Listar categorías de medios"""
    
    categories = db.query(MediaCategory).filter(MediaCategory.is_active == True).all()
    
    # Contar archivos por categoría
    for category in categories:
        category.file_count = len(category.files)
    
    return categories
