# 🐳 Guía Docker - Web Empresa

Esta guía te ayudará a configurar y ejecutar **Web Empresa** usando Docker para un entorno de desarrollo consistente y fácil de configurar.

---

## 🎯 Opciones de Instalación

### 🚀 **Opción 1: Solo Base de Datos (Recomendado para desarrollo)**
- ✅ PostgreSQL y Redis en contenedores
- ✅ Frontend y Backend ejecutándose localmente  
- ✅ Hot reload completo
- ✅ Debug con VS Code (F5)

### 🏗️ **Opción 2: Stack Completo**
- ✅ Todo en contenedores
- ✅ Ideal para testing de producción
- ✅ Fácil deploy
- ❌ Sin hot reload (requiere rebuild)

---

## 🚀 Opción 1: Solo Base de Datos

### 📋 Prerrequisitos
- **Docker** 20+ ([Descargar](https://www.docker.com/))
- **Docker Compose** 2+ (incluido con Docker Desktop)
- **Node.js** 18+ para frontend
- **Python** 3.11+ para backend

### ⚡ Instalación Rápida

#### 1️⃣ **Iniciar Servicios de Base de Datos**
```bash
# Desde la raíz del proyecto
docker-compose -f docker-compose.webempresa.yml up -d

# Verificar que los servicios estén corriendo
docker-compose -f docker-compose.webempresa.yml ps
```

**Resultado esperado:**
```
Name                  State    Ports
webempresa_postgres   Up       0.0.0.0:5433->5432/tcp
webempresa_redis      Up       0.0.0.0:6380->6379/tcp
```

#### 2️⃣ **Configurar Backend**
```bash
cd BackendFastAPI

# Crear entorno virtual
python -m venv webempresa_fastapi_env

# Activar entorno virtual
# Windows:
webempresa_fastapi_env\Scripts\activate
# Linux/Mac:
source webempresa_fastapi_env/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno para Docker
cp env.example .env
```

**Editar `.env` para Docker:**
```env
# Base de datos Docker
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/webempresa_db

# Resto de configuración
ENVIRONMENT=development
SECRET_KEY=tu-clave-secreta-para-desarrollo
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=http://localhost:3001
DEVELOPMENT_MODE=true
```

```bash
# Ejecutar migraciones
alembic upgrade head

# Crear usuario administrador
python create_admin.py

# Iniciar servidor backend
python main.py
```

#### 3️⃣ **Configurar Frontend**
```bash
# En otra terminal
cd frontend

# Instalar dependencias
npm install

# Configurar API URL para backend local
echo "NEXT_PUBLIC_API_URL=http://localhost:8002" > .env.local

# Iniciar servidor frontend
npm run dev
```

#### 4️⃣ **¡Listo! 🎉**
- **🌐 Sitio Web**: http://localhost:3001
- **🔐 Admin Panel**: http://localhost:3001/admin/login
- **📚 API Docs**: http://localhost:8002/docs
- **🗄️ PostgreSQL**: localhost:5433
- **🚀 Redis**: localhost:6380

### 🛠️ Comandos Útiles

```bash
# Ver logs de la base de datos
docker-compose -f docker-compose.webempresa.yml logs -f webempresa_postgres

# Conectar a PostgreSQL
docker exec -it webempresa_postgres psql -U postgres -d webempresa_db

# Reiniciar servicios
docker-compose -f docker-compose.webempresa.yml restart

# Parar servicios
docker-compose -f docker-compose.webempresa.yml down

# Parar y eliminar volúmenes (⚠️ ELIMINA TODOS LOS DATOS)
docker-compose -f docker-compose.webempresa.yml down -v
```

### 🔍 Debug con VS Code

Con esta configuración, puedes usar **F5** en VS Code para lanzar frontend y backend simultáneamente:

```json
// .vscode/launch.json ya está configurado
{
    "configurations": [
        {
            "name": "🚀 FastAPI Backend",
            "type": "node",
            "request": "launch",
            "program": "${workspaceFolder}/BackendFastAPI/main.py",
            "runtimeExecutable": "python",
            "cwd": "${workspaceFolder}/BackendFastAPI"
        },
        {
            "name": "⚡ Frontend Next.js", 
            "type": "node",
            "request": "launch",
            "runtimeExecutable": "npm",
            "runtimeArgs": ["run", "dev"],
            "cwd": "${workspaceFolder}/frontend"
        }
    ],
    "compounds": [
        {
            "name": "🌐 Full Stack Web Empresa",
            "configurations": ["🚀 FastAPI Backend", "⚡ Frontend Next.js"]
        }
    ]
}
```

---

## 🏗️ Opción 2: Stack Completo con Docker

### 📁 Archivos Necesarios

Primero, vamos a crear los Dockerfiles necesarios:

#### 🎨 **Dockerfile.frontend**
```dockerfile
# Dockerfile.frontend
FROM node:18-alpine AS base

# Instalar dependencias solo cuando sea necesario
FROM base AS deps
WORKDIR /app

# Instalar dependencias
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci --only=production

# Rebuild solo cuando sea necesario
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ .

# Variables de entorno para build
ENV NEXT_PUBLIC_API_URL=http://localhost:8002
ENV NODE_ENV=production

# Build de la aplicación
RUN npm run build:production

# Imagen de producción
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3001

ENV PORT=3001

CMD ["node", "server.js"]
```

#### ⚡ **Dockerfile.backend**
```dockerfile
# Dockerfile.backend
FROM python:3.11-slim

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Crear directorio de trabajo
WORKDIR /app

# Instalar dependencias Python
COPY BackendFastAPI/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código de la aplicación
COPY BackendFastAPI/ .

# Crear usuario no-root
RUN adduser --disabled-password --gecos '' appuser
RUN chown -R appuser:appuser /app
USER appuser

# Exponer puerto
EXPOSE 8002

# Variables de entorno por defecto
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Comando por defecto
CMD ["python", "main.py"]
```

#### 🐳 **docker-compose.yml** (Stack Completo)
```yaml
version: '3.8'

services:
  # Base de datos PostgreSQL
  postgres:
    image: postgres:15
    container_name: webempresa_postgres
    environment:
      POSTGRES_DB: webempresa_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5433:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-webempresa-db.sql:/docker-entrypoint-initdb.d/init-webempresa-db.sql
    networks:
      - webempresa_network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d webempresa_db"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis para cache
  redis:
    image: redis:7-alpine
    container_name: webempresa_redis
    ports:
      - "6380:6379"
    volumes:
      - redis_data:/data
    networks:
      - webempresa_network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Backend FastAPI
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    container_name: webempresa_backend
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/webempresa_db
      - SECRET_KEY=tu-clave-secreta-para-docker
      - ACCESS_TOKEN_EXPIRE_MINUTES=30
      - ALLOWED_ORIGINS=http://localhost:3001,http://frontend:3001
      - ENVIRONMENT=development
      - DEVELOPMENT_MODE=true
    ports:
      - "8002:8002"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - webempresa_network
    restart: unless-stopped
    volumes:
      - ./BackendFastAPI:/app
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8002/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend Next.js
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: webempresa_frontend
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8002
      - NODE_ENV=production
    ports:
      - "3001:3001"
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - webempresa_network
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:

networks:
  webempresa_network:
    driver: bridge
```

### 🚀 **Configuración Completa con Docker**

#### 1️⃣ **Preparar Archivos**
```bash
# Crear Dockerfiles
touch Dockerfile.frontend Dockerfile.backend

# Crear archivo de inicialización de BD
cat > init-webempresa-db.sql << 'EOF'
-- Inicialización de la base de datos Web Empresa
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verificar que la base de datos está lista
SELECT 'Base de datos Web Empresa inicializada correctamente' as status;
EOF
```

#### 2️⃣ **Variables de Entorno**
```bash
# Crear archivo .env.docker
cat > .env.docker << 'EOF'
# Backend
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/webempresa_db
SECRET_KEY=tu-clave-secreta-super-larga-para-docker-desarrollo
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=http://localhost:3001,http://frontend:3001
ENVIRONMENT=development
DEVELOPMENT_MODE=true

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8002
NODE_ENV=production
EOF
```

#### 3️⃣ **Build y Ejecutar**
```bash
# Build de todas las imágenes
docker-compose build

# Ejecutar stack completo
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Verificar que todos los servicios estén corriendo
docker-compose ps
```

#### 4️⃣ **Configurar Base de Datos**
```bash
# Ejecutar migraciones
docker-compose exec backend alembic upgrade head

# Crear usuario administrador
docker-compose exec backend python create_admin.py
```

#### 5️⃣ **¡Acceder a la Aplicación! 🎉**
- **🌐 Frontend**: http://localhost:3001
- **⚡ Backend API**: http://localhost:8002
- **📚 API Docs**: http://localhost:8002/docs

### 🔧 **Comandos de Gestión**

```bash
# Ver estado de todos los servicios
docker-compose ps

# Ver logs específicos
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f postgres

# Reiniciar un servicio específico
docker-compose restart backend

# Rebuild de un servicio
docker-compose build --no-cache backend
docker-compose up -d backend

# Acceder a contenedor
docker-compose exec backend bash
docker-compose exec postgres psql -U postgres -d webempresa_db

# Parar todo
docker-compose down

# Parar y eliminar volúmenes (⚠️ ELIMINA DATOS)
docker-compose down -v
```

---

## 🔧 Configuración Avanzada

### 🌍 **Variables de Entorno por Servicio**

#### Backend (`docker-compose.yml`)
```yaml
backend:
  environment:
    # Base de datos
    - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/webempresa_db
    
    # Seguridad
    - SECRET_KEY=tu-clave-secreta-super-larga-minimo-32-caracteres
    - ACCESS_TOKEN_EXPIRE_MINUTES=30
    
    # CORS
    - ALLOWED_ORIGINS=http://localhost:3001,http://frontend:3001
    
    # Modo desarrollo
    - ENVIRONMENT=development
    - DEVELOPMENT_MODE=true
    
    # Logging
    - LOG_LEVEL=INFO
    
    # Redis (opcional)
    - REDIS_URL=redis://redis:6379/0
```

#### Frontend (`docker-compose.yml`)
```yaml
frontend:
  environment:
    # API Backend
    - NEXT_PUBLIC_API_URL=http://localhost:8002
    
    # Next.js
    - NODE_ENV=production
    
    # Opcional: Analytics
    - NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 🗄️ **Persistencia de Datos**

```yaml
volumes:
  # Datos de PostgreSQL
  postgres_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: ./docker/postgres-data
  
  # Datos de Redis  
  redis_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: ./docker/redis-data
  
  # Uploads del backend
  backend_uploads:
    driver: local
    driver_opts:
      type: none
      o: bind  
      device: ./BackendFastAPI/uploads
```

### 🌐 **Networking Personalizado**

```yaml
networks:
  webempresa_network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
          gateway: 172.20.0.1

services:
  postgres:
    networks:
      webempresa_network:
        ipv4_address: 172.20.0.10
  
  backend:
    networks:
      webempresa_network:
        ipv4_address: 172.20.0.20
  
  frontend:
    networks:
      webempresa_network:
        ipv4_address: 172.20.0.30
```

---

## 🚀 Configuración para Producción

### 🏭 **docker-compose.prod.yml**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}  
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_prod_data:/var/lib/postgresql/data
    restart: always
    # No exponer puerto públicamente en producción
    expose:
      - "5432"

  redis:
    image: redis:7-alpine
    restart: always
    expose:
      - "6379"
    volumes:
      - redis_prod_data:/data

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
      target: production
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      - SECRET_KEY=${SECRET_KEY}
      - ACCESS_TOKEN_EXPIRE_MINUTES=30
      - ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
      - ENVIRONMENT=production
      - DEVELOPMENT_MODE=false
    expose:
      - "8002"
    depends_on:
      - postgres
      - redis
    restart: always

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
      target: production
      args:
        - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
    ports:
      - "80:3001"
    depends_on:
      - backend
    restart: always

  # Nginx como reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: always

volumes:
  postgres_prod_data:
  redis_prod_data:
```

### 🔒 **Archivo .env.prod**

```env
# Base de datos
POSTGRES_DB=webempresa_prod
POSTGRES_USER=webempresa_user
POSTGRES_PASSWORD=contraseña-super-segura-produccion

# Backend
SECRET_KEY=clave-secreta-super-larga-para-produccion-minimo-32-caracteres
ALLOWED_ORIGINS=https://tudominio.com,https://www.tudominio.com

# Frontend
NEXT_PUBLIC_API_URL=https://api.tudominio.com
```

### 🚀 **Deploy en Producción**

```bash
# Build para producción
docker-compose -f docker-compose.prod.yml build

# Ejecutar en producción
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Verificar logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

## 🔍 Troubleshooting

### ❌ **Problemas Comunes**

#### **1. Error de conexión a PostgreSQL**
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps postgres

# Ver logs de PostgreSQL
docker-compose logs postgres

# Conectar manualmente para probar
docker exec -it webempresa_postgres psql -U postgres -d webempresa_db
```

#### **2. Frontend no puede conectar con Backend**
```bash
# Verificar que backend esté corriendo
curl http://localhost:8002/health

# Verificar variables de entorno del frontend
docker-compose exec frontend env | grep NEXT_PUBLIC_API_URL

# Verificar red Docker
docker network ls
docker network inspect webempresa_default
```

#### **3. Permisos de archivos**
```bash
# Dar permisos correctos
sudo chown -R $USER:$USER ./docker/
chmod -R 755 ./docker/
```

#### **4. Puerto ya en uso**
```bash
# Ver qué está usando el puerto
sudo lsof -i :3001
sudo lsof -i :8002
sudo lsof -i :5433

# Cambiar puertos en docker-compose.yml si es necesario
```

### 🧪 **Health Checks**

```bash
# Verificar salud de todos los servicios
docker-compose ps

# Health check manual
curl http://localhost:8002/health
curl http://localhost:3001/api/health

# Logs detallados
docker-compose logs --tail=100 -f
```

### 🔄 **Reset Completo**

```bash
# Parar todo y limpiar
docker-compose down -v
docker system prune -f
docker volume prune -f

# Rebuild completo
docker-compose build --no-cache
docker-compose up -d

# Reconfigurar base de datos
docker-compose exec backend alembic upgrade head
docker-compose exec backend python create_admin.py
```

---

## 📊 Monitoreo y Logs

### 📈 **Configuración de Logs**

```yaml
# En docker-compose.yml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
  
  frontend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 🔍 **Comandos de Monitoreo**

```bash
# Ver uso de recursos
docker stats

# Logs en tiempo real de todos los servicios
docker-compose logs -f

# Logs específicos con timestamps
docker-compose logs -f --timestamps backend

# Buscar en logs
docker-compose logs backend | grep ERROR
docker-compose logs frontend | grep -i error

# Exportar logs
docker-compose logs > docker-logs-$(date +%Y%m%d-%H%M%S).log
```

---

## 🎯 Tips y Mejores Prácticas

### ⚡ **Performance**

1. **Usar multi-stage builds** para imágenes más pequeñas
2. **Configurar `.dockerignore`** para excluir archivos innecesarios
3. **Usar layers caching** para builds más rápidos
4. **Configurar health checks** para disponibilidad

### 🔒 **Seguridad**

1. **No usar passwords por defecto** en producción
2. **Usar secrets** de Docker Compose para credenciales
3. **Ejecutar contenedores como non-root user**
4. **Actualizar imágenes base** regularmente

### 📁 **.dockerignore**
```gitignore
# Node.js
frontend/node_modules
frontend/.next
frontend/dist

# Python
BackendFastAPI/__pycache__
BackendFastAPI/*.pyc
BackendFastAPI/webempresa_fastapi_env

# Git y documentación
.git
*.md
docs/

# Archivos locales
.env*
*.log
docker-logs-*

# VS Code
.vscode
```

### 🔄 **Docker Compose Override**

Crear `docker-compose.override.yml` para desarrollo local:
```yaml
version: '3.8'

services:
  backend:
    volumes:
      # Hot reload para desarrollo
      - ./BackendFastAPI:/app
    environment:
      - DEVELOPMENT_MODE=true
      - LOG_LEVEL=DEBUG

  frontend:
    volumes:
      # Hot reload para desarrollo  
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev
```

---

## 📚 Recursos Adicionales

- 📖 [Docker Compose Reference](https://docs.docker.com/compose/)
- 🐳 [Dockerfile Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- 🔧 [Next.js Docker](https://nextjs.org/docs/deployment#docker-image)
- ⚡ [FastAPI in Containers](https://fastapi.tiangolo.com/deployment/docker/)

---

<div align="center">

**🐳 ¡Docker hace el desarrollo más fácil y consistente! 🚀**

[🏠 Volver al README](../README.md) • [🤝 Contribuir](../CONTRIBUTING.md) • [🎯 Funcionalidades](FEATURES.md)

</div>
