from rest_framework import serializers
from .models import Category, Product, Supplier, SupplierStock

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'category_name']


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['id', 'name', 'contact', 'address', 'email']


class SupplierStockSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_category = serializers.CharField(source='product.category.name', read_only=True)

    class Meta:
        model = SupplierStock
        fields = ['id', 'supplier', 'product', 'stock_price', 'quantity', 'total',
                  'supplier_name', 'product_name', 'product_category']
        read_only_fields = ['total', 'supplier_name', 'product_name', 'product_category']
