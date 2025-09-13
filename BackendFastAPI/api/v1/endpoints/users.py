"""
Endpoints de gestión de usuarios
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from db.session import get_db
from security.deps import get_current_admin_user
from crud import user as crud_user
from schemas.user import UserCreate, UserUpdate, UserResponse, UserListResponse
from models.user import UserRole

router = APIRouter()

@router.get("/", response_model=UserListResponse)
def get_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    search: str = Query("", description="Buscar por username, email o nombre"),
    role: UserRole = Query(None, description="Filtrar por rol"),
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Obtener lista de usuarios (solo admins)"""
    # Por simplicidad, implementamos paginación básica
    # En producción, usarías una implementación más robusta
    users = crud_user.get_multi(db, skip=(page - 1) * per_page, limit=per_page)
    total = len(crud_user.get_multi(db, skip=0, limit=1000))  # Simplificado
    
    return UserListResponse(
        users=users,
        total=total,
        page=page,
        per_page=per_page
    )

@router.post("/", response_model=UserResponse)
def create_user(
    user_data: UserCreate,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Crear nuevo usuario (solo admins)"""
    # Verificar si el email ya existe
    existing_user = crud_user.get_by_email(db, email=user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user = crud_user.create(db, obj_in=user_data)
    return user

@router.put("/{user_id}/", response_model=UserResponse)
def update_user(
    user_id: int,
    user_data: UserUpdate,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Actualizar usuario (solo admins)"""
    user = crud_user.get(db, id=user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user = crud_user.update(db, db_obj=user, obj_in=user_data)
    return user

@router.delete("/{user_id}/")
def delete_user(
    user_id: int,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Eliminar usuario (solo admins)"""
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    user = crud_user.get(db, id=user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    crud_user.remove(db, id=user_id)
    
    return {"message": "User deleted successfully"}

@router.put("/{user_id}/toggle-status/")
def toggle_user_status(
    user_id: int,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Activar/desactivar usuario (solo admins)"""
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot change your own status"
        )
    
    user = crud_user.get(db, id=user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user = crud_user.update(db, db_obj=user, obj_in={"is_active": not user.is_active})
    
    return {"message": f"User {'activated' if user.is_active else 'deactivated'} successfully"}
