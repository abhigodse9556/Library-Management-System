from django.db import models
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _

# Add these choices at the top with other imports
GENDER_CHOICES = [
    ('M', 'Male'),
    ('F', 'Female'),
    ('O', 'Other')
]

USER_ROLES = [
    ('ADMIN', 'Administrator'),
    ('LIBRARIAN', 'Librarian'),
    ('STAFF', 'Staff')
]

class User(models.Model):
    """Model to store user information"""
    # Personal Information
    userName = models.CharField(
        max_length=50, 
        unique=True, 
        blank=False, 
        null=False,
        validators=[RegexValidator(r'^[\w.@+-]+$')]
    )
    password = models.CharField(max_length=128, blank=False, null=False)
    userRole = models.CharField(
        max_length=20, 
        choices=USER_ROLES,
        blank=False, 
        null=False
    )
    firstName = models.CharField(max_length=50, blank=False, null=False)
    lastName = models.CharField(max_length=50, blank=False, null=False)
    
    # Contact Information
    mobileNo = models.CharField(
        max_length=15,
        unique=True,
        blank=False,
        null=False,
        validators=[RegexValidator(r'^\+?1?\d{9,15}$')]
    )
    alternateMobileNo = models.CharField(
        max_length=15,
        unique=True,
        blank=True,
        null=True,
        validators=[RegexValidator(r'^\+?1?\d{9,15}$')]
    )
    emailID = models.EmailField(unique=True, blank=False, null=False)
    alternateEmailID = models.EmailField(unique=True, blank=True, null=True)
    
    # Current Address
    currentAddressLine1 = models.CharField(max_length=100, blank=True)
    currentAddressLine2 = models.CharField(max_length=100, blank=True)
    currentStreet = models.CharField(max_length=100, blank=True)
    currentArea = models.CharField(max_length=100, blank=True)
    currentCity = models.CharField(max_length=50, blank=False, null=False)
    currentState = models.CharField(max_length=50, blank=False, null=False)
    currentZip = models.CharField(
        max_length=10, 
        blank=False, 
        null=False,
        validators=[RegexValidator(r'^\d{5,10}$')]
    )
    currentCountry = models.CharField(max_length=50, blank=False, null=False)
    isCurrentAddressPermanent = models.BooleanField(default=False)
    
    # Permanent Address
    permanentAddressLine1 = models.CharField(max_length=100, blank=True)
    permanentAddressLine2 = models.CharField(max_length=100, blank=True)
    permanentStreet = models.CharField(max_length=100, blank=True)
    permanentArea = models.CharField(max_length=100, blank=True)
    permanentCity = models.CharField(max_length=50, blank=True)
    permanentState = models.CharField(max_length=50, blank=True)
    permanentZip = models.CharField(
        max_length=10, 
        blank=True,
        validators=[RegexValidator(r'^\d{5,10}$')]
    )
    permanentCountry = models.CharField(max_length=50, blank=True)
    
    # Additional Information
    joiningDate = models.DateField(null=True, blank=True)
    dateOfBirth = models.DateField(null=True, blank=True)
    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        blank=True
    )
    qualification = models.CharField(max_length=200, blank=True)
    notes = models.TextField(blank=True)
    
    # Timestamps
    lastLogin = models.DateTimeField(null=True, blank=True, help_text="Last login datetime (updated on successful login)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.firstName} {self.lastName} ({self.userName})"