# Guía de Contribución - Web Empresa

## 🚀 Configuración del Entorno de Desarrollo

### Prerrequisitos
- Node.js 18+
- Python 3.11+
- PostgreSQL 13+
- Git

### Primera Configuración
1. Fork y clonar el repositorio
2. Configurar backend según README.md
3. Configurar frontend según README.md
4. Crear rama de desarrollo: `git checkout -b feature/mi-feature`

## 🎯 Estándares de Código

### Frontend (Next.js + TypeScript)

#### Naming Conventions
- **Componentes**: PascalCase (`UserModal.tsx`)
- **Funciones**: camelCase (`getUserData`)
- **Variables**: camelCase (`userData`)
- **Constantes**: UPPER_CASE (`API_BASE_URL`)
- **Archivos**: kebab-case para páginas (`user-profile.tsx`)

#### Estructura de Componentes
```typescript
'use client'

import { useState, useEffect } from 'react'
import { ComponentProps } from '@/types'

interface Props {
    title: string
    isVisible?: boolean
}

export default function MyComponent({ title, isVisible = true }: Props) {
    const [loading, setLoading] = useState(false)
    
    useEffect(() => {
        // Lógica de efecto
    }, [])
    
    return (
        <div className="container">
            {/* JSX */}
        </div>
    )
}
```

#### Comentarios
- **Código**: En inglés para variables/funciones
- **Explicaciones complejas**: En español
- **Documentación**: En español

```typescript
// Función para obtener datos del usuario
const fetchUserData = async (userId: string) => {
    // Validar que el ID sea válido antes de hacer la petición
    if (!userId) return null
    
    try {
        const response = await api.get(`/users/${userId}`)
        return response.data
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error)
        return null
    }
}
```

### Backend (FastAPI + Python)

#### Naming Conventions
- **Funciones**: snake_case (`get_user_data`)
- **Variables**: snake_case (`user_data`)
- **Clases**: PascalCase (`UserModel`)
- **Constantes**: UPPER_CASE (`MAX_FILE_SIZE`)
- **Archivos**: snake_case (`user_models.py`)

#### Estructura de Endpoints
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_db
from schemas.user import UserResponse, UserCreate
from crud.crud_user import user

router = APIRouter()

@router.get("/users/{user_id}/", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Obtener información de un usuario específico
    """
    db_user = user.get(db, id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return db_user
```

#### Comentarios y Docstrings
```python
def calculate_plan_price(base_price: float, billing_period: str) -> float:
    """
    Calcula el precio final de un plan según el período de facturación
    
    Args:
        base_price: Precio base mensual del plan
        billing_period: 'monthly' o 'yearly'
    
    Returns:
        Precio final calculado con descuentos aplicados
    """
    if billing_period == 'yearly':
        # Aplicar descuento del 40% en planes anuales
        return base_price * 12 * 0.6
    return base_price
```

## 🗃️ Base de Datos

### Migraciones
```bash
# Crear migración
alembic revision --autogenerate -m "Descripción clara del cambio"

# Aplicar migración
alembic upgrade head

# Revertir migración
alembic downgrade -1
```

### Modelos SQLAlchemy
```python
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from db.base import Base

class ServicePlan(Base):
    __tablename__ = "website_content_serviceplan"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, comment="Nombre del plan")
    price_monthly = Column(Integer, nullable=False, comment="Precio mensual en centavos")
    price_yearly = Column(Integer, nullable=False, comment="Precio anual en centavos")
    is_active = Column(Boolean, default=True, comment="Plan activo/inactivo")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

## 🔒 Seguridad

### Buenas Prácticas
1. **Nunca** hardcodear credenciales
2. Usar variables de entorno para secretos
3. Validar todas las entradas con Pydantic
4. Implementar rate limiting en producción
5. Hashear contraseñas con bcrypt
6. Usar JWT para autenticación
7. Configurar CORS correctamente

### Validación de Datos
```python
from pydantic import BaseModel, validator, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('La contraseña debe tener al menos 8 caracteres')
        return v
```

## 🧪 Testing

### Frontend
```typescript
// tests/components/UserCard.test.tsx
import { render, screen } from '@testing-library/react'
import UserCard from '@/components/UserCard'

describe('UserCard', () => {
    it('debe mostrar el nombre del usuario', () => {
        render(<UserCard user={{ name: 'Juan Pérez', email: 'juan@test.com' }} />)
        expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
    })
})
```

### Backend
```python
# tests/test_users.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_user():
    """Prueba obtener información de usuario"""
    response = client.get("/api/v1/users/1/")
    assert response.status_code == 200
    assert "username" in response.json()
```

## 📦 Deployment

### Pre-deployment Checklist
- [ ] Ejecutar `npm run build:production` (elimina console.logs)
- [ ] Verificar variables de entorno
- [ ] Ejecutar migraciones de DB
- [ ] Probar endpoints críticos
- [ ] Verificar CORS configuration
- [ ] Actualizar documentación

### Variables de Entorno Requeridas

#### Producción Backend
```env
ENVIRONMENT=production
DEVELOPMENT_MODE=false
SECRET_KEY=clave-super-secreta-256-bits
DATABASE_URL=postgresql://user:pass@host:port/db
ALLOWED_ORIGINS=https://tudominio.com,https://www.tudominio.com
```

#### Producción Frontend
```env
NEXT_PUBLIC_API_URL=https://api.tudominio.com
NODE_ENV=production
```

## 🐛 Debugging

### Console Logs
- **Desarrollo**: Usar console.log libremente
- **Producción**: NUNCA dejar console.logs (usar `npm run clean:console`)

### Error Handling
```typescript
// Frontend
try {
    const result = await api.call()
    return result
} catch (error) {
    console.error('Error específico:', error)
    throw new Error('Mensaje amigable para el usuario')
}
```

```python
# Backend
import logging

logger = logging.getLogger(__name__)

try:
    result = await database_operation()
    return result
except DatabaseError as e:
    logger.error(f"Error de base de datos: {str(e)}")
    raise HTTPException(status_code=500, detail="Error interno del servidor")
```

## 📝 Commit Guidelines

### Formato de Commits
```
tipo(alcance): descripción breve

Descripción más detallada si es necesaria

Ejemplos:
feat(pricing): añadir toggle mensual/anual
fix(auth): corregir validación de tokens JWT
docs(readme): actualizar instrucciones de instalación
style(frontend): mejorar diseño responsive
refactor(api): reorganizar estructura de endpoints
test(users): añadir pruebas unitarias
```

### Tipos de Commit
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bugs
- `docs`: Documentación
- `style`: Cambios de formato/estilo
- `refactor`: Refactorización de código
- `test`: Añadir/modificar tests
- `chore`: Tareas de mantenimiento

## 🔄 Workflow de Desarrollo

1. **Crear Issue**: Describir el problema/feature
2. **Crear Rama**: `git checkout -b feature/nombre-descriptivo`
3. **Desarrollar**: Seguir estándares de código
4. **Testing**: Probar funcionalidad
5. **Commit**: Seguir convención de commits
6. **Push**: `git push origin feature/nombre-descriptivo`
7. **Pull Request**: Descripción clara, screenshots si aplica
8. **Code Review**: Incorporar feedback
9. **Merge**: Una vez aprobado

## 📊 Performance Guidelines

### Frontend
- Usar `React.memo()` para componentes pesados
- Implementar lazy loading para imágenes
- Minimizar re-renders innecesarios
- Usar `useCallback` y `useMemo` cuando sea apropiado

### Backend
- Implementar paginación en listas largas
- Usar índices de base de datos apropiados
- Cachear respuestas frecuentes
- Implementar rate limiting

## 🤝 Code Review Checklist

### Revisor
- [ ] ¿El código sigue las convenciones establecidas?
- [ ] ¿Hay tests apropiados?
- [ ] ¿La documentación está actualizada?
- [ ] ¿No hay console.logs en producción?
- [ ] ¿Las variables de entorno están bien configuradas?
- [ ] ¿No hay hardcoded secrets?
- [ ] ¿El performance es aceptable?

### Autor
- [ ] He probado mi código localmente
- [ ] He añadido tests si es necesario
- [ ] He actualizado la documentación
- [ ] He seguido las convenciones de naming
- [ ] No hay código comentado innecesario
- [ ] Los commits son descriptivos

---

¡Gracias por contribuir al proyecto! 🚀
