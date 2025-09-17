# Web Empresa 🚀

Sistema de gestión de contenido y servicios web empresariales con panel de administración completo.

## 🏗️ Arquitectura

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: FastAPI + SQLAlchemy + PostgreSQL
- **Autenticación**: JWT con bcrypt
- **Base de datos**: PostgreSQL

## 📋 Características

### 🎯 Frontend Público
- Página de inicio con hero dinámico y slideshow
- Sección de precios con planes mensuales/anuales
- Páginas de empresa (nosotros, historia)
- Formulario de contacto
- Sección de clientes y testimonios
- FAQ dinámicas

### 🔧 Panel de Administración
- Dashboard con estadísticas en tiempo real
- Editor universal de contenido de páginas
- Gestión completa de planes de servicio (CRUD)
- Administración de usuarios y permisos
- Gestión de contactos y mensajes
- Sistema de autenticación seguro

### ✨ Funcionalidades Avanzadas
- Toggle dinámico mensual/anual en precios
- Editor modal universal para todas las secciones
- Componentes reutilizables y responsivos
- Sistema de permisos granular
- API RESTful completa
- Validación de datos con Pydantic schemas

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+ 
- Python 3.11+
- PostgreSQL 13+

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd webempresa
```

### 2. Configurar Backend (FastAPI)

```bash
cd BackendFastAPI

# Crear entorno virtual
python -m venv webempresa_fastapi_env

# Activar entorno virtual
# En Windows:
webempresa_fastapi_env\Scripts\activate
# En Linux/Mac:
source webempresa_fastapi_env/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp env.example .env
# Editar .env con tus configuraciones

# Ejecutar migraciones
alembic upgrade head

# Crear usuario administrador
python create_admin.py

# Iniciar servidor
python main.py
```

### 3. Configurar Frontend (Next.js)

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### 4. Configurar Base de Datos

```sql
-- Crear base de datos PostgreSQL
CREATE DATABASE webempresa_db;
CREATE USER webempresa_user WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE webempresa_db TO webempresa_user;
```

## 🔧 Configuración

### Variables de Entorno

#### Backend (.env)
```env
ENVIRONMENT=development
DATABASE_URL=postgresql://usuario:password@localhost:5433/webempresa_db
SECRET_KEY=tu-clave-secreta-aqui
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=http://localhost:3001
DEVELOPMENT_MODE=true
```

#### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:8001
NODE_ENV=development
```

## 📦 Scripts Disponibles

### Frontend
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run build:production  # Build con limpieza de console.logs
npm run start        # Servidor de producción
npm run lint         # Linter
npm run clean:console # Eliminar console.logs
```

### Backend
```bash
python main.py       # Iniciar servidor FastAPI
python create_admin.py # Crear usuario admin
alembic upgrade head # Ejecutar migraciones
alembic revision --autogenerate -m "mensaje" # Crear migración
```

## 🌐 URLs de Acceso

- **Frontend Público**: http://localhost:3001
- **Panel Admin**: http://localhost:3001/admin/login
- **API Backend**: http://localhost:8001
- **Documentación API**: http://localhost:8001/docs

### Credenciales Admin por Defecto
- **Usuario**: admin
- **Contraseña**: admin123

> ⚠️ **Importante**: Cambiar estas credenciales en producción

## 📁 Estructura del Proyecto

```
webempresa/
├── frontend/                    # Next.js Frontend
│   ├── src/
│   │   ├── app/                # Pages (App Router)
│   │   ├── components/         # Componentes React
│   │   ├── lib/               # Utilidades y API client
│   │   ├── contexts/          # Context providers
│   │   └── types/             # TypeScript types
│   ├── scripts/               # Scripts de utilidad
│   └── package.json
├── BackendFastAPI/             # FastAPI Backend
│   ├── api/                   # Endpoints API
│   ├── core/                  # Configuración core
│   ├── crud/                  # Operaciones CRUD
│   ├── db/                    # Database connection
│   ├── models/                # SQLAlchemy models
│   ├── schemas/               # Pydantic schemas
│   ├── security/              # Autenticación y seguridad
│   ├── alembic/               # Migraciones de DB
│   └── requirements.txt
└── README.md
```

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- Tokens JWT para autenticación
- Validación de datos con Pydantic
- CORS configurado por entorno
- Variables de entorno para secretos
- Permisos granulares por usuario

## 🚀 Despliegue en Producción

### 1. Preparar Frontend
```bash
cd frontend
npm run build:production  # Build con limpieza automática
```

### 2. Configurar Variables de Entorno
```bash
# Backend
ENVIRONMENT=production
DEVELOPMENT_MODE=false
ALLOWED_ORIGINS=https://tudominio.com
DATABASE_URL=postgresql://user:pass@rds-endpoint:5432/dbname

# Frontend
NEXT_PUBLIC_API_URL=https://api.tudominio.com
NODE_ENV=production
```

### 3. Ejecutar Migraciones
```bash
cd BackendFastAPI
alembic upgrade head
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Para reportar bugs o solicitar características:
- Crear un [Issue](issues)
- Enviar [Pull Request](pulls)

---

**Desarrollado con ❤️ para empresas que buscan presencia web profesional**
