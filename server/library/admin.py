from django.contrib import admin
from .models import User, Book, Member, Transaction

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('userName', 'firstName', 'lastName', 'userRole', 'emailID', 'mobileNo')
    search_fields = ('userName', 'firstName', 'lastName', 'emailID', 'mobileNo')
    list_filter = ('userRole', 'gender', 'currentCity', 'currentState')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Login Information', {
            'fields': ('userName', 'password', 'userRole')
        }),
        ('Personal Information', {
            'fields': ('firstName', 'lastName', 'gender', 'dateOfBirth', 'qualification')
        }),
        ('Contact Information', {
            'fields': ('mobileNo', 'alternateMobileNo', 'emailID', 'alternateEmailID')
        }),
        ('Current Address', {
            'fields': ('currentAddressLine1', 'currentAddressLine2', 'currentStreet', 
                      'currentArea', 'currentCity', 'currentState', 'currentZip', 
                      'currentCountry', 'isCurrentAddressPermanent')
        }),
        ('Permanent Address', {
            'fields': ('permanentAddressLine1', 'permanentAddressLine2', 'permanentStreet',
                      'permanentArea', 'permanentCity', 'permanentState', 'permanentZip',
                      'permanentCountry')
        }),
        ('Additional Information', {
            'fields': ('joiningDate', 'notes', 'lastLogin')
        })
    )

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

