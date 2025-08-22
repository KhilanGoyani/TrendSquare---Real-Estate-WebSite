from rest_framework import serializers

class ContactAgentSerializer(serializers.Serializer):
    name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    message = serializers.CharField(required=True)
