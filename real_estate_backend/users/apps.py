# # users/apps.py
# from django.apps import AppConfig
# from mongoengine import connect

# class UsersConfig(AppConfig):
#     default_auto_field = 'django.db.models.BigAutoField'
#     name = 'users'

#     def ready(self):
#         # Disconnect previous connections before connecting again
#         connect(
#             db="real_estate_db",
#             host="localhost",
#             port=27017,
#             alias='default'
#         )

# users/apps.py
from django.apps import AppConfig
from mongoengine import connect, disconnect

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'

    def ready(self):
        # Disconnect existing connections if any (optional but safer)
        disconnect(alias='default')
        
        # Connect to MongoDB
        connect(
            db="real_estate_db",
            host="localhost",
            port=27017,
            alias='default'
        )
