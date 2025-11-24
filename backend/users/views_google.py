# # users/views_google.py
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from django.conf import settings
# from .models import User, Profile
# from rest_framework_simplejwt.tokens import RefreshToken
# from google.oauth2 import id_token
# from google.auth.transport import requests as google_requests

# # class GoogleLoginView(APIView):
# #     permission_classes = []

# #     def post(self, request):
# #         token = request.data.get("credential") or request.data.get("id_token")
# #         if not token:
# #             return Response({"error": "Missing Google ID token."}, status=400)

# #         try:
# #             idinfo = id_token.verify_oauth2_token(token, google_requests.Request())
# #             if idinfo["aud"] != settings.GOOGLE_CLIENT_ID:
# #                 return Response({"error": "Invalid Google client ID."}, status=400)

# #         except Exception:
# #             return Response({"error": "Invalid Google token."}, status=401)

# #         email = idinfo.get("email")
# #         google_id = idinfo.get("sub")
# #         username = email.split("@")[0]

# #         user, created = User.objects.get_or_create(
# #             email=email,
# #             defaults={
# #                 "username": username,
# #                 "auth_provider": "google",
# #                 "google_id": google_id,
# #             }
# #         )

# #         if not created and user.auth_provider != "google":
# #             return Response({
# #                 "error": "User exists with same email using local login."
# #             }, status=400)

# #         if created:
# #             user.set_unusable_password()
# #             user.save()

# #         Profile.objects.get_or_create(user=user)
# #         refresh = RefreshToken.for_user(user)

# #         return Response({
# #             "access": str(refresh.access_token),
# #             "refresh": str(refresh),
# #             "user": {
# #                 "id": user.id,
# #                 "username": user.username,
# #                 "email": user.email,
# #                 "auth_provider": user.auth_provider,
# #             }
# #         })

# class GoogleLoginView(APIView):
#     permission_classes = []

#     def post(self, request):
#         token = request.data.get("credential") or request.data.get("id_token")
#         if not token:
#             return Response({"error": "Missing Google ID token."}, status=400)

#         try:
#             idinfo = id_token.verify_oauth2_token(token, google_requests.Request())
#             if idinfo["aud"] != settings.GOOGLE_CLIENT_ID:
#                 return Response({"error": "Invalid Google client ID."}, status=400)
#         except Exception:
#             return Response({"error": "Invalid Google token."}, status=401)

#         email = idinfo.get("email")
#         google_id = idinfo.get("sub")

#         if not email:
#             return Response({"error": "Google account has no email."}, status=400)

#         # Ensure unique username
#         username_base = email.split("@")[0]
#         username = username_base
#         counter = 1
#         while User.objects.filter(username=username).exists():
#             username = f"{username_base}{counter}"
#             counter += 1

#         # Create or get user
#         try:
#             user, created = User.objects.get_or_create(
#                 email=email,
#                 defaults={"username": username}
#             )
#         except Exception as e:
#             return Response({"error": f"Could not create user: {str(e)}"}, status=500)

#         # Create Profile if not exists
#         profile, _ = Profile.objects.get_or_create(user=user)
#         profile.auth_provider = "google"  # add this field to Profile
#         profile.google_id = google_id       # add this field to Profile
#         profile.save()

#         # Set unusable password for new users
#         if created:
#             user.set_unusable_password()
#             user.save()

#         refresh = RefreshToken.for_user(user)
#         return Response({
#             "access": str(refresh.access_token),
#             "refresh": str(refresh),
#             "user": {
#                 "id": user.id,
#                 "username": user.username,
#                 "email": user.email,
#                 "auth_provider": profile.auth_provider,
#             }
#         })

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
