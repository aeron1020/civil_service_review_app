from datetime import timedelta
from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import RegisterSerializer, UserSerializer
from quizzes.models import QuizResult
from quizzes.serializers import QuizResultSerializer

User = get_user_model()

ACCESS_COOKIE = getattr(settings, "JWT_ACCESS_COOKIE_NAME", "access")
REFRESH_COOKIE = getattr(settings, "JWT_REFRESH_COOKIE_NAME", "refresh")
COOKIE_SAMESITE = getattr(settings, "JWT_COOKIE_SAMESITE", "Lax")
# ensure secure flag defaults to False in dev
COOKIE_SECURE = getattr(settings, "SECURE_COOKIE_FOR_JWT", False)

def set_jwt_cookies(response, access_token: str, refresh_token: str):
    response.set_cookie(
        ACCESS_COOKIE,
        access_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        path="/",
    )
    response.set_cookie(
        REFRESH_COOKIE,
        refresh_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        path="/",
    )

def unset_jwt_cookies(response):
    response.delete_cookie(ACCESS_COOKIE, path="/")
    response.delete_cookie(REFRESH_COOKIE, path="/")

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

@method_decorator(csrf_exempt, name="dispatch")
class CookieLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        if not user:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        token_serializer = TokenObtainPairSerializer(data={"username": username, "password": password})
        token_serializer.is_valid(raise_exception=True)
        tokens = token_serializer.validated_data
        access = tokens["access"]
        refresh = tokens["refresh"]

        resp = Response({"detail": "Login successful", "user": UserSerializer(user).data}, status=status.HTTP_200_OK)
        set_jwt_cookies(resp, access, refresh)
        return resp

@method_decorator(csrf_exempt, name="dispatch")
class CookieRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_cookie = request.COOKIES.get("refresh")
        if not refresh_cookie:
            return Response({"detail": "No refresh cookie"}, status=401)

        try:
            refresh = RefreshToken(refresh_cookie)
        except Exception:
            return Response({"detail": "Invalid refresh token"}, status=401)

        user_id = refresh.get("user_id")
        user = User.objects.filter(id=user_id).first()
        if not user:
            return Response({"detail": "User not found"}, status=401)

        new_refresh = RefreshToken.for_user(user)
        new_access = str(new_refresh.access_token)

        response = Response({"detail": "Refreshed"}, status=200)
        set_jwt_cookies(response, new_access, str(new_refresh))
        return response



@method_decorator(csrf_exempt, name="dispatch")
class CookieLogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_cookie = request.COOKIES.get(REFRESH_COOKIE)
        if refresh_cookie:
            try:
                RefreshToken(refresh_cookie).blacklist()
            except Exception:
                pass
        resp = Response({"detail": "Logged out"}, status=status.HTTP_200_OK)
        unset_jwt_cookies(resp)
        return resp

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = UserSerializer(user).data
        quiz_results = QuizResult.objects.filter(user=user).order_by('-submitted_at')
        quiz_data = QuizResultSerializer(quiz_results, many=True).data
        return Response({"user": user_data, "quiz_results": quiz_data})
    

from .models import Profile

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

