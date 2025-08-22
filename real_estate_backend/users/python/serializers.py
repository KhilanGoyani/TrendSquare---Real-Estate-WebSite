from rest_framework import serializers
from ..models import PropertyListing
class PropertyListingSerializer(serializers.Serializer):
    _id = serializers.CharField(source='id')
    title = serializers.CharField()
    location = serializers.CharField()
    price = serializers.FloatField()
    bhk = serializers.IntegerField()
    area = serializers.FloatField()
    image_url = serializers.CharField()
    is_new_construction = serializers.BooleanField()
    
