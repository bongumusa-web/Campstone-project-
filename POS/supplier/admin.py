from django.contrib import admin
from .models import Supplier, SupplierProduct

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ['name', 'contact_number', 'email']
    search_fields = ['name']

@admin.register(SupplierProduct)
class SupplierProductAdmin(admin.ModelAdmin):
    list_display = ['supplier', 'product_name', 'category_type', 'cost_price', 'quantity_purchased', 'total']
    list_filter = ['category_type', 'supplier']
    search_fields = ['product_name', 'supplier__name']
