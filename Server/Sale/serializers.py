from rest_framework import serializers
from .models import Sale, SaleItem
from product.models import Product
from django.db import transaction


class SaleItemSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    class Meta:
        model = SaleItem
        fields = ["product", "quantity", "price"]

class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True)

    class Meta:
        model = Sale
        fields = ["id", "customer_name", "customer_phone", "date", "subtotal", "tax", "total_amount", "items"]
        read_only_fields = ["id", "date"]

    def create(self, validated_data):
        items_data = validated_data.pop("items")

        with transaction.atomic():
            sale = Sale.objects.create(**validated_data)

            for item in items_data:
                product = item["product"]
                quantity = item["quantity"]

                if quantity > product.quantity:
                    raise serializers.ValidationError(  
                        f"Not enough stock for product id {product.id}"
                    )

                SaleItem.objects.create(
                    sale=sale,
                    product=product,
                    quantity=quantity,
                )

                product.quantity -= quantity
                product.save()

        return sale
