# Create your views here.
from django.http import HttpResponse
from .models import Product,Category,Supplier,StockIn
from Sale.models import Sale
from rest_framework import viewsets
from .serializers import ProductSerializer,CategorySerializer,SupplierSerializer,StockInSerializer
from django_filters.rest_framework import DjangoFilterBackend
from .filters import ProductFilter,StockInFilter
from rest_framework.filters import SearchFilter
from django.db.models import Sum, F,Case, When, Value, CharField
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .permission import *

# Create your views here.
def first_view(request):
    return HttpResponse("Hi, How are you")


class ProductViewSet(viewsets.ModelViewSet):
    queryset=Product.objects.all()
    serializer_class=ProductSerializer
    filter_backends = [DjangoFilterBackend,SearchFilter]
    filterset_class = ProductFilter
    search_fields = ['product_name']
    permission_classes = [CanManageProducts]
    
    def get_queryset(self):
        status = self.request.query_params.get("status")

        qs = Product.objects.annotate(
            stock_status=Case(
                When(quantity=0, then=Value("out_stock")),
                When(quantity__lte=20, then=Value("low_stock")),
                default=Value("in_stock"),
                output_field=CharField(),
            )
        )

        if status:
            qs = qs.filter(stock_status=status)

        return qs


class CategoryViewSet(viewsets.ModelViewSet):
    queryset=Category.objects.all()
    serializer_class=CategorySerializer
    pagination_class = None
    permission_classes = [CanManageCategories] 

class SupplierViewSet(viewsets.ModelViewSet):
    queryset=Supplier.objects.all()
    serializer_class=SupplierSerializer
    pagination_class = None
    permission_classes = [CanManageSuppliers]


class StockInViewSet(viewsets.ModelViewSet):
    queryset=StockIn.objects.all().order_by('-date')
    serializer_class=StockInSerializer
    filter_backends = [DjangoFilterBackend,SearchFilter]
    filterset_class = StockInFilter
    search_fields = ['product__product_name','supplier__name']
    permission_classes = [CanManageStockIn]

@api_view(['GET'])
@permission_classes([CanViewReports]) 
def total_revenue(request):
    revenue = Sale.objects.aggregate(
        total_revenue=Sum('total_amount')
    )['total_revenue'] or 0

    return Response({"total_revenue": revenue})

        

from collections import defaultdict
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([CanViewReports]) 
def products_grouped_by_category(request):
    queryset = Product.objects.select_related('category')

    grouped = defaultdict(list)
    for product in queryset:
        grouped[product.category.name].append(
            ProductSerializer(product).data
        )

    return Response(grouped)


