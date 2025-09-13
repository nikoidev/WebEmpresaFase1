"""
Configuración de base de datos SQLAlchemy
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

# Crear engine de base de datos
engine = create_engine(
    settings.DATABASE_URL,
    echo=False,           # Desactivar logs SQL verbosos
    pool_pre_ping=True,   # Verificar conexiones
    pool_recycle=300      # Reciclar conexiones cada 5 min
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class para modelos
Base = declarative_base()

# Dependency para obtener sesión de DB
def get_db():
    """Dependency para inyectar sesión de base de datos"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Función para probar conexión
def test_connection():
    """Prueba la conexión a la base de datos"""
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            return True
    except Exception as e:
        print(f"❌ Error de conexión a DB: {e}")
        return False
