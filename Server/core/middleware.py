class TenantFromHeaderMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        tenant = request.headers.get('X-Tenant')
        
        if tenant:
            # Override host so django_tenants can detect the tenant
            request.META['HTTP_HOST'] = f"{tenant}.localhost"
        
        response = self.get_response(request)
        return response