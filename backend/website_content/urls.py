from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from . import auth_views

# Router para ViewSets (admin)
router = DefaultRouter()
router.register(r'admin/news', views.NewsArticleViewSet, basename='admin-news')
router.register(r'admin/plans', views.ServicePlanViewSet, basename='admin-plans')
router.register(r'admin/testimonials', views.TestimonialViewSet, basename='admin-testimonials')
router.register(r'admin/faqs', views.FAQViewSet, basename='admin-faqs')
router.register(r'admin/company', views.CompanyInfoViewSet, basename='admin-company')
router.register(r'admin/contact-messages', views.ContactMessageViewSet, basename='admin-contact')

urlpatterns = [
    # Incluir rutas del router (admin)
    path('api/', include(router.urls)),
    
    # Rutas de autenticación
    path('api/auth/login/', auth_views.login_view, name='auth-login'),
    path('api/auth/logout/', auth_views.logout_view, name='auth-logout'),
    path('api/auth/user/', auth_views.user_view, name='auth-user'),
    
    # Rutas públicas
    path('api/public/news/', views.public_news_list, name='public-news-list'),
    path('api/public/news/<slug:slug>/', views.public_news_detail, name='public-news-detail'),
    path('api/public/plans/', views.public_service_plans, name='public-plans'),
    path('api/public/testimonials/', views.public_testimonials, name='public-testimonials'),
    path('api/public/faqs/', views.public_faqs, name='public-faqs'),
    path('api/public/faq/<int:faq_id>/helpful/', views.faq_helpful_vote, name='faq-helpful'),
    path('api/public/company/', views.public_company_info, name='public-company'),
    path('api/public/contact/', views.public_contact_submit, name='public-contact'),
    path('api/public/stats/', views.public_stats, name='public-stats'),
    path('api/public/homepage/', views.public_homepage_content, name='public-homepage'),
]
