"""
Script para crear usuario administrador
"""

from sqlalchemy.orm import Session
from db.session import SessionLocal, engine
from models.user import User
from security.core import get_password_hash
from db.base import Base

def create_admin_user():
    """Crea usuario administrador por defecto"""
    # Crear tablas si no existen
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Verificar si ya existe admin (buscar por email o username anterior)
        admin = db.query(User).filter(
            (User.username == "admin") | (User.username == "admin@sevp.com") | (User.email == "admin@sevp.com")
        ).first()
        
        if not admin:
            # Crear usuario admin
            from models.user import UserRole
            admin = User(
                username="admin@sevp.com",  # Usar email como username
                email="admin@sevp.com",
                first_name="Admin",
                last_name="SEVP",
                password_hash=get_password_hash("admin123"),
                role=UserRole.SUPER_ADMIN,
                is_active=True,
                is_staff=True,
                is_superuser=True
            )
            
            db.add(admin)
            db.commit()
            db.refresh(admin)
            
            print("✅ Usuario administrador creado:")
            print(f"   Username/Email: admin@sevp.com")
            print(f"   Password: admin123")
            print(f"   Nota: Usar email para hacer login")
        else:
            # Actualizar el usuario existente con el nuevo rol y email como username
            from models.user import UserRole
            admin.username = "admin@sevp.com"  # Cambiar username a email
            admin.email = "admin@sevp.com"
            admin.role = UserRole.SUPER_ADMIN
            admin.is_superuser = True
            admin.is_staff = True
            db.commit()
            print("✅ Usuario administrador actualizado: username=email, rol=SUPER_ADMIN")
            
    except Exception as e:
        print(f"❌ Error creando admin: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()
