"""
Endpoints de gestión de contenido de páginas
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from db.session import get_db
from security.deps import get_current_admin_user
from crud import page_content as crud_page_content
from schemas.page_content import PageContentCreate, PageContentUpdate, PageContentResponse

router = APIRouter()

# APIs Públicas
@router.get("/public/{page_key}/", response_model=PageContentResponse)
def get_public_page_content(
    page_key: str,
    db: Session = Depends(get_db)
):
    """Obtener contenido público de una página"""
    content = crud_page_content.get_active_by_page_key(db, page_key=page_key)
    
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page content not found"
        )
    
    return content

# APIs de Administración
@router.get("/admin/", response_model=List[PageContentResponse])
def get_all_page_contents(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Obtener todo el contenido de páginas (admin)"""
    contents = crud_page_content.get_multi(db)
    return contents

@router.get("/admin/{page_key}/", response_model=PageContentResponse)
def get_page_content_admin(
    page_key: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Obtener contenido específico de página (admin)"""
    content = crud_page_content.get_by_page_key(db, page_key=page_key)
    
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page content not found"
        )
    
    return content

@router.post("/admin/", response_model=PageContentResponse)
def create_page_content(
    content_data: PageContentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Crear nuevo contenido de página"""
    # Verificar si ya existe
    existing = crud_page_content.get_by_page_key(db, page_key=content_data.page_key)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Page content already exists for this page_key"
        )
    
    content = crud_page_content.create(db, obj_in=content_data)
    return content

@router.put("/admin/{page_key}/", response_model=PageContentResponse)
def update_page_content(
    page_key: str,
    content_data: PageContentUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Actualizar contenido de página"""
    content = crud_page_content.get_by_page_key(db, page_key=page_key)
    
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page content not found"
        )
    
    content = crud_page_content.update(db, db_obj=content, obj_in=content_data)
    return content

@router.delete("/admin/{page_key}/")
def delete_page_content(
    page_key: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Eliminar contenido de página"""
    content = crud_page_content.get_by_page_key(db, page_key=page_key)
    
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page content not found"
        )
    
    crud_page_content.remove(db, id=content.id)
    
    return {"message": "Page content deleted successfully"}
