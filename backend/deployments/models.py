from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from clients.models import Client


class Deployment(models.Model):
    """Modelo para gestionar despliegues de código"""
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='deployments')
    
    # Información del despliegue
    version = models.CharField(max_length=50, verbose_name="Versión")
    branch = models.CharField(max_length=100, default='main', verbose_name="Rama de Git")
    commit_hash = models.CharField(max_length=40, verbose_name="Hash del Commit")
    
    # Estado del despliegue
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pendiente'),
            ('in_progress', 'En Progreso'),
            ('success', 'Exitoso'),
            ('failed', 'Fallido'),
            ('rolled_back', 'Revertido')
        ],
        default='pending',
        verbose_name="Estado"
    )
    
    # Tipo de despliegue
    deployment_type = models.CharField(
        max_length=20,
        choices=[
            ('backend', 'Backend'),
            ('frontend', 'Frontend'),
            ('database', 'Base de Datos'),
            ('full', 'Completo')
        ],
        verbose_name="Tipo de Despliegue"
    )
    
    # Configuración
    environment = models.CharField(
        max_length=20,
        choices=[
            ('development', 'Desarrollo'),
            ('staging', 'Staging'),
            ('production', 'Producción')
        ],
        default='production',
        verbose_name="Ambiente"
    )
    
    # Usuario que inició el despliegue
    deployed_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True,
        verbose_name="Desplegado por"
    )
    
    # Logs y mensajes
    deployment_log = models.TextField(blank=True, verbose_name="Log de Despliegue")
    error_message = models.TextField(blank=True, verbose_name="Mensaje de Error")
    rollback_reason = models.TextField(blank=True, verbose_name="Razón del Rollback")
    
    # Tiempos
    started_at = models.DateTimeField(null=True, blank=True, verbose_name="Iniciado en")
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name="Completado en")
    duration_seconds = models.IntegerField(null=True, blank=True, verbose_name="Duración (segundos)")
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Despliegue"
        verbose_name_plural = "Despliegues"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.client.name} - v{self.version} ({self.status})"
    
    def calculate_duration(self):
        """Calcula la duración del despliegue"""
        if self.started_at and self.completed_at:
            delta = self.completed_at - self.started_at
            self.duration_seconds = int(delta.total_seconds())
            self.save(update_fields=['duration_seconds'])


class DeploymentStep(models.Model):
    """Pasos individuales de un despliegue"""
    deployment = models.ForeignKey(Deployment, on_delete=models.CASCADE, related_name='steps')
    
    step_name = models.CharField(max_length=100, verbose_name="Nombre del Paso")
    step_order = models.IntegerField(verbose_name="Orden del Paso")
    
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pendiente'),
            ('running', 'Ejecutando'),
            ('success', 'Exitoso'),
            ('failed', 'Fallido'),
            ('skipped', 'Omitido')
        ],
        default='pending',
        verbose_name="Estado"
    )
    
    # Logs del paso
    step_log = models.TextField(blank=True, verbose_name="Log del Paso")
    error_message = models.TextField(blank=True, verbose_name="Mensaje de Error")
    
    # Tiempos
    started_at = models.DateTimeField(null=True, blank=True, verbose_name="Iniciado en")
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name="Completado en")
    duration_seconds = models.IntegerField(null=True, blank=True, verbose_name="Duración (segundos)")

    class Meta:
        verbose_name = "Paso de Despliegue"
        verbose_name_plural = "Pasos de Despliegue"
        ordering = ['step_order']
        unique_together = ['deployment', 'step_order']

    def __str__(self):
        return f"{self.deployment.version} - {self.step_name}"


class RollbackRecord(models.Model):
    """Registro de rollbacks realizados"""
    deployment = models.OneToOneField(
        Deployment, 
        on_delete=models.CASCADE, 
        related_name='rollback_record'
    )
    
    # Versión anterior a la que se hizo rollback
    previous_version = models.CharField(max_length=50, verbose_name="Versión Anterior")
    previous_commit_hash = models.CharField(max_length=40, verbose_name="Hash del Commit Anterior")
    
    # Usuario que realizó el rollback
    rolled_back_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True,
        verbose_name="Rollback realizado por"
    )
    
    rollback_reason = models.TextField(verbose_name="Razón del Rollback")
    rollback_successful = models.BooleanField(default=False, verbose_name="Rollback Exitoso")
    
    # Tiempos
    rollback_started_at = models.DateTimeField(default=timezone.now, verbose_name="Rollback iniciado en")
    rollback_completed_at = models.DateTimeField(null=True, blank=True, verbose_name="Rollback completado en")
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Registro de Rollback"
        verbose_name_plural = "Registros de Rollback"

    def __str__(self):
        return f"Rollback: {self.deployment.version} → {self.previous_version}"


class DeploymentConfiguration(models.Model):
    """Configuración de despliegues por cliente"""
    client = models.OneToOneField(
        Client, 
        on_delete=models.CASCADE, 
        related_name='deployment_config'
    )
    
    # Configuración de Git
    git_repository_url = models.URLField(verbose_name="URL del Repositorio Git")
    default_branch = models.CharField(max_length=100, default='main', verbose_name="Rama por Defecto")
    
    # Configuración de deployment automático
    auto_deploy_enabled = models.BooleanField(default=False, verbose_name="Auto-Despliegue Habilitado")
    auto_deploy_branch = models.CharField(
        max_length=100, 
        default='main', 
        verbose_name="Rama para Auto-Despliegue"
    )
    
    # Notificaciones
    notify_on_success = models.BooleanField(default=True, verbose_name="Notificar en Éxito")
    notify_on_failure = models.BooleanField(default=True, verbose_name="Notificar en Fallo")
    notification_emails = models.JSONField(default=list, verbose_name="Emails de Notificación")
    
    # Configuración de rollback automático
    auto_rollback_on_failure = models.BooleanField(
        default=False, 
        verbose_name="Rollback Automático en Fallo"
    )
    max_failed_deployments = models.IntegerField(
        default=3, 
        verbose_name="Máximo de Despliegues Fallidos"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Configuración de Despliegue"
        verbose_name_plural = "Configuraciones de Despliegue"

    def __str__(self):
        return f"Config Despliegue - {self.client.name}"
