from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.utils.text import slugify


class NewsArticle(models.Model):
    """Modelo para gestionar noticias de la web empresa"""
    title = models.CharField(max_length=200, verbose_name="Título")
    slug = models.SlugField(max_length=220, unique=True, verbose_name="URL Amigable")
    content = models.TextField(verbose_name="Contenido")
    excerpt = models.TextField(max_length=300, verbose_name="Resumen")
    
    # Imagen destacada
    featured_image = models.ImageField(
        upload_to='news/images/', 
        null=True, 
        blank=True, 
        verbose_name="Imagen Destacada"
    )
    
    # Metadatos
    author = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        verbose_name="Autor"
    )
    
    # Estado de publicación
    status = models.CharField(
        max_length=20,
        choices=[
            ('draft', 'Borrador'),
            ('published', 'Publicado'),
            ('archived', 'Archivado')
        ],
        default='draft',
        verbose_name="Estado"
    )
    
    # SEO
    meta_description = models.CharField(
        max_length=160, 
        blank=True, 
        verbose_name="Meta Descripción"
    )
    meta_keywords = models.CharField(
        max_length=255, 
        blank=True, 
        verbose_name="Palabras Clave"
    )
    
    # Fechas
    published_at = models.DateTimeField(null=True, blank=True, verbose_name="Fecha de Publicación")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Última Actualización")
    
    # Estadísticas
    views_count = models.IntegerField(default=0, verbose_name="Número de Vistas")
    featured = models.BooleanField(default=False, verbose_name="Destacado")

    class Meta:
        verbose_name = "Artículo de Noticia"
        verbose_name_plural = "Artículos de Noticias"
        ordering = ['-published_at', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if self.status == 'published' and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ServicePlan(models.Model):
    """Modelo para gestionar planes de servicio y precios"""
    name = models.CharField(max_length=100, verbose_name="Nombre del Plan")
    slug = models.SlugField(max_length=110, unique=True, verbose_name="URL Amigable")
    description = models.TextField(verbose_name="Descripción")
    
    # Precios
    price_monthly = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        verbose_name="Precio Mensual"
    )
    price_yearly = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True, 
        verbose_name="Precio Anual"
    )
    
    # Configuración del plan
    max_users = models.IntegerField(verbose_name="Máximo de Usuarios")
    max_courses = models.IntegerField(verbose_name="Máximo de Cursos")
    storage_gb = models.IntegerField(verbose_name="Almacenamiento (GB)")
    api_requests_limit = models.IntegerField(verbose_name="Límite de Requests API")
    
    # Características incluidas
    features = models.JSONField(default=list, verbose_name="Características Incluidas")
    
    # Estado y orden
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    is_popular = models.BooleanField(default=False, verbose_name="Plan Popular")
    display_order = models.IntegerField(default=0, verbose_name="Orden de Visualización")
    
    # Colores y diseño
    color_primary = models.CharField(
        max_length=7, 
        default='#3B82F6', 
        verbose_name="Color Primario"
    )
    color_secondary = models.CharField(
        max_length=7, 
        default='#1E40AF', 
        verbose_name="Color Secundario"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Plan de Servicio"
        verbose_name_plural = "Planes de Servicio"
        ordering = ['display_order', 'price_monthly']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - ${self.price_monthly}/mes"

    @property
    def monthly_savings(self):
        """Calcula el ahorro mensual si se paga anualmente"""
        if self.price_yearly:
            monthly_equivalent = self.price_yearly / 12
            return self.price_monthly - monthly_equivalent
        return 0


class Testimonial(models.Model):
    """Modelo para gestionar testimonios de clientes"""
    client_name = models.CharField(max_length=100, verbose_name="Nombre del Cliente")
    client_position = models.CharField(max_length=100, verbose_name="Cargo")
    client_company = models.CharField(max_length=100, verbose_name="Empresa")
    
    # Contenido del testimonio
    content = models.TextField(verbose_name="Testimonio")
    rating = models.IntegerField(
        choices=[(i, i) for i in range(1, 6)],
        default=5,
        verbose_name="Calificación (1-5)"
    )
    
    # Imagen del cliente
    client_photo = models.ImageField(
        upload_to='testimonials/photos/', 
        null=True, 
        blank=True, 
        verbose_name="Foto del Cliente"
    )
    
    # Estado
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    is_featured = models.BooleanField(default=False, verbose_name="Destacado")
    display_order = models.IntegerField(default=0, verbose_name="Orden de Visualización")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Testimonio"
        verbose_name_plural = "Testimonios"
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return f"{self.client_name} - {self.client_company}"


class FAQ(models.Model):
    """Modelo para gestionar preguntas frecuentes"""
    question = models.CharField(max_length=255, verbose_name="Pregunta")
    answer = models.TextField(verbose_name="Respuesta")
    
    # Categorización
    category = models.CharField(
        max_length=50,
        choices=[
            ('general', 'General'),
            ('pricing', 'Precios'),
            ('technical', 'Técnico'),
            ('support', 'Soporte'),
            ('billing', 'Facturación')
        ],
        default='general',
        verbose_name="Categoría"
    )
    
    # Estado y orden
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    display_order = models.IntegerField(default=0, verbose_name="Orden de Visualización")
    
    # Estadísticas
    views_count = models.IntegerField(default=0, verbose_name="Número de Vistas")
    helpful_votes = models.IntegerField(default=0, verbose_name="Votos Útiles")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Pregunta Frecuente"
        verbose_name_plural = "Preguntas Frecuentes"
        ordering = ['category', 'display_order']

    def __str__(self):
        return self.question


class CompanyInfo(models.Model):
    """Modelo para gestionar información de la empresa"""
    company_name = models.CharField(max_length=200, verbose_name="Nombre de la Empresa")
    tagline = models.CharField(max_length=255, verbose_name="Eslogan")
    description = models.TextField(verbose_name="Descripción de la Empresa")
    
    # Información de contacto
    email = models.EmailField(verbose_name="Email de Contacto")
    phone = models.CharField(max_length=20, verbose_name="Teléfono")
    address = models.TextField(verbose_name="Dirección")
    
    # Redes sociales
    website = models.URLField(blank=True, verbose_name="Sitio Web")
    linkedin = models.URLField(blank=True, verbose_name="LinkedIn")
    twitter = models.URLField(blank=True, verbose_name="Twitter")
    facebook = models.URLField(blank=True, verbose_name="Facebook")
    instagram = models.URLField(blank=True, verbose_name="Instagram")
    
    # Imágenes
    logo = models.ImageField(
        upload_to='company/logos/', 
        null=True, 
        blank=True, 
        verbose_name="Logo"
    )
    hero_image = models.ImageField(
        upload_to='company/hero/', 
        null=True, 
        blank=True, 
        verbose_name="Imagen Principal"
    )
    
    # SEO y metadatos
    meta_title = models.CharField(max_length=60, verbose_name="Título Meta")
    meta_description = models.CharField(max_length=160, verbose_name="Descripción Meta")
    
    # Solo debe haber una instancia
    class Meta:
        verbose_name = "Información de la Empresa"
        verbose_name_plural = "Información de la Empresa"

    def save(self, *args, **kwargs):
        # Asegurar que solo existe una instancia
        if not self.pk and CompanyInfo.objects.exists():
            raise Exception("Solo puede existir una instancia de CompanyInfo")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.company_name


class ContactMessage(models.Model):
    """Modelo para gestionar mensajes de contacto"""
    name = models.CharField(max_length=100, verbose_name="Nombre")
    email = models.EmailField(verbose_name="Email")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Teléfono")
    company = models.CharField(max_length=100, blank=True, verbose_name="Empresa")
    
    subject = models.CharField(max_length=200, verbose_name="Asunto")
    message = models.TextField(verbose_name="Mensaje")
    
    # Estado de respuesta
    status = models.CharField(
        max_length=20,
        choices=[
            ('new', 'Nuevo'),
            ('in_progress', 'En Progreso'),
            ('responded', 'Respondido'),
            ('closed', 'Cerrado')
        ],
        default='new',
        verbose_name="Estado"
    )
    
    # Usuario asignado para respuesta
    assigned_to = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        verbose_name="Asignado a"
    )
    
    # Respuesta del admin
    admin_response = models.TextField(blank=True, verbose_name="Respuesta del Admin")
    responded_at = models.DateTimeField(null=True, blank=True, verbose_name="Respondido en")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Última Actualización")

    class Meta:
        verbose_name = "Mensaje de Contacto"
        verbose_name_plural = "Mensajes de Contacto"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.subject}"
