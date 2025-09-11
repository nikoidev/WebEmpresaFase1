"""
Script para actualizar la configuración del frontend
"""

import os

def update_frontend_config():
    """Actualiza el archivo .env.local del frontend para usar FastAPI"""
    frontend_dir = "../frontend"
    env_file = os.path.join(frontend_dir, ".env.local")
    
    env_content = """# FastAPI Backend Configuration
NEXT_PUBLIC_API_URL=http://localhost:8002
"""
    
    try:
        with open(env_file, 'w') as f:
            f.write(env_content)
        print(f"✅ Archivo {env_file} actualizado")
        print("🔄 Frontend configurado para usar FastAPI en puerto 8002")
    except Exception as e:
        print(f"❌ Error actualizando frontend: {e}")

if __name__ == "__main__":
    update_frontend_config()
