from rest_framework import serializers
from .models import Product,Category,Supplier,StockIn

from django.db import transaction
#Serializer
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model =Category
        fields="__all__"


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model =Supplier
        fields="__all__"


class ProductSerializer(serializers.ModelSerializer):

    category = CategorySerializer(read_only=True)
    supplier = SupplierSerializer(read_only=True)

    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )

    supplier_id = serializers.PrimaryKeyRelatedField(
        queryset=Supplier.objects.all(),
        source='supplier',
        write_only=True
    )

    class Meta:
        model = Product
        fields = "__all__"






class StockInSerializer(serializers.ModelSerializer):
    class Meta:
        model =StockIn
        fields="__all__"

