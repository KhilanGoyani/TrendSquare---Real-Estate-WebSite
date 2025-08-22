from django.urls import path
from .views import (
    register_user, send_otp, verify_otp, listings, property_detail,
    predict_price, homes_for_sale, new_construction_properties,
    rent_listings, rent_property_detail, get_my_rental_listings,
    add_to_rental_listings, remove_from_rental_listings, add_rental_listing, confirm_rental_payment, 
    add_property, find_agents, join_agent, agent_detail, contact_agent,
    add_to_listings, remove_from_my_listings, listings_by_location, get_my_listings, confirm_payment
)

urlpatterns = [
    # User Auth
    path('register/', register_user),
    path('send-otp/', send_otp),
    path('verify-otp/', verify_otp),

    # Property listings
    path('listings/', listings),
    path('properties/<str:id>/', property_detail),
    path('predict_price/', predict_price, name="predict_price"),
    path('homes_for_sale/', homes_for_sale, name='homes_for_sale'),
    path('new_construction/', new_construction_properties, name="new_construction"),

    # Rental properties
    path('rent_listings/', rent_listings, name='rent_listings'),
    path('rent_listings/<str:pk>/', rent_property_detail, name='rent_property_detail'),
    path('my-rental-listings/', get_my_rental_listings, name="get_my_rental_listings"),
    path('my-rental-listings/add/', add_to_rental_listings, name="add_to_rental_listings"),
    path('my-rental-listings/remove/<str:listing_id>/', remove_from_rental_listings, name="remove_from_rental_listings"),
    path('add-rental-listing/', add_rental_listing, name="add_rental_listing"),
    path("my-rental-listings/payment/<str:listing_id>/", confirm_rental_payment, name="confirm_rental_payment"),

    # Add new property
    path('add_property/', add_property, name='add_property'),

    # Agent-related
    path('agent-finder/find/', find_agents, name="find_agents"),
    path('agent-finder/join/', join_agent, name="join_agent"),
    path('agent-finder/<str:agent_id>/', agent_detail, name="agent_detail"),
    path('agent-finder/<str:agent_id>/contact/', contact_agent, name="contact_agent"),
    
    # User saved listings
    path('my-listings/add/', add_to_listings, name="add_to_my_listings"),
    path('my-listings/remove/<str:listing_id>/', remove_from_my_listings, name="remove_from_my_listings"),
    path('listings-by-location/', listings_by_location, name='listings-by-location'),
    path("my-listings/", get_my_listings, name="get_my_listings"),
    path("my-listings/payment/<str:listing_id>/", confirm_payment, name="confirm_payment"),
]
