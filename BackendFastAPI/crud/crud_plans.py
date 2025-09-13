"""
CRUD operations para ServicePlan
"""

from typing import List
from sqlalchemy.orm import Session
from slugify import slugify

from crud.base import CRUDBase
from models.plans import ServicePlan
from schemas.plans import ServicePlanCreate, ServicePlanUpdate

class CRUDServicePlan(CRUDBase[ServicePlan, ServicePlanCreate, ServicePlanUpdate]):
    def create(self, db: Session, *, obj_in: ServicePlanCreate) -> ServicePlan:
        # Generar slug automáticamente
        slug = slugify(obj_in.name)
        
        # Crear objeto con slug
        db_obj = ServicePlan(
            **obj_in.dict(),
            slug=slug
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_active_plans(self, db: Session) -> List[ServicePlan]:
        return db.query(ServicePlan).filter(
            ServicePlan.is_active == True
        ).order_by(ServicePlan.display_order).all()

    def get_by_slug(self, db: Session, *, slug: str) -> ServicePlan:
        return db.query(ServicePlan).filter(ServicePlan.slug == slug).first()

    def get_popular_plan(self, db: Session) -> ServicePlan:
        return db.query(ServicePlan).filter(
            ServicePlan.is_popular == True,
            ServicePlan.is_active == True
        ).first()

service_plan = CRUDServicePlan(ServicePlan)
