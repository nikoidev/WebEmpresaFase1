from django.shortcuts import render
from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.core.mail import send_mail
from django.conf import settings

from .models import (
    NewsArticle, ServicePlan, Testimonial, 
    FAQ, CompanyInfo, ContactMessage
)
from .serializers import (
    NewsArticleSerializer, NewsArticlePublicSerializer,
    ServicePlanSerializer, ServicePlanPublicSerializer,
    TestimonialSerializer, TestimonialPublicSerializer,
    FAQSerializer, FAQPublicSerializer,
    CompanyInfoSerializer, ContactMessageSerializer,
    ContactMessageCreateSerializer
)


class NewsArticleViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión completa de artículos de noticias (admin)"""
    queryset = NewsArticle.objects.all()
    serializer_class = NewsArticleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'featured']
    ordering = ['-created_at']
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


@api_view(['GET'])
@permission_classes([AllowAny])
def public_news_list(request):
    """Lista pública de noticias publicadas"""
    articles = NewsArticle.objects.filter(
        status='published'
    ).order_by('-published_at')
    
    # Paginación simple
    page = int(request.GET.get('page', 1))
    limit = int(request.GET.get('limit', 10))
    start = (page - 1) * limit
    end = start + limit
    
    total = articles.count()
    articles_page = articles[start:end]
    
    serializer = NewsArticlePublicSerializer(articles_page, many=True)
    
    return Response({
        'articles': serializer.data,
        'total': total,
        'page': page,
        'pages': (total + limit - 1) // limit
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def public_news_detail(request, slug):
    """Detalle público de un artículo"""
    try:
        article = NewsArticle.objects.get(slug=slug, status='published')
        # Incrementar contador de vistas
        article.views_count += 1
        article.save(update_fields=['views_count'])
        
        serializer = NewsArticleSerializer(article)
        return Response(serializer.data)
    except NewsArticle.DoesNotExist:
        return Response({'error': 'Artículo no encontrado'}, status=404)


class ServicePlanViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de planes de servicio (admin)"""
    queryset = ServicePlan.objects.all()
    serializer_class = ServicePlanSerializer
    permission_classes = [IsAuthenticated]
    ordering = ['display_order', 'price_monthly']


@api_view(['GET'])
@permission_classes([AllowAny])
def public_service_plans(request):
    """Lista pública de planes de servicio activos"""
    plans = ServicePlan.objects.filter(
        is_active=True
    ).order_by('display_order', 'price_monthly')
    
    serializer = ServicePlanPublicSerializer(plans, many=True)
    return Response(serializer.data)


class TestimonialViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de testimonios (admin)"""
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [IsAuthenticated]
    ordering = ['display_order', '-created_at']


@api_view(['GET'])
@permission_classes([AllowAny])
def public_testimonials(request):
    """Lista pública de testimonios activos"""
    testimonials = Testimonial.objects.filter(
        is_active=True
    ).order_by('display_order', '-created_at')
    
    # Limitar a testimonios destacados si se solicita
    featured_only = request.GET.get('featured', 'false').lower() == 'true'
    if featured_only:
        testimonials = testimonials.filter(is_featured=True)
    
    serializer = TestimonialPublicSerializer(testimonials, many=True)
    return Response(serializer.data)


class FAQViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de FAQ (admin)"""
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'is_active']
    ordering = ['category', 'display_order']


