from rest_framework import serializers
from .models import Product, Category
from supplier.models import SupplierProduct
from supplier.serializers import SupplierProductSerializer


class ProductSerializer(serializers.ModelSerializer):
    supplier_product = SupplierProductSerializer(read_only=True)
    supplier_product_id = serializers.PrimaryKeyRelatedField(
        queryset=SupplierProduct.objects.all(),
        source='supplier_product',
        write_only=True
    )

    category_name = serializers.CharField(source='category.name', read_only=True)
    stock_price = serializers.DecimalField(
        source='supplier_product.cost_price',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    stock = serializers.IntegerField(
        source='supplier_product.quantity_purchased',
        read_only=True
    )
    product_name = serializers.CharField(
        source='supplier_product.product_name',
        read_only=True
    )

    class Meta:
        model = Product
        fields = [
            'id',
            'supplier_product',
            'supplier_product_id',
            'category',
            'category_name',
            'selling_price',
            'unit',
            'image',
            'stock_price',
            'stock',
            'product_name',
        ]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
