from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BookViewSet, MemberViewSet, TransactionViewSet,
    IssueBookView, ReturnBookView, ImportBooksView
)

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')
router.register(r'members', MemberViewSet, basename='member')
router.register(r'transactions', TransactionViewSet, basename='transaction')

urlpatterns = [
    path('', include(router.urls)),
    path('issue', IssueBookView.as_view(), name='issue-book'),
    path('return', ReturnBookView.as_view(), name='return-book'),
    path('import-books', ImportBooksView.as_view(), name='import-books'),
]

