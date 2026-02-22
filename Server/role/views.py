from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .permissions import IsAdmin, IsAdminOrManager, CanCreateManager, CanCreateStaff
from .serializers import LoginSerializer, CreateManagerSerializer, CreateStaffSerializer, UserSerializer
from .models import *
from tenants.serializers import ClientRegistrationSerializer

class AuthViewSet(viewsets.ViewSet):
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register_client(self, request):
        serializer = ClientRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)  # 🔥 cleaner
        data = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        """Login user and return JWT tokens"""
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            return Response({
                'user': {
                    'id': serializer.validated_data['user'].id,
                    'email': serializer.validated_data['user'].email,
                    'role': serializer.validated_data['user'].role,
                },
                'tokens': serializer.validated_data['tokens'],
                'message': 'Login successful'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    @action(detail=False, methods=['post'], permission_classes=[CanCreateManager])  # ✅ Custom permission
    def create_manager(self, request):
        """Admin creates a manager"""
        serializer = CreateManagerSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            manager = serializer.save()
            return Response({
                'message': 'Manager created successfully',
                'manager': UserSerializer(manager).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[CanCreateStaff])  # ✅ Custom permission
    def create_staff(self, request):
        """Admin or Manager creates staff"""
        serializer = CreateStaffSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            staff = serializer.save()
            return Response({
                'message': 'Staff created successfully',
                'staff': UserSerializer(staff).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_team(self, request):
        """Get all users in the same company"""
        users = CustomUser.objects.filter()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Get current user info"""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    @action(detail=True, methods=['delete'], permission_classes=[IsAuthenticated])
    def delete_user(self, request, pk=None):
        """Delete a user"""
        try:
            user = CustomUser.objects.get(pk=pk)  # Replace User with your actual model
            user.delete()
            return Response(
                {"message": "User deleted successfully"}, 
                status=status.HTTP_204_NO_CONTENT
            )
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "User not found"}, 
                status=status.HTTP_404_NOT_FOUND
        )