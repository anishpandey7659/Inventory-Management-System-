from django.db import models, transaction
from product.models import Product, Supplier
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.db.models import F,Sum
# from django.contrib.auth.models import User

# Create your models here.


from decimal import Decimal, ROUND_HALF_UP
class Sale(models.Model):
    customer_name = models.CharField(max_length=50, blank=True, null=True)
    customer_phone = models.CharField(max_length=15, blank=True, null=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sale #{self.id} - {self.customer_name}"

    def update_totals(self):
        subtotal = self.items.aggregate(
            total=Sum(F('price') * F('quantity'))
        )['total'] or Decimal("0.00")

        tax_rate = Decimal("0.08")
        tax = (subtotal * tax_rate).quantize(Decimal("0.01"))

        Sale.objects.filter(pk=self.pk).update(
            subtotal=subtotal,
            tax=tax,
            total_amount=subtotal + tax
        )

class SaleItem(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey("product.Product", on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def _update_price_total(self):
        self.price = self.product.selling_price
        self.total = (self.price * self.quantity).quantize(Decimal("0.01"))

    def _deduct_stock(self, product, qty):
        if product.quantity < qty:
            raise ValidationError("Not enough stock!")
        product.quantity = F('quantity') - qty
        product.save(update_fields=["quantity"])

    def _add_stock(self, product, qty):
        product.quantity = F('quantity') + qty
        product.save(update_fields=["quantity"])

    def save(self, *args, **kwargs):
        self._update_price_total()

        with transaction.atomic():
            # Lock the product row
            product = Product.objects.select_for_update().get(pk=self.product_id)

            if self.pk:
                # Update case
                old_item = SaleItem.objects.select_for_update().get(pk=self.pk)

                if old_item.sale_id != self.sale_id:
                    raise ValidationError("Cannot move item to another sale")

                # If product changed, restore stock of old product first
                if old_item.product_id != self.product_id:
                    old_product = Product.objects.select_for_update().get(pk=old_item.product_id)
                    self._add_stock(old_product, old_item.quantity)
                else:
                    # Same product, restore old quantity
                    self._add_stock(product, old_item.quantity)

            # Deduct stock for new quantity
            self._deduct_stock(product, self.quantity)

            super().save(*args, **kwargs)

        # Update sale totals after saving
        self.sale.update_totals()

    def delete(self, *args, **kwargs):
        with transaction.atomic():
            product = Product.objects.select_for_update().get(pk=self.product_id)
            self._add_stock(product, self.quantity)
            super().delete(*args, **kwargs)

        self.sale.update_totals()

