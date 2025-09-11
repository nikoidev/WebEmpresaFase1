from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.company import CompanyInfo, ContactMessage
from models.user import User
from schemas.company import CompanyInfoUpdate, CompanyInfoResponse, ContactMessageCreate, ContactMessageResponse
from auth.security import get_current_admin_user

router = APIRouter()

# Company Info endpoints
@router.get("/public/company/", response_model=CompanyInfoResponse)
async def get_public_company_info(db: Session = Depends(get_db)):
    company = db.query(CompanyInfo).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company info not found")
    return company

@router.get("/admin/company/", response_model=CompanyInfoResponse)
async def get_admin_company_info(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    company = db.query(CompanyInfo).first()
    if not company:
        # Crear company info por defecto si no existe
        company = CompanyInfo(
            company_name="Web Empresa",
            tagline="Tu empresa digital",
            description="Descripción de la empresa",
            email="info@webempresa.com",
            phone="",
            address="",
            meta_title="Web Empresa",
            meta_description="Empresa digital"
        )
        db.add(company)
        db.commit()
        db.refresh(company)
    return company

@router.put("/admin/company/", response_model=CompanyInfoResponse)
async def update_company_info(
    company_data: CompanyInfoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    company = db.query(CompanyInfo).first()
    if not company:
        # Crear si no existe
        company = CompanyInfo(**company_data.dict(exclude_unset=True))
        db.add(company)
    else:
        # Actualizar existente
        update_data = company_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(company, field, value)
    
    db.commit()
    db.refresh(company)
    return company

# Contact Messages endpoints
@router.post("/public/contact/", response_model=dict)
async def submit_contact_message(
    contact_data: ContactMessageCreate,
    db: Session = Depends(get_db)
):
    contact = ContactMessage(**contact_data.dict())
    db.add(contact)
    db.commit()
    db.refresh(contact)
    
    return {
        "message": "Contact message sent successfully",
        "id": contact.id
    }

@router.get("/admin/contact-messages/", response_model=List[ContactMessageResponse])
async def get_admin_contact_messages(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    messages = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
    return messages

@router.get("/admin/contact-messages/{message_id}/", response_model=ContactMessageResponse)
async def get_admin_contact_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return message

@router.put("/admin/contact-messages/{message_id}/")
async def update_contact_message_status(
    message_id: int,
    status: str,
    admin_response: str = "",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    message.status = status
    if admin_response:
        message.admin_response = admin_response
        if status == "responded":
            from datetime import datetime
            message.responded_at = datetime.utcnow()
    
    message.assigned_to_id = current_user.id
    db.commit()
    
    return {"message": "Contact message updated successfully"}
