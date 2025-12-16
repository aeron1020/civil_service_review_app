# users/urls.py
from django.urls import path, include
from .views import (
    RegisterView,
    CookieLoginView,
    CookieRefreshView,
    CookieLogoutView,
    UserProfileView,
)
from .views_google import GoogleLoginView

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CookieLoginView.as_view(), name='cookie_login'),
    path('auth/refresh/', CookieRefreshView.as_view(), name='cookie_refresh'),
    path('auth/logout/', CookieLogoutView.as_view(), name='cookie_logout'),

    # Google OAuth
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),

    # Profile
    path('profile/', UserProfileView.as_view(), name='user_profile'),
]
