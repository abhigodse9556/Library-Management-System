from django.db import IntegrityError, transaction
from rest_framework import viewsets, status, permissions, filters
from rest_framework.response import Response

from ..models import User
from ..serializers import UserSerializer

class RoleBasedPermission(permissions.BasePermission):
    """
    Map userRole to allowed HTTP methods:
      - ADMIN: full CRUD
      - LIBRARIAN: read + update (GET, PUT, PATCH)
      - STAFF: read-only (GET)
    Requires authenticated users.
    """
    ROLE_PERMISSIONS = {
        'ADMIN': {'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'},
        'LIBRARIAN': {'GET', 'PUT', 'PATCH', 'HEAD', 'OPTIONS'},
        'STAFF': {'GET', 'HEAD', 'OPTIONS'},
    }

    def _is_authenticated(self, request):
        return bool(request.user and getattr(request.user, 'is_authenticated', False))

    def _allowed(self, request):
        # superuser or django staff users get full access
        if getattr(request.user, 'is_superuser', False) or getattr(request.user, 'is_staff', False):
            return True
        role = getattr(request.user, 'userRole', None)
        allowed = self.ROLE_PERMISSIONS.get(role, set())
        return request.method in allowed

    def has_permission(self, request, view):
        if not self._is_authenticated(request):
            return False
        return self._allowed(request)

    def has_object_permission(self, request, view, obj):
        # Same mapping for object-level checks
        return self.has_permission(request, view)

class UserViewSet(viewsets.ModelViewSet):
    """
    CRUD endpoints for User model.
    - list, retrieve: anyone (read-only) or as configured by permission classes
    - create, update, partial_update, destroy: restricted by permission classes
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [RoleBasedPermission]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['userName', 'firstName', 'lastName', 'emailID', 'mobileNo']
    ordering = ['-created_at']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            with transaction.atomic():
                self.perform_create(serializer)
        except IntegrityError:
            return Response(
                {"detail": "Conflict: unique field already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        try:
            with transaction.atomic():
                self.perform_update(serializer)
        except IntegrityError:
            return Response(
                {"detail": "Conflict: unique field already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        # soft-delete could be implemented here; currently performs hard delete.
        return super().destroy(request, *args, **kwargs)