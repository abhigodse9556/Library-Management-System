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