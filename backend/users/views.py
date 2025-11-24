# from rest_framework import generics, status
# from rest_framework.response import Response
# from django.contrib.auth.models import User
# from rest_framework.permissions import AllowAny
# from .serializers import RegisterSerializer, UserSerializer
# from rest_framework_simplejwt.views import TokenObtainPairView
# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.views import APIView
# from quizzes.models import QuizResult
# from quizzes.serializers import QuizResultSerializer



# # ✅ Registration View
# class RegisterView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     permission_classes = [AllowAny]
#     serializer_class = RegisterSerializer


# # ✅ Custom JWT Login (returns user info + tokens)
# class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
#     @classmethod
#     def get_token(cls, user):
#         token = super().get_token(user)
#         token['username'] = user.username
#         return token

#     def validate(self, attrs):
#         data = super().validate(attrs)
#         data['user'] = UserSerializer(self.user).data
#         return data


# class CustomTokenObtainPairView(TokenObtainPairView):
#     serializer_class = CustomTokenObtainPairSerializer


# class UserProfileView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user

#         # Serialize user info
#         user_data = UserSerializer(user).data

#         # Get user's quiz history (latest first)
#         quiz_results = QuizResult.objects.filter(user=user).order_by('-submitted_at')
#         quiz_data = QuizResultSerializer(quiz_results, many=True).data

#         # Combine into one response
#         return Response({
#             "user": user_data,
#             "quiz_results": quiz_data
#         })
    

# from .models import Profile

# class PremiumStatusView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         profile = Profile.objects.get(user=request.user)
#         return Response({
#             "is_premium": profile.check_premium_status(),
#             "premium_until": profile.premium_until
#         })


# class ActivatePremiumView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         profile = Profile.objects.get(user=request.user)
#         profile.activate_premium(days=30)  # 30-day subscription
#         return Response({
#             "message": "Premium activated!",
#             "is_premium": True,
#             "premium_until": profile.premium_until
#         })

# users/views.py
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.views import APIView
from .serializers import RegisterSerializer, UserSerializer
from .models import Profile
from quizzes.models import QuizResult
from quizzes.serializers import QuizResultSerializer
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = UserSerializer(user).data
        quiz_results = QuizResult.objects.filter(user=user).order_by('-submitted_at')
        quiz_data = QuizResultSerializer(quiz_results, many=True).data
        return Response({
            "user": user_data,
            "quiz_results": quiz_data
        })

class PremiumStatusView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        return Response({
            "is_premium": profile.check_premium_status(),
            "premium_until": profile.premium_until
        })

class ActivatePremiumView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        profile.activate_premium(days=30)
        return Response({
            "message": "Premium activated!",
            "is_premium": profile.is_premium,
            "premium_until": profile.premium_until
        })

