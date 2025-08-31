from django.db import models
from supplier.models import SupplierProduct


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name




# Product model
class Product(models.Model):
    image = models.ImageField(upload_to="products/", blank=True, null=True)
    supplier_product = models.ForeignKey(SupplierProduct, on_delete=models.CASCADE, related_name="shop_products", default=1)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=50)
    


    @property
    def product_name(self):
        return self.supplier_product.product_name

    @property
    def stock_price(self):
        return self.supplier_product.cost_price

    @property
    def stock(self):
        return self.supplier_product.quantity_purchased

    @property
    def type(self):
        return self.category.category_type

    def __str__(self):
        return f"{self.product_name} ({self.category.name})"