@api_view(['GET'])
@permission_classes([AllowAny])
def public_faqs(request):
    """Lista pública de FAQs activos"""
    category = request.GET.get('category', None)
    
    faqs = FAQ.objects.filter(is_active=True)
    if category:
        faqs = faqs.filter(category=category)
    
    faqs = faqs.order_by('category', 'display_order')
    
    serializer = FAQPublicSerializer(faqs, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def faq_helpful_vote(request, faq_id):
    """Votar si una FAQ fue útil"""
    try:
        faq = FAQ.objects.get(id=faq_id, is_active=True)
        faq.helpful_votes += 1
        faq.save(update_fields=['helpful_votes'])
        return Response({'message': 'Voto registrado'})
    except FAQ.DoesNotExist:
        return Response({'error': 'FAQ no encontrada'}, status=404)


class CompanyInfoViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de información de la empresa (admin)"""
    queryset = CompanyInfo.objects.all()
    serializer_class = CompanyInfoSerializer
    permission_classes = [IsAuthenticated]


@api_view(['GET'])
@permission_classes([AllowAny])
def public_company_info(request):
    """Información pública de la empresa"""
    try:
        company = CompanyInfo.objects.first()
        if company:
            serializer = CompanyInfoSerializer(company)
            return Response(serializer.data)
        else:
            return Response({'error': 'Información de empresa no configurada'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


class ContactMessageViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de mensajes de contacto (admin)"""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']
    ordering = ['-created_at']
    
    @action(detail=True, methods=['post'])
    def respond(self, request, pk=None):
        """Responder a un mensaje de contacto"""
        message = self.get_object()
        response_text = request.data.get('response', '')
        
        if not response_text:
            return Response({'error': 'Respuesta requerida'}, status=400)
        
        # Actualizar el mensaje
        message.admin_response = response_text
        message.status = 'responded'
        message.assigned_to = request.user
        message.responded_at = timezone.now()
        message.save()
        
        # Enviar email de respuesta
        try:
            send_mail(
                subject=f'Re: {message.subject}',
                message=response_text,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[message.email],
                fail_silently=False,
            )
        except Exception as e:
            # Log error but don't fail the request
            print(f"Error sending email: {e}")
        
        serializer = self.get_serializer(message)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def public_contact_submit(request):
    """Endpoint público para enviar mensajes de contacto"""
    serializer = ContactMessageCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        contact_message = serializer.save()
        
        # Enviar notificación por email a los administradores
        try:
            admin_emails = [admin[1] for admin in settings.ADMINS] if hasattr(settings, 'ADMINS') else []
            if admin_emails:
                send_mail(
                    subject=f'Nuevo mensaje de contacto: {contact_message.subject}',
                    message=f"""
Nuevo mensaje de contacto recibido:

Nombre: {contact_message.name}
Email: {contact_message.email}
Teléfono: {contact_message.phone}
Empresa: {contact_message.company}
Asunto: {contact_message.subject}

Mensaje:
{contact_message.message}

Puedes responder desde el panel de administración.
                    """,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=admin_emails,
                    fail_silently=True,
                )
        except Exception as e:
            print(f"Error sending notification email: {e}")
        
        return Response({
            'message': 'Mensaje enviado correctamente. Te contactaremos pronto.',
            'id': contact_message.id
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Vistas adicionales para estadísticas y contenido agregado

@api_view(['GET'])
@permission_classes([AllowAny])
def public_stats(request):
    """Estadísticas públicas básicas"""
    stats = {
        'total_articles': NewsArticle.objects.filter(status='published').count(),
        'total_testimonials': Testimonial.objects.filter(is_active=True).count(),
        'total_faqs': FAQ.objects.filter(is_active=True).count(),
        'featured_articles': NewsArticle.objects.filter(status='published', featured=True).count(),
    }
    return Response(stats)


@api_view(['GET'])
@permission_classes([AllowAny])
def public_homepage_content(request):
    """Contenido agregado para la página principal"""
    # Artículos destacados
    featured_articles = NewsArticle.objects.filter(
        status='published', featured=True
    ).order_by('-published_at')[:3]
    
    # Testimonios destacados
    featured_testimonials = Testimonial.objects.filter(
        is_active=True, is_featured=True
    ).order_by('display_order')[:3]
    
    # Información de la empresa
    company_info = CompanyInfo.objects.first()
    
    data = {
        'featured_articles': NewsArticlePublicSerializer(featured_articles, many=True).data,
        'featured_testimonials': TestimonialPublicSerializer(featured_testimonials, many=True).data,
        'company_info': CompanyInfoSerializer(company_info).data if company_info else None,
    }
    
    return Response(data)