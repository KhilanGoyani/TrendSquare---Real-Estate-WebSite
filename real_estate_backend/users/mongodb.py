# users/mongodb.py
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["real_estate"]
users_collection = db["users"]
