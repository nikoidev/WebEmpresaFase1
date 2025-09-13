"""
Endpoints de gestión de planes de servicio
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from db.session import get_db
from security.deps import get_current_admin_user
from crud import service_plan as crud_plans
from schemas.plans import ServicePlanCreate, ServicePlanUpdate, ServicePlanResponse

router = APIRouter()

# APIs Públicas
@router.get("/public/", response_model=List[ServicePlanResponse])
def get_public_plans(db: Session = Depends(get_db)):
    """Obtener planes públicos activos"""
    plans = crud_plans.get_active_plans(db)
    return plans

# APIs de Administración
@router.get("/admin/", response_model=List[ServicePlanResponse])
def get_admin_plans(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Obtener todos los planes (admin)"""
    plans = crud_plans.get_multi(db)
    return plans

@router.post("/admin/", response_model=ServicePlanResponse)
def create_plan(
    plan_data: ServicePlanCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Crear nuevo plan de servicio"""
    plan = crud_plans.create(db, obj_in=plan_data)
    return plan

@router.put("/admin/{plan_id}/", response_model=ServicePlanResponse)
def update_plan(
    plan_id: int,
    plan_data: ServicePlanUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Actualizar plan de servicio"""
    plan = crud_plans.get(db, id=plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    plan = crud_plans.update(db, db_obj=plan, obj_in=plan_data)
    return plan

@router.delete("/admin/{plan_id}/")
def delete_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Eliminar plan de servicio"""
    plan = crud_plans.get(db, id=plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    crud_plans.remove(db, id=plan_id)
    return {"message": "Plan deleted successfully"}
