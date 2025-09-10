from django.db import models
from django.utils import timezone
from clients.models import Client


class AWSInstance(models.Model):
    """Modelo para gestionar instancias EC2 de AWS"""
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='aws_instances')
    
    # Información de la instancia
    instance_id = models.CharField(max_length=50, unique=True, verbose_name="Instance ID")
    instance_type = models.CharField(max_length=50, verbose_name="Tipo de Instancia")
    availability_zone = models.CharField(max_length=50, verbose_name="Zona de Disponibilidad")
    
    # Estado de la instancia
    state = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pendiente'),
            ('running', 'Ejecutando'),
            ('shutting-down', 'Apagándose'),
            ('terminated', 'Terminada'),
            ('stopping', 'Deteniéndose'),
            ('stopped', 'Detenida')
        ],
        verbose_name="Estado"
    )
    
    # Configuración de red
    public_ip = models.GenericIPAddressField(null=True, blank=True, verbose_name="IP Pública")
    private_ip = models.GenericIPAddressField(null=True, blank=True, verbose_name="IP Privada")
    security_groups = models.JSONField(default=list, verbose_name="Grupos de Seguridad")
    
    # Auto Scaling Group
    auto_scaling_group = models.CharField(max_length=100, blank=True, verbose_name="Auto Scaling Group")
    min_size = models.IntegerField(default=1, verbose_name="Tamaño Mínimo")
    max_size = models.IntegerField(default=3, verbose_name="Tamaño Máximo")
    desired_capacity = models.IntegerField(default=1, verbose_name="Capacidad Deseada")
    
    # Fechas
    launch_time = models.DateTimeField(null=True, blank=True, verbose_name="Tiempo de Lanzamiento")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Instancia AWS"
        verbose_name_plural = "Instancias AWS"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.instance_id} ({self.client.name})"


class LoadBalancer(models.Model):
    """Modelo para gestionar Application Load Balancers"""
    client = models.OneToOneField(Client, on_delete=models.CASCADE, related_name='load_balancer')
    
    # Información del Load Balancer
    lb_arn = models.CharField(max_length=255, unique=True, verbose_name="ARN del Load Balancer")
    lb_name = models.CharField(max_length=100, verbose_name="Nombre del Load Balancer")
    dns_name = models.CharField(max_length=255, verbose_name="Nombre DNS")
    
    # Estado y configuración
    state = models.CharField(
        max_length=20,
        choices=[
            ('provisioning', 'Aprovisionando'),
            ('active', 'Activo'),
            ('active_impaired', 'Activo con Problemas'),
            ('failed', 'Fallido')
        ],
        verbose_name="Estado"
    )
    
    scheme = models.CharField(
        max_length=20,
        choices=[
            ('internet-facing', 'Orientado a Internet'),
            ('internal', 'Interno')
        ],
        default='internet-facing',
        verbose_name="Esquema"
    )
    
    # Configuración de red
    vpc_id = models.CharField(max_length=50, verbose_name="VPC ID")
    availability_zones = models.JSONField(default=list, verbose_name="Zonas de Disponibilidad")
    security_groups = models.JSONField(default=list, verbose_name="Grupos de Seguridad")
    
    # Fechas
    created_time = models.DateTimeField(null=True, blank=True, verbose_name="Tiempo de Creación")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Load Balancer"
        verbose_name_plural = "Load Balancers"

    def __str__(self):
        return f"{self.lb_name} ({self.client.name})"


class S3Bucket(models.Model):
    """Modelo para gestionar buckets de S3"""
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='s3_buckets')
    
    bucket_name = models.CharField(max_length=100, unique=True, verbose_name="Nombre del Bucket")
    region = models.CharField(max_length=50, verbose_name="Región")
    
    # Configuración de acceso
    public_read = models.BooleanField(default=False, verbose_name="Lectura Pública")
    versioning_enabled = models.BooleanField(default=False, verbose_name="Versionado Habilitado")
    encryption_enabled = models.BooleanField(default=True, verbose_name="Encriptación Habilitada")
    
    # Estadísticas de uso
    total_size_bytes = models.BigIntegerField(default=0, verbose_name="Tamaño Total (Bytes)")
    object_count = models.IntegerField(default=0, verbose_name="Cantidad de Objetos")
    
    # Fechas
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Bucket S3"
        verbose_name_plural = "Buckets S3"

    def __str__(self):
        return f"{self.bucket_name} ({self.client.name})"


class InfrastructureMetrics(models.Model):
    """Métricas de infraestructura en tiempo real"""
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='infrastructure_metrics')
    timestamp = models.DateTimeField(default=timezone.now)
    
    # Métricas de EC2
    cpu_utilization = models.FloatField(verbose_name="Utilización de CPU (%)")
    memory_utilization = models.FloatField(verbose_name="Utilización de Memoria (%)")
    disk_utilization = models.FloatField(verbose_name="Utilización de Disco (%)")
    network_in = models.FloatField(verbose_name="Red Entrada (MB)")
    network_out = models.FloatField(verbose_name="Red Salida (MB)")
    
    # Métricas de Load Balancer
    request_count = models.IntegerField(default=0, verbose_name="Cantidad de Requests")
    response_time = models.FloatField(default=0, verbose_name="Tiempo de Respuesta (ms)")
    error_rate = models.FloatField(default=0, verbose_name="Tasa de Error (%)")
    
    # Estado general
    health_status = models.CharField(
        max_length=20,
        choices=[
            ('healthy', 'Saludable'),
            ('warning', 'Advertencia'),
            ('critical', 'Crítico')
        ],
        default='healthy',
        verbose_name="Estado de Salud"
    )

    class Meta:
        verbose_name = "Métrica de Infraestructura"
        verbose_name_plural = "Métricas de Infraestructura"
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.client.name} - {self.timestamp}"
