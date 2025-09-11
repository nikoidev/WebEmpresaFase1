#!/usr/bin/env python
"""
Script de desarrollo para Web Empresa Backend
Configura automáticamente el entorno y ejecuta Django en modo debug
"""
import os
import sys
import subprocess
from pathlib import Path

def main():
    # Obtener el directorio del script
    script_dir = Path(__file__).parent.absolute()
    os.chdir(script_dir)
    
    print("🔧 Web Empresa - Servidor de Desarrollo")
    print("=" * 50)
    print(f"📂 Directorio: {script_dir}")
    
    # Verificar que estamos en el directorio correcto
    if not (script_dir / 'manage.py').exists():
        print("❌ Error: manage.py no encontrado")
        print("🔍 Asegúrate de ejecutar este script desde el directorio backend/")
        sys.exit(1)
    
    # Configurar variables de entorno
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'webempresa_core.settings')
    os.environ.setdefault('PYTHONPATH', str(script_dir))
    
    try:
        # Verificar conexión a base de datos
        print("🔍 Verificando conexión a base de datos...")
        result = subprocess.run([
            'pipenv', 'run', 'python', 'manage.py', 'check', '--database', 'default'
        ], capture_output=True, text=True, cwd=script_dir)
        
        if result.returncode != 0:
            print("❌ Error de conexión a base de datos:")
            print(result.stderr)
            print("\n💡 Asegúrate de que Docker esté corriendo:")
            print("   docker-compose -f ../docker-compose.webempresa.yml up -d")
            sys.exit(1)
        
        print("✅ Conexión a base de datos OK")
        
        # Ejecutar migraciones
        print("📊 Aplicando migraciones...")
        subprocess.run([
            'pipenv', 'run', 'python', 'manage.py', 'migrate'
        ], cwd=script_dir)
        
        # Verificar si existe superusuario
        print("👤 Verificando usuario administrador...")
        create_admin = subprocess.run([
            'pipenv', 'run', 'python', 'manage.py', 'shell', '-c',
            "from django.contrib.auth.models import User; print('EXISTS' if User.objects.filter(username='admin').exists() else 'NOT_EXISTS')"
        ], capture_output=True, text=True, cwd=script_dir)
        
        if 'NOT_EXISTS' in create_admin.stdout:
            print("🔧 Creando usuario administrador...")
            subprocess.run([
                'pipenv', 'run', 'python', 'manage.py', 'createsuperuser',
                '--username', 'admin',
                '--email', 'admin@webempresa.com',
                '--noinput'
            ], cwd=script_dir)
            
            # Establecer contraseña
            subprocess.run([
                'pipenv', 'run', 'python', 'manage.py', 'shell', '-c',
                "from django.contrib.auth.models import User; u=User.objects.get(username='admin'); u.set_password('admin123'); u.save(); print('Password set')"
            ], cwd=script_dir)
            
            print("✅ Usuario admin creado con contraseña: admin123")
        else:
            print("✅ Usuario administrador ya existe")
        
        # Iniciar servidor de desarrollo
        print("\n🚀 Iniciando servidor Django...")
        print("=" * 50)
        print("🌐 URL: http://localhost:8001")
        print("👨‍💼 Admin: http://localhost:8001/admin")
        print("🔑 Usuario: admin / admin123")
        print("⏹️  Para detener: Ctrl+C")
        print("=" * 50)
        
        # Ejecutar servidor
        subprocess.run([
            'pipenv', 'run', 'python', 'manage.py', 'runserver', '8001'
        ], cwd=script_dir)
        
    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido")
    except FileNotFoundError:
        print("❌ Error: pipenv no encontrado")
        print("💡 Instala pipenv: pip install pipenv")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
