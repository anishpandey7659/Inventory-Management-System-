from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    """Allow access only to admin users"""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'


class IsManager(BasePermission):
    """Allow access only to manager users"""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'manager'


class IsAdminOrManager(BasePermission):
    """Allow access to admin or manager users"""
    
    def has_permission(self, request, view):
        return (request.user and 
                request.user.is_authenticated and 
                request.user.role in ['admin', 'manager'])


class IsSameCompany(BasePermission):
    """Allow access only if user belongs to the same company"""
    
    def has_object_permission(self, request, view, obj):
        return request.user.company == obj.company


class CanCreateManager(BasePermission):
    """Only admins can create managers"""
    
    def has_permission(self, request, view):
        return (request.user and 
                request.user.is_authenticated and 
                request.user.role == 'admin' and
                hasattr(request.user, 'admin_profile') and
                request.user.admin_profile.can_create_managers)


class CanCreateStaff(BasePermission):
    """Admins and managers can create staff"""
    
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        
        if user.role == 'admin':
            return hasattr(user, 'admin_profile') and user.admin_profile.can_create_staff
        elif user.role == 'manager':
            return hasattr(user, 'manager_profile') and user.manager_profile.can_create_staff
        
        return False