from mongoengine import connect, Document, StringField, FloatField, IntField, URLField
import random

connect(db='real_estate_db', host='localhost', port=27017)

class PropertyListing(Document):
    title = StringField(required=True, max_length=255)
    location = StringField(required=True, max_length=255)
    price = FloatField(required=True)
    bhk = IntField(required=True)
    area = FloatField(required=True)
    image_url = URLField(required=True)

# 20 distinct house images (Unsplash public domain style)
image_urls = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1472220625704-91e1462799b2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80",
]



# Expanded cities list: (city, bhk_range, price_range INR, area_range sqft)
cities = [
    ("Mumbai", (1, 5), (10000000, 40000000), (800, 4000)),
    ("Delhi", (1, 4), (6000000, 30000000), (700, 3500)),
    ("Bangalore", (1, 5), (7000000, 25000000), (900, 3000)),
    ("Chennai", (1, 4), (5000000, 20000000), (700, 2800)),
    ("Hyderabad", (1, 4), (4500000, 15000000), (750, 2700)),
    ("Pune", (1, 4), (4000000, 18000000), (700, 3200)),
    ("Ahmedabad", (1, 3), (3000000, 10000000), (600, 2500)),
    ("Surat", (1, 3), (2500000, 9000000), (550, 2400)),
    ("Jaipur", (1, 3), (3000000, 8500000), (600, 2300)),
    ("Lucknow", (1, 3), (2000000, 7000000), (500, 2100)),
    ("Kanpur", (1, 3), (1800000, 6500000), (500, 2000)),
    ("Nagpur", (1, 3), (1500000, 6000000), (450, 1900)),
    ("Indore", (1, 3), (1700000, 7000000), (500, 2100)),
    ("Thane", (1, 4), (3500000, 12000000), (700, 2800)),
    ("Bhopal", (1, 3), (1600000, 6500000), (450, 2000)),
    ("Visakhapatnam", (1, 3), (1700000, 7000000), (480, 2200)),
    ("Pimpri-Chinchwad", (1, 4), (3000000, 10000000), (650, 2700)),
    ("Patna", (1, 3), (1400000, 6000000), (400, 1800)),
    ("Vadodara", (1, 3), (2500000, 9000000), (600, 2400)),
    ("Ghaziabad", (1, 3), (2000000, 7000000), (500, 2100)),
    ("Ludhiana", (1, 3), (1800000, 6500000), (500, 2000)),
    ("Agra", (1, 3), (1200000, 5500000), (400, 1800)),
    ("Nashik", (1, 3), (1800000, 7000000), (480, 2100)),
    ("Faridabad", (1, 3), (1500000, 6000000), (450, 1900)),
    ("Meerut", (1, 3), (1200000, 5500000), (400, 1800)),
]

listings = []

for i in range(120):
    city, bhk_range, price_range, area_range = random.choice(cities)
    bhk = random.randint(*bhk_range)
    price = round(random.uniform(*price_range), 2)
    area = round(random.uniform(*area_range), 2)
    title = f"{bhk} BHK Apartment in {city}"
    image_url = random.choice(image_urls)

    listing = PropertyListing(
        title=title,
        location=city,
        price=price,
        bhk=bhk,
        area=area,
        image_url=image_url
    )
    listings.append(listing)

for listing in listings:
    listing.save()

print(f"Inserted {len(listings)} listings into the database.")
