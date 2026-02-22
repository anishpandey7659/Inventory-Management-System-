from rest_framework_simplejwt.tokens import RefreshToken

def get_tokens_for_user(user):
    """Generate JWT tokens with custom claims for user"""
    refresh = RefreshToken.for_user(user)
    
    # Add custom claims
    refresh['email'] = user.email
    refresh['role'] = user.role
    refresh['is_staff'] = user.is_staff
    refresh['is_superuser'] = user.is_superuser
    
    # Add permissions based on role
    if user.role == 'admin':
        refresh['permissions'] = ['create_manager', 'create_staff', 'view_all', 'edit_all', 'delete_all']
    elif user.role == 'manager':
        refresh['permissions'] = ['create_staff', 'view_team', 'edit_team']
    elif user.role == 'staff':
        refresh['permissions'] = ['view_own', 'edit_own']
    else:
        refresh['permissions'] = []
    
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }