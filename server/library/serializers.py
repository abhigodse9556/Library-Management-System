from rest_framework import serializers
from .models import Book, Member, Transaction


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = [
            'id', 'bookID', 'title', 'authors', 'isbn', 'isbn13',
            'publisher', 'publication_date', 'language_code', 'num_pages',
            'stock', 'average_rating', 'ratings_count', 'text_reviews_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['id', 'name', 'email', 'phone', 'outstanding_debt', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


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


class IssueBookSerializer(serializers.Serializer):
    book_id = serializers.IntegerField()
    member_id = serializers.IntegerField()


class ReturnBookSerializer(serializers.Serializer):
    transaction_id = serializers.IntegerField()
    rent_fee = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)

