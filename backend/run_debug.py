#!/usr/bin/env python
"""
Script para ejecutar Web Empresa backend en modo debug
Maneja automáticamente pipenv y las configuraciones necesarias
"""
import os
import sys
import subprocess

def main():
    # Cambiar al directorio del backend
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    
    # Verificar si estamos en el entorno virtual correcto
    try:
        # Ejecutar el servidor usando pipenv
        print("🌐 Iniciando Web Empresa Backend en puerto 8001...")
        print("📂 Directorio:", backend_dir)
        print("🔧 Usando pipenv para gestionar dependencias...")
        
        # Ejecutar con pipenv
        subprocess.run([
            "pipenv", "run", "python", "manage.py", "runserver", "0.0.0.0:8001"
        ], check=True)
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error al ejecutar el servidor: {e}")
        sys.exit(1)
    except FileNotFoundError:
        print("❌ pipenv no encontrado. Asegúrate de tenerlo instalado.")
        print("💡 Instala pipenv con: pip install pipenv")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido por el usuario")
        sys.exit(0)

if __name__ == "__main__":
    main()
