"""
Esquemas Pydantic para validación de datos
"""

from .auth import Token, TokenData, UserCreate, UserResponse, LoginRequest
from .news import NewsArticleCreate, NewsArticleUpdate, NewsArticleResponse, NewsArticlePublic
from .plans import ServicePlanCreate, ServicePlanUpdate, ServicePlanResponse
from .testimonials import TestimonialCreate, TestimonialUpdate, TestimonialResponse
from .faqs import FAQCreate, FAQUpdate, FAQResponse
from .company import CompanyInfoUpdate, CompanyInfoResponse, ContactMessageCreate, ContactMessageResponse

__all__ = [
    # Auth
    "Token", "TokenData", "UserCreate", "UserResponse", "LoginRequest",
    # News  
    "NewsArticleCreate", "NewsArticleUpdate", "NewsArticleResponse", "NewsArticlePublic",
    # Plans
    "ServicePlanCreate", "ServicePlanUpdate", "ServicePlanResponse", 
    # Testimonials
    "TestimonialCreate", "TestimonialUpdate", "TestimonialResponse",
    # FAQs
    "FAQCreate", "FAQUpdate", "FAQResponse",
    # Company
    "CompanyInfoUpdate", "CompanyInfoResponse", "ContactMessageCreate", "ContactMessageResponse"
]
