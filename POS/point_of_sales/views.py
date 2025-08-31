from rest_framework import viewsets
from .models import Sale
from .serializers import SaleSerializer
from django.shortcuts import render
from product.models import Product

def pos_view(request):
    product = Product.objects.all()
    return render(request, "pos/pos.html", {"products": product})


class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all().order_by('-date')
    serializer_class = SaleSerializer
