from rest_framework import viewsets

from ..models import Member
from ..serializers import MemberSerializer

class MemberViewSet(viewsets.ModelViewSet):
    """ViewSet for Member CRUD operations"""
    queryset = Member.objects.all()
    serializer_class = MemberSerializer