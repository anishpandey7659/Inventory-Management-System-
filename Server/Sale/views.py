from django.shortcuts import render
from .models import Sale
from rest_framework import viewsets
from .serializers import SaleSerializer
from product.permission import CanManageSales

# Create your views here.

class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all() \
        .prefetch_related("items") \
        .order_by("-date")
    serializer_class = SaleSerializer
    permission_classes = [CanManageSales]

