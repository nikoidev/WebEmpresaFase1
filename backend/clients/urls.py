from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Placeholder para futuras rutas de clientes
router = DefaultRouter()

urlpatterns = [
    path('api/clients/', include(router.urls)),
]
