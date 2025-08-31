# supplier/views.py
from django.shortcuts import render
from rest_framework import viewsets, filters
from .models import Supplier, SupplierProduct
from .serializers import SupplierSerializer, SupplierProductSerializer
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

# Template views
def supplier_page(request):
    return render(request, 'supplier/supplier.html')

def add_supplier_page(request):
    return render(request, 'supplier/add_supplier.html')

def add_supplier_product_page(request):
    return render(request, 'supplier/add_supplier_product.html')

# API
class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class SupplierProductViewSet(viewsets.ModelViewSet):
    queryset = SupplierProduct.objects.all()
    serializer_class = SupplierProductSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['product_name']
    

class CategoryViewSet(viewsets.ViewSet):
    categories = ['Consumable', 'Mass Product', 'Quantity Product', 'Normal Product']
    def list(self, request):
        return Response([{"name": c} for c in self.categories])

