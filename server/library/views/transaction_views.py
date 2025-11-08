from rest_framework import viewsets

from ..models import Transaction
from ..serializers import TransactionSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    """ViewSet for Transaction operations"""
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    def get_queryset(self):
        queryset = Transaction.objects.all()
        member_id = self.request.query_params.get('member', None)
        book_id = self.request.query_params.get('book', None)
        is_active = self.request.query_params.get('is_active', None)
        
        if member_id:
            queryset = queryset.filter(member_id=member_id)
        if book_id:
            queryset = queryset.filter(book_id=book_id)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset