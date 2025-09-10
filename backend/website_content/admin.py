from django.contrib import admin
from .models import (
    NewsArticle, ServicePlan, Testimonial, 
    FAQ, CompanyInfo, ContactMessage
)


@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'featured', 'published_at', 'views_count', 'created_at']
    list_filter = ['status', 'featured', 'created_at']
    search_fields = ['title', 'content', 'excerpt']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['status', 'featured']
    readonly_fields = ['views_count', 'published_at']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('title', 'slug', 'excerpt', 'content', 'featured_image', 'author')
        }),
        ('Estado', {
            'fields': ('status', 'featured')
        }),
        ('SEO', {
            'fields': ('meta_description', 'meta_keywords'),
            'classes': ('collapse',)
        }),
        ('Estadísticas', {
            'fields': ('views_count', 'published_at', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ['views_count', 'published_at', 'created_at', 'updated_at']


@admin.register(ServicePlan)
class ServicePlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'price_monthly', 'price_yearly', 'is_active', 'is_popular', 'display_order']
    list_filter = ['is_active', 'is_popular']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['is_active', 'is_popular', 'display_order']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('name', 'slug', 'description')
        }),
        ('Precios', {
            'fields': ('price_monthly', 'price_yearly')
        }),
        ('Límites del Plan', {
            'fields': ('max_users', 'max_courses', 'storage_gb', 'api_requests_limit')
        }),
        ('Características', {
            'fields': ('features',)
        }),
        ('Estado y Presentación', {
            'fields': ('is_active', 'is_popular', 'display_order')
        }),
        ('Diseño', {
            'fields': ('color_primary', 'color_secondary'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['client_name', 'client_company', 'rating', 'is_active', 'is_featured', 'display_order']
    list_filter = ['rating', 'is_active', 'is_featured']
    search_fields = ['client_name', 'client_company', 'content']
    list_editable = ['is_active', 'is_featured', 'display_order']
    
    fieldsets = (
        ('Información del Cliente', {
            'fields': ('client_name', 'client_position', 'client_company', 'client_photo')
        }),
        ('Testimonio', {
            'fields': ('content', 'rating')
        }),
        ('Estado', {
            'fields': ('is_active', 'is_featured', 'display_order')
        }),
    )


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'category', 'is_active', 'display_order', 'helpful_votes', 'views_count']
    list_filter = ['category', 'is_active']
    search_fields = ['question', 'answer']
    list_editable = ['is_active', 'display_order']
    readonly_fields = ['views_count', 'helpful_votes']
    
    fieldsets = (
        ('Pregunta y Respuesta', {
            'fields': ('question', 'answer', 'category')
        }),
        ('Estado', {
            'fields': ('is_active', 'display_order')
        }),
        ('Estadísticas', {
            'fields': ('views_count', 'helpful_votes'),
            'classes': ('collapse',)
        }),
    )


@admin.register(CompanyInfo)
class CompanyInfoAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        # Solo permitir una instancia
        return not CompanyInfo.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # No permitir borrar la única instancia
        return False
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('company_name', 'tagline', 'description')
        }),
        ('Contacto', {
            'fields': ('email', 'phone', 'address')
        }),
        ('Redes Sociales', {
            'fields': ('website', 'linkedin', 'twitter', 'facebook', 'instagram'),
            'classes': ('collapse',)
        }),
        ('Imágenes', {
            'fields': ('logo', 'hero_image')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'status', 'created_at', 'assigned_to']
    list_filter = ['status', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['status', 'assigned_to']
    
    fieldsets = (
        ('Información del Contacto', {
            'fields': ('name', 'email', 'phone', 'company')
        }),
        ('Mensaje', {
            'fields': ('subject', 'message')
        }),
        ('Gestión', {
            'fields': ('status', 'assigned_to', 'admin_response', 'responded_at')
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if change and 'admin_response' in form.changed_data and obj.admin_response:
            obj.responded_at = timezone.now()
            if not obj.assigned_to:
                obj.assigned_to = request.user
            if obj.status == 'new':
                obj.status = 'responded'
        super().save_model(request, obj, form, change)
