from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models.company import CompanyInfo

router = APIRouter()

@router.get("/public/stats/")
async def get_public_stats(db: Session = Depends(get_db)):
    """Estadísticas públicas del sitio"""
    # Información de la empresa
    company_info = db.query(CompanyInfo).first()
    
    stats = {
        "company_name": company_info.company_name if company_info else "SEVP",
        "established_year": company_info.established_year if company_info else 2020,
        "message": "Estadísticas disponibles a través del sistema de contenido"
    }
    return stats

@router.get("/public/homepage/")
async def get_homepage_content(db: Session = Depends(get_db)):
    """Contenido básico para la página de inicio"""
    # Información de la empresa
    company_info = db.query(CompanyInfo).first()
    
    return {
        "company_info": company_info,
        "message": "Contenido gestionado a través del sistema de PageContent"
    }
