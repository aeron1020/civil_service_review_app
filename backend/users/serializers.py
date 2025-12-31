# # users/serializers.py
# from rest_framework import serializers
# from django.contrib.auth.models import User
# from django.core.exceptions import ValidationError as DjangoValidationError
# from django.contrib.auth.password_validation import validate_password
# from .models import Profile

# class RegisterSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True, min_length=8)

#     class Meta:
#         model = User
#         fields = ['username', 'password', 'email']
#         extra_kwargs = {'email': {'required': False}}

#     def validate_username(self, value):
#         if User.objects.filter(username=value).exists():
#             raise serializers.ValidationError("That username is already taken.")
#         if len(value) < 3:
#             raise serializers.ValidationError("Username must be at least 3 characters long.")
#         if " " in value:
#             raise serializers.ValidationError("Username cannot contain spaces.")
#         return value

#     def validate_password(self, value):
#         try:
#             validate_password(value)
#         except DjangoValidationError as e:
#             raise serializers.ValidationError(list(e.messages))

#         import re
#         if not re.search(r"[A-Z]", value):
#             raise serializers.ValidationError("Password must contain at least one uppercase letter (A-Z).")
#         if not re.search(r"[a-z]", value):
#             raise serializers.ValidationError("Password must contain at least one lowercase letter (a-z).")
#         if not re.search(r"[0-9]", value):
#             raise serializers.ValidationError("Password must contain at least one number (0-9).")
#         if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
#             raise serializers.ValidationError("Password must include at least one special character (@, #, %, etc.).")
#         if re.search(r"(password|1234|abcd|qwerty|letmein)", value, re.IGNORECASE):
#             raise serializers.ValidationError("Password is too common. Please choose something more unique.")
#         return value

#     def create(self, validated_data):
#         email = validated_data.get('email', '') or ''
#         user = User.objects.create_user(
#             username=validated_data['username'],
#             password=validated_data['password'],
#             email=email
#         )
#         return user

# class UserSerializer(serializers.ModelSerializer):
#     is_premium = serializers.SerializerMethodField()

#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'is_premium']

#     def get_is_premium(self, obj):
#         profile, _ = Profile.objects.get_or_create(user=obj)
#         return profile.check_premium_status()
    

from rest_framework import serializers
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth.password_validation import validate_password
from .models import Profile

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        # Added first_name and last_name to fields
        fields = ['username', 'password', 'email', 'first_name', 'last_name']
        extra_kwargs = {
            'email': {'required': False},
            'first_name': {'required': False},
            'last_name': {'required': False}
        }

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("That username is already taken.")
        if len(value) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters long.")
        if " " in value:
            raise serializers.ValidationError("Username cannot contain spaces.")
        return value

    def validate_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(list(e.messages))

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
        # Extract name fields with defaults
        email = validated_data.get('email', '') or ''
        first_name = validated_data.get('first_name', '')
        last_name = validated_data.get('last_name', '')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=email,
            first_name=first_name,
            last_name=last_name
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    is_premium = serializers.SerializerMethodField()
    # Adding full name field for convenience
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        # Added name fields to the returned user object
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name', 'is_premium', 'date_joined']

    def get_is_premium(self, obj):
        profile, _ = Profile.objects.get_or_create(user=obj)
        return profile.check_premium_status()

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username
    

class UserUpdateSerializer(serializers.ModelSerializer):
    # Allow password to be optional (user might only want to change name)
    password = serializers.CharField(write_only=True, required=False, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password']

    def validate_password(self, value):
        if value:
            # Re-use the validation logic from RegisterSerializer
            # or move the logic to a helper function to keep it DRY
            try:
                validate_password(value)
            except DjangoValidationError as e:
                raise serializers.ValidationError(list(e.messages))
            # ... (Add the same regex checks from your RegisterSerializer here)
        return value

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance