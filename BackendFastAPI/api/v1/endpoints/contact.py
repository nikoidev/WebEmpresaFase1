"""
Endpoints de gestión de mensajes de contacto
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from db.session import get_db
from security.deps import get_current_admin_user
from crud import contact_message as crud_contact
from schemas.contact import ContactMessageCreate, ContactMessageUpdate, ContactMessageResponse

router = APIRouter()

# API pública para enviar mensajes de contacto
@router.post("/public/", response_model=ContactMessageResponse)
def create_contact_message(
    message_data: ContactMessageCreate,
    db: Session = Depends(get_db)
):
    """Crear nuevo mensaje de contacto"""
    message = crud_contact.create(db, obj_in=message_data)
    return message

# APIs de Administración
@router.get("/admin/", response_model=List[ContactMessageResponse])
def get_contact_messages(
    status_filter: Optional[str] = Query(None, description="Filtrar por estado"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Obtener mensajes de contacto (admin)"""
    if status_filter:
        messages = crud_contact.get_by_status(db, status=status_filter)
    else:
        messages = crud_contact.get_multi(db)
    
    return messages

@router.get("/admin/{message_id}/", response_model=ContactMessageResponse)
def get_contact_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Obtener mensaje específico (admin)"""
    message = crud_contact.get(db, id=message_id)
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact message not found"
        )
    
    return message

@router.put("/admin/{message_id}/", response_model=ContactMessageResponse)
def update_contact_message(
    message_id: int,
    message_data: ContactMessageUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Actualizar mensaje de contacto (admin)"""
    message = crud_contact.get(db, id=message_id)
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact message not found"
        )
    
    message = crud_contact.update(db, db_obj=message, obj_in=message_data)
    return message

@router.delete("/admin/{message_id}/")
def delete_contact_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Eliminar mensaje de contacto (admin)"""
    message = crud_contact.get(db, id=message_id)
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact message not found"
        )
    
    crud_contact.remove(db, id=message_id)
    
    return {"message": "Contact message deleted successfully"}
