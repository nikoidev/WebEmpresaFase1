#!/usr/bin/env python3
"""
Script para crear planes de ejemplo en la base de datos
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from db.session import SessionLocal
from models.plans import ServicePlan
from decimal import Decimal

def create_sample_plans():
    db = SessionLocal()
    
    try:
        # Verificar si ya existen planes
        existing_plans = db.query(ServicePlan).count()
        if existing_plans > 0:
            print(f"✅ Ya existen {existing_plans} planes en la base de datos")
            return
        
        # Crear planes de ejemplo
        plans_data = [
            {
                "name": "Plan Básico",
                "slug": "plan-basico",
                "description": "Perfecto para pequeñas empresas que están empezando",
                "price_monthly": Decimal("29.99"),
                "price_yearly": Decimal("299.99"),
                "max_users": 5,
                "max_courses": 10,
                "storage_gb": 10,
                "api_requests_limit": 1000,
                "features": [
                    "5 usuarios incluidos",
                    "10GB de almacenamiento",
                    "Soporte por email",
                    "Dashboard básico",
                    "Reportes mensuales"
                ],
                "color_primary": "#3B82F6",
                "color_secondary": "#1E40AF",
                "is_active": True,
                "is_popular": False,
                "display_order": 1
            },
            {
                "name": "Plan Profesional",
                "slug": "plan-profesional",
                "description": "Ideal para empresas en crecimiento con necesidades avanzadas",
                "price_monthly": Decimal("79.99"),
                "price_yearly": Decimal("799.99"),
                "max_users": 25,
                "max_courses": 50,
                "storage_gb": 100,
                "api_requests_limit": 10000,
                "features": [
                    "25 usuarios incluidos",
                    "100GB de almacenamiento",
                    "Soporte prioritario",
                    "Dashboard avanzado",
                    "Reportes semanales",
                    "Integraciones API",
                    "Análisis detallado",
                    "Backup automático"
                ],
                "color_primary": "#10B981",
                "color_secondary": "#047857",
                "is_active": True,
                "is_popular": True,  # Plan más popular
                "display_order": 2
            },
            {
                "name": "Plan Empresarial",
                "slug": "plan-empresarial", 
                "description": "Para grandes organizaciones con necesidades complejas",
                "price_monthly": Decimal("199.99"),
                "price_yearly": Decimal("1999.99"),
                "max_users": 100,
                "max_courses": 200,
                "storage_gb": 500,
                "api_requests_limit": 100000,
                "features": [
                    "100 usuarios incluidos",
                    "500GB de almacenamiento",
                    "Soporte 24/7",
                    "Dashboard empresarial",
                    "Reportes diarios",
                    "API ilimitada",
                    "Análisis predictivo",
                    "Backup en tiempo real",
                    "SSO integrado",
                    "Certificaciones de seguridad"
                ],
                "color_primary": "#8B5CF6",
                "color_secondary": "#6D28D9",
                "is_active": True,
                "is_popular": False,
                "display_order": 3
            }
        ]
        
        # Insertar planes
        for plan_data in plans_data:
            plan = ServicePlan(**plan_data)
            db.add(plan)
            print(f"✅ Creado plan: {plan_data['name']}")
        
        db.commit()
        print(f"🎉 Se crearon {len(plans_data)} planes de ejemplo exitosamente!")
        
        # Mostrar resumen
        all_plans = db.query(ServicePlan).all()
        print("\n📋 PLANES CREADOS:")
        for plan in all_plans:
            status = "🌟 POPULAR" if plan.is_popular else "📦 ESTÁNDAR"
            print(f"  {status} {plan.name} - €{plan.price_monthly}/mes - {plan.max_users} usuarios")
        
    except Exception as e:
        print(f"❌ Error creando planes: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Creando planes de ejemplo...")
    create_sample_plans()
