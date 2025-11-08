from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.http import JsonResponse
from django.conf import settings

class JWTAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.jwt_auth = JWTAuthentication()

    def __call__(self, request):
        # Skip auth for login and admin paths
        if any(path in request.path for path in ['/api/login/', '/admin/']):
            return self.get_response(request)

        try:
            header = request.META.get('HTTP_AUTHORIZATION', '')
            if not header.startswith('Bearer '):
                return JsonResponse(
                    {'detail': 'No valid token provided'}, 
                    status=401
                )
            
            validated_token = self.jwt_auth.get_validated_token(header.split(' ')[1])
            user_id = validated_token['user_id']
            request.user_id = user_id
            
            return self.get_response(request)
            
        except Exception as e:
            return JsonResponse(
                {'detail': f'Authentication failed: {str(e)}'}, 
                status=401
            )