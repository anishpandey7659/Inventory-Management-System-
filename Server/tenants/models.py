from django.db import models
from django.contrib.auth.models import AbstractUser
from django_tenants.models import TenantMixin, DomainMixin
from django.contrib.auth.models import User  


class Client(TenantMixin):
    name = models.CharField(max_length=100)
    email=models.EmailField()
    phone=models.CharField(max_length=15)
    registration_number = models.CharField(max_length=100, unique=True, null=True, blank=True)
    address =models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    created_on = models.DateField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # default true, schema will be automatically created and synced when it is saved
    auto_create_schema = True
    class Meta:
        ordering = ['-created_on']
    def __str__(self):
        return self.name


class Domain(DomainMixin):
    pass