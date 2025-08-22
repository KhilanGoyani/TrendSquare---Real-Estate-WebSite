
from django.http import JsonResponse, HttpResponseNotFound
from rest_framework.decorators import api_view
from .models import CustomUser, PropertyListing
import random
from datetime import datetime, timedelta
from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password
from bson import ObjectId
from mongoengine.errors import ValidationError,DoesNotExist
import os
import joblib
import numpy as np
from rest_framework.response import Response
from rest_framework import status
from mongoengine.queryset.visitor import Q as MQ
from users.python.serializers import PropertyListingSerializer

# Helper: generate random 6-digit OTP
def generate_otp():
    return random.randint(100000, 999999)

# Register User API
@api_view(['POST'])
def register_user(request):
    data = request.data
    if CustomUser.objects(email=data['email']).first():
        return JsonResponse({'error': 'User already exists'}, status=400)

    hashed_password = make_password(data['password'])

    user = CustomUser(
        username=data['username'],
        email=data['email'],
        password=hashed_password,
        role=data['role']
    )
    user.save()
    return JsonResponse({'message': 'User registered successfully'})

# Send OTP API
@api_view(['POST'])
def send_otp(request):
    email = request.data.get('email')
    user = CustomUser.objects(email=email).first()

    if not user:
        return JsonResponse({'error': 'User not found'}, status=404)

    otp = generate_otp()
    user.otp = otp
    user.otp_created_at = datetime.utcnow()
    user.save()

    # Send OTP Email
    send_mail(
        subject='Your OTP Code - RentScout',
        message=f'Your OTP code is {otp}. It is valid for 2 minutes.',
        from_email='your_email@gmail.com',  # Replace with your actual email
        recipient_list=[email],
        fail_silently=False,
    )

    return JsonResponse({'message': 'OTP sent to email'})

# Verify OTP API
@api_view(['POST'])
def verify_otp(request):
    email = request.data.get('email')
    otp = int(request.data.get('otp'))

    user = CustomUser.objects(email=email, otp=otp).first()
    if not user:
        return JsonResponse({'error': 'Invalid OTP'}, status=400)

    # OTP expires after 2 minutes
    if datetime.utcnow() - user.otp_created_at > timedelta(minutes=2):
        return JsonResponse({'error': 'OTP expired'}, status=400)

    return JsonResponse({
        'message': 'Login successful',
        'role': user.role,
        'username': user.username,
        'email' : user.email
    })

# Listings API to fetch all properties
from .python.serializers import PropertyListingSerializer

