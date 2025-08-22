from rest_framework import serializers
from ..models import Agent

class AgentSerializer(serializers.Serializer):
    id = serializers.CharField(source="pk", read_only=True)
    name = serializers.CharField()
    email = serializers.EmailField()
    phone = serializers.CharField()
    location = serializers.CharField()
    role = serializers.CharField()
    experience_years = serializers.IntegerField()
    price_range = serializers.CharField()
    profile_image = serializers.CharField()

    def create(self, validated_data):
        # Create Agent in MongoDB
        return Agent.objects.create(**validated_data)
