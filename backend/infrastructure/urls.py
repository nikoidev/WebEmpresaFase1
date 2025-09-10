from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Placeholder para futuras rutas de infraestructura
router = DefaultRouter()

urlpatterns = [
    path('api/infrastructure/', include(router.urls)),
]
