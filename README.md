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
- **Python** 3.13+ ([Descargar](https://www.python.org/))
- **Docker Desktop** ([Descargar](https://www.docker.com/products/docker-desktop))
- **Git** ([Descargar](https://git-scm.com/))
- **VS Code** (recomendado) ([Descargar](https://code.visualstudio.com/))

### 🔥 Instalación en 5 Minutos

#### 1️⃣ **Clonar el Repositorio**
```bash
git clone https://github.com/tu-usuario/webempresa.git
cd webempresa
```

#### 2️⃣ **Iniciar Contenedores Docker**
```bash
# Inicia PostgreSQL y pgAdmin
docker-compose -f docker-compose.webempresa.yml up -d
```

Esto iniciará:
- **PostgreSQL** en puerto `5436`
- **pgAdmin** en puerto `5054` (http://localhost:5054)

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

# Crear archivo .env (copiar desde env.example y ajustar si es necesario)
# Por defecto ya está configurado para funcionar

# Ejecutar migraciones
alembic upgrade head

# Crear usuario administrador y datos iniciales
python create_admin.py
python seed_content.py

# Iniciar servidor backend
python -m uvicorn main:app --reload --port 8000
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
- **📚 API Docs**: http://localhost:8000/docs
- **🛠️ pgAdmin**: http://localhost:5054

**Credenciales de Admin:**
- Usuario: `admin@sevp.com`
- Contraseña: `admin123`

**Credenciales de pgAdmin:**
- Email: `admin@webempresa.com`
- Contraseña: `webempresa_admin_2024`

> ⚠️ **Importante**: Cambiar estas credenciales antes de producción

### 🚀 Modo Producción con VS Code

Si usas VS Code, puedes ejecutar todo con **F5**:

1. Abre el proyecto en VS Code
2. Presiona **F5**
3. Selecciona:
   - **🌐 Full Stack - Development** (modo desarrollo con hot-reload)
   - **🏭 Full Stack - Production** (modo producción optimizado)

O usa tasks con `Ctrl + Shift + P` → "Tasks: Run Task" → selecciona el modo deseado.

---

## 🐳 Configuración con Docker

### 🎯 Contenedores Incluidos

El proyecto usa Docker para los servicios de base de datos:

```bash
# Iniciar contenedores
docker-compose -f docker-compose.webempresa.yml up -d

# Ver estado
docker ps --filter "name=webempresa"

# Ver logs
docker-compose -f docker-compose.webempresa.yml logs -f

# Detener contenedores
docker-compose -f docker-compose.webempresa.yml down

# Detener y eliminar datos (⚠️ cuidado, borra todo)
docker-compose -f docker-compose.webempresa.yml down -v
```

**Servicios en Docker:**
- `webempresa_postgres` - PostgreSQL 15 (puerto 5436)
- `webempresa_pgadmin` - pgAdmin 4 (puerto 5054)

**Configuración de PostgreSQL:**
- Base de datos: `webempresa_db`
- Usuario: `webempresa_user`
- Contraseña: `webempresa_pass_2024`
- Puerto: `5436`

**Configuración de pgAdmin:**
- URL: http://localhost:5054
- Email: `admin@webempresa.com`
- Contraseña: `webempresa_admin_2024`

---

## ⚙️ Configuración

### 🔧 Variables de Entorno

#### Backend (.env)
```env
# Entorno
ENVIRONMENT=development
DEVELOPMENT_MODE=true

# Base de datos  
DATABASE_URL=postgresql://webempresa_user:webempresa_pass_2024@localhost:5436/webempresa_db

# Seguridad
SECRET_KEY=webempresa-secret-key-change-in-production-2024
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3001,https://yourdomain.com
```

> **Nota**: El archivo `.env` ya viene preconfigurado. Solo necesitas copiarlo desde `env.example` si no existe.

#### Frontend 
El frontend usa configuración en `next.config.js` con valores por defecto correctos. No necesitas crear archivos `.env` adicionales para desarrollo.

```javascript
// next.config.js (ya configurado)
NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
```

### 🌐 URLs y Puertos

| **Servicio** | **URL** | **Puerto** | **Descripción** |
|--------------|---------|------------|-----------------|
| Frontend | http://localhost:3001 | 3001 | Sitio web público |
| Backend API | http://localhost:8000 | 8000 | API REST |
| PostgreSQL | localhost | 5436 | Base de datos |
| pgAdmin | http://localhost:5054 | 5054 | Admin de BD |

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
python -m uvicorn main:app --reload --port 8000  # Desarrollo (puerto 8000)
python -m uvicorn main:app --host 0.0.0.0 --port 8000  # Producción

# Base de datos
alembic upgrade head     # Aplicar migraciones
alembic revision --autogenerate -m "descripcion"  # Crear migración

# Datos iniciales
python create_admin.py   # Crear usuario administrador
python seed_content.py   # Crear contenido inicial del CMS
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

---

## 🚀 Roadmap del Proyecto

### ✅ **Fase 1: Sistema de Gestión de Contenido** (COMPLETADA)
- Sistema completo de gestión de contenido empresarial
- Panel de administración avanzado
- Editor universal por secciones
- Gestión de planes y precios
- Sistema de usuarios y roles
- Formularios de contacto
- API REST completa

### 🔮 **Fase 2: Control de Clientes CRM** (PRÓXIMAMENTE)
- **Sistema CRM integrado** para gestión de clientes
- **Base de datos de clientes** con información completa
- **Pipeline de ventas** con estados de seguimiento
- **Gestión de leads** desde formularios de contacto
- **Historial de interacciones** con cada cliente
- **Dashboard de métricas** de ventas y conversión
- **Automatización de emails** y notificaciones
- **Reportes avanzados** de CRM y analytics

### 🌐 **Fase 3: Control Centralizado Multi-Proyecto** (FUTURO)
- **Plataforma centralizada** en AWS para múltiples proyectos
- **Gestión multi-tenant** de diferentes empresas/proyectos
- **Dashboard consolidado** con métricas de todos los proyectos
- **APIs unificadas** para integración entre proyectos
- **Monitoreo distribuido** de infraestructura AWS
- **Despliegue automatizado** con CI/CD pipeline
- **Escalabilidad automática** basada en demanda
- **Backup y recuperación** centralizada

</div>