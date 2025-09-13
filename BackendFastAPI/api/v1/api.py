"""
API v1 Router - Agrupa todos los endpoints de la versión 1
"""

from fastapi import APIRouter

from api.v1.endpoints import auth, users, page_content, contact, plans

api_router = APIRouter()

# Incluir todos los routers de endpoints
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(page_content.router, prefix="/page-content", tags=["page-content"])
api_router.include_router(contact.router, prefix="/contact", tags=["contact"])
api_router.include_router(plans.router, prefix="/plans", tags=["plans"])
