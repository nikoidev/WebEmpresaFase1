"""
Endpoints de gestión de contenido de páginas
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from db.session import get_db
from security.deps import get_current_admin_user
from crud import page_content as crud_page_content
from schemas.page_content import PageContentCreate, PageContentUpdate, PageContentResponse

router = APIRouter()

# APIs Públicas
@router.get("/public/{page_key}/", response_model=PageContentResponse)
def get_public_page_content(
    page_key: str,
    db: Session = Depends(get_db)
):
    """Obtener contenido público de una página"""
    content = crud_page_content.get_active_by_page_key(db, page_key=page_key)
    
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page content not found"
        )
    
    return content

# APIs de Administración
@router.get("/admin/", response_model=List[PageContentResponse])
def get_all_page_contents(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Obtener todo el contenido de páginas (admin)"""
    contents = crud_page_content.get_multi(db)
    return contents

@router.get("/admin/{page_key}/", response_model=PageContentResponse)
def get_page_content_admin(
    page_key: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Obtener contenido específico de página (admin)"""
    content = crud_page_content.get_by_page_key(db, page_key=page_key)
    
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page content not found"
        )
    
    return content

@router.post("/admin/", response_model=PageContentResponse)
def create_page_content(
    content_data: PageContentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Crear nuevo contenido de página"""
    # Verificar si ya existe
    existing = crud_page_content.get_by_page_key(db, page_key=content_data.page_key)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Page content already exists for this page_key"
        )
    
    content = crud_page_content.create(db, obj_in=content_data)
    return content

