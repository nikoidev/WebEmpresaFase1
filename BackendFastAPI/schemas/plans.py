from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

class ServicePlanBase(BaseModel):
    name: str
    description: str
    price_monthly: Decimal
    price_yearly: Optional[Decimal] = None
    max_users: int = 1
    max_courses: int = 10
    storage_gb: int = 1
    api_requests_limit: int = 1000
    features: List[str] = []
    color_primary: str = "#3B82F6"
    color_secondary: str = "#1E40AF"
    is_active: bool = True
    is_popular: bool = False
    display_order: int = 0

class ServicePlanCreate(ServicePlanBase):
    pass

class ServicePlanUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price_monthly: Optional[Decimal] = None
    price_yearly: Optional[Decimal] = None
    max_users: Optional[int] = None
    max_courses: Optional[int] = None
    storage_gb: Optional[int] = None
    api_requests_limit: Optional[int] = None
    features: Optional[List[str]] = None
    color_primary: Optional[str] = None
    color_secondary: Optional[str] = None
    is_active: Optional[bool] = None
    is_popular: Optional[bool] = None
    display_order: Optional[int] = None

class ServicePlanResponse(ServicePlanBase):
    id: int
    slug: str
    monthly_savings: Decimal
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
