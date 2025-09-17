# 🤝 Guía de Contribución - Web Empresa

¡Gracias por tu interés en contribuir a **Web Empresa**! Esta guía te ayudará a empezar y mantener la calidad del proyecto.

---

## 🚀 Configuración del Entorno de Desarrollo

### 📋 Prerrequisitos

- **Node.js** 18+ ([Descargar](https://nodejs.org/))
- **Python** 3.11+ ([Descargar](https://www.python.org/))
- **PostgreSQL** 13+ ([Descargar](https://www.postgresql.org/))
- **Git** ([Descargar](https://git-scm.com/))
- **VS Code** (recomendado) con extensiones:
  - Python
  - TypeScript
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets

### 🔧 Primera Configuración

1. **Fork y clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/webempresa.git
cd webempresa
```

2. **Configurar backend según README.md**
```bash
cd BackendFastAPI
python -m venv webempresa_fastapi_env
# Activar entorno virtual y seguir instrucciones del README
```

3. **Configurar frontend según README.md**
```bash
cd frontend
npm install
npm run dev
```

4. **Crear rama de desarrollo**
```bash
git checkout -b feature/mi-feature-increible
```

### 🐳 Configuración con Docker (Opcional)

```bash
# Solo iniciar base de datos
docker-compose -f docker-compose.webempresa.yml up -d

# O el stack completo
docker-compose up --build
```

---

## 🎯 Estándares de Código

### 🎨 Frontend (Next.js + TypeScript)

#### 📝 Naming Conventions

| **Elemento** | **Convención** | **Ejemplo** |
|--------------|----------------|-------------|
| **Componentes** | PascalCase | `UserModal.tsx` |
| **Funciones** | camelCase | `getUserData()` |
| **Variables** | camelCase | `userData` |
| **Constantes** | UPPER_CASE | `API_BASE_URL` |
| **Archivos de páginas** | kebab-case | `user-profile.tsx` |
| **Hooks personalizados** | use + PascalCase | `useUserData()` |
| **Types/Interfaces** | PascalCase | `UserData`, `ApiResponse` |

#### 🏗️ Estructura de Componentes

```typescript
'use client'

import { useState, useEffect } from 'react'
import { ComponentProps } from '@/types'
import { apiClient } from '@/lib/api'

// 1. Definir interfaces
interface Props {
    title: string
    isVisible?: boolean
    onClose?: () => void
}

interface UserData {
    id: number
    name: string
    email: string
}

// 2. Componente principal
export default function MyComponent({ title, isVisible = true, onClose }: Props) {
    // 3. Estados (ordenados por importancia)
    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState<UserData | null>(null)
    const [error, setError] = useState<string | null>(null)
    
    // 4. Efectos
    useEffect(() => {
        if (isVisible) {
            loadUserData()
        }
    }, [isVisible])
    
    // 5. Funciones auxiliares
    const loadUserData = async () => {
        setLoading(true)
        setError(null)
        
        try {
            const response = await apiClient.get('/users/me')
            setUserData(response.data)
        } catch (err) {
            setError('Error al cargar datos del usuario')
            console.error('Error loading user data:', err)
        } finally {
            setLoading(false)
        }
    }
    
    const handleClose = () => {
        onClose?.()
    }
    
    // 6. Renderizado condicional
    if (!isVisible) return null
    
    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        )
    }
    
    // 7. Render principal
    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                <button 
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>
            </div>
            
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            
            {userData && (
                <div>
                    <p>Bienvenido, {userData.name}!</p>
                    <p className="text-gray-600">{userData.email}</p>
                </div>
            )}
        </div>
    )
}
```

#### 💬 Comentarios y Documentación

```typescript
// ✅ CORRECTO - Explicaciones en español para lógica compleja
/**
 * Función para obtener datos del usuario con cache automático
 * Si los datos están en caché y no han expirado, los devuelve directamente
 * @param userId - ID del usuario a obtener
 * @param forceRefresh - Forzar recarga desde servidor
 * @returns Datos del usuario o null si no existe
 */
const fetchUserData = async (userId: string, forceRefresh = false): Promise<UserData | null> => {
    // Verificar caché antes de hacer petición al servidor
    const cachedData = getCachedUserData(userId)
    if (cachedData && !forceRefresh && !isCacheExpired(cachedData.timestamp)) {
        console.log('✅ Datos obtenidos desde caché')
        return cachedData.data
    }
    
    try {
        const response = await apiClient.get(`/users/${userId}`)
        // Guardar en caché para futuras consultas
        setCachedUserData(userId, response.data)
        return response.data
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error)
        return null
    }
}

// ❌ INCORRECTO - Comentarios innecesarios
const userName = 'John' // Asignar nombre del usuario
```

#### 🎨 Clases CSS con Tailwind

```typescript
// ✅ CORRECTO - Organizado y legible
const buttonStyles = {
    base: "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
    primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
}

// Uso
<button className={`${buttonStyles.base} ${buttonStyles.primary}`}>
    Guardar Cambios
</button>

// ✅ CORRECTO - Para clases dinámicas complejas
const cardClassName = `
    bg-white rounded-lg shadow-lg p-6 transition-all duration-300
    ${isActive ? 'border-2 border-primary-500 shadow-xl' : 'border border-gray-200'}
    ${isLoading ? 'opacity-50 pointer-events-none' : 'hover:shadow-xl'}
    ${size === 'large' ? 'p-8' : 'p-4'}
`
```

### ⚡ Backend (FastAPI + Python)

#### 🐍 Naming Conventions

| **Elemento** | **Convención** | **Ejemplo** |
|--------------|----------------|-------------|
| **Funciones** | snake_case | `get_user_data()` |
| **Variables** | snake_case | `user_data` |
| **Constantes** | UPPER_CASE | `MAX_FILE_SIZE` |
| **Clases** | PascalCase | `UserModel`, `ServicePlan` |
| **Archivos** | snake_case | `user_service.py` |
| **Endpoints** | kebab-case | `/api/user-profiles` |

#### 🏗️ Estructura de Routers

```python
"""
Router para gestión de usuarios
Maneja autenticación, CRUD de usuarios y permisos
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from db.session import get_db
from models.user import User
from schemas.user import UserCreate, UserUpdate, UserResponse
from auth.security import get_current_user, require_permission
from services.user_service import UserService

# Configuración del router
router = APIRouter(
    prefix="/api/users",
    tags=["users"],
    responses={404: {"description": "Usuario no encontrado"}}
)

@router.get("/", response_model=List[UserResponse])
async def get_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtener lista de usuarios con paginación
    
    Requiere permisos de administrador para ver todos los usuarios.
    Los usuarios normales solo pueden ver su propio perfil.
    """
    # Verificar permisos
    if not current_user.has_permission("manage_users"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para ver la lista de usuarios"
        )
    
    try:
        users = UserService.get_users(db, skip=skip, limit=limit)
        return users
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crear nuevo usuario (solo administradores)"""
    # Lógica de creación...
    pass
```

#### 📝 Documentación de Modelos

```python
"""
Modelo de Usuario con autenticación y permisos granulares
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum as SQLEnum
from sqlalchemy.sql import func
from db.base import Base
import enum

class UserRole(enum.Enum):
    """
    Roles disponibles en el sistema
    
    - SUPER_ADMIN: Acceso completo al sistema
    - ADMIN: Administrador general, puede gestionar usuarios y contenido
    - EDITOR: Puede editar contenido pero no gestionar usuarios
    - MODERATOR: Solo puede moderar contenido existente
    - VIEWER: Solo lectura, acceso limitado al panel
    """
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    EDITOR = "editor"
    MODERATOR = "moderator"
    VIEWER = "viewer"

class User(Base):
    """
    Modelo de usuario con autenticación JWT y sistema de permisos
    
    Campos principales:
    - username: Identificador único del usuario
    - email: Email para recuperación de contraseña
    - password_hash: Contraseña hasheada con bcrypt
    - role: Rol del usuario que determina permisos
    - is_active: Si el usuario puede acceder al sistema
    
    Métodos principales:
    - has_permission(): Verifica si tiene un permiso específico
    - is_admin: Property que verifica si es administrador
    - full_name: Property que retorna nombre completo
    """
    __tablename__ = "auth_user"
    
    # Campos principales
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(150), unique=True, index=True, nullable=False)
    email = Column(String(254), nullable=False)
    
    # Información personal
    first_name = Column(String(150), default="")
    last_name = Column(String(150), default="")
    
    # Autenticación
    password_hash = Column("password", String(128), nullable=False)
    
    # Permisos y estado
    is_active = Column(Boolean, default=True)
    is_staff = Column(Boolean, default=False)
    is_superuser = Column(Boolean, default=False)
    role = Column(SQLEnum(UserRole), default=UserRole.VIEWER, nullable=False)
    
    # Timestamps
    date_joined = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    def has_permission(self, permission: str, resource: str = "*") -> bool:
        """
        Verifica si el usuario tiene un permiso específico
        
        Args:
            permission: Nombre del permiso (ej: 'edit_content', 'manage_users')
            resource: Recurso específico (opcional, default: cualquiera)
            
        Returns:
            bool: True si tiene el permiso, False en caso contrario
            
        Examples:
            user.has_permission('edit_content')  # Puede editar contenido
            user.has_permission('manage_users', 'admin_panel')  # Puede gestionar usuarios en panel admin
        """
        # Super admins tienen todos los permisos
        if self.is_superuser or self.role == UserRole.SUPER_ADMIN:
            return True
            
        # Mapeo de permisos por rol
        permissions_map = {
            UserRole.ADMIN: ['edit_content', 'manage_users', 'view_analytics'],
            UserRole.EDITOR: ['edit_content', 'view_analytics'],
            UserRole.MODERATOR: ['moderate_content'],
            UserRole.VIEWER: ['view_content']
        }
        
        user_permissions = permissions_map.get(self.role, [])
        return permission in user_permissions
```

---

## 🔄 Flujo de Trabajo con Git

### 🌿 Estrategia de Branches

```
main
├── develop                 # Branch principal de desarrollo
│   ├── feature/user-auth  # Nueva funcionalidad
│   ├── feature/pricing    # Editor de precios
│   └── bugfix/modal-css   # Corrección de bugs
└── hotfix/security-fix    # Correcciones urgentes
```

### 📝 Convenciones de Commits

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/) en español:

```bash
# Tipos de commit
feat:     # Nueva funcionalidad
fix:      # Corrección de bug
docs:     # Cambios en documentación
style:    # Cambios de formato (espacios, punto y coma, etc.)
refactor: # Refactoring de código
test:     # Agregar o modificar tests
chore:    # Cambios en build, dependencias, etc.

# Ejemplos
git commit -m "feat: agregar editor de navegación con CRUD completo"
git commit -m "fix: corregir sincronización de planes en modal de precios"
git commit -m "docs: actualizar README con guía de instalación Docker"
git commit -m "refactor: optimizar componente UniversalSectionEditModal"
git commit -m "style: mejorar espaciado en cards de precios"
git commit -m "test: agregar tests para autenticación JWT"
git commit -m "chore: actualizar dependencias de Next.js a v15"
```

### 🔄 Proceso de Contribución

#### 1. **Preparación**
```bash
# Actualizar tu fork
git checkout main
git pull upstream main
git push origin main

# Crear nueva rama
git checkout -b feature/mi-feature
```

#### 2. **Desarrollo**
```bash
# Hacer cambios y commits frecuentes
git add .
git commit -m "feat: agregar validación de formularios"

# Push regularmente
git push origin feature/mi-feature
```

#### 3. **Antes del Pull Request**
```bash
# Ejecutar tests y linting
cd frontend
npm run lint
npm run type-check

cd ../BackendFastAPI
# Activar entorno virtual
flake8 .
black .
```

#### 4. **Pull Request**

**Template para PR:**
```markdown
## 🎯 Descripción
Breve descripción de los cambios realizados.

## 🔧 Tipo de cambio
- [ ] Bug fix (cambio que corrige un issue)
- [ ] Nueva funcionalidad (cambio que agrega funcionalidad)
- [ ] Breaking change (cambio que puede romper funcionalidad existente)
- [ ] Documentación

## ✅ Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado mi código, especialmente en áreas complejas
- [ ] He actualizado la documentación correspondiente
- [ ] Mis cambios no generan nuevas warnings
- [ ] He agregado tests que prueban mi funcionalidad
- [ ] Tests nuevos y existentes pasan localmente

## 🧪 ¿Cómo probar?
Pasos para probar los cambios:
1. Ir a '...'
2. Hacer clic en '...'
3. Verificar que '...'

## 📸 Screenshots (si aplica)
Agregar capturas de pantalla de los cambios visuales.
```

---

## 🧪 Testing y Quality Assurance

### 🎨 Frontend Testing

```bash
# Instalar dependencias de testing
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Ejecutar tests
npm run test
npm run test:watch  # Modo watch
npm run test:coverage  # Con coverage
```

**Ejemplo de test:**
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { jest } from '@jest/globals'
import UserModal from '@/components/UserModal'

// Mock de API
jest.mock('@/lib/api', () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn()
    }
}))

describe('UserModal', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('debe renderizar correctamente cuando está abierto', () => {
        render(
            <UserModal 
                isOpen={true} 
                title="Test Modal" 
                onClose={() => {}} 
            />
        )

        expect(screen.getByText('Test Modal')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /cerrar/i })).toBeInTheDocument()
    })

    test('debe llamar onClose cuando se hace clic en cerrar', async () => {
        const mockOnClose = jest.fn()

        render(
            <UserModal 
                isOpen={true} 
                title="Test Modal" 
                onClose={mockOnClose} 
            />
        )

        const closeButton = screen.getByRole('button', { name: /cerrar/i })
        fireEvent.click(closeButton)

        await waitFor(() => {
            expect(mockOnClose).toHaveBeenCalledTimes(1)
        })
    })
})
```

### ⚡ Backend Testing

```bash
cd BackendFastAPI

# Instalar dependencias de testing
pip install pytest pytest-asyncio httpx

# Ejecutar tests
pytest
pytest --cov=. --cov-report=html  # Con coverage
pytest -v  # Verbose
pytest tests/test_auth.py  # Test específico
```

**Ejemplo de test:**
```python
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from main import app
from db.base import Base
from db.session import get_db
from models.user import User
from auth.security import create_access_token

# Base de datos de prueba
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture
def db():
    """Crear base de datos de prueba"""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client(db):
    """Cliente de prueba con DB mockeada"""
    def override_get_db():
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()

@pytest.fixture
def test_user(db):
    """Usuario de prueba"""
    user = User(
        username="testuser",
        email="test@example.com",
        password_hash="hashed_password"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def test_get_users_without_permission(client):
    """Test que usuario sin permisos no puede ver lista de usuarios"""
    response = client.get("/api/users/")
    assert response.status_code == 401

def test_get_users_with_permission(client, test_user):
    """Test que admin puede ver lista de usuarios"""
    # Crear token de acceso
    token = create_access_token(data={"sub": test_user.username})
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.get("/api/users/", headers=headers)
    assert response.status_code == 200
    
    data = response.json()
    assert len(data) >= 1
    assert data[0]["username"] == "testuser"

def test_create_user_validation(client):
    """Test validación de datos al crear usuario"""
    response = client.post("/api/users/", json={
        "username": "",  # Username vacío debe fallar
        "email": "invalid-email",  # Email inválido
        "password": "123"  # Contraseña muy corta
    })
    assert response.status_code == 422
```

---

## 🔍 Code Review Guidelines

### ✅ Qué revisar

#### **Funcionalidad**
- [ ] El código hace lo que dice que hace
- [ ] Maneja errores apropiadamente
- [ ] Casos edge están cubiertos
- [ ] Performance es aceptable

#### **Código**
- [ ] Sigue convenciones de naming
- [ ] Funciones son pequeñas y enfocadas
- [ ] No hay código duplicado
- [ ] Comments explican el "por qué", no el "qué"

#### **Seguridad**
- [ ] No hay secretos hardcodeados
- [ ] Validación de inputs
- [ ] Autenticación y autorización apropiadas
- [ ] No hay vulnerabilidades obvias

#### **Tests**
- [ ] Tests cubren funcionalidad nueva
- [ ] Tests son claros y mantenibles
- [ ] Edge cases están probados

### 💬 Cómo dar feedback

```markdown
# ✅ CORRECTO
Esta función se ve bien, pero podría beneficiarse de manejo de errores:

```typescript
// Sugerencia: agregar try-catch
const loadUserData = async () => {
    try {
        const response = await api.get('/users')
        setUsers(response.data)
    } catch (error) {
        console.error('Error loading users:', error)
        setError('No se pudieron cargar los usuarios')
    }
}
```

# ❌ INCORRECTO
Esta función está mal.
```

---

## 🚀 Configuración de VS Code

### ⚙️ Extensiones Recomendadas

Crea `.vscode/extensions.json`:
```json
{
    "recommendations": [
        "ms-python.python",
        "ms-python.black-formatter",
        "ms-python.flake8",
        "bradlc.vscode-tailwindcss",
        "esbenp.prettier-vscode",
        "ms-vscode.vscode-typescript-next",
        "formulahendry.auto-rename-tag",
        "christian-kohler.path-intellisense"
    ]
}
```

### ⚙️ Configuración de Workspace

Crea `.vscode/settings.json`:
```json
{
    "python.defaultInterpreterPath": "./BackendFastAPI/webempresa_fastapi_env/Scripts/python.exe",
    "python.formatting.provider": "black",
    "python.linting.enabled": true,
    "python.linting.flake8Enabled": true,
    "typescript.preferences.importModuleSpecifier": "relative",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "tailwindCSS.includeLanguages": {
        "typescript": "typescript",
        "typescriptreact": "typescriptreact"
    }
}
```

---

## 📚 Recursos y Referencias

### 📖 Documentación Oficial
- [Next.js 15 Docs](https://nextjs.org/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org/)

### 🛠️ Herramientas de Desarrollo
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Postman](https://www.postman.com/) - Para probar APIs
- [TablePlus](https://tableplus.com/) - Cliente PostgreSQL
- [Figma](https://www.figma.com/) - Para diseño UI/UX

### 📝 Guías de Estilo
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

## ❓ FAQ para Contribuidores

<details>
<summary><strong>¿Cómo ejecuto solo el frontend o solo el backend?</strong></summary>

```bash
# Solo frontend
cd frontend && npm run dev

# Solo backend
cd BackendFastAPI && python main.py

# Con VS Code: Presiona F5 para lanzar ambos automáticamente
```
</details>

<details>
<summary><strong>¿Cómo reseteo la base de datos?</strong></summary>

```bash
cd BackendFastAPI
alembic downgrade base  # Eliminar todas las tablas
alembic upgrade head    # Recrear tablas
python create_admin.py  # Crear usuario admin
```
</details>

<details>
<summary><strong>¿Qué hago si mis tests fallan en CI pero pasan localmente?</strong></summary>

1. Verifica que tienes las mismas versiones de dependencias
2. Ejecuta `npm ci` en lugar de `npm install` 
3. Revisa variables de entorno en CI
4. Verifica que la base de datos de test esté limpia
</details>

<details>
<summary><strong>¿Cómo agrego una nueva página pública?</strong></summary>

1. Crear archivo en `frontend/src/app/nueva-pagina/page.tsx`
2. Agregar entrada en `pageTypes` en `admin/content/page.tsx`
3. Agregar modelo/schema en backend si necesita contenido editable
4. Actualizar navegación en `PublicLayout.tsx`
</details>

<details>
<summary><strong>¿Cómo agrego un nuevo endpoint al backend?</strong></summary>

1. Crear modelo en `models/` si es necesario
2. Crear schema en `schemas/`
3. Crear router en `routers/`
4. Registrar router en `main.py`
5. Crear migración con `alembic revision --autogenerate`
</details>

---

## 🎯 Roadmap de Contribuciones

### 🔥 Prioridad Alta
- [ ] **Tests automatizados** - Frontend y backend
- [ ] **Internacionalización (i18n)** - Soporte multi-idioma
- [ ] **Performance optimization** - Lazy loading, caching
- [ ] **Accessibility (a11y)** - WCAG compliance

### 🚀 Prioridad Media  
- [ ] **Dark mode** - Theme switcher
- [ ] **Email templates** - Para notificaciones
- [ ] **File upload** - Para imágenes y documentos
- [ ] **Advanced analytics** - Métricas detalladas

### 💡 Ideas Futuras
- [ ] **Mobile app** - React Native
- [ ] **GraphQL API** - Alternativa a REST
- [ ] **Real-time notifications** - WebSockets
- [ ] **Multi-tenancy** - Soporte para múltiples empresas

---

## 🏆 Reconocimientos

### 🌟 Top Contributors

*¡Tu nombre podría estar aquí!*

### 🎖️ Como ser reconocido

- **🐛 Bug Hunter**: Reporta y corrige bugs críticos
- **✨ Feature Creator**: Agrega funcionalidades importantes
- **📖 Documentation Master**: Mejora significativamente la documentación
- **🧪 Test Champion**: Agrega coverage de testing significativo
- **🎨 UI/UX Expert**: Mejora la experiencia de usuario

---

## 📞 Soporte para Contribuidores

- 💬 **Discord**: [Servidor de la comunidad](https://discord.gg/webempresa)
- 📧 **Email**: dev@webempresa.com
- 📝 **Issues**: Para bugs y feature requests
- 💭 **Discussions**: Para preguntas y ideas

---

## 📝 Licencia

Al contribuir a este proyecto, aceptas que tus contribuciones serán licenciadas bajo la misma [Licencia MIT](LICENSE) del proyecto.

---

<div align="center">

**¡Gracias por hacer que Web Empresa sea mejor! 🙏**

[🏠 Volver al README](README.md) • [🐛 Reportar Bug](https://github.com/tu-usuario/webempresa/issues) • [💡 Sugerir Feature](https://github.com/tu-usuario/webempresa/issues)

</div>