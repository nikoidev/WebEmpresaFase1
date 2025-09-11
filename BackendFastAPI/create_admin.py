"""
Script para crear usuario administrador
"""

from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models.user import User
from auth.security import get_password_hash
from database import Base

def create_admin_user():
    """Crea usuario administrador por defecto"""
    # Crear tablas si no existen
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Verificar si ya existe admin
        admin = db.query(User).filter(User.username == "admin").first()
        
        if not admin:
            # Crear usuario admin
            admin = User(
                username="admin",
                email="admin@sevp.com",
                first_name="Admin",
                last_name="SEVP",
                password_hash=get_password_hash("admin123"),
                is_active=True,
                is_staff=True,
                is_superuser=True
            )
            
            db.add(admin)
            db.commit()
            db.refresh(admin)
            
            print("✅ Usuario administrador creado:")
            print(f"   Username: admin")
            print(f"   Password: admin123")
            print(f"   Email: admin@sevp.com")
        else:
            print("ℹ️ Usuario administrador ya existe")
            
    except Exception as e:
        print(f"❌ Error creando admin: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()
