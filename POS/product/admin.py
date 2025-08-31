from django.contrib import admin
from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)       # show only category name
    search_fields = ('name',)      # allow search by name


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'supplier_product',   
        'category',
        'selling_price',
        'unit',
    )
    list_filter = ('category',)    
    search_fields = ('supplier_product__product_name',)
    ordering = ('supplier_product__product_name',)
