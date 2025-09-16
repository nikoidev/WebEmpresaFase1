#!/usr/bin/env python3
"""
Script para limpiar datos duplicados de homepage
Elimina la estructura plana y mantiene solo la estructura anidada
"""

import requests
import json

API_BASE_URL = "http://localhost:8002"
API_URL = f"{API_BASE_URL}/api/v1/page-content/admin/homepage/"

def clean_homepage_data():
    print("🔍 Obteniendo datos actuales de homepage...")
    
    # Obtener datos actuales (endpoint público para leer)
    response = requests.get(f"{API_BASE_URL}/api/v1/page-content/public/homepage/")
    if response.status_code != 200:
        print(f"❌ Error obteniendo datos: {response.status_code}")
        return
    
    data = response.json()
    content = data['content_json']
    
    print("📊 Estructura actual:")
    print(f"Hero anidado existe: {'hero' in content}")
    print(f"Hero plano existe: {'hero_title' in content}")
    
    if 'hero' in content:
        print(f"Hero anidado - título: {content['hero'].get('title', '')}")
    if 'hero_title' in content:
        print(f"Hero plano - título: {content.get('hero_title', '')}")
    
    # Limpiar estructura - eliminar campos planos duplicados
    cleaned_content = {k: v for k, v in content.items() 
                      if not k.startswith('hero_') or k in ['hero_title', 'hero_subtitle', 'hero_description']}
    
    # Si existe estructura anidada, eliminar campos planos
    if 'hero' in content and content['hero']:
        # Eliminar solo si la estructura anidada tiene datos
        if content['hero'].get('title') or content['hero'].get('subtitle'):
            print("🧹 Eliminando estructura plana duplicada...")
            for key in list(cleaned_content.keys()):
                if key.startswith('hero_'):
                    del cleaned_content[key]
    
    # Preparar datos para actualización
    update_data = {
        "title": data['title'],
        "content_json": cleaned_content,
        "meta_title": data['meta_title'],
        "meta_description": data['meta_description'],
        "meta_keywords": data['meta_keywords'],
        "is_active": data['is_active']
    }
    
    print("🔄 Estructura limpia:")
    print(json.dumps(cleaned_content, indent=2))
    
    print("✅ Datos listos para actualizar")
    print("Ejecutar manualmente la actualización desde el admin o el frontend")

if __name__ == "__main__":
    clean_homepage_data()
