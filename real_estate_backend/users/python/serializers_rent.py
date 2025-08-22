from rest_framework import serializers
from ..models import RentalProperty

class RentPropertySerializer(serializers.Serializer):
    id = serializers.CharField(source='pk', read_only=True)
    title = serializers.CharField()
    location = serializers.CharField()
    rent_price = serializers.FloatField()
    bhk = serializers.IntegerField()
    area = serializers.FloatField()
    image_url = serializers.CharField()
    is_new_construction = serializers.BooleanField()
