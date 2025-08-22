import mongoengine

mongoengine.connect(
    db='real_estate_db',  # Change to your MongoDB database name
    host='mongodb://localhost:27017/real_estate_db'  # or your MongoDB URI
)
