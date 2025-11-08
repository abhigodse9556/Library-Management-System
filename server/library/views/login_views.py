from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from ..models import User
from ..serializers import UserSerializer
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.tokens import RefreshToken
import logging

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class LoginAPIView(APIView):
    permission_classes = []

    def generate_tokens_for_user(self, user):
        try:
            # Create tokens manually since we're not using Django's default User model
            refresh = RefreshToken()
            
            # Add custom claims
            refresh['user_id'] = user.id
            refresh['username'] = user.userName
            refresh['role'] = user.userRole
            refresh['email'] = user.emailID

            # Generate access token
            access_token = refresh.access_token

            return {
                'refresh': str(refresh),
                'access': str(access_token),
            }
        except Exception as e:
            logger.error(f"Token generation failed: {str(e)}")
            raise

    def post(self, request):
        try:
            username = request.data.get('userName')
            password = request.data.get('password')

            if not username or not password:
                return Response(
                    {"detail": "Username and password are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                user = User.objects.get(userName=username)
            except User.DoesNotExist:
                return Response(
                    {"detail": "Invalid credentials"},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            if user.password != password:  # Note: Should use proper password hashing
                return Response(
                    {"detail": "Invalid credentials"},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            # Update last login
            user.lastLogin = timezone.now()
            user.save(update_fields=['lastLogin'])

            # Generate tokens
            tokens = self.generate_tokens_for_user(user)
            
            response_data = {
                "status": "success",
                "tokens": tokens,
                "user": {
                    "id": user.id,
                    "userName": user.userName,
                    "userRole": user.userRole,
                    "firstName": user.firstName,
                    "lastName": user.lastName
                }
            }
            
            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Login failed: {str(e)}", exc_info=True)
            return Response(
                {"detail": f"Login failed: {str(e)}"},  # Include error message in development
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )