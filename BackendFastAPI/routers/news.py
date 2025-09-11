"""
Router para gestión de artículos de noticias
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from slugify import slugify

from database import get_db
from models.news import NewsArticle
from models.user import User
from schemas.news import NewsArticleCreate, NewsArticleUpdate, NewsArticleResponse, NewsArticlePublic
from auth.security import get_current_admin_user

router = APIRouter()

# APIs Públicas
@router.get("/public/news/", response_model=List[NewsArticlePublic])
async def get_public_news(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    featured: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Lista pública de artículos publicados"""
    query = db.query(NewsArticle).filter(NewsArticle.status == "published")
    
    if featured is not None:
        query = query.filter(NewsArticle.featured == featured)
    
    query = query.order_by(desc(NewsArticle.published_at))
    
    # Paginación
    offset = (page - 1) * limit
    articles = query.offset(offset).limit(limit).all()
    
    return articles

@router.get("/public/news/{slug}/", response_model=NewsArticlePublic)
async def get_public_news_detail(
    slug: str,
    db: Session = Depends(get_db)
):
    """Detalle público de artículo por slug"""
    article = db.query(NewsArticle).filter(
        NewsArticle.slug == slug,
        NewsArticle.status == "published"
    ).first()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    # Incrementar vistas
    article.views_count += 1
    db.commit()
    
    return article

# APIs Administrativas
@router.get("/admin/news/", response_model=List[NewsArticleResponse])
async def get_admin_news(
    status_filter: Optional[str] = Query(None),
    featured: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Lista administrativa de artículos"""
    query = db.query(NewsArticle)
    
    if status_filter:
        query = query.filter(NewsArticle.status == status_filter)
    if featured is not None:
        query = query.filter(NewsArticle.featured == featured)
    
    articles = query.order_by(desc(NewsArticle.created_at)).all()
    return articles

@router.get("/admin/news/{article_id}/", response_model=NewsArticleResponse)
async def get_admin_news_detail(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Detalle administrativo de artículo"""
    article = db.query(NewsArticle).filter(NewsArticle.id == article_id).first()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    return article

@router.post("/admin/news/", response_model=NewsArticleResponse)
async def create_news(
    article_data: NewsArticleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Crear nuevo artículo"""
    # Generar slug único
    base_slug = slugify(article_data.title)
    slug = base_slug
    counter = 1
    
    while db.query(NewsArticle).filter(NewsArticle.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    # Crear artículo
    article = NewsArticle(
        **article_data.dict(),
        slug=slug,
        author_id=current_user.id
    )
    
    # Si se publica, establecer fecha
    if article.status == "published":
        from datetime import datetime
        article.published_at = datetime.utcnow()
    
    db.add(article)
    db.commit()
    db.refresh(article)
    
    return article

@router.put("/admin/news/{article_id}/", response_model=NewsArticleResponse)
async def update_news(
    article_id: int,
    article_data: NewsArticleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Actualizar artículo"""
    article = db.query(NewsArticle).filter(NewsArticle.id == article_id).first()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    # Actualizar campos
    update_data = article_data.dict(exclude_unset=True)
    
    # Si cambia el título, regenerar slug
    if "title" in update_data:
        base_slug = slugify(update_data["title"])
        slug = base_slug
        counter = 1
        
        while db.query(NewsArticle).filter(
            NewsArticle.slug == slug,
            NewsArticle.id != article_id
        ).first():
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        update_data["slug"] = slug
    
    # Si se publica por primera vez, establecer fecha
    if update_data.get("status") == "published" and article.status != "published":
        from datetime import datetime
        update_data["published_at"] = datetime.utcnow()
    
    for field, value in update_data.items():
        setattr(article, field, value)
    
    db.commit()
    db.refresh(article)
    
    return article

@router.delete("/admin/news/{article_id}/")
async def delete_news(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Eliminar artículo"""
    article = db.query(NewsArticle).filter(NewsArticle.id == article_id).first()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    db.delete(article)
    db.commit()
    
    return {"message": "Article deleted successfully"}
