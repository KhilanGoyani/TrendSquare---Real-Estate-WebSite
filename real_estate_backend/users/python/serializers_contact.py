# users/serializers_contact.py
from rest_framework import serializers
from ..models import ContactMessage

class ContactMessageSerializer(serializers.Serializer):
    agent = serializers.CharField()
    name = serializers.CharField()
    email = serializers.EmailField()
    message = serializers.CharField()
