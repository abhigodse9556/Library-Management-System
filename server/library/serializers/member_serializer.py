from rest_framework import serializers
from ..models import Member

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['id', 'name', 'email', 'phone', 'outstanding_debt', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']