from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional

from database import get_db
from models.testimonials import Testimonial
from models.user import User
from schemas.testimonials import TestimonialCreate, TestimonialUpdate, TestimonialResponse
from auth.security import get_current_admin_user

router = APIRouter()

@router.get("/public/testimonials/", response_model=List[TestimonialResponse])
async def get_public_testimonials(
    featured: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Testimonial).filter(Testimonial.is_active == True)
    if featured is not None:
        query = query.filter(Testimonial.is_featured == featured)
    testimonials = query.order_by(Testimonial.display_order, desc(Testimonial.created_at)).all()
    return testimonials

@router.get("/admin/testimonials/", response_model=List[TestimonialResponse])
async def get_admin_testimonials(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    testimonials = db.query(Testimonial).order_by(desc(Testimonial.created_at)).all()
    return testimonials

@router.post("/admin/testimonials/", response_model=TestimonialResponse)
async def create_testimonial(
    testimonial_data: TestimonialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    testimonial = Testimonial(**testimonial_data.dict())
    db.add(testimonial)
    db.commit()
    db.refresh(testimonial)
    return testimonial

@router.put("/admin/testimonials/{testimonial_id}/", response_model=TestimonialResponse)
async def update_testimonial(
    testimonial_id: int,
    testimonial_data: TestimonialUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    update_data = testimonial_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(testimonial, field, value)
    
    db.commit()
    db.refresh(testimonial)
    return testimonial

@router.delete("/admin/testimonials/{testimonial_id}/")
async def delete_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    db.delete(testimonial)
    db.commit()
    return {"message": "Testimonial deleted successfully"}
