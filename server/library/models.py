from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


class Book(models.Model):
    """Model to store book information"""
    bookID = models.CharField(max_length=100, unique=True, null=True, blank=True)
    title = models.CharField(max_length=500)
    authors = models.CharField(max_length=500)
    isbn = models.CharField(max_length=20, null=True, blank=True)
    isbn13 = models.CharField(max_length=20, null=True, blank=True)
    publisher = models.CharField(max_length=200, null=True, blank=True)
    publication_date = models.CharField(max_length=50, null=True, blank=True)
    language_code = models.CharField(max_length=10, null=True, blank=True)
    num_pages = models.IntegerField(null=True, blank=True)
    stock = models.IntegerField(default=1, validators=[MinValueValidator(0)])
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    ratings_count = models.IntegerField(default=0)
    text_reviews_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} by {self.authors}"


class Member(models.Model):
    """Model to store member information"""
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    outstanding_debt = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.email})"


class Transaction(models.Model):
    """Model to store book issue/return transactions"""
    ISSUE = 'issue'
    RETURN = 'return'
    TRANSACTION_TYPE_CHOICES = [
        (ISSUE, 'Issue'),
        (RETURN, 'Return'),
    ]

    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPE_CHOICES)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='transactions')
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='transactions')
    rent_fee = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    issue_date = models.DateTimeField(auto_now_add=True)
    return_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)  # True for issued, False for returned
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.transaction_type.upper()} - {self.book.title} to {self.member.name}"

