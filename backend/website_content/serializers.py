from rest_framework import serializers
from .models import (
    NewsArticle, ServicePlan, Testimonial, 
    FAQ, CompanyInfo, ContactMessage
)


class NewsArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsArticle
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt', 'featured_image',
            'status', 'meta_description', 'meta_keywords', 'published_at',
            'created_at', 'updated_at', 'views_count', 'featured'
        ]
        read_only_fields = ['id', 'slug', 'published_at', 'created_at', 'updated_at', 'views_count']


class NewsArticlePublicSerializer(serializers.ModelSerializer):
    """Serializer para artículos públicos (solo publicados)"""
    class Meta:
        model = NewsArticle
        fields = [
            'id', 'title', 'slug', 'excerpt', 'featured_image',
            'published_at', 'views_count', 'featured'
        ]


class ServicePlanSerializer(serializers.ModelSerializer):
    monthly_savings = serializers.ReadOnlyField()
    
    class Meta:
        model = ServicePlan
        fields = [
            'id', 'name', 'slug', 'description', 'price_monthly', 'price_yearly',
            'max_users', 'max_courses', 'storage_gb', 'api_requests_limit',
            'features', 'is_active', 'is_popular', 'display_order',
            'color_primary', 'color_secondary', 'monthly_savings',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'monthly_savings', 'created_at', 'updated_at']


class ServicePlanPublicSerializer(serializers.ModelSerializer):
    """Serializer para planes públicos (solo activos)"""
    monthly_savings = serializers.ReadOnlyField()
    
    class Meta:
        model = ServicePlan
        fields = [
            'id', 'name', 'description', 'price_monthly', 'price_yearly',
            'max_users', 'max_courses', 'storage_gb', 'api_requests_limit',
            'features', 'is_popular', 'color_primary', 'color_secondary',
            'monthly_savings'
        ]


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = [
            'id', 'client_name', 'client_position', 'client_company',
            'content', 'rating', 'client_photo', 'is_active', 'is_featured',
            'display_order', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TestimonialPublicSerializer(serializers.ModelSerializer):
    """Serializer para testimonios públicos (solo activos)"""
    class Meta:
        model = Testimonial
        fields = [
            'id', 'client_name', 'client_position', 'client_company',
            'content', 'rating', 'client_photo', 'is_featured'
        ]


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = [
            'id', 'question', 'answer', 'category', 'is_active',
            'display_order', 'views_count', 'helpful_votes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'views_count', 'helpful_votes', 'created_at', 'updated_at']


class FAQPublicSerializer(serializers.ModelSerializer):
    """Serializer para FAQs públicos (solo activos)"""
    class Meta:
        model = FAQ
        fields = [
            'id', 'question', 'answer', 'category', 'helpful_votes'
        ]


class CompanyInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyInfo
        fields = [
            'id', 'company_name', 'tagline', 'description', 'email', 'phone', 'address',
            'website', 'linkedin', 'twitter', 'facebook', 'instagram',
            'logo', 'hero_image', 'meta_title', 'meta_description'
        ]
        read_only_fields = ['id']


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            'id', 'name', 'email', 'phone', 'company', 'subject', 'message',
            'status', 'assigned_to', 'admin_response', 'responded_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'assigned_to', 'admin_response', 'responded_at', 'created_at', 'updated_at']


class ContactMessageCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear mensajes de contacto desde el formulario público"""
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'phone', 'company', 'subject', 'message']
