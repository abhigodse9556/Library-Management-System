from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
from .book_model import Book
from .member_model import Member

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