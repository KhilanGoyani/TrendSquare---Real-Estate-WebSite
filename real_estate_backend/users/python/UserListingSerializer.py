from rest_framework import serializers
from ..models import UserListing

class UserListingSerializer(serializers.Serializer):
    id = serializers.CharField(source="pk")
    property_id = serializers.CharField(source="property.pk")
    property_title = serializers.CharField(source="property.title")
    location = serializers.CharField(source="property.location")
    price = serializers.FloatField(source="property.price")
    bhk = serializers.IntegerField(source="property.bhk")
    area = serializers.FloatField(source="property.area")
    image_url = serializers.CharField(source="property.image_url")
