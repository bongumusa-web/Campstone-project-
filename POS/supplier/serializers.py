from rest_framework import serializers
from .models import Supplier, SupplierProduct

class SupplierProductSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)

    class Meta:
        model = SupplierProduct
        fields = [
            'id',
            'supplier',
            'supplier_name',
            'product_name',
            'category_type',
            'cost_price',
            'quantity_purchased',
            'total',
            'date_stocked',
        ]
        read_only_fields = ['total', 'date_stocked']


class SupplierSerializer(serializers.ModelSerializer):
    
    supplier_products = SupplierProductSerializer(many=True, read_only=True)

    class Meta:
        model = Supplier
        fields = ['id', 'name', 'contact_number', 'email', 'address', 'supplier_products']
