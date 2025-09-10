from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Client(models.Model):
    """Modelo para gestionar clientes del sistema SEVP"""
    name = models.CharField(max_length=200, verbose_name="Nombre del Cliente")
    email = models.EmailField(unique=True, verbose_name="Email")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Teléfono")
    company = models.CharField(max_length=200, blank=True, verbose_name="Empresa")
    
    # Información de la instancia SEVP
    sevp_instance_url = models.URLField(verbose_name="URL de la Instancia SEVP")
    sevp_database_name = models.CharField(max_length=100, verbose_name="Nombre de la Base de Datos")
    sevp_api_token = models.CharField(max_length=255, verbose_name="Token de API SEVP")
    
    # Estado del cliente
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    subscription_type = models.CharField(
        max_length=50,
        choices=[
            ('basic', 'Básico'),
            ('premium', 'Premium'),
            ('enterprise', 'Empresarial')
        ],
        default='basic',
        verbose_name="Tipo de Suscripción"
    )
    
    # Fechas
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Última Actualización")
    
    # Usuario administrador asignado
    assigned_admin = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        verbose_name="Administrador Asignado"
    )

    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.company})"


class ClientUsageStats(models.Model):
    """Estadísticas de uso del cliente"""
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='usage_stats')
    date = models.DateField(default=timezone.now)
    
    # Métricas de uso
    total_users = models.IntegerField(default=0, verbose_name="Total de Usuarios")
    active_users = models.IntegerField(default=0, verbose_name="Usuarios Activos")
    total_courses = models.IntegerField(default=0, verbose_name="Total de Cursos")
    total_grades = models.IntegerField(default=0, verbose_name="Total de Calificaciones")
    
    # Métricas de rendimiento
    database_size_mb = models.FloatField(default=0, verbose_name="Tamaño de BD (MB)")
    api_requests_count = models.IntegerField(default=0, verbose_name="Requests API")
    response_time_avg = models.FloatField(default=0, verbose_name="Tiempo de Respuesta Promedio (ms)")
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Estadística de Uso"
        verbose_name_plural = "Estadísticas de Uso"
        unique_together = ['client', 'date']
        ordering = ['-date']

    def __str__(self):
        return f"{self.client.name} - {self.date}"
