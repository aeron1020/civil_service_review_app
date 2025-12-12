# views_google.py

from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from .models import Profile
import logging

logger = logging.getLogger(__name__)

class GoogleLoginView(APIView):
    permission_classes = []  # Allow any

    def post(self, request):
        try:
            token = request.data.get("credential") or request.data.get("id_token")
            if not token:
                return Response({"error": "Missing Google ID token."}, status=400)

            # Verify Google token
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request())

            if idinfo.get("aud") != settings.GOOGLE_CLIENT_ID:
                return Response({"error": "Invalid Google client ID."}, status=400)

            email = idinfo.get("email")
            google_id = idinfo.get("sub")
            username = email.split("@")[0] if email else None

            if not email or not google_id:
                return Response({"error": "Invalid Google token: missing email or ID."}, status=400)

            # Check if user exists
            user, created = User.objects.get_or_create(
                email=email,
                defaults={"username": username},
            )

            # Add auth_provider and google_id dynamically
            if created:
                user.set_unusable_password()
                user.save()
                Profile.objects.get_or_create(user=user)
                user.profile.auth_provider = "google"
                user.profile.google_id = google_id
                user.profile.save()
            else:
                profile, _ = Profile.objects.get_or_create(user=user)
                # Prevent conflict with local accounts
                if getattr(profile, "auth_provider", "local") != "google":
                    return Response(
                        {"error": "Email already registered using local login."},
                        status=400
                    )
                profile.auth_provider = "google"
                profile.google_id = google_id
                profile.save()

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)

            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "auth_provider": "google",
                }
            })

        except ValueError as e:
            # Invalid token
            logger.exception("Google login failed")
            return Response({"error": "Invalid Google token."}, status=401)
        except Exception as e:
            logger.exception("Unexpected error during Google login")
            return Response({"error": str(e)}, status=500)
