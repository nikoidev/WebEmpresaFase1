"""
Script para iniciar FastAPI con configuración automática
"""

import uvicorn
import sys
import os

# Agregar directorio actual al path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def check_dependencies():
    """Verifica que las dependencias estén instaladas"""
    try:
        import fastapi
        import uvicorn
        import sqlalchemy
        import psycopg2
        print("✅ Dependencias verificadas (PostgreSQL)")
        return True
    except ImportError as e:
        print(f"❌ Falta dependencia: {e}")
        print("Ejecuta: pip install -r requirements.txt")
        return False

def check_database():
    """Verifica conexión a la base de datos"""
    try:
        from database import test_connection
        if test_connection():
            print("✅ Conexión a base de datos OK")
            return True
        else:
            print("❌ Error de conexión a base de datos")
            return False
    except Exception as e:
        print(f"❌ Error verificando DB: {e}")
        return False

def create_admin():
    """Crea usuario admin si no existe"""
    try:
        from create_admin import create_admin_user
        create_admin_user()
    except Exception as e:
        print(f"⚠️ Error creando admin: {e}")

def main():
    print("🚀 Iniciando FastAPI Backend - Web Empresa")
    print("=" * 50)
    
    # Verificaciones
    if not check_dependencies():
        sys.exit(1)
    
    if not check_database():
        print("⚠️ Continuando sin verificación de DB...")
    
    # Crear admin
    create_admin()
    
    print("\n🌐 Iniciando servidor FastAPI...")
    print("📱 Frontend: http://localhost:3001")
    print("🔧 API: http://localhost:8002")
    print("📚 Docs: http://localhost:8002/api/docs")
    print("🛑 Para detener: Ctrl + C")
    print("=" * 50)
    
    # Iniciar servidor
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8002,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main()
