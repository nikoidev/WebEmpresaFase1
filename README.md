# 🚀 Web Empresa - Sistema de Gestión de Contenido Empresarial

<div align="center">

![Web Empresa](https://img.shields.io/badge/Web%20Empresa-v1.0.0-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green?style=for-the-badge&logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)

*Sistema completo de gestión de contenido empresarial con panel de administración avanzado y sitio web público dinámico*

[🚀 Comenzar](#-instalación-rápida) • [📖 Documentación](#-documentación) • [🎯 Funcionalidades](#-funcionalidades-principales) • [🤝 Contribuir](#-contribución)

</div>

---

## 📌 Descripción

**Web Empresa** es una solución completa y moderna para empresas que necesitan:
- ✅ **Sitio web profesional** con gestión de contenido dinámica
- ✅ **Panel de administración** intuitivo y potente  
- ✅ **Sistema de gestión de planes** y precios
- ✅ **Formularios de contacto** avanzados
- ✅ **Navegación personalizable** y responsive
- ✅ **Autenticación segura** con roles y permisos

### 🎯 ¿Para quién es este proyecto?

- **Desarrolladores** que necesitan una base sólida para sitios empresariales
- **Empresas** que quieren control total sobre su contenido web
- **Agencias** que buscan una solución escalable y personalizable
- **Emprendedores** que necesitan un sitio profesional sin complicaciones

---

## 🏗️ Arquitectura Tecnológica

### 🎨 Frontend
- **Next.js 15** - Framework React de última generación
- **TypeScript** - Tipado estático para mayor confiabilidad
- **Tailwind CSS** - Diseño moderno y responsive
- **Lucide React** - Iconografía consistente y moderna

### ⚡ Backend
- **FastAPI** - API moderna y de alto rendimiento
- **SQLAlchemy** - ORM robusto para Python
- **PostgreSQL** - Base de datos empresarial
- **JWT + bcrypt** - Autenticación segura
- **Pydantic** - Validación automática de datos

### 🔧 DevOps & Herramientas
- **Docker** - Containerización completa
- **Alembic** - Migraciones de base de datos
- **VS Code** - Configuración de debug completa
- **Git** - Control de versiones con convenciones

---

## 🎯 Funcionalidades Principales

### 🌐 **Sitio Web Público**

| **Página** | **Funcionalidades** | **Editable** |
|------------|---------------------|:------------:|
| **🏠 Inicio** | Hero dinámico, características destacadas, call-to-action | ✅ |
| **💰 Precios** | Toggle mensual/anual, planes customizables, pruebas gratuitas | ✅ |
| **👥 Nosotros** | Misión/visión, valores, equipo, historia empresarial | ✅ |
| **📈 Historia** | Timeline interactivo, hitos importantes, números de impacto | ✅ |
| **🌍 Clientes** | Tipos de clientes, testimonios, métricas de éxito | ✅ |
| **📧 Contacto** | Formulario avanzado, información de contacto, FAQs | ✅ |

### 🔐 **Panel de Administración**

#### 📊 Dashboard Inteligente
- **Métricas en tiempo real** de visitas y conversiones
- **Accesos rápidos** a funciones más utilizadas
- **Estado del sistema** y notificaciones importantes

#### ✏️ **Editor Universal de Contenido**
- **Sistema modular por secciones** - Edita cualquier parte de cualquier página
- **Vista previa en tiempo real** - Ve cambios al instante
- **Campos dinámicos** - Texto, imágenes, listas, colores
- **Sincronización automática** - Sin pérdida de datos

#### 💼 **Gestión Completa de Planes**
- **CRUD completo** - Crear, editar, eliminar planes
- **Precios flexibles** - Mensual, anual, descuentos automáticos
- **Características dinámicas** - Lista editable de features
- **Diseño personalizable** - Colores, badges, orden de display
- **Pruebas gratuitas** - Configurable y opcional

#### 🧭 **Editor de Navegación**
- **CRUD de menú principal** - Agregar/quitar/reordenar enlaces
- **Iconos personalizables** - Biblioteca de iconos integrada
- **Editor de marca** - Logo y nombre de empresa
- **Vista previa inmediata** - Ve cambios antes de guardar

#### 👤 **Gestión de Usuarios**
- **Sistema de roles** - Super Admin, Admin, Editor, Moderator, Viewer
- **Permisos granulares** - Control preciso de accesos
- **Autenticación JWT** - Segura y escalable

#### 📬 **Sistema de Contactos**
- **Gestión de mensajes** - Recibir y gestionar consultas
- **Estados de seguimiento** - Nuevo, en progreso, resuelto
- **Información completa** - Email, teléfono, mensaje, fecha

### ⚙️ **Funcionalidades Técnicas Avanzadas**

- **🔄 Sincronización en tiempo real** - Cambios reflejados instantáneamente
- **📱 Diseño responsive** - Funciona perfecto en móvil, tablet y desktop
- **🚀 Rendimiento optimizado** - Carga rápida y experiencia fluida
- **🔒 Seguridad robusta** - Hashing de contraseñas, validación de datos
- **🛠️ Debug integrado** - F5 para lanzar frontend + backend simultáneamente
- **📝 Limpieza automática** - Eliminación de console.logs para producción

---

## 🚀 Instalación Rápida

### 📋 Prerrequisitos

- **Node.js** 18+ ([Descargar](https://nodejs.org/))
- **Python** 3.11+ ([Descargar](https://www.python.org/))
- **PostgreSQL** 13+ ([Descargar](https://www.postgresql.org/))
- **Git** ([Descargar](https://git-scm.com/))

### 🔥 Instalación en 5 Minutos

#### 1️⃣ **Clonar el Repositorio**
```bash
git clone https://github.com/tu-usuario/webempresa.git
cd webempresa
```

#### 2️⃣ **Configurar Base de Datos**
```sql
# Conectar a PostgreSQL y ejecutar:
CREATE DATABASE webempresa_db;
CREATE USER webempresa_user WITH PASSWORD 'tu_password_seguro';
GRANT ALL PRIVILEGES ON DATABASE webempresa_db TO webempresa_user;
```

#### 3️⃣ **Configurar Backend**
```bash
cd BackendFastAPI

# Crear y activar entorno virtual
python -m venv webempresa_fastapi_env

# Windows
webempresa_fastapi_env\Scripts\activate
# Linux/Mac
source webempresa_fastapi_env/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp env.example .env
# ✏️ Editar .env con tus configuraciones (ver sección configuración)

# Ejecutar migraciones
alembic upgrade head

# Crear usuario administrador
python create_admin.py

# Iniciar servidor backend
python main.py
```

#### 4️⃣ **Configurar Frontend**
```bash
# En otra terminal
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor frontend
npm run dev
```

#### 5️⃣ **¡Listo! 🎉**

- **🌐 Sitio Público**: http://localhost:3001
- **🔐 Panel Admin**: http://localhost:3001/admin/login
- **📚 API Docs**: http://localhost:8002/docs

**Credenciales de prueba:**
- Usuario: `admin`
- Contraseña: `admin123`

> ⚠️ **Importante**: Cambiar estas credenciales antes de producción

---

## 🐳 Instalación con Docker

### 🎯 Opción Rápida - Solo Base de Datos
```bash
# Iniciar PostgreSQL y Redis en contenedores
docker-compose -f docker-compose.webempresa.yml up -d

# Configurar backend y frontend normalmente
# (La BD estará en localhost:5433)
```

### 🏗️ Instalación Completa con Docker
```bash
# Construir y ejecutar todo el stack
docker-compose up --build

# Acceder a:
# Frontend: http://localhost:3001  
# Backend: http://localhost:8002
# PostgreSQL: localhost:5433
```

**Archivos incluidos:**
- `docker-compose.webempresa.yml` - Base de datos y Redis
- `Dockerfile.frontend` - Contenedor del frontend  
- `Dockerfile.backend` - Contenedor del backend
- `.dockerignore` - Archivos excluidos

---

## ⚙️ Configuración

### 🔧 Variables de Entorno

#### Backend (.env)
```env
# Entorno
ENVIRONMENT=development
DEVELOPMENT_MODE=true

# Base de datos  
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/webempresa_db

# Seguridad
SECRET_KEY=tu-clave-super-secreta-de-32-caracteres-min
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3001
```

#### Frontend (.env.local)
```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:8002

# Entorno
NODE_ENV=development
```

### 🌐 URLs y Puertos

| **Servicio** | **URL** | **Puerto** | **Descripción** |
|--------------|---------|------------|-----------------|
| Frontend | http://localhost:3001 | 3001 | Sitio web público |
| Backend API | http://localhost:8002 | 8002 | API REST |
| PostgreSQL | localhost | 5433 | Base de datos |
| Redis | localhost | 6380 | Cache (opcional) |

---

## 📦 Scripts y Comandos

### 🎨 Frontend (Next.js)
```bash
# Desarrollo
npm run dev              # Servidor de desarrollo (puerto 3001)
npm run build            # Build para producción
npm run start            # Servidor de producción
npm run lint             # Ejecutar linter

# Utilidades
npm run clean:console    # Eliminar console.logs
npm run build:production # Build + limpieza automática
npm run type-check       # Verificar tipos TypeScript
```

### ⚡ Backend (FastAPI)
```bash
# Servidor
python main.py           # Iniciar servidor (puerto 8002)

# Base de datos
alembic upgrade head     # Aplicar migraciones
alembic revision --autogenerate -m "descripcion"  # Crear migración

# Administración
python create_admin.py   # Crear usuario administrador
```

### 🐳 Docker
```bash
# Solo base de datos
docker-compose -f docker-compose.webempresa.yml up -d

# Stack completo
docker-compose up --build

# Limpiar
docker-compose down -v   # Parar y eliminar volúmenes
```

---

## 📁 Estructura del Proyecto

```
webempresa/
├── 🎨 frontend/                    # Frontend Next.js
│   ├── src/
│   │   ├── app/                   # Páginas (App Router)
│   │   │   ├── admin/             # Panel de administración
│   │   │   ├── precios/           # Página de precios
│   │   │   ├── nosotros/          # Página sobre nosotros  
│   │   │   ├── historia/          # Página de historia
│   │   │   ├── clientes/          # Página de clientes
│   │   │   └── contacto/          # Página de contacto
│   │   ├── components/            # Componentes React
│   │   │   ├── layout/            # Layouts (Public/Admin)
│   │   │   ├── UniversalSectionEditModal.tsx  # Editor universal
│   │   │   └── NavigationEditModal.tsx        # Editor de navegación
│   │   ├── contexts/              # Context providers
│   │   ├── lib/                   # API client y utilidades
│   │   ├── services/              # Servicios API
│   │   └── types/                 # TypeScript types
│   ├── scripts/                   # Scripts de utilidad
│   └── package.json
├── ⚡ BackendFastAPI/              # Backend FastAPI
│   ├── models/                    # Modelos SQLAlchemy
│   │   ├── user.py               # Usuarios y permisos
│   │   ├── page_content.py       # Contenido de páginas
│   │   ├── plans.py              # Planes de servicio
│   │   └── contact.py            # Mensajes de contacto
│   ├── routers/                   # Endpoints API
│   ├── schemas/                   # Esquemas Pydantic
│   ├── auth/                      # Autenticación JWT
│   ├── alembic/                   # Migraciones DB
│   ├── main.py                    # Servidor principal
│   ├── create_admin.py            # Crear usuario admin
│   └── requirements.txt
├── 🐳 Docker/
│   ├── docker-compose.webempresa.yml  # Solo BD
│   ├── Dockerfile.frontend        # Contenedor frontend
│   └── Dockerfile.backend         # Contenedor backend
├── 📚 docs/                       # Documentación
│   ├── FEATURES.md               # Guía de funcionalidades
│   ├── DOCKER.md                 # Guía Docker detallada
│   └── API.md                    # Documentación API
└── 📄 Archivos de configuración
    ├── README.md                 # Este archivo
    ├── CONTRIBUTING.md           # Guía de contribución
    ├── .gitignore               # Archivos ignorados
    └── .vscode/                 # Configuración VS Code
```

---

## 🔒 Seguridad

### 🛡️ Características de Seguridad

- **🔐 Autenticación JWT** - Tokens seguros con expiración
- **🔑 Hash de contraseñas** - bcrypt con salt automático
- **✅ Validación de datos** - Pydantic schemas para toda entrada
- **🌐 CORS configurado** - Orígenes permitidos por entorno
- **🔒 Variables de entorno** - Secretos fuera del código
- **👥 Sistema de roles** - Permisos granulares por funcionalidad

### 🔧 Configuración de Seguridad en Producción

```env
# .env para producción
ENVIRONMENT=production
DEVELOPMENT_MODE=false
SECRET_KEY=clave-super-secreta-de-al-menos-32-caracteres
ALLOWED_ORIGINS=https://tudominio.com,https://www.tudominio.com
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

---

## 🚀 Despliegue en Producción

### 🏗️ Preparación

#### 1. **Frontend**
```bash
cd frontend
npm run build:production  # Build con limpieza automática
```

#### 2. **Backend**
```bash
cd BackendFastAPI
pip install -r requirements.txt
alembic upgrade head      # Aplicar migraciones
```

#### 3. **Variables de Entorno**
```bash
# Backend
ENVIRONMENT=production
DEVELOPMENT_MODE=false
DATABASE_URL=postgresql://user:pass@host:5432/dbname
ALLOWED_ORIGINS=https://tudominio.com

# Frontend  
NEXT_PUBLIC_API_URL=https://api.tudominio.com
NODE_ENV=production
```

### ☁️ Opciones de Despliegue

| **Plataforma** | **Frontend** | **Backend** | **Base de Datos** |
|----------------|--------------|-------------|-------------------|
| **Vercel + Railway** | Vercel | Railway | Railway PostgreSQL |
| **Netlify + Heroku** | Netlify | Heroku | Heroku PostgreSQL |
| **AWS** | S3 + CloudFront | EC2 + ALB | RDS PostgreSQL |
| **Digital Ocean** | App Platform | Droplet | Managed Database |

---

## 🤝 Contribución

¡Contribuciones son bienvenidas! Lee nuestra [Guía de Contribución](CONTRIBUTING.md) para:

- 📋 **Estándares de código** y convenciones
- 🔄 **Flujo de trabajo** con Git y GitHub
- 🧪 **Testing** y quality assurance
- 📝 **Documentación** y comentarios
- 🐛 **Reporte de bugs** y feature requests

### 🚀 Proceso Rápido

1. **Fork** el proyecto
2. **Crear** rama feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** cambios (`git commit -m 'Add AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abrir** Pull Request

---

## 📚 Documentación Adicional

- 📖 **[Guía de Funcionalidades](docs/FEATURES.md)** - Tutorial completo para usuarios
- 🐳 **[Guía Docker](docs/DOCKER.md)** - Instalación y configuración con Docker
- 🔧 **[API Reference](docs/API.md)** - Documentación completa de endpoints
- 🤝 **[Guía de Contribución](CONTRIBUTING.md)** - Para desarrolladores

---

## 🏆 Casos de Uso

### 💼 **Empresas de Servicios**
- Consultorías, agencias de marketing, estudios legales
- Presentación de servicios con planes claros
- Formularios de contacto y seguimiento de leads

### 🎓 **Instituciones Educativas**  
- Academias, cursos online, universidades
- Gestión de programas educativos
- Testimonios de estudiantes

### 🏭 **Empresas Tecnológicas**
- Startups, software houses, consultoras IT
- Presentación de productos y servicios
- Documentación técnica y recursos

### 🛒 **E-commerce de Servicios**
- Plataformas SaaS, servicios digitales
- Comparación de planes y precios
- Onboarding de usuarios

---

## 🎨 Capturas de Pantalla

### 🌐 Sitio Web Público
[Agregar capturas del sitio público]

### 🔐 Panel de Administración  
[Agregar capturas del panel admin]

### 💰 Editor de Precios
[Agregar capturas del editor de planes]

---

## 📊 Métricas del Proyecto

- ⭐ **Funcionalidades**: 20+ características principales
- 📄 **Páginas**: 6 páginas públicas + panel admin completo
- 🔧 **Componentes**: 30+ componentes React reutilizables
- 🗄️ **Modelos de BD**: 4 modelos principales con relaciones
- 🔒 **Endpoints**: 25+ endpoints API documentados
- 📱 **Responsive**: 100% compatible móvil/tablet/desktop

---

## ❓ FAQ

<details>
<summary><strong>¿Puedo usar este proyecto comercialmente?</strong></summary>

Sí, el proyecto está bajo licencia MIT que permite uso comercial. Solo asegúrate de revisar las dependencias individuales.
</details>

<details>
<summary><strong>¿Qué nivel de conocimiento necesito?</strong></summary>

- **Básico**: Configurar y usar el panel admin
- **Intermedio**: Personalizar estilos y contenido  
- **Avanzado**: Agregar funcionalidades y modificar backend
</details>

<details>
<summary><strong>¿Incluye hosting gratuito?</strong></summary>

No incluye hosting, pero está optimizado para plataformas gratuitas como Vercel (frontend) y Railway (backend).
</details>

<details>
<summary><strong>¿Puedo agregar más idiomas?</strong></summary>

Actualmente está en español, pero la arquitectura permite agregar internacionalización fácilmente.
</details>

---

## 📞 Soporte y Comunidad

- 🐛 **Issues**: [GitHub Issues](https://github.com/tu-usuario/webempresa/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/tu-usuario/webempresa/discussions)  
- 📧 **Email**: contacto@tudominio.com
- 🐦 **Twitter**: [@tu_usuario](https://twitter.com/tu_usuario)

---

## 📝 Licencia

Este proyecto está licenciado bajo la **Licencia MIT** - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🙏 Agradecimientos

- **Next.js Team** - Por el increíble framework
- **FastAPI** - Por la API más rápida de Python
- **Tailwind CSS** - Por hacer el diseño un placer
- **Lucide** - Por los iconos perfectos
- **PostgreSQL** - Por la base de datos más confiable

---

<div align="center">

**¡Si te gusta este proyecto, dale una ⭐ en GitHub!**

[🚀 Comenzar](##-instalación-rápida) • [📖 Documentación](##-documentación) • [🤝 Contribuir](##-contribución)

---

*Desarrollado con ❤️ para la comunidad de desarrolladores*

</div>