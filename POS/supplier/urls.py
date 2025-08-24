from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SupplierViewSet, ProductViewSet, CategoryViewSet, SupplierStockViewSet, supplier_page

router = DefaultRouter()
router.register('supplier', SupplierViewSet)
router.register('category', CategoryViewSet)
router.register('product', ProductViewSet)
router.register('stock', SupplierStockViewSet)

app_name = 'supplier'

urlpatterns = [
    path('api/', include(router.urls)),
    path('', supplier_page, name='supplier_page')
]
