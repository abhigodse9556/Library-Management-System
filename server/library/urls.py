from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BookViewSet, MemberViewSet, TransactionViewSet,
    IssueBookView, ReturnBookView, ImportBooksView, 
    UserViewSet, LoginAPIView, DynamicChoicesAPIView
)

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')
router.register(r'members', MemberViewSet, basename='member')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('issue', IssueBookView.as_view(), name='issue-book'),
    path('return', ReturnBookView.as_view(), name='return-book'),
    path('import-books', ImportBooksView.as_view(), name='import-books'),
    path("choices/", DynamicChoicesAPIView.as_view()),
]

