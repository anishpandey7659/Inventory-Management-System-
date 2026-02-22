from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, SupplierViewSet, StockInViewSet, first_view,total_revenue,products_grouped_by_category
from Sale.views import SaleViewSet

router = DefaultRouter()
router.register('products', ProductViewSet)
router.register('categories', CategoryViewSet)
router.register('suppliers', SupplierViewSet)
router.register('stockin', StockInViewSet)
router.register("sales", SaleViewSet, basename="sale")

urlpatterns = [
    # your app urls go here
    path('', include(router.urls)),
    path('hello/', first_view),
    path('revenue/', total_revenue),
    path('products_grouped_by_category/', products_grouped_by_category),
    
]