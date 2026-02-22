from django.contrib import admin
from django_tenants.admin import TenantAdminMixin
from django_tenants.utils import get_public_schema_name
from django.db import connection
from .models import Client, Domain

# Custom admin site for public schema only
class PublicSchemaAdmin(admin.ModelAdmin):
    """Base admin class that only shows in public schema"""
    
    def has_module_permission(self, request):
        # Only show this module in public schema
        return connection.schema_name == get_public_schema_name()
    
    def has_add_permission(self, request):
        return connection.schema_name == get_public_schema_name()
    
    def has_change_permission(self, request, obj=None):
        return connection.schema_name == get_public_schema_name()
    
    def has_delete_permission(self, request, obj=None):
        return connection.schema_name == get_public_schema_name()
    
    def get_queryset(self, request):
        # Return empty queryset for non-public schemas
        if connection.schema_name == get_public_schema_name():
            return super().get_queryset(request)
        return self.model.objects.none()

# Register Client with public schema restriction
@admin.register(Client)
class ClientAdmin(PublicSchemaAdmin):
    list_display = ['name', 'schema_name', 'created_on']
    # Optional: Add these to prevent accidental access
    exclude = []  # Keep all fields but restricted by parent class

# Register Domain with public schema restriction
@admin.register(Domain)
class DomainAdmin(TenantAdminMixin, PublicSchemaAdmin):
    list_display = ['domain', 'tenant', 'is_primary']
    list_filter = ['is_primary']