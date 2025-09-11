"""
FastAPI Backend para Web Empresa
Migración desde Django REST Framework
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import uvicorn
import sys

# Importar routers
from routers import auth, news, plans, testimonials, faqs, company, contact
from database import engine, Base
from config import settings

# Crear tablas al iniciar
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        from database import test_connection
        print("🔄 Starting FastAPI Backend...")
        print(f"🐍 Python Environment: {sys.executable}")
        print(f"🌐 Server URL: http://localhost:8002")
        print(f"📖 API Documentation: http://localhost:8002/api/docs")
        print(f"🗄️ Database URL: {settings.DATABASE_URL}")
        
        # Test database connection
        if test_connection():
            print("✅ Database Connection - OK")
        else:
            print("❌ Database Connection - FAILED")
            
        Base.metadata.create_all(bind=engine)
        print("✅ Database Tables - OK")
        print("🚀 FastAPI Backend - READY")
        print("=" * 50)
    except Exception as e:
        print(f"❌ Startup failed: {e}")
    yield
    # Shutdown
    print("👋 FastAPI Backend stopped")

# Crear aplicación FastAPI
app = FastAPI(
    title="Web Empresa API",
    description="API para gestión de contenido empresarial con FastAPI",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001", 
        "http://127.0.0.1:3001",
        "http://192.168.1.36:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(news.router, prefix="/api", tags=["news"])
app.include_router(plans.router, prefix="/api", tags=["plans"])
app.include_router(testimonials.router, prefix="/api", tags=["testimonials"])
app.include_router(faqs.router, prefix="/api", tags=["faqs"])
app.include_router(company.router, prefix="/api", tags=["company"])
app.include_router(contact.router, prefix="/api", tags=["contact"])

@app.get("/")
async def root():
    return {
        "message": "Web Empresa FastAPI Backend",
        "version": "2.0.0",
        "docs": "/api/docs",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

@app.get("/api/public/homepage/")
async def get_homepage_content():
    """Endpoint para contenido de homepage que espera el frontend"""
    return {
        "featured_articles": [],
        "featured_testimonials": [], 
        "company_info": None,
        "stats": {
            "total_clients": 0,
            "total_projects": 0,
            "total_testimonials": 0
        }
    }

if __name__ == "__main__":
    print("🚀 Starting Web Empresa FastAPI Server...")
    print(f"🐍 Python: {sys.version}")
    print(f"📁 Working Directory: {sys.path[0]}")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8002,
        reload=True,
        log_level="info",  # Más información en debug
        access_log=True,
        reload_dirs=["./"]
    )
