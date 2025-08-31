from rest_framework import serializers
from .models import Sale, SaleItem
from product.models import Product


class SaleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.product_name", read_only=True)

    class Meta:
        model = SaleItem
        fields = ['id', 'product', 'product_name', 'quantity', 'selling_price', 'stock_price', 'profit']


class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True)
    cashier_name = serializers.CharField(source="cashier.username", read_only=True)

    class Meta:
        model = Sale
        fields = ['id', 'cashier', 'cashier_name', 'date', 'total', 'payment_method', 'profit', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        sale = Sale.objects.create(**validated_data)

        total = 0
        profit_total = 0

        for item_data in items_data:
            product = Product.objects.get(id=item_data['product'].id if isinstance(item_data['product'], Product) else item_data['product'])
            qty = item_data['quantity']

            # Calculate values
            selling_price = product.selling_price
            stock_price = product.stock_price
            line_total = selling_price * qty
            line_profit = (selling_price - stock_price) * qty

            # Create SaleItem
            SaleItem.objects.create(
                sale=sale,
                product=product,
                quantity=qty,
                selling_price=selling_price,
                stock_price=stock_price,
                profit=line_profit
            )

            # Update totals
            total += line_total
            profit_total += line_profit

            # Reduce stock
            supplier_product = product.supplier_product
            supplier_product.quantity_purchased -= qty
            supplier_product.save()

        sale.total = total
        sale.profit = profit_total
        sale.save()

        return sale
