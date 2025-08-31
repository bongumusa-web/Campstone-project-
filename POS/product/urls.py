from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'product'

router = DefaultRouter()
router.register('products', views.ProductViewSet, basename='product')
router.register('categories', views.CategoryViewSet, basename='category')

urlpatterns = [
    # HTML pages
    path('', views.product, name='product'),
    path('add-product/', views.add_product, name='add_product'),

    # CRUD JSON endpoints for products
    path('add-product-row/', views.add_product_row, name='add_product_row'),
    path('edit-product-row/<int:product_id>/', views.edit_product_row, name='edit_product_row'),
    path('delete-product-row/<int:product_id>/', views.delete_product_row, name='delete_product_row'),

    # DRF API routes
    path('api/', include(router.urls)),
]
