from tenants.models import Client

public_tenant = Client.objects.create(
    name="Public Tenant",
    email="admin@example.com",
    phone="0000000000",
    registration_number="PUBLIC",
    address="Public Address",
    is_active=True,
    schema_name="public",  # must be exactly 'public'
)

from tenants.models import Domain

Domain.objects.get_or_create(
    domain="localhost",  # the hostname you use in browser
    tenant=public_tenant,
    is_primary=True
)

from django.contrib.auth import get_user_model
from django_tenants.utils import schema_context

User = get_user_model()

with schema_context('public'):
    User.objects.create_superuser(
        email="anishpandey@gmail.com",
        password="sarita@12"
    )
    
# with schema_context('mclaren'):
#     User.objects.create_superuser(
#         email="mclarenadmin@gmail.com",
#         password="sarita@12"
#     )

# To create a superuser for the public tenant, run the following command in your terminal:
# python manage.py shell
# exec(open('create_tenant_superuser.py').read())