

from mongoengine import Document, EmailField, StringField, DateTimeField, IntField, FloatField, URLField, BooleanField
from datetime import datetime

class CustomUser(Document):
    username = StringField(required=True, unique=True)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    role = StringField(required=True, choices=('buyer', 'seller', 'agent'))
    otp = IntField()
    otp_created_at = DateTimeField()

    meta = {'collection': 'users'}

class PropertyListing(Document):
    title = StringField(required=True, max_length=255)
    location = StringField(required=True, max_length=255)
    price = FloatField(required=True)
    bhk = IntField(required=True)
    area = FloatField(required=True)  # square feet or other unit
    image_url = URLField(required=True)
    is_new_construction = BooleanField(default=False) 

    meta = {'collection': 'property_listings'}

    def __str__(self):
        return self.title
    
class RentalProperty(Document):
    title = StringField(required=True, max_length=255)
    location = StringField(required=True, max_length=255)
    rent_price = FloatField()
    price = FloatField()  # TEMP field to avoid crash
    bhk = IntField(required=True)
    area = FloatField(required=True)
    image_url = URLField(required=True)
    is_new_construction = BooleanField(default=False)

    meta = {'collection': 'property_listings_rent'}  # Separate collection

    def __str__(self):
        return self.title

from mongoengine import Document, StringField, IntField, EmailField

class Agent(Document):
    name = StringField(required=True)
    email = EmailField(required=True)
    phone = StringField(required=True)
    location = StringField(required=True)
    role = StringField(default="agent")  # always 'agent'
    experience_years = IntField(required=True)
    price_range = StringField(required=True)
    profile_image = StringField(required=True)  # URL
    
    meta = {'collection': 'agents'}
    
    def __str__(self):
        return self.title

# users/models.py
from django.db import models
from mongoengine import Document, StringField, ReferenceField, DateTimeField
from datetime import datetime
from .models import Agent  # if you have a separate Agent model

class ContactMessage(Document):
    agent = ReferenceField(Agent, required=True)
    name = StringField(required=True)
    email = StringField(required=True)
    message = StringField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)
    
# users/models.py
from mongoengine import Document, ReferenceField
from .models import CustomUser, PropertyListing

class UserListing(Document):
    user = ReferenceField(CustomUser, required=True)
    property = ReferenceField(PropertyListing, required=True)
    payment_status = StringField(default="pending", choices=["UnPaid", "paid"])

# models.py
from mongoengine import Document, ReferenceField, StringField, FloatField, BooleanField, IntField
from users.models import CustomUser

class UserRentalListing(Document):
    user = ReferenceField(CustomUser, required=True)
    rental_property = ReferenceField('RentalProperty', required=True)
    payment_status = StringField(default="unpaid")  

    meta = {'collection': 'user_rental_listings'}