@api_view(['GET', 'POST'])
def listings(request):
    if request.method == 'GET':
        # Fetch all properties
        properties = PropertyListing.objects()
        serializer = PropertyListingSerializer(properties, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        # Add a new property
        data = request.data
        try:
            prop = PropertyListing.objects.create(
                title=data.get("title"),
                location=data.get("location"),
                price=float(data.get("price")),
                bhk=int(data.get("bhk")),
                area=float(data.get("area")),
                image_url=data.get("image_url"),
                is_new_construction=bool(data.get("is_new_construction", False))
            )
            return Response({"success": True, "id": str(prop.id)}, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

# Property detail API to fetch a single property by ID
@api_view(['GET'])
def property_detail(request, id):
    try:
        # Validate ObjectId format first
        obj_id = ObjectId(id)
    except Exception:
        return JsonResponse({'error': 'Invalid property ID format'}, status=400)
    
    try:
        prop = PropertyListing.objects.get(id=obj_id)
    except (DoesNotExist, ValidationError):
        return JsonResponse({'error': 'Property not found'}, status=404)

    data = {
        '_id': str(prop.id),
        'title': prop.title,
        'location': prop.location,
        'price': prop.price,
        'bhk': prop.bhk,
        'area': prop.area,
        'image_url': prop.image_url,
        'is_new_construction': getattr(prop, 'is_new_construction', False),
        # Add more fields if needed
    }
    return JsonResponse(data)


# Path to this views.py directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, 'models')
# Load saved model and encoders once on server startup
model = joblib.load(os.path.join(MODEL_DIR, 'price_model.pkl'))
location_encoder = joblib.load(os.path.join(MODEL_DIR, 'location_encoder.pkl'))
property_type_encoder = joblib.load(os.path.join(MODEL_DIR, 'property_type_encoder.pkl'))

@api_view(['POST'])
def predict_price(request):
    try:
        required_fields = ["property_type", "location", "bhk", "baths", "balcony", "total_area"]
        for field in required_fields:
            if request.data.get(field) is None:
                return JsonResponse({"error": f"Missing field: {field}"}, status=400)

        property_type = request.data.get("property_type").lower()
        location = request.data.get("location").lower()
        bhk = float(request.data.get("bhk"))          # BHK can be float in your CSV
        baths = int(request.data.get("baths"))
        
        # Handle balcony: accept "yes"/"no" or 1/0
        balcony_raw = str(request.data.get("balcony")).lower()
        if balcony_raw in ['yes', '1', 'true']:
            balcony = 1
        else:
            balcony = 0
        
        total_area = float(request.data.get("total_area"))

        try:
            loc_encoded = location_encoder.transform([location])[0]
        except ValueError:
            return JsonResponse({"error": "Location not found in training data"}, status=400)

        try:
            prop_type_encoded = property_type_encoder.transform([property_type])[0]
        except ValueError:
            return JsonResponse({"error": "Property type not found in training data"}, status=400)

        features = np.array([[loc_encoded, prop_type_encoded, bhk, baths, balcony, total_area]])
        prediction = model.predict(features)[0]

        return JsonResponse({"predicted_price": round(prediction, 2)})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(['GET'])
def homes_for_sale(request):
    """
    GET /api/users/homes_for_sale/?q=&location=&min_price=&max_price=&bhk_min=&bhk_max=&min_area=&max_area=
    Returns only properties with listing_type="sale".
    """
    q = request.GET.get('q', '').strip()
    location = request.GET.get('location', '').strip()
    min_price = request.GET.get('min_price')
    max_price = request.GET.get('max_price')
    bhk_min = request.GET.get('bhk_min')
    bhk_max = request.GET.get('bhk_max')
    min_area = request.GET.get('min_area')
    max_area = request.GET.get('max_area')

    # Start with only "Homes for Sale"
    query = MQ()

    # Search by title or location
    if q:
        query = query & (MQ(title__icontains=q) | MQ(location__icontains=q))

    # Filter by location
    if location:
        query = query & MQ(location__icontains=location)

    # Filter by price range
    if min_price:
        try:
            query = query & MQ(price__gte=float(min_price))
        except ValueError:
            pass
    if max_price:
        try:
            query = query & MQ(price__lte=float(max_price))
        except ValueError:
            pass

    # Filter by BHK
    if bhk_min:
        try:
            query = query & MQ(bhk__gte=int(bhk_min))
        except ValueError:
            pass
    if bhk_max:
        try:
            query = query & MQ(bhk__lte=int(bhk_max))
        except ValueError:
            pass

    # Filter by Area
    if min_area:
        try:
            query = query & MQ(area__gte=float(min_area))
        except ValueError:
            pass
    if max_area:
        try:
            query = query & MQ(area__lte=float(max_area))
        except ValueError:
            pass
    new_only = request.GET.get('new_only')
    if new_only == 'true':
        query = query & MQ(is_new_construction=True)

    # Fetch data from DB
    props = PropertyListing.objects(query).order_by('-id')  # newest first

    # Serialize data
    serializer = PropertyListingSerializer(props, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


from mongoengine.queryset.visitor import Q as MQ
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import PropertyListing

@api_view(['GET'])
def new_construction_properties(request):
    """
    GET /api/users/new_construction/?q=&location=&min_price=&max_price=
    Returns only properties with is_new_construction=True
    """
    query = MQ(is_new_construction=True)

    q = request.GET.get('q', '').strip()
    location = request.GET.get('location', '').strip()
    min_price = request.GET.get('min_price')
    max_price = request.GET.get('max_price')

    # Filter by search query
    if q:
        query = query & (MQ(title__icontains=q) | MQ(location__icontains=q))

    # Filter by location (optional)
    if location:
        query = query & MQ(location__icontains=location)

    # Filter by price range (optional)
    if min_price:
        try:
            query = query & MQ(price__gte=float(min_price))
        except ValueError:
            pass
    if max_price:
        try:
            query = query & MQ(price__lte=float(max_price))
        except ValueError:
            pass

    props = PropertyListing.objects(query).order_by('-id')
    data = []
    for prop in props:
        data.append({
            '_id': str(prop.id),
            'title': prop.title,
            'location': prop.location,
            'price': prop.price,
            'bhk': prop.bhk,
            'area': prop.area,
            'image_url': prop.image_url,
            'description': getattr(prop, 'description', ''),
            'is_new_construction': getattr(prop, 'is_new_construction', False)
        })

    return Response(data, status=status.HTTP_200_OK)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import RentalProperty, UserRentalListing, CustomUser
from .python.serializers_rent import RentPropertySerializer

# Get all rental listings
@api_view(['GET'])
def rent_listings(request):
    min_bhk = request.GET.get('min_bhk', None)
    max_bhk = request.GET.get('max_bhk', None)
    location_query = request.GET.get('location', None)

    listings = RentalProperty.objects

    if min_bhk is not None:
        listings = listings.filter(bhk__gte=int(min_bhk))
    if max_bhk is not None:
        listings = listings.filter(bhk__lte=int(max_bhk))
    if location_query:
        query_lower = location_query.strip().lower()
        listings = [prop for prop in listings if query_lower in prop.location.lower()]

    serializer = RentPropertySerializer(listings, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Get single rental property details
@api_view(['GET'])
def rent_property_detail(request, pk):
    from bson import ObjectId
    if not ObjectId.is_valid(pk):
        return Response({'error': 'Invalid property ID'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        prop = RentalProperty.objects.get(pk=pk)
    except RentalProperty.DoesNotExist:
        return Response({'error': 'Property not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = RentPropertySerializer(prop)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Get user's rental listings
@api_view(['GET'])
def get_my_rental_listings(request):
    email = request.query_params.get("email")
    if not email:
        return Response({"error": "Email required"}, status=400)

    user = CustomUser.objects(email=email).first()
    if not user:
        return Response({"error": "User not found"}, status=404)

    user_rentals = UserRentalListing.objects(user=user)
    data = []
    for ur in user_rentals:
        rental = ur.rental_property
        data.append({
            "listing_id": str(ur.id),
            "title": rental.title,
            "location": rental.location,
            "rent_price": rental.rent_price,
            "bhk": rental.bhk,
            "area": rental.area,
            "image_url": rental.image_url,
            "payment_status": ur.payment_status
        })
    return Response(data, status=200)

# Add a rental to user's listings
@api_view(['POST'])
def add_to_rental_listings(request):
    email = request.data.get("email")
    rental_id = request.data.get("rental_id")

    user = CustomUser.objects(email=email).first()
    if not user:
        return Response({"error": "User not found"}, status=404)

    rental = RentalProperty.objects(id=rental_id).first()
    if not rental:
        return Response({"error": "Rental not found"}, status=404)

    existing = UserRentalListing.objects(user=user, rental_property=rental).first()
    if existing:
        return Response({"error": "Already added"}, status=400)

    UserRentalListing.objects.create(user=user, rental_property=rental)
    return Response({"message": "Rental added"}, status=201)

# Remove rental from user's listings
@api_view(['DELETE'])
def remove_from_rental_listings(request, listing_id):
    email = request.query_params.get("email")
    user = CustomUser.objects(email=email).first()
    if not user:
        return Response({"error": "User not found"}, status=404)

    listing = UserRentalListing.objects(id=listing_id, user=user).first()
    if not listing:
        return Response({"error": "Listing not found"}, status=404)

    listing.delete()
    return Response({"message": "Rental removed"}, status=200)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import RentalProperty

@api_view(['POST'])
def add_rental_listing(request):
    try:
        rental = RentalProperty(
            title=request.data.get("title"),
            location=request.data.get("location"),
            rent_price=request.data.get("rent_price"),
            bhk=request.data.get("bhk"),
            area=request.data.get("area"),
            image_url=request.data.get("image_url"),
            is_new_construction=request.data.get("is_new_construction", False)
        )
        rental.save()

        return Response(
            {"message": "Rental listing added successfully", "id": str(rental.id)},
            status=status.HTTP_201_CREATED
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
def confirm_rental_payment(request, listing_id):
    user_rental = UserRentalListing.objects(id=listing_id).first()
    if not user_rental:
        return Response({"error": "Listing not found"}, status=404)
    
    user_rental.payment_status = "paid"
    user_rental.save()
    
    return Response({"message": "Rental payment confirmed"}, status=200)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import PropertyListing, CustomUser

@api_view(['POST'])
def add_property(request):
    user_data = request.data.get('user')  # You need to send user info
    if not user_data or user_data.get('role') != 'seller':
        return Response({"error": "Only sellers can add properties"}, status=status.HTTP_403_FORBIDDEN)

    data = request.data
    try:
        prop = PropertyListing(
            title=data.get("title"),
            location=data.get("location"),
            price=float(data.get("price")),
            bhk=int(data.get("bhk")),
            area=float(data.get("area")),
            image_url=data.get("image_url"),
            is_new_construction=bool(data.get("is_new_construction", False))
        )
        prop.save()  #  Important: save to DB
        return Response({"success": True, "id": str(prop.id)}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Agent
from .python.serializers_agent import AgentSerializer

# GET all agents
@api_view(['GET'])
def find_agents(request):
    agents = Agent.objects.all()
    serializer = AgentSerializer(agents, many=True)
    return Response(serializer.data)

# POST new agent
@api_view(['POST'])
def join_agent(request):
    serializer = AgentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Agent registered successfully!"}, status=201)
    print("Serializer errors:", serializer.errors)  # <--- ADD THIS
    return Response(serializer.errors, status=400)


# GET single agent details
@api_view(['GET'])
def agent_detail(request, agent_id):
    try:
        agent = Agent.objects.get(id=agent_id)
    except Agent.DoesNotExist:
        return Response({"error": "Agent not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = AgentSerializer(agent)
    return Response(serializer.data)

# views.py
# users/views.py
from .models import ContactMessage, Agent
from .python.serializers_contact import ContactMessageSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def contact_agent(request, agent_id):
    name = request.data.get("name")
    email = request.data.get("email")
    message = request.data.get("message")

    if not name or not email or not message:
        return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

    agent = Agent.objects(id=agent_id).first()
    if not agent:
        return Response({"error": "Agent not found"}, status=status.HTTP_404_NOT_FOUND)

    contact = ContactMessage(agent=agent, name=name, email=email, message=message)
    contact.save()

    return Response({"success": True}, status=status.HTTP_200_OK)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import PropertyListing

@api_view(['GET'])
def listings_by_location(request):
    location = request.query_params.get('location')
    
    if not location:
        return Response({"error": "Location query is required"}, status=400)

    # Case-insensitive partial match
    properties = PropertyListing.objects(location__icontains=location)

    data = [
        {
            "_id": str(p.pk),
            "title": p.title,
            "location": p.location,
            "price": p.price,
            "bhk": p.bhk,
            "area": p.area,
            "image_url": p.image_url,
            "is_new_construction": p.is_new_construction,
        }
        for p in properties
    ]
    return Response(data)


# users/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from .models import CustomUser, PropertyListing, UserListing


#  1. Get all listings for a user
@api_view(['GET'])
def my_listings(request):
    email = request.query_params.get('email')
    if not email:
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

    user = CustomUser.objects(email=email).first()
    if not user:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    listings = UserListing.objects(user=user)
    data = [
        {
            "listing_id": str(l.id),
            "property_id": str(l.property.id),
            "title": l.property.title,
            "location": l.property.location,
            "price": l.property.price,
            "bhk": l.property.bhk,
            "area": l.property.area,
            "image_url": l.property.image_url,
        }
        for l in listings
    ]
    return Response(data, status=status.HTTP_200_OK)


#  2. Add property to user's listings
@api_view(['POST'])
def add_to_listings(request):
    email = request.data.get('email')
    property_id = request.data.get('property_id')

    if not email or not property_id:
        return Response({"error": "Email and property_id are required"}, status=status.HTTP_400_BAD_REQUEST)

    user = CustomUser.objects(email=email).first()
    if not user:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    property_obj = PropertyListing.objects(id=property_id).first()
    if not property_obj:
        return Response({"error": "Property not found"}, status=status.HTTP_404_NOT_FOUND)

    # prevent duplicate
    existing = UserListing.objects(user=user, property=property_obj).first()
    if existing:
        return Response({"error": "Already in listings"}, status=status.HTTP_400_BAD_REQUEST)

    UserListing.objects.create(user=user, property=property_obj, payment_status='UnPaid')
    return Response({"message": "Property added to listings"}, status=status.HTTP_201_CREATED)


#  3. Remove property from user's listings
@api_view(['DELETE'])
def remove_from_my_listings(request, listing_id):
    # Try query param first, then body
    email = request.query_params.get("email") or request.data.get("email")
    if not email:
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

    user = CustomUser.objects(email=email).first()
    if not user:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    listing = UserListing.objects(id=listing_id, user=user).first()
    if not listing:
        return Response({"error": "Listing not found"}, status=status.HTTP_404_NOT_FOUND)

    listing.delete()
    return Response({"message": "Removed from listings"}, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_my_listings(request):
    email = request.query_params.get('email')
    if not email:
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

    user = CustomUser.objects(email=email).first()
    if not user:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    user_listings = UserListing.objects(user=user)

    data = []
    for listing in user_listings:
        property_obj = listing.property
        data.append({
            "_id": str(property_obj.id),
            "listing_id": str(listing.id),
            "title": property_obj.title,
            "location": property_obj.location,
            "price": property_obj.price,
            "bhk": property_obj.bhk,
            "area": property_obj.area,
            "image_url": property_obj.image_url,
            "payment_status": listing.payment_status,   # include status
        })

    return Response(data, status=status.HTTP_200_OK)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import UserListing

@api_view(['POST'])
def confirm_payment(request, listing_id):
    try:
        listing = UserListing.objects(id=listing_id).first()
        if not listing:
            return Response({"error": "Listing not found"}, status=status.HTTP_404_NOT_FOUND)

        # update payment status
        listing.payment_status = "paid"
        listing.save()

        return Response({"message": "Payment confirmed ✅", "payment_status": "paid"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
