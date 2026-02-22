from rest_framework import serializers
from django.db import transaction
from django_tenants.utils import schema_context
from tenants.models import Client, Domain
from role.models import CustomUser, AdminProfile
from role.tokens import get_tokens_for_user
from django.core.management import call_command 


class ClientRegistrationSerializer(serializers.Serializer):

    # 🔹 Tenant fields
    client_name = serializers.CharField(max_length=255)
    client_email = serializers.EmailField()
    client_phone = serializers.CharField(max_length=15)
    client_address = serializers.CharField()

    # 🔹 Admin fields
    admin_email = serializers.EmailField()
    admin_password = serializers.CharField(write_only=True)
    admin_confirm_password = serializers.CharField(write_only=True)
    admin_first_name = serializers.CharField(max_length=150)
    admin_last_name = serializers.CharField(max_length=150)
    admin_code = serializers.CharField(max_length=50)

    # ---------------------------
    # VALIDATIONS
    # ---------------------------

    def validate(self, data):
        if data['admin_password'] != data['admin_confirm_password']:
            raise serializers.ValidationError({
                'admin_confirm_password': "Passwords do not match."
            })
        return data

    def validate_client_name(self, value):
        if Client.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError("Client already exists.")
        return value

    def validate_admin_email(self, value):
        with schema_context('public'):
            if CustomUser.objects.filter(email__iexact=value).exists():
                raise serializers.ValidationError("Email already exists.")
        return value

    # ---------------------------
    # CREATE TENANT + ADMIN
    # ---------------------------

    @transaction.atomic
    def create(self, validated_data):

        # 1️⃣ Generate schema_name safely
        schema_name = validated_data['client_name'].lower().replace(" ", "_")
        domain_name = validated_data['client_name'].lower().replace(" ", "-")

        # 2️⃣ Create Tenant
        client = Client.objects.create(
            schema_name=schema_name,
            name=validated_data['client_name'],
            email=validated_data['client_email'],
            phone=validated_data['client_phone'],
            address=validated_data['client_address'],
        )

        client.save()  # 🔥 Creates schema automatically

        # 3️⃣ Create Domain
        Domain.objects.create(
            domain=f"{domain_name}.localhost",
            tenant=client,
            is_primary=True,
        )
        
        # ✅ 3.5️⃣ RUN MIGRATIONS ON NEW TENANT SCHEMA
        try:
            call_command('migrate_schemas', schema_name=schema_name, verbosity=0)
        except Exception as e:
            raise serializers.ValidationError(
                f"Failed to setup tenant database: {str(e)}"
            )


        # 4️⃣ Switch to tenant schema
        with schema_context(schema_name):

            admin_user = CustomUser.objects.create_superuser(
                    email=validated_data['admin_email'],
                    password=validated_data['admin_password'],
                    role='admin',
                )

            admin_profile = AdminProfile.objects.create(
                user=admin_user,
                admin_code=validated_data['admin_code']
            )

            tokens = get_tokens_for_user(admin_user)

        return {
            'client': client,
            'admin_user': admin_user,
            'tokens': tokens
        }

    # ---------------------------
    # RESPONSE FORMAT
    # ---------------------------

    def to_representation(self, instance):
        return {
            'client': {
                'id': instance['client'].id,
                'name': instance['client'].name,
                'email': instance['client'].email,
                'phone': instance['client'].phone,
                'address': instance['client'].address,
            },
            'admin_user': {
                'id': instance['admin_user'].id,
                'email': instance['admin_user'].email,
                'first_name': instance['admin_user'].first_name,
                'last_name': instance['admin_user'].last_name,
            },
            'tokens': instance['tokens'],
            'message': "Tenant and admin created successfully"
        }
