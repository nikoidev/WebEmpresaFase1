"""
Router de autenticación
"""

from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from database import get_db
from config import settings
from auth.security import authenticate_user, create_access_token, get_current_user, get_current_admin_user, get_password_hash
from schemas.auth import (
    LoginRequest, Token, UserResponse, UserCreate, UserUpdate, 
    UserListResponse, PermissionSchema
)
from models.user import User, UserRole, Permission

router = APIRouter()

@router.post("/login/", response_model=Token)
async def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """Endpoint de login que retorna JWT token"""
    print(f"🔐 Login attempt: {login_data.username}")
    user = authenticate_user(db, login_data.username, login_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Crear token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "user_id": user.id},
        expires_delta=access_token_expires
    )
    
    # Actualizar last_login
    from datetime import datetime
    user.last_login = datetime.utcnow()
    db.commit()
    
    response_data = {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60  # En segundos
    }
    print(f"✅ Login successful for {user.username}, returning token")
    return response_data

@router.post("/logout/")
async def logout():
    """Endpoint de logout (stateless, solo retorna confirmación)"""
    return {"message": "Successfully logged out"}

@router.get("/user/", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """Obtiene información del usuario actual"""
    return current_user

@router.get("/verify/")
async def verify_token(
    current_user: User = Depends(get_current_user)
):
    """Verifica si el token es válido"""
    return {
        "valid": True,
        "user_id": current_user.id,
        "username": current_user.username
    }

# ===== GESTIÓN DE USUARIOS =====

def get_user_permissions_list(user: User) -> List[PermissionSchema]:
    """Obtiene la lista de permisos del usuario basada en su rol"""
    if user.is_superuser or user.role == UserRole.SUPER_ADMIN:
        return [p for p in PermissionSchema]
    
    # Obtener permisos base del rol
    role_permissions = {
        UserRole.ADMIN: [PermissionSchema.VIEW, PermissionSchema.CREATE, PermissionSchema.EDIT, PermissionSchema.DELETE, PermissionSchema.MODERATE],
        UserRole.EDITOR: [PermissionSchema.VIEW, PermissionSchema.CREATE, PermissionSchema.EDIT],
        UserRole.MODERATOR: [PermissionSchema.VIEW, PermissionSchema.MODERATE],
        UserRole.VIEWER: [PermissionSchema.VIEW]
    }
    
    return role_permissions.get(user.role, [])

@router.get("/users/", response_model=UserListResponse)
async def get_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Obtiene lista de usuarios (solo para administradores)"""
    
    # Verificar permisos
    if not current_user.can_manage_users():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para gestionar usuarios"
        )
    
    # Calcular offset
    offset = (page - 1) * per_page
    
    # Obtener usuarios con paginación
    users_query = db.query(User).order_by(User.date_joined.desc())
    total = users_query.count()
    users = users_query.offset(offset).limit(per_page).all()
    
    # Agregar permisos a cada usuario
    users_with_permissions = []
    for user in users:
        user_dict = {
            **UserResponse.model_validate(user).model_dump(),
            "permissions": get_user_permissions_list(user)
        }
        users_with_permissions.append(UserResponse(**user_dict))
    
    return UserListResponse(
        users=users_with_permissions,
        total=total,
        page=page,
        per_page=per_page
    )

@router.post("/users/", response_model=UserResponse)
async def create_user(
    user_data: UserCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Crea un nuevo usuario (solo para administradores)"""
    
    # Verificar permisos
    if not current_user.can_manage_users():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para crear usuarios"
        )
    
    # Verificar si el email ya existe (username será igual al email)
    if db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.email)
    ).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está en uso"
        )
    
    # Crear nuevo usuario (username = email automáticamente)
    user = User(
        username=user_data.email,  # Username es siempre el email
        email=user_data.email,
        first_name=user_data.first_name or "",
        last_name=user_data.last_name or "",
        password_hash=get_password_hash(user_data.password),
        role=UserRole(user_data.role.value),
        is_staff=user_data.is_staff,
        is_superuser=user_data.is_superuser
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Preparar respuesta con permisos
    user_response = UserResponse.model_validate(user)
    user_response.permissions = get_user_permissions_list(user)
    
    return user_response

@router.get("/users/{user_id}/", response_model=UserResponse)
async def get_user(
    user_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Obtiene un usuario específico"""
    
    # Verificar permisos
    if not current_user.can_manage_users() and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para ver este usuario"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    # Preparar respuesta con permisos
    user_response = UserResponse.model_validate(user)
    user_response.permissions = get_user_permissions_list(user)
    
    return user_response

@router.put("/users/{user_id}/", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Actualiza un usuario"""
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    # Verificar permisos
    if not current_user.can_manage_users() and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para modificar este usuario"
        )
    
    # Actualizar campos
    update_data = user_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if field == "role" and value:
            setattr(user, field, UserRole(value.value))
        else:
            setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    
    # Preparar respuesta con permisos
    user_response = UserResponse.model_validate(user)
    user_response.permissions = get_user_permissions_list(user)
    
    return user_response

@router.delete("/users/{user_id}/")
async def delete_user(
    user_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Elimina un usuario"""
    
    # Verificar permisos
    if not current_user.can_manage_users():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para eliminar usuarios"
        )
    
    # No permitir auto-eliminación
    if current_user.id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes eliminarte a ti mismo"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    db.delete(user)
    db.commit()
    
    return {"message": "Usuario eliminado exitosamente"}