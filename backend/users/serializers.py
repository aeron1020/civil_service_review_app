from rest_framework import serializers
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth.password_validation import validate_password
from .models import Profile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'password']

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("That username is already taken.")
        if len(value) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters long.")
        if " " in value:
            raise serializers.ValidationError("Username cannot contain spaces.")
        return value

    def validate_password(self, value):
        """
        Use Django's built-in password validators + custom ones.
        """
        try:
            # Django built-in checks (length, complexity, etc.)
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(list(e.messages))

        # Custom checks (can adjust to your rules)
        import re
        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter (A-Z).")
        if not re.search(r"[a-z]", value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter (a-z).")
        if not re.search(r"[0-9]", value):
            raise serializers.ValidationError("Password must contain at least one number (0-9).")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise serializers.ValidationError("Password must include at least one special character (@, #, %, etc.).")
        if re.search(r"(password|1234|abcd|qwerty|letmein)", value, re.IGNORECASE):
            raise serializers.ValidationError("Password is too common. Please choose something more unique.")

        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    is_premium = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_premium']

    def get_is_premium(self, obj):
        profile = Profile.objects.get(user=obj)
        return profile.check_premium_status()