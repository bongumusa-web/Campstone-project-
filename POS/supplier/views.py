from rest_framework import viewsets
from .models import Category, Product, Supplier, SupplierStock
from .serializers import CategorySerializer, ProductSerializer, SupplierSerializer, SupplierStockSerializer
from django.shortcuts import render

def supplier_page(request):
    return render(request, 'supplier/supplier.html')

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

class SupplierStockViewSet(viewsets.ModelViewSet):
    queryset = SupplierStock.objects.all()
    serializer_class = SupplierStockSerializer
