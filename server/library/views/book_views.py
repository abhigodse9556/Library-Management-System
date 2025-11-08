from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework import status
from decimal import Decimal
from django.utils import timezone
from ..models import Book, Member, Transaction
from ..serializers import (BookSerializer, IssueBookSerializer, ReturnBookSerializer, TransactionSerializer, MemberSerializer)
import requests

class BookViewSet(viewsets.ModelViewSet):
    """ViewSet for Book CRUD operations"""
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def get_queryset(self):
        queryset = Book.objects.all()
        search_query = self.request.query_params.get('search', None)
        title = self.request.query_params.get('title', None)
        author = self.request.query_params.get('author', None)
        
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) | 
                Q(authors__icontains=search_query)
            )
        if title:
            queryset = queryset.filter(title__icontains=title)
        if author:
            queryset = queryset.filter(authors__icontains=author)
        
        return queryset

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search books by title and/or author"""
        title = request.query_params.get('title', '')
        author = request.query_params.get('author', '')
        
        queryset = Book.objects.all()
        
        if title:
            queryset = queryset.filter(title__icontains=title)
        if author:
            queryset = queryset.filter(authors__icontains=author)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
class IssueBookView(APIView):
    """API view to issue a book to a member"""
    
    def post(self, request):
        serializer = IssueBookSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        book_id = serializer.validated_data['book_id']
        member_id = serializer.validated_data['member_id']
        
        try:
            book = Book.objects.get(id=book_id)
            member = Member.objects.get(id=member_id)
        except Book.DoesNotExist:
            return Response(
                {'error': 'Book not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Member.DoesNotExist:
            return Response(
                {'error': 'Member not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if book is in stock
        if book.stock <= 0:
            return Response(
                {'error': 'Book is out of stock'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if member's debt is within limit (Rs. 500)
        MAX_DEBT = Decimal('500.00')
        if member.outstanding_debt >= MAX_DEBT:
            return Response(
                {'error': f'Member outstanding debt ({member.outstanding_debt}) exceeds maximum limit of Rs. {MAX_DEBT}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create transaction
        transaction = Transaction.objects.create(
            transaction_type=Transaction.ISSUE,
            book=book,
            member=member,
            is_active=True
        )
        
        # Decrease book stock
        book.stock -= 1
        book.save()
        
        serializer = TransactionSerializer(transaction)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ReturnBookView(APIView):
    """API view to return a book and charge rent fee"""
    
    def post(self, request):
        serializer = ReturnBookSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        transaction_id = serializer.validated_data['transaction_id']
        rent_fee = serializer.validated_data.get('rent_fee', Decimal('0.00'))
        
        try:
            transaction = Transaction.objects.get(id=transaction_id, is_active=True)
        except Transaction.DoesNotExist:
            return Response(
                {'error': 'Active transaction not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Update transaction
        transaction.transaction_type = Transaction.RETURN
        transaction.return_date = timezone.now()
        transaction.rent_fee = rent_fee
        transaction.is_active = False
        transaction.save()
        
        # Increase book stock
        transaction.book.stock += 1
        transaction.book.save()
        
        # Update member's outstanding debt
        member = transaction.member
        member.outstanding_debt += rent_fee
        member.save()
        
        serializer = TransactionSerializer(transaction)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ImportBooksView(APIView):
    """API view to import books from Frappe Library API"""
    
    def get(self, request):
        count = int(request.query_params.get('count', 20))
        title = request.query_params.get('title', '')
        authors = request.query_params.get('authors', '')
        isbn = request.query_params.get('isbn', '')
        publisher = request.query_params.get('publisher', '')
        page = int(request.query_params.get('page', 1))
        
        # Build query parameters for Frappe API
        params = {}
        if title:
            params['title'] = title
        if authors:
            params['authors'] = authors
        if isbn:
            params['isbn'] = isbn
        if publisher:
            params['publisher'] = publisher
        params['page'] = page
        
        # Calculate how many pages we need
        pages_needed = (count + 19) // 20  # Each page returns max 20 books
        
        imported_books = []
        total_imported = 0
        
        try:
            for page_num in range(1, pages_needed + 1):
                if total_imported >= count:
                    break
                
                params['page'] = page_num
                response = requests.get(
                    'https://frappe.io/api/method/frappe-library',
                    params=params,
                    timeout=10
                )
                response.raise_for_status()
                
                data = response.json()
                books_data = data.get('message', [])
                
                for book_data in books_data:
                    if total_imported >= count:
                        break
                    
                    # Check if book already exists
                    book_id = book_data.get('bookID')
                    if book_id and Book.objects.filter(bookID=book_id).exists():
                        continue
                    
                    # Create book
                    book = Book.objects.create(
                        bookID=book_data.get('bookID'),
                        title=book_data.get('title', ''),
                        authors=book_data.get('authors', ''),
                        isbn=book_data.get('isbn'),
                        isbn13=book_data.get('isbn13'),
                        publisher=book_data.get('publisher'),
                        publication_date=book_data.get('publication_date'),
                        language_code=book_data.get('language_code'),
                        num_pages=book_data.get('num_pages'),
                        stock=1,  # Default stock
                        average_rating=book_data.get('average_rating'),
                        ratings_count=book_data.get('ratings_count', 0),
                        text_reviews_count=book_data.get('text_reviews_count', 0),
                    )
                    
                    imported_books.append(book)
                    total_imported += 1
            
            serializer = BookSerializer(imported_books, many=True)
            return Response({
                'message': f'Successfully imported {total_imported} book(s)',
                'books': serializer.data,
                'count': total_imported
            }, status=status.HTTP_201_CREATED)
        
        except requests.RequestException as e:
            return Response(
                {'error': f'Failed to fetch books from Frappe API: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            return Response(
                {'error': f'An error occurred: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )