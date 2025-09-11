"""
Modelo de planes de servicio
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, DECIMAL, JSON
from sqlalchemy.sql import func
from database import Base

class ServicePlan(Base):
    """Modelo de plan de servicio"""
    __tablename__ = "website_content_serviceplan"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    slug = Column(String(120), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    
    # Precios
    price_monthly = Column(DECIMAL(10, 2), nullable=False)
    price_yearly = Column(DECIMAL(10, 2), nullable=True)
    monthly_savings = Column(DECIMAL(5, 2), default=0)  # Porcentaje de ahorro anual
    
    # Límites del plan
    max_users = Column(Integer, default=1)
    max_courses = Column(Integer, default=10)
    storage_gb = Column(Integer, default=1)
    api_requests_limit = Column(Integer, default=1000)
    
    # Características (lista JSON)
    features = Column(JSON, default=list)
    
    # Configuración visual
    color_primary = Column(String(7), default="#3B82F6")    # Azul por defecto
    color_secondary = Column(String(7), default="#1E40AF")  # Azul oscuro por defecto
    
    # Estado y orden
    is_active = Column(Boolean, default=True, index=True)
    is_popular = Column(Boolean, default=False, index=True)
    display_order = Column(Integer, default=0, index=True)
    
    # Fechas
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<ServicePlan {self.name}>"
    
    @property
    def yearly_savings_amount(self):
        """Calcula el ahorro anual en dinero"""
        if self.price_yearly and self.price_monthly:
            yearly_if_monthly = self.price_monthly * 12
            return float(yearly_if_monthly - self.price_yearly)
        return 0
    
    @property
    def features_list(self):
        """Retorna las características como lista"""
        return self.features if self.features else []
