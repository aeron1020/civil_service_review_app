# from django.urls import path
# from .views import RegisterView, CustomTokenObtainPairView, UserProfileView, ActivatePremiumView, PremiumStatusView
# from rest_framework_simplejwt.views import TokenRefreshView

# urlpatterns = [
#     path('register/', RegisterView.as_view(), name='register'),
#     path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
#     path('profile/', UserProfileView.as_view(), name='user_profile'),

#     path("premium/status/", PremiumStatusView.as_view()),
#     path("premium/activate/", ActivatePremiumView.as_view()),
# ]

from django.urls import path
from .views import (
    RegisterView,
    CustomTokenObtainPairView,
    UserProfileView,
    PremiumStatusView,
    ActivatePremiumView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("profile/", UserProfileView.as_view(), name="profile"),

    # ⭐ PREMIUM ENDPOINTS
    path("premium/status/", PremiumStatusView.as_view(), name="premium-status"),
    path("premium/activate/", ActivatePremiumView.as_view(), name="premium-activate"),
]
