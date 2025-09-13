"""
FastAPI Backend para Web Empresa
Estructura estándar de FastAPI con versionado de API
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import sys

# Importar configuración y database
from core.config import settings
from db.session import engine, test_connection
from db.base import Base

# Importar API router
from api.v1.api import api_router

# Importar todos los modelos para que SQLAlchemy los reconozca
import models.user
import models.page_content
import models.contact
import models.plans

# Crear tablas al iniciar
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        print("🔄 Starting FastAPI Backend...")
        print(f"🐍 Python Environment: {sys.executable}")
        print(f"🌐 Server URL: http://localhost:8002")
        print(f"📖 API Documentation: http://localhost:8002/docs")
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
    description="API para gestión de contenido empresarial con FastAPI - Estructura Estándar",
    version="3.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
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

# Incluir API router con versionado
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "Web Empresa FastAPI Backend",
        "version": "3.0.0",
        "architecture": "Standard FastAPI Structure",
        "api_version": "v1",
        "docs": "/docs",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

# Endpoint de compatibilidad para el frontend
@app.get("/api/public/homepage/")
async def get_homepage_content():
    """Endpoint para contenido de homepage que espera el frontend"""
    return {
        "featured_articles": [],
        "featured_testimonials": [], 
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
        log_level="info",
        access_log=True,
        reload_dirs=["./"]
    )