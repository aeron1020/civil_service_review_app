# users/urls.py
from django.urls import path, include
from .views import (
    RegisterView,
    CustomTokenObtainPairView,
    UserProfileView,
    ActivatePremiumView,
    PremiumStatusView
)
from .views_google import GoogleLoginView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Profile
    path('profile/', UserProfileView.as_view(), name='user_profile'),

    # Premium
    path('premium/status/', PremiumStatusView.as_view()),
    path('premium/activate/', ActivatePremiumView.as_view()),

    # Google OAuth
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),

    # DJ Rest Auth (optional)
    path("dj-rest-auth/", include("dj_rest_auth.urls")),
    path("dj-rest-auth/registration/", include("dj_rest_auth.registration.urls")),
]
