from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models.faqs import FAQ
from models.user import User
from schemas.faqs import FAQCreate, FAQUpdate, FAQResponse
from auth.security import get_current_admin_user

router = APIRouter()

@router.get("/public/faqs/", response_model=List[FAQResponse])
async def get_public_faqs(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(FAQ).filter(FAQ.is_active == True)
    if category:
        query = query.filter(FAQ.category == category)
    faqs = query.order_by(FAQ.display_order, FAQ.created_at).all()
    return faqs

@router.post("/public/faq/{faq_id}/helpful/")
async def vote_faq_helpful(
    faq_id: int,
    db: Session = Depends(get_db)
):
    faq = db.query(FAQ).filter(FAQ.id == faq_id, FAQ.is_active == True).first()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    
    faq.add_helpful_vote()
    db.commit()
    return {"message": "Vote recorded", "helpful_votes": faq.helpful_votes}

@router.get("/admin/faqs/", response_model=List[FAQResponse])
async def get_admin_faqs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    faqs = db.query(FAQ).order_by(FAQ.category, FAQ.display_order).all()
    return faqs

@router.post("/admin/faqs/", response_model=FAQResponse)
async def create_faq(
    faq_data: FAQCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    faq = FAQ(**faq_data.dict())
    db.add(faq)
    db.commit()
    db.refresh(faq)
    return faq

@router.put("/admin/faqs/{faq_id}/", response_model=FAQResponse)
async def update_faq(
    faq_id: int,
    faq_data: FAQUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    
    update_data = faq_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(faq, field, value)
    
    db.commit()
    db.refresh(faq)
    return faq

@router.delete("/admin/faqs/{faq_id}/")
async def delete_faq(
    faq_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    
    db.delete(faq)
    db.commit()
    return {"message": "FAQ deleted successfully"}
