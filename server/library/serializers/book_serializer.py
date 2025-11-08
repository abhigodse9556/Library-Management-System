from rest_framework import serializers
from ..models import Book

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
        
class IssueBookSerializer(serializers.Serializer):
    book_id = serializers.IntegerField()
    member_id = serializers.IntegerField()


class ReturnBookSerializer(serializers.Serializer):
    transaction_id = serializers.IntegerField()
    rent_fee = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)