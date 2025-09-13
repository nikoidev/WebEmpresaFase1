"""
Esquemas Pydantic para Web Empresa
"""

from .auth import LoginRequest, Token, TokenData
from .user import UserCreate, UserUpdate, UserResponse, UserListResponse, UserRoleSchema, PermissionSchema
from .page_content import PageContentCreate, PageContentUpdate, PageContentResponse
from .contact import ContactMessageCreate, ContactMessageUpdate, ContactMessageResponse
from .plans import ServicePlanCreate, ServicePlanUpdate, ServicePlanResponse

__all__ = [
    # Auth
    "LoginRequest", "Token", "TokenData",
    # User
    "UserCreate", "UserUpdate", "UserResponse", "UserListResponse", "UserRoleSchema", "PermissionSchema",
    # Page Content
    "PageContentCreate", "PageContentUpdate", "PageContentResponse",
    # Contact
    "ContactMessageCreate", "ContactMessageUpdate", "ContactMessageResponse",
    # Plans
    "ServicePlanCreate", "ServicePlanUpdate", "ServicePlanResponse"
]