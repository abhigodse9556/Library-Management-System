from django.contrib.auth.hashers import make_password
from django.core.validators import RegexValidator
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from ..models import User

mobile_validator = RegexValidator(r'^\+?1?\d{9,15}$', 'Enter a valid mobile number (9-15 digits, optional leading +).')
zip_validator = RegexValidator(r'^\d{4,10}$', 'Enter a valid zip/postal code.')

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        trim_whitespace=True
    )

    userName = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message='This username is already taken.')],
        trim_whitespace=True
    )

    mobileNo = serializers.CharField(
        required=True,
        validators=[
            UniqueValidator(queryset=User.objects.all(), message='This mobile number is already in use.'),
            mobile_validator
        ],
        trim_whitespace=True
    )

    alternateMobileNo = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message='This alternate mobile is already in use.')],
        trim_whitespace=True
    )

    emailID = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message='This email is already in use.')]
    )

    alternateEmailID = serializers.EmailField(
        required=False,
        allow_null=True,
        allow_blank=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message='This alternate email is already in use.')]
    )

    currentZip = serializers.CharField(required=True, validators=[zip_validator])
    permanentZip = serializers.CharField(required=False, allow_blank=True, allow_null=True, validators=[zip_validator])

    class Meta:
        model = User
        # include all fields you want exposed via API
        fields = '__all__'
        extra_kwargs = {
            'firstName': {'required': True, 'allow_blank': False},
            'lastName': {'required': True, 'allow_blank': False},
            'userRole': {'required': True},
            'currentCity': {'required': True, 'allow_blank': False},
            'currentState': {'required': True, 'allow_blank': False},
            'currentCountry': {'required': True, 'allow_blank': False},
            'isCurrentAddressPermanent': {'required': False},
            'joiningDate': {'required': False, 'allow_null': True},
            'dateOfBirth': {'required': False, 'allow_null': True},
        }

    def validate(self, attrs):
        # Fail fast on required string fields that are blank after trimming
        for key in ('userName', 'password', 'firstName', 'lastName', 'mobileNo', 'emailID',
                    'currentCity', 'currentState', 'currentZip', 'currentCountry', 'userRole'):
            val = attrs.get(key, None)
            if isinstance(val, str) and not val.strip():
                raise serializers.ValidationError({key: 'This field may not be blank.'})

        # If address is not marked permanent, require permanent address fields (optional policy)
        is_perm = attrs.get('isCurrentAddressPermanent', False)
        if not is_perm:
            # if permanent fields are entirely empty that's acceptable; adjust policy if needed
            pass

        # Ensure alternate fields are empty or valid (UniqueValidator handles uniqueness)
        for alt in ('alternateMobileNo', 'alternateEmailID'):
            v = attrs.get(alt, None)
            if v is not None and isinstance(v, str) and not v.strip():
                # normalize blank string to None
                attrs[alt] = None

        return attrs

    def create(self, validated_data):
        # Hash password before saving
        raw_password = validated_data.pop('password', None)
        if raw_password:
            validated_data['password'] = make_password(raw_password)
        user = super().create(validated_data)
        return user

    def update(self, instance, validated_data):
        # Hash password if it's being updated
        raw_password = validated_data.pop('password', None)
        if raw_password:
            instance.password = make_password(raw_password)
        return super().update(instance, validated_data)