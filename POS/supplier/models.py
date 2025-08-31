from django.db import models

CATEGORY_CHOICES = [
    ('Consumable', 'Consumable'),
    ('Mass Product', 'Mass Product'),
    ('Quantity Product', 'Quantity Product'),
    ('Normal Product', 'Normal Product'),
]

class Supplier(models.Model):
    name = models.CharField(max_length=150, unique=True)
    contact_number = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class SupplierProduct(models.Model):
    
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name="supplier_products")
    product_name = models.CharField(max_length=200)
    category_type = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_purchased = models.PositiveIntegerField()
    date_stocked = models.DateField(auto_now_add=True)

    @property
    def total(self):
        return self.cost_price * self.quantity_purchased

    def __str__(self):
        return f"{self.product_name} from {self.supplier.name}"
