from rest_framework import serializers
from ..models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    member_name = serializers.CharField(source='member.name', read_only=True)
    member_email = serializers.CharField(source='member.email', read_only=True)

    class Meta:
        model = Transaction
        fields = [
            'id', 'transaction_type', 'book', 'member', 'book_title',
            'member_name', 'member_email', 'rent_fee', 'issue_date',
            'return_date', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['issue_date', 'created_at', 'updated_at']