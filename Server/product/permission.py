from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrManager(BasePermission):
    """Allow admin and manager to perform actions"""
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in ['admin', 'manager']
    
class IsAdmin(BasePermission):
    """Allow only admin users"""
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role == 'admin'
    
class CanManageProducts(BasePermission):
    """
    - Admin & Manager: Full access (create, read, update, delete)
    - Staff: Read only (GET requests)
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Allow GET, HEAD, OPTIONS for all authenticated users
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        
        # Only admin and manager can create/update/delete
        return request.user.role in ['admin', 'manager']


class CanManageCategories(BasePermission):
    """Only admin and manager can manage categories"""
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if request.method in ['GET' ,'HEAD', 'OPTIONS']:
            return True
        
        return request.user.role in ['admin', 'manager']


class CanManageSuppliers(BasePermission):
    """Only admin and manager can manage suppliers"""
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if request.method in ['GET',"POST" ,'HEAD', 'OPTIONS']:
            return True
        
        return request.user.role in ['admin', 'manager']


class CanManageStockIn(BasePermission):
    """Only admin and manager can add stock"""
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Read-only for everyone authenticated
        if request.method in SAFE_METHODS:
            return True
        
        # Write only for admin & manager
        return request.user.role in ['admin', 'manager']


class CanManageSales(BasePermission):
    """
    - Admin & Manager: Full access
    - Staff: Can create sales, view sales
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # All authenticated users can view and create sales
        if request.method in ['GET', 'HEAD', 'OPTIONS', 'POST']:
            return True
        
        # Only admin and manager can update/delete sales
        return request.user.role in ['admin', 'manager']


class CanViewReports(BasePermission):
    """Only admin and manager can view reports"""
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        return request.user.role in ['admin', 'manager','staff']