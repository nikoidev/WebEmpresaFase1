#!/usr/bin/env python
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'webempresa_core.settings')
django.setup()

from django.contrib.auth.models import User
from website_content.models import CompanyInfo, ServicePlan, Testimonial, FAQ

# Set admin password
try:
    admin_user = User.objects.get(username='admin')
    admin_user.set_password('admin123')
    admin_user.save()
    print("✅ Admin password set to 'admin123'")
except User.DoesNotExist:
    print("❌ Admin user not found")

# Create company info
company_info, created = CompanyInfo.objects.get_or_create(
    defaults={
        'company_name': 'SEVP',
        'tagline': 'Sistema Educativo Virtual Profesional',
        'description': 'La plataforma educativa más completa para transformar tu institución educativa. Gestión integral de estudiantes, cursos, calificaciones y más.',
        'email': 'info@sevp.com',
        'phone': '+51 999 999 999',
        'address': 'Lima, Perú',
        'website': 'https://sevp.com',
        'linkedin': 'https://linkedin.com/company/sevp',
        'meta_title': 'SEVP - Sistema Educativo Virtual Profesional',
        'meta_description': 'Plataforma educativa completa para instituciones. Gestión de estudiantes, cursos, calificaciones y más.',
    }
)
if created:
    print("✅ Company info created")
else:
    print("✅ Company info already exists")

# Create service plans
plans_data = [
    {
        'name': 'Básico',
        'description': 'Perfecto para instituciones pequeñas que están comenzando',
        'price_monthly': 29,
        'price_yearly': 290,
        'max_users': 50,
        'max_courses': 10,
        'storage_gb': 5,
        'api_requests_limit': 1000,
        'features': [
            'Gestión de estudiantes',
            'Cursos básicos',
            'Calificaciones',
            'Soporte por email',
            'Reportes básicos'
        ],
        'is_active': True,
        'is_popular': False,
        'display_order': 1,
        'color_primary': '#3B82F6',
        'color_secondary': '#1E40AF',
    },
    {
        'name': 'Premium',
        'description': 'Ideal para instituciones en crecimiento con necesidades avanzadas',
        'price_monthly': 79,
        'price_yearly': 790,
        'max_users': 200,
        'max_courses': 50,
        'storage_gb': 20,
        'api_requests_limit': 5000,
        'features': [
            'Todo del plan Básico',
            'Análisis avanzados',
            'Integraciones API',
            'Soporte prioritario',
            'Copias de seguridad automáticas',
            'Personalización avanzada'
        ],
        'is_active': True,
        'is_popular': True,
        'display_order': 2,
        'color_primary': '#8B5CF6',
        'color_secondary': '#7C3AED',
    },
    {
        'name': 'Enterprise',
        'description': 'Solución completa para grandes instituciones educativas',
        'price_monthly': 199,
        'price_yearly': 1990,
        'max_users': 1000,
        'max_courses': 200,
        'storage_gb': 100,
        'api_requests_limit': 25000,
        'features': [
            'Todo del plan Premium',
            'Usuarios ilimitados',
            'Soporte 24/7',
            'Manager dedicado',
            'Implementación personalizada',
            'SLA garantizado',
            'Integración empresarial'
        ],
        'is_active': True,
        'is_popular': False,
        'display_order': 3,
        'color_primary': '#F59E0B',
        'color_secondary': '#D97706',
    }
]

for plan_data in plans_data:
    plan, created = ServicePlan.objects.get_or_create(
        name=plan_data['name'],
        defaults=plan_data
    )
    if created:
        print(f"✅ Service plan '{plan.name}' created")
    else:
        print(f"✅ Service plan '{plan.name}' already exists")

# Create testimonials
testimonials_data = [
    {
        'client_name': 'María González',
        'client_position': 'Directora Académica',
        'client_company': 'Instituto San Marcos',
        'content': 'SEVP ha transformado completamente nuestra gestión educativa. La plataforma es intuitiva y nuestros profesores se adaptaron muy rápido.',
        'rating': 5,
        'is_active': True,
        'is_featured': True,
        'display_order': 1,
    },
    {
        'client_name': 'Carlos Ruiz',
        'client_position': 'Coordinador TI',
        'client_company': 'Universidad del Norte',
        'content': 'El soporte técnico es excepcional. Siempre están disponibles para resolver cualquier duda y la plataforma es muy estable.',
        'rating': 5,
        'is_active': True,
        'is_featured': True,
        'display_order': 2,
    },
    {
        'client_name': 'Ana Morales',
        'client_position': 'Rectora',
        'client_company': 'Colegio Internacional',
        'content': 'Los reportes y análisis nos han permitido tomar mejores decisiones académicas. Recomiendo SEVP sin dudarlo.',
        'rating': 5,
        'is_active': True,
        'is_featured': True,
        'display_order': 3,
    }
]

for testimonial_data in testimonials_data:
    testimonial, created = Testimonial.objects.get_or_create(
        client_name=testimonial_data['client_name'],
        defaults=testimonial_data
    )
    if created:
        print(f"✅ Testimonial from '{testimonial.client_name}' created")
    else:
        print(f"✅ Testimonial from '{testimonial.client_name}' already exists")

# Create FAQs
faqs_data = [
    {
        'question': '¿Cómo funciona el período de prueba?',
        'answer': 'Ofrecemos 14 días de prueba gratuita completa. No necesitas tarjeta de crédito y puedes explorar todas las funcionalidades.',
        'category': 'general',
        'is_active': True,
        'display_order': 1,
    },
    {
        'question': '¿Puedo migrar mis datos existentes?',
        'answer': 'Sí, nuestro equipo te ayuda gratuitamente a migrar todos tus datos desde tu sistema actual. El proceso es seguro y sin interrupciones.',
        'category': 'technical',
        'is_active': True,
        'display_order': 2,
    },
    {
        'question': '¿Qué métodos de pago aceptan?',
        'answer': 'Aceptamos tarjetas de crédito, débito, transferencias bancarias y pagos anuales con descuento. También ofrecemos facturación institucional.',
        'category': 'billing',
        'is_active': True,
        'display_order': 3,
    },
    {
        'question': '¿La plataforma es segura?',
        'answer': 'Absolutamente. Utilizamos encriptación SSL, copias de seguridad automáticas y cumplimos con estándares internacionales de seguridad de datos.',
        'category': 'technical',
        'is_active': True,
        'display_order': 4,
    }
]

for faq_data in faqs_data:
    faq, created = FAQ.objects.get_or_create(
        question=faq_data['question'],
        defaults=faq_data
    )
    if created:
        print(f"✅ FAQ '{faq.question[:50]}...' created")
    else:
        print(f"✅ FAQ '{faq.question[:50]}...' already exists")

print("\n🎉 Setup completed! You can now:")
print("- Access admin panel: http://localhost:8001/admin/")
print("- Username: admin")
print("- Password: admin123")
print("- Frontend: http://localhost:3001/")
