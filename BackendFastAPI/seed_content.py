"""
Script para crear contenido inicial (seeds) del CMS
"""

from sqlalchemy.orm import Session
from db.session import SessionLocal
from models.page_content import PageContent

def create_initial_content():
    """Crea contenido inicial para las páginas del CMS"""
    db = SessionLocal()
    try:
        # Verificar si ya existe contenido
        existing_content = db.query(PageContent).count()
        
        if existing_content > 0:
            print(f"[INFO] Ya existe contenido en la base de datos ({existing_content} páginas)")
            return
        
        # Contenido para Homepage
        homepage = PageContent(
            page_key="homepage",
            title="Bienvenido a Web Empresa",
            content_json={
                "hero": {
                    "title": "Soluciones Empresariales Innovadoras",
                    "subtitle": "Transformamos tu negocio con tecnología de vanguardia",
                    "cta_text": "Conocer más",
                    "cta_link": "/nosotros",
                    "background_image": ""
                },
                "features": [
                    {
                        "title": "Innovación",
                        "description": "Soluciones tecnológicas de última generación",
                        "icon": "rocket"
                    },
                    {
                        "title": "Experiencia",
                        "description": "Más de 10 años en el mercado",
                        "icon": "star"
                    },
                    {
                        "title": "Soporte 24/7",
                        "description": "Atención personalizada cuando lo necesites",
                        "icon": "support"
                    }
                ],
                "about_section": {
                    "title": "Sobre Nosotros",
                    "description": "Somos una empresa líder en soluciones empresariales, comprometidos con la excelencia y la innovación."
                }
            },
            meta_title="Web Empresa - Soluciones Empresariales",
            meta_description="Líder en soluciones empresariales innovadoras con más de 10 años de experiencia",
            meta_keywords="empresa, soluciones, innovación, tecnología",
            is_active=True
        )
        
        # Contenido para Footer
        footer = PageContent(
            page_key="footer",
            title="Footer Global",
            content_json={
                "company_info": {
                    "name": "Web Empresa",
                    "description": "Soluciones empresariales innovadoras",
                    "logo": ""
                },
                "contact": {
                    "email": "info@webempresa.com",
                    "phone": "+34 900 000 000",
                    "address": "Calle Principal 123, Madrid, España"
                },
                "social_media": {
                    "facebook": "https://facebook.com/webempresa",
                    "twitter": "https://twitter.com/webempresa",
                    "linkedin": "https://linkedin.com/company/webempresa",
                    "instagram": "https://instagram.com/webempresa"
                },
                "links": [
                    {"text": "Política de Privacidad", "url": "/privacidad"},
                    {"text": "Términos de Servicio", "url": "/terminos"},
                    {"text": "Cookies", "url": "/cookies"}
                ],
                "copyright": f"© 2024 Web Empresa. Todos los derechos reservados."
            },
            meta_title="Footer",
            meta_description="Footer global del sitio",
            is_active=True
        )
        
        # Contenido para Navigation
        navigation = PageContent(
            page_key="navigation",
            title="Menú de Navegación Principal",
            content_json={
                "navigation_items": [
                    {"name": "Inicio", "href": "/", "icon": "Home"},
                    {"name": "Nosotros", "href": "/nosotros", "icon": "Users"},
                    {"name": "Historia", "href": "/historia", "icon": "History"},
                    {"name": "Clientes", "href": "/clientes", "icon": "Globe"},
                    {"name": "Precios", "href": "/precios", "icon": "DollarSign"},
                    {"name": "Contacto", "href": "/contacto", "icon": "Mail"}
                ],
                "brand": {
                    "companyName": "Web Empresa",
                    "logoLetter": "W"
                }
            },
            meta_title="Navegación",
            meta_description="Menú de navegación principal",
            is_active=True
        )
        
        # Contenido para Nosotros
        nosotros = PageContent(
            page_key="nosotros",
            title="Sobre Nosotros",
            content_json={
                "hero": {
                    "title": "Sobre Nosotros",
                    "subtitle": "Conoce nuestra historia y valores"
                },
                "mission": {
                    "title": "Nuestra Misión",
                    "content": "Proporcionar soluciones empresariales innovadoras que impulsen el crecimiento y éxito de nuestros clientes."
                },
                "vision": {
                    "title": "Nuestra Visión",
                    "content": "Ser la empresa líder en transformación digital empresarial en España y Europa."
                },
                "values": [
                    {"title": "Innovación", "description": "Buscamos constantemente nuevas formas de mejorar"},
                    {"title": "Integridad", "description": "Actuamos con transparencia y honestidad"},
                    {"title": "Excelencia", "description": "Nos comprometemos con la calidad en todo lo que hacemos"},
                    {"title": "Colaboración", "description": "Trabajamos juntos para lograr mejores resultados"}
                ],
                "team_section": {
                    "title": "Nuestro Equipo",
                    "description": "Profesionales altamente capacitados dedicados a tu éxito"
                }
            },
            meta_title="Sobre Nosotros - Web Empresa",
            meta_description="Conoce la misión, visión y valores de Web Empresa",
            meta_keywords="sobre nosotros, misión, visión, valores, equipo",
            is_active=True
        )
        
        # Contenido para Historia
        historia = PageContent(
            page_key="historia",
            title="Nuestra Historia",
            content_json={
                "hero": {
                    "title": "Nuestra Historia",
                    "subtitle": "Un viaje de innovación y crecimiento"
                },
                "timeline": [
                    {
                        "year": "2014",
                        "title": "Fundación",
                        "description": "Web Empresa inicia operaciones con un equipo de 5 personas"
                    },
                    {
                        "year": "2016",
                        "title": "Primera Expansión",
                        "description": "Abrimos nuestra segunda oficina y llegamos a 50 clientes"
                    },
                    {
                        "year": "2019",
                        "title": "Reconocimiento Internacional",
                        "description": "Premiados como mejor empresa de soluciones empresariales"
                    },
                    {
                        "year": "2024",
                        "title": "Líder del Sector",
                        "description": "Más de 500 clientes satisfechos y equipo de 100+ profesionales"
                    }
                ],
                "achievements": {
                    "title": "Logros Destacados",
                    "items": [
                        "Más de 500 clientes satisfechos",
                        "Presencia en 10 países",
                        "Equipo de 100+ profesionales",
                        "Premios y reconocimientos nacionales e internacionales"
                    ]
                }
            },
            meta_title="Historia - Web Empresa",
            meta_description="Descubre la historia y evolución de Web Empresa desde 2014",
            meta_keywords="historia, trayectoria, evolución, logros",
            is_active=True
        )
        
        # Agregar todo a la base de datos
        db.add_all([homepage, footer, navigation, nosotros, historia])
        db.commit()
        
        print("[OK] Contenido inicial creado exitosamente:")
        print("   - Homepage")
        print("   - Footer")
        print("   - Navigation")
        print("   - Nosotros")
        print("   - Historia")
        print("\n[INFO] Ahora puedes acceder al frontend y ver el contenido")
        
    except Exception as e:
        print(f"[ERROR] Error creando contenido inicial: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_initial_content()

