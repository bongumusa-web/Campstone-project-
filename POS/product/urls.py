from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import product, ProductViewSet

app_name = 'product'

router = DefaultRouter()
router.register('api/product', ProductViewSet, basename='product')

urlpatterns = [
    path('', product, name='product'),
    path('', include(router.urls)),
]
