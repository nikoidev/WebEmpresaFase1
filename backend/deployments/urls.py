from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Placeholder para futuras rutas de deployments
router = DefaultRouter()

urlpatterns = [
    path('api/deployments/', include(router.urls)),
]
