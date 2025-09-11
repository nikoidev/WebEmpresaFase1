"""
Router de autenticación
"""

from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from database import get_db
from config import settings
from auth.security import authenticate_user, create_access_token, get_current_user
from schemas.auth import LoginRequest, Token, UserResponse
from models.user import User

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