@router.put("/admin/{page_key}/", response_model=PageContentResponse)
def update_page_content(
    page_key: str,
    content_data: PageContentUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Actualizar contenido de página"""
    content = crud_page_content.get_by_page_key(db, page_key=page_key)
    
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page content not found"
        )
    
    content = crud_page_content.update(db, db_obj=content, obj_in=content_data)
    return content

@router.post("/admin/seed-missing/")
def seed_missing_pages(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Detecta y crea automáticamente las páginas que faltan en el CMS"""
    
    # Definir todas las páginas que deberían existir
    required_pages = {
        'homepage': {
            'title': 'Bienvenido a Web Empresa',
            'content_json': {
                'hero': {
                    'title': 'Soluciones Empresariales Innovadoras',
                    'subtitle': 'Transformamos tu negocio con tecnología de vanguardia',
                    'cta_text': 'Conocer más',
                    'cta_link': '/nosotros',
                    'background_image': ''
                },
                'features': [
                    {'title': 'Innovación', 'description': 'Soluciones tecnológicas de última generación', 'icon': 'rocket'},
                    {'title': 'Experiencia', 'description': 'Más de 10 años en el mercado', 'icon': 'star'},
                    {'title': 'Soporte 24/7', 'description': 'Atención personalizada cuando lo necesites', 'icon': 'support'}
                ],
                'about_section': {
                    'title': 'Sobre Nosotros',
                    'description': 'Somos una empresa líder en soluciones empresariales, comprometidos con la excelencia y la innovación.'
                }
            },
            'meta_title': 'Web Empresa - Soluciones Empresariales',
            'meta_description': 'Líder en soluciones empresariales innovadoras con más de 10 años de experiencia',
            'meta_keywords': 'empresa, soluciones, innovación, tecnología'
        },
        'about': {
            'title': 'Sobre Nosotros',
            'content_json': {
                'hero': {'title': 'Sobre Nosotros', 'subtitle': 'Conoce nuestra historia y valores'},
                'mission': {
                    'title': 'Nuestra Misión',
                    'content': 'Proporcionar soluciones empresariales innovadoras que impulsen el crecimiento y éxito de nuestros clientes.'
                },
                'vision': {
                    'title': 'Nuestra Visión',
                    'content': 'Ser la empresa líder en transformación digital empresarial en España y Europa.'
                },
                'values': [
                    {'title': 'Innovación', 'description': 'Buscamos constantemente nuevas formas de mejorar'},
                    {'title': 'Integridad', 'description': 'Actuamos con transparencia y honestidad'},
                    {'title': 'Excelencia', 'description': 'Nos comprometemos con la calidad en todo lo que hacemos'},
                    {'title': 'Colaboración', 'description': 'Trabajamos juntos para lograr mejores resultados'}
                ]
            },
            'meta_title': 'Sobre Nosotros - Web Empresa',
            'meta_description': 'Conoce la misión, visión y valores de Web Empresa',
            'meta_keywords': 'sobre nosotros, misión, visión, valores, equipo'
        },
        'history': {
            'title': 'Nuestra Historia',
            'content_json': {
                'hero': {'title': 'Nuestra Historia', 'subtitle': 'Un viaje de innovación y crecimiento'},
                'timeline': [
                    {'year': '2014', 'title': 'Fundación', 'description': 'Web Empresa inicia operaciones con un equipo de 5 personas'},
                    {'year': '2016', 'title': 'Primera Expansión', 'description': 'Abrimos nuestra segunda oficina y llegamos a 50 clientes'},
                    {'year': '2019', 'title': 'Reconocimiento Internacional', 'description': 'Premiados como mejor empresa de soluciones empresariales'},
                    {'year': '2024', 'title': 'Líder del Sector', 'description': 'Más de 500 clientes satisfechos y equipo de 100+ profesionales'}
                ]
            },
            'meta_title': 'Historia - Web Empresa',
            'meta_description': 'Descubre la historia y evolución de Web Empresa desde 2014',
            'meta_keywords': 'historia, trayectoria, evolución, logros'
        },
        'clients': {
            'title': 'Nuestros Clientes',
            'content_json': {
                'hero': {'title': 'Nuestros Clientes', 'subtitle': 'Instituciones que confían en nosotros'},
                'client_types': [
                    {'title': 'Pequeñas Empresas', 'description': 'Soluciones escalables para negocios en crecimiento', 'icon': 'building'},
                    {'title': 'Medianas Empresas', 'description': 'Herramientas profesionales para equipos establecidos', 'icon': 'briefcase'},
                    {'title': 'Grandes Corporaciones', 'description': 'Soluciones enterprise con soporte dedicado', 'icon': 'globe'}
                ],
                'testimonials': [],
                'metrics': []
            },
            'meta_title': 'Clientes - Web Empresa',
            'meta_description': 'Instituciones y empresas que confían en nuestras soluciones',
            'meta_keywords': 'clientes, testimonios, casos de éxito'
        },
        'pricing': {
            'title': 'Planes y Precios',
            'content_json': {
                'hero': {'title': 'Planes y Precios', 'subtitle': 'Elige el plan perfecto para tu empresa'},
                'pricing': [],
                'enterprise': {
                    'title': 'Soluciones Enterprise',
                    'description': 'Planes personalizados para grandes organizaciones'
                },
                'faq': []
            },
            'meta_title': 'Precios - Web Empresa',
            'meta_description': 'Planes y precios de nuestros servicios empresariales',
            'meta_keywords': 'precios, planes, tarifas, servicios'
        },
        'contact': {
            'title': 'Contáctanos',
            'content_json': {
                'hero': {'title': 'Contáctanos', 'subtitle': 'Estamos aquí para ayudarte'},
                'contact_info': {
                    'email': 'info@webempresa.com',
                    'phone': '+34 900 000 000',
                    'address': 'Calle Principal 123, Madrid, España'
                },
                'form': {'show_form': True},
                'faq': []
            },
            'meta_title': 'Contacto - Web Empresa',
            'meta_description': 'Contáctanos para más información sobre nuestros servicios',
            'meta_keywords': 'contacto, email, teléfono, dirección'
        },
        'footer': {
            'title': 'Footer Global',
            'content_json': {
                'company_info': {
                    'name': 'Web Empresa',
                    'description': 'Soluciones empresariales innovadoras',
                    'logo': ''
                },
                'contact': {
                    'email': 'info@webempresa.com',
                    'phone': '+34 900 000 000',
                    'address': 'Calle Principal 123, Madrid, España'
                },
                'social_media': {
                    'facebook': 'https://facebook.com/webempresa',
                    'twitter': 'https://twitter.com/webempresa',
                    'linkedin': 'https://linkedin.com/company/webempresa',
                    'instagram': 'https://instagram.com/webempresa'
                },
                'links': [
                    {'text': 'Política de Privacidad', 'url': '/privacidad'},
                    {'text': 'Términos de Servicio', 'url': '/terminos'},
                    {'text': 'Cookies', 'url': '/cookies'}
                ],
                'copyright': '© 2024 Web Empresa. Todos los derechos reservados.'
            },
            'meta_title': 'Footer',
            'meta_description': 'Footer global del sitio'
        },
        'navigation': {
            'title': 'Menú de Navegación Principal',
            'content_json': {
                'navigation_items': [
                    {'name': 'Inicio', 'href': '/', 'icon': 'Home'},
                    {'name': 'Nosotros', 'href': '/nosotros', 'icon': 'Users'},
                    {'name': 'Historia', 'href': '/historia', 'icon': 'History'},
                    {'name': 'Clientes', 'href': '/clientes', 'icon': 'Globe'},
                    {'name': 'Precios', 'href': '/precios', 'icon': 'DollarSign'},
                    {'name': 'Contacto', 'href': '/contacto', 'icon': 'Mail'}
                ],
                'brand': {
                    'companyName': 'Web Empresa',
                    'logoLetter': 'W'
                }
            },
            'meta_title': 'Navegación',
            'meta_description': 'Menú de navegación principal'
        }
    }
    
    # Obtener páginas existentes
    existing_pages = crud_page_content.get_multi(db)
    existing_keys = {page.page_key for page in existing_pages}
    
    # Detectar páginas faltantes
    missing_keys = set(required_pages.keys()) - existing_keys
    
    if not missing_keys:
        return {
            'status': 'success',
            'message': 'Todas las páginas ya existen',
            'created_pages': [],
            'existing_pages': list(existing_keys)
        }
    
    # Crear páginas faltantes
    created_pages = []
    for page_key in missing_keys:
        page_data = required_pages[page_key]
        content = crud_page_content.create(
            db,
            obj_in=PageContentCreate(
                page_key=page_key,
                title=page_data['title'],
                content_json=page_data['content_json'],
                meta_title=page_data.get('meta_title', ''),
                meta_description=page_data.get('meta_description', ''),
                meta_keywords=page_data.get('meta_keywords', ''),
                is_active=True
            )
        )
        created_pages.append({
            'page_key': page_key,
            'title': content.title
        })
    
    return {
        'status': 'success',
        'message': f'Se crearon {len(created_pages)} páginas faltantes',
        'created_pages': created_pages,
        'missing_count': len(missing_keys),
        'total_pages': len(required_pages)
    }

@router.delete("/admin/{page_key}/")
def delete_page_content(
    page_key: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Eliminar contenido de página"""
    content = crud_page_content.get_by_page_key(db, page_key=page_key)
    
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page content not found"
        )
    
    crud_page_content.remove(db, id=content.id)
    
    return {"message": "Page content deleted successfully"}
