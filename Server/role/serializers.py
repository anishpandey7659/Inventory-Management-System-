# serializers.py
from rest_framework import serializers
from django.db import transaction
from .tokens import get_tokens_for_user
from .models import CustomUser, AdminProfile, ManagerProfile, StaffProfile


class CreateManagerSerializer(serializers.Serializer):
    """Admin creates a manager"""
    
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    phone = serializers.CharField(max_length=15)
    department = serializers.CharField(max_length=100, required=False, allow_blank=True)

    def validate_email(self, value):
        if CustomUser.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("User with this email already exists.")
        return value

    def validate(self, attrs):
        # Check if the requester is an admin
        request = self.context.get('request')
        if not request or request.user.role != 'admin':
            raise serializers.ValidationError("Only admins can create managers.")
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        request = self.context.get('request')
        admin_user = request.user

        # Create Manager User
        manager_user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            role='manager',
        )

        # Create Manager Profile
        manager_profile = ManagerProfile.objects.create(
            user=manager_user,
            created_by=admin_user,
            department=validated_data.get('department', '')
        )

        return manager_user


class CreateStaffSerializer(serializers.Serializer):
    """Admin or Manager creates staff"""
    
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    phone = serializers.CharField(max_length=15)
    department = serializers.CharField(max_length=100, required=False, allow_blank=True)

    def validate_email(self, value):
        if CustomUser.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("User with this email already exists.")
        return value

    def validate(self, attrs):
        # Check if the requester is admin or manager
        request = self.context.get('request')
        if not request or request.user.role not in ['admin', 'manager']:
            raise serializers.ValidationError("Only admins and managers can create staff.")
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        request = self.context.get('request')
        creator = request.user

        # Create Staff User
        staff_user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            role='staff',
        )

        # Create Staff Profile
        staff_profile = StaffProfile.objects.create(
            user=staff_user,
            created_by=creator,
            department=validated_data.get('department', '')
        )

        return staff_user


class UserSerializer(serializers.ModelSerializer):
    """For displaying user info"""
    
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 
                   'phone', 'is_active', 'created_at']
        read_only_fields = ['id', 'role', 'created_at']


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            try:
                user = CustomUser.objects.get(email=email)
            except CustomUser.DoesNotExist:
                raise serializers.ValidationError('Invalid credentials')

            if not user.check_password(password):
                raise serializers.ValidationError('Invalid credentials')

            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')

            # Generate tokens
            tokens = get_tokens_for_user(user)  
            
            data['user'] = user
            data['tokens'] = tokens
            
            return data
        else:
            raise serializers.ValidationError('Must include email and password')