"""
Endpoints de autenticación
"""

from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from db.session import get_db
from core.config import settings
from security.core import authenticate_user, create_access_token
from security.deps import get_current_user
from schemas.auth import LoginRequest, Token
from schemas.user import UserResponse

router = APIRouter()

@router.post("/login/", response_model=Token)
def login(
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
    
    print(f"✅ Login successful for user: {user.username}")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@router.get("/me/", response_model=UserResponse)
def get_current_user_info(
    current_user = Depends(get_current_user)
):
    """Obtener información del usuario actual"""
    return current_user
