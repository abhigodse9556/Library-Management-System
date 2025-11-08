from django.contrib import admin
from .models import Book, Member, Transaction


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'authors', 'stock', 'isbn', 'created_at']
    search_fields = ['title', 'authors', 'isbn']
    list_filter = ['created_at', 'stock']


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'outstanding_debt', 'created_at']
    search_fields = ['name', 'email']
    list_filter = ['created_at']


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['transaction_type', 'book', 'member', 'rent_fee', 'issue_date', 'is_active']
    list_filter = ['transaction_type', 'is_active', 'issue_date']
    search_fields = ['book__title', 'member__name', 'member__email']

