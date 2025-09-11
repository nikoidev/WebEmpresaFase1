from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from slugify import slugify

from database import get_db
from models.plans import ServicePlan
from models.user import User
from schemas.plans import ServicePlanCreate, ServicePlanUpdate, ServicePlanResponse
from auth.security import get_current_admin_user

router = APIRouter()

@router.get("/public/plans/", response_model=List[ServicePlanResponse])
async def get_public_plans(db: Session = Depends(get_db)):
    plans = db.query(ServicePlan).filter(ServicePlan.is_active == True).order_by(ServicePlan.display_order).all()
    return plans

@router.get("/admin/plans/", response_model=List[ServicePlanResponse])
async def get_admin_plans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    plans = db.query(ServicePlan).order_by(ServicePlan.display_order).all()
    return plans

@router.post("/admin/plans/", response_model=ServicePlanResponse)
async def create_plan(
    plan_data: ServicePlanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    slug = slugify(plan_data.name)
    plan = ServicePlan(**plan_data.dict(), slug=slug)
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan

@router.put("/admin/plans/{plan_id}/", response_model=ServicePlanResponse)
async def update_plan(
    plan_id: int,
    plan_data: ServicePlanUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    plan = db.query(ServicePlan).filter(ServicePlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    update_data = plan_data.dict(exclude_unset=True)
    if "name" in update_data:
        update_data["slug"] = slugify(update_data["name"])
    
    for field, value in update_data.items():
        setattr(plan, field, value)
    
    db.commit()
    db.refresh(plan)
    return plan

@router.delete("/admin/plans/{plan_id}/")
async def delete_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    plan = db.query(ServicePlan).filter(ServicePlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    db.delete(plan)
    db.commit()
    return {"message": "Plan deleted successfully"}
