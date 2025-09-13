"""
Esquemas para autenticación
"""

from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    """Esquema para solicitud de login"""
    username: str
    password: str

class Token(BaseModel):
    """Esquema para respuesta de token"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int

class TokenData(BaseModel):
    """Datos decodificados del token"""
    username: Optional[str] = None
    user_id: Optional[int] = None
