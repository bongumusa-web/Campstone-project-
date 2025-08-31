from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer
from supplier.models import SupplierProduct
from rest_framework import viewsets


# -------------------------
# DASHBOARD
# -------------------------
def product(request):
    """Display all products and categories on the dashboard."""
    products = Product.objects.select_related('category', 'supplier_product').all()
    categories = Category.objects.all()
    return render(request, 'product/product.html', {
        'products': products,
        'categories': categories
    })


# -------------------------
# ADD PRODUCT PAGE
# -------------------------
def add_product(request):
    """Render page to add a new product from supplier. Categories can be typed manually."""
    categories = Category.objects.all()
    products = Product.objects.select_related('category', 'supplier_product').all()
    supplier_products = SupplierProduct.objects.all()
    return render(request, 'product/add_product.html', {
        'categories': categories,
        'products': products,
        'supplier_products': supplier_products
    })


# -------------------------
# PRODUCT CRUD (AJAX/JSON)
# -------------------------
@csrf_exempt
def add_product_row(request):
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'Invalid request method.'})

    try:
        supplier_product = get_object_or_404(SupplierProduct, id=request.POST.get('supplier_product'))
        category_name = request.POST.get('category_name').strip()

        # Create category if it does not exist
        category, created = Category.objects.get_or_create(name=category_name)

        product = Product.objects.create(
            supplier_product=supplier_product,
            category=category,
            selling_price=request.POST.get('selling_price'),
            unit=request.POST.get('unit'),
            image=request.FILES.get('image')
        )

        return JsonResponse({
            'status': 'success',
            'id': product.id,
            'product_name': product.supplier_product.product_name,
            'category_name': product.category.name,
            'selling_price': product.selling_price,
            'unit': product.unit,
            'stock_price': product.supplier_product.cost_price,
            'stock': product.supplier_product.quantity_purchased,
            'image_url': product.image.url if product.image else ''
        })
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})
    

@csrf_exempt
def edit_product_row(request, product_id):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Invalid request method.'})

    try:
        product = get_object_or_404(Product, id=product_id)

        #  Update category (or keep old one)
        category_name = request.POST.get('category_name', product.category.name).strip()
        category, created = Category.objects.get_or_create(name=category_name)
        product.category = category

        #  Update selling price & unit (or keep old values)
        product.selling_price = request.POST.get('selling_price', product.selling_price)
        product.unit = request.POST.get('unit', product.unit)

        #  If image uploaded, update it
        if 'image' in request.FILES:
            product.image = request.FILES['image']

        #  Save changes
        product.save()

        return JsonResponse({
            'success': True,
            'id': product.id,
            'product_name': product.supplier_product.product_name,
            'category_name': product.category.name,
            'selling_price': product.selling_price,
            'unit': product.unit,
            'stock_price': product.supplier_product.cost_price,
            'stock': product.supplier_product.quantity_purchased,
            'image_url': product.image.url if product.image else ''
        })

    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})




@csrf_exempt
def delete_product_row(request, product_id):
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'Invalid request method.'})
    try:
        get_object_or_404(Product, id=product_id).delete()
        return JsonResponse({'status': 'success'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})


# -------------------------
# DRF VIEWSETS
# -------------------------
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().select_related('supplier_product', 'category')
    serializer_class = ProductSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
