from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models.news import NewsArticle
from models.testimonials import Testimonial
from models.faqs import FAQ
from models.company import CompanyInfo

router = APIRouter()

@router.get("/public/stats/")
async def get_public_stats(db: Session = Depends(get_db)):
    """Estadísticas públicas del sitio"""
    stats = {
        "total_articles": db.query(func.count(NewsArticle.id)).filter(NewsArticle.status == "published").scalar() or 0,
        "total_testimonials": db.query(func.count(Testimonial.id)).filter(Testimonial.is_active == True).scalar() or 0,
        "total_faqs": db.query(func.count(FAQ.id)).filter(FAQ.is_active == True).scalar() or 0,
        "featured_articles": db.query(func.count(NewsArticle.id)).filter(
            NewsArticle.status == "published",
            NewsArticle.featured == True
        ).scalar() or 0
    }
    return stats

@router.get("/public/homepage/")
async def get_homepage_content(db: Session = Depends(get_db)):
    """Contenido completo para la página de inicio"""
    # Artículos destacados (máximo 3)
    featured_articles = db.query(NewsArticle).filter(
        NewsArticle.status == "published",
        NewsArticle.featured == True
    ).order_by(NewsArticle.published_at.desc()).limit(3).all()
    
    # Testimonios destacados (máximo 3)
    featured_testimonials = db.query(Testimonial).filter(
        Testimonial.is_active == True,
        Testimonial.is_featured == True
    ).order_by(Testimonial.display_order).limit(3).all()
    
    # Información de la empresa
    company_info = db.query(CompanyInfo).first()
    
    return {
        "featured_articles": featured_articles,
        "featured_testimonials": featured_testimonials,
        "company_info": company_info
    }
