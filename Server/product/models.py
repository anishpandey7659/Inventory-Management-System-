from django.db import models, transaction
from django.db.models import F,Sum
from decimal import Decimal
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)

    def __str__(self):
        return self.name

class Supplier(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    product_name = models.CharField(max_length=100)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=0) 
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    sku = models.CharField(max_length=50, unique=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.product_name} - ({self.sku})"
    
    @property
    def status(self):
        if self.quantity <= 0:
            return "Out of Stock"
        elif self.quantity <= 10:
            return "Low Stock"
        return "In Stock"

    
class StockIn(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="stock_ins")
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE,null=True)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.pk:
            # New StockIn
            with transaction.atomic():
                self.product.quantity += self.quantity
                self.product.save(update_fields=["quantity"])
                super().save(*args, **kwargs)
        else:
            # Updating existing StockIn
            old = StockIn.objects.get(pk=self.pk)
            diff = self.quantity - old.quantity
            with transaction.atomic():
                self.product.quantity += diff
                self.product.save(update_fields=["quantity"])
                super().save(*args, **kwargs)
    def __str__(self):
        return f"{self.product.product_name} - {self.quantity}"

