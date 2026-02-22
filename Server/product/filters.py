import django_filters
from .models import Product,Category,Supplier,StockIn
from django_filters import rest_framework as filters

class ProductFilter(filters.FilterSet):
    # 🔹 Exact filters
    product_name = filters.CharFilter(field_name='product_name',lookup_expr='iexact')
    quantity = filters.NumberFilter(field_name='quantity',lookup_expr='exact')
    purchase_price = filters.NumberFilter(field_name='purchase_price',lookup_expr='exact')
    selling_price = filters.NumberFilter(field_name='selling_price',lookup_expr='exact')

    # 🔹 Range filters (min / max)
    min_quantity = filters.NumberFilter(field_name='quantity',lookup_expr='gte')
    max_quantity = filters.NumberFilter(field_name='quantity',lookup_expr='lte')
    min_purchase_price = filters.NumberFilter(field_name='purchase_price',lookup_expr='gte')
    max_purchase_price = filters.NumberFilter(field_name='purchase_price',lookup_expr='lte')
    min_selling_price = filters.NumberFilter(field_name='selling_price',lookup_expr='gte')
    max_selling_price = filters.NumberFilter(field_name='selling_price',lookup_expr='lte')

    # 🔹 ForeignKey filters
    category = filters.BaseInFilter(field_name='category__id', lookup_expr='in')
    supplier = filters.CharFilter(field_name='supplier__name',lookup_expr='icontains')
    sku = filters.CharFilter(field_name='sku',lookup_expr='icontains')

    # 🔹 Ordering
    ordering = filters.OrderingFilter(
        fields=(
            ('quantity', 'quantity'),
            ('purchase_price', 'purchase_price'),
            ('selling_price', 'selling_price'),
        )
    )

    class Meta:
        model = Product
        fields = [
            'product_name','sku','category','supplier',

            # exact
            'quantity','purchase_price','selling_price',

            # ranges
            'min_quantity','max_quantity','min_purchase_price','max_purchase_price','min_selling_price','max_selling_price',
        ]
 
    
class StockInFilter(django_filters.FilterSet):
    product=django_filters.CharFilter(field_name='product__product_name',lookup_expr='icontains')
    supplier = django_filters.CharFilter(field_name='supplier__name',lookup_expr='icontains')
    start_date = django_filters.DateFilter(field_name='date',lookup_expr='gte')
    end_date = django_filters.DateFilter(field_name='date',lookup_expr='lte')

    class Meta:
        model = StockIn
        fields = ['product', 'supplier', 'start_date', 'end_date']

