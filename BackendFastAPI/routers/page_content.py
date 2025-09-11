"""
Router para gestión de contenido de páginas y mensajes de contacto
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.page_content import PageContent
from models.company import ContactMessage
from models.user import User
from schemas.page_content import (
    PageContentCreate, PageContentUpdate, PageContentResponse
)
from schemas.company import ContactMessageCreate, ContactMessageUpdate, ContactMessageResponse
from auth.security import get_current_admin_user

router = APIRouter()

# APIs Públicas para contenido de páginas
@router.get("/public/page/{page_key}/", response_model=PageContentResponse)
async def get_public_page_content(
    page_key: str,
    db: Session = Depends(get_db)
):
    """Obtener contenido público de una página"""
    content = db.query(PageContent).filter(
        PageContent.page_key == page_key,
        PageContent.is_active == True
    ).first()
    
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page content not found"
        )
    
    return content

# API para enviar mensajes de contacto (público)
@router.post("/public/contact/", response_model=ContactMessageResponse)
async def create_contact_message(
    message_data: ContactMessageCreate,
    db: Session = Depends(get_db)
):
    """Crear nuevo mensaje de contacto"""
    message = ContactMessage(**message_data.dict())
    
    db.add(message)
    db.commit()
    db.refresh(message)
    
    return message

# APIs Administrativas para contenido de páginas
@router.get("/admin/pages/", response_model=List[PageContentResponse])
async def get_admin_page_contents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Lista administrativa de contenidos de páginas"""
    contents = db.query(PageContent).all()
    return contents

@router.get("/admin/pages/{page_key}/", response_model=PageContentResponse)
async def get_admin_page_content(
    page_key: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Obtener contenido específico de página para admin"""
    content = db.query(PageContent).filter(PageContent.page_key == page_key).first()
    
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page content not found"
        )
    
    return content

@router.post("/admin/pages/", response_model=PageContentResponse)
async def create_page_content(
    content_data: PageContentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Crear nuevo contenido de página"""
    # Verificar que no exista ya
    existing = db.query(PageContent).filter(PageContent.page_key == content_data.page_key).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Page content already exists for this key"
        )
    
    content = PageContent(**content_data.dict())
    
    db.add(content)
    db.commit()
    db.refresh(content)
    
    return content

@router.put("/admin/pages/{page_key}/", response_model=PageContentResponse)
async def update_page_content(
    page_key: str,
    content_data: PageContentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Actualizar contenido de página"""
    content = db.query(PageContent).filter(PageContent.page_key == page_key).first()
    
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page content not found"
        )
    
    # Actualizar campos
    for field, value in content_data.dict(exclude_unset=True).items():
        setattr(content, field, value)
    
    db.commit()
    db.refresh(content)
    
    return content

# APIs Administrativas para mensajes de contacto
@router.get("/admin/contact-messages/", response_model=List[ContactMessageResponse])
async def get_admin_contact_messages(
    status_filter: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Lista administrativa de mensajes de contacto"""
    query = db.query(ContactMessage)
    
    if status_filter:
        query = query.filter(ContactMessage.status == status_filter)
    
    messages = query.order_by(ContactMessage.created_at.desc()).all()
    return messages

@router.get("/admin/contact-messages/{message_id}/", response_model=ContactMessageResponse)
async def get_admin_contact_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Obtener mensaje de contacto específico"""
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact message not found"
        )
    
    # Marcar como leído si era nuevo
    if message.status == "new":
        message.status = "read"
        db.commit()
    
    return message

@router.put("/admin/contact-messages/{message_id}/", response_model=ContactMessageResponse)
async def update_contact_message(
    message_id: int,
    message_data: ContactMessageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Actualizar mensaje de contacto (responder, cambiar estado)"""
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact message not found"
        )
    
    # Actualizar campos
    for field, value in message_data.dict(exclude_unset=True).items():
        setattr(message, field, value)
    
    # Si se agregó respuesta, marcar fecha
    if message_data.admin_response:
        from datetime import datetime
        message.responded_at = datetime.utcnow()
        if message.status not in ["responded", "closed"]:
            message.status = "responded"
    
    db.commit()
    db.refresh(message)
    
    return message

@router.delete("/admin/contact-messages/{message_id}/")
async def delete_contact_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Eliminar mensaje de contacto"""
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact message not found"
        )
    
    db.delete(message)
    db.commit()
    
    return {"message": "Contact message deleted successfully"}
