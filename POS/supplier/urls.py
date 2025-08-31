# supplier/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SupplierViewSet, SupplierProductViewSet, CategoryViewSet, supplier_page, add_supplier_page, add_supplier_product_page

app_name = 'supplier'

router = DefaultRouter()
router.register('suppliers', SupplierViewSet, basename='supplier')
router.register('supplier-products', SupplierProductViewSet, basename='supplierproduct')
router.register('categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('', supplier_page, name='supplier_page'),
    path('add/', add_supplier_page, name='add_supplier'),
    path('add-product/', add_supplier_product_page, name='add_supplier_product'),
    path('api/', include(router.urls)),
]
