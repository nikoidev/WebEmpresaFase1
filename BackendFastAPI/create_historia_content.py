#!/usr/bin/env python3

import asyncio
import json
from sqlalchemy import create_engine, text
DATABASE_URL = "sqlite:///./webempresa_test.db"

async def create_historia_content():
    """Crear contenido inicial para la página Historia"""
    
    # Crear conexión a la base de datos
    engine = create_engine(DATABASE_URL)
    
    # Contenido inicial para la página Historia
    historia_content = {
        "hero_title": "Nuestra Historia",
        "hero_subtitle": "Un viaje de innovación y crecimiento",
        "hero_description": "Descubre cómo SEVP ha evolucionado para convertirse en líder en soluciones educativas tecnológicas",
        
        "intro_title": "Cómo Comenzó Todo",
        "intro_description": "SEVP nació de la visión de transformar la educación mediante la tecnología, creando soluciones innovadoras que empoderan a las instituciones educativas para alcanzar su máximo potencial.",
        
        "timeline_title": "Hitos Importantes", 
        "timeline_description": "Los momentos clave en nuestro crecimiento",
        "milestones": [
            {
                "year": "2019",
                "title": "Fundación de SEVP",
                "description": "Inicio de nuestra misión de democratizar la educación tecnológica con las primeras plataformas educativas."
            },
            {
                "year": "2020", 
                "title": "Expansión Digital",
                "description": "Adaptación rápida a la educación remota, desarrollando herramientas específicas para el aprendizaje virtual."
            },
            {
                "year": "2021",
                "title": "Reconocimiento Internacional",
                "description": "Primeros premios por innovación educativa y expansión a mercados internacionales."
            },
            {
                "year": "2022",
                "title": "Alianzas Estratégicas",
                "description": "Colaboraciones con universidades de prestigio y organizaciones educativas globales."
            },
            {
                "year": "2023",
                "title": "Tecnología IA",
                "description": "Integración de inteligencia artificial en nuestras plataformas educativas."
            }
        ],
        
        "impact_title": "Nuestro Impacto",
        "impact_description": "Números que reflejan nuestro crecimiento y alcance global",
        "stats": [
            {
                "number": "500+",
                "label": "Instituciones Educativas"
            },
            {
                "number": "100K+", 
                "label": "Estudiantes Activos"
            },
            {
                "number": "15",
                "label": "Países"
            },
            {
                "number": "99.9%",
                "label": "Uptime"
            }
        ],
        
        "future_title": "Hacia el Futuro", 
        "future_description": "Continuamos innovando para crear el futuro de la educación, con nuevas tecnologías y soluciones que transformarán la manera de enseñar y aprender."
    }
    
    with engine.connect() as conn:
        # Verificar si ya existe contenido para historia
        result = conn.execute(
            text("SELECT id FROM page_content WHERE page_key = :page_key"),
            {"page_key": "history"}
        )
        existing = result.fetchone()
        
        if existing:
            # Actualizar contenido existente
            conn.execute(
                text("""
                    UPDATE page_content 
                    SET content_json = :content_json,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE page_key = :page_key
                """),
                {
                    "content_json": json.dumps(historia_content, ensure_ascii=False),
                    "page_key": "history"
                }
            )
            print("✅ Contenido de Historia actualizado")
        else:
            # Crear nuevo contenido
            conn.execute(
                text("""
                    INSERT INTO page_content (page_key, title, content_json, meta_title, meta_description, is_active)
                    VALUES (:page_key, :title, :content_json, :meta_title, :meta_description, :is_active)
                """),
                {
                    "page_key": "history",
                    "title": "Historia de SEVP",
                    "content_json": json.dumps(historia_content, ensure_ascii=False),
                    "meta_title": "Historia de SEVP - Nuestro Viaje de Innovación",
                    "meta_description": "Conoce la historia de SEVP, desde nuestros inicios hasta convertirnos en líderes en soluciones educativas tecnológicas.",
                    "is_active": True
                }
            )
            print("✅ Contenido de Historia creado")
        
        conn.commit()
    
    print("📋 Contenido inicial de Historia:")
    print(json.dumps(historia_content, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    asyncio.run(create_historia_content())
