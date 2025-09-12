"""
Esquemas Pydantic para validación de datos
"""

from .auth import Token, TokenData, UserCreate, UserResponse, LoginRequest
from .plans import ServicePlanCreate, ServicePlanUpdate, ServicePlanResponse
from .company import CompanyInfoUpdate, CompanyInfoResponse, ContactMessageCreate, ContactMessageResponse
from .page_content import PageContentCreate, PageContentUpdate, PageContentResponse

__all__ = [
    # Auth
    "Token", "TokenData", "UserCreate", "UserResponse", "LoginRequest",
    # Plans
    "ServicePlanCreate", "ServicePlanUpdate", "ServicePlanResponse", 
    # Company
    "CompanyInfoUpdate", "CompanyInfoResponse", "ContactMessageCreate", "ContactMessageResponse",
    # Page Content
    "PageContentCreate", "PageContentUpdate", "PageContentResponse"
]
