from django.contrib.auth import get_user_model
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
<<<<<<< HEAD
        fields = ("id", "username", "is_superuser", "is_staff", "email", "last_login")
=======
        fields = ("id", "username", "is_superuser", "is_staff")

    
>>>>>>> tentativa
