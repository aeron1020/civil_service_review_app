# views_google.py

import logging
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from .serializers import UserSerializer
from .views import set_jwt_cookies

logger = logging.getLogger(__name__)
User = get_user_model()

@method_decorator(csrf_exempt, name="dispatch")
class GoogleLoginView(APIView):
    permission_classes = []  # Allow any

    def post(self, request):
        try:
            token = request.data.get("credential") or request.data.get("id_token")
            if not token:
                return Response({"error": "Missing Google ID token."}, status=status.HTTP_400_BAD_REQUEST)

            # Verify Google token
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request())

            if idinfo.get("aud") != settings.GOOGLE_CLIENT_ID:
                return Response({"error": "Invalid Google client ID."}, status=status.HTTP_400_BAD_REQUEST)

            email = idinfo.get("email")
            google_id = idinfo.get("sub")
            username = email.split("@")[0] if email else None

            if not email or not google_id:
                return Response({"error": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)

            # Check if user exists
            user, created = User.objects.get_or_create(email=email, defaults={"username": username})
            if created:
                user.set_unusable_password()
                user.save()

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access = str(refresh.access_token)

            response = Response({"user": UserSerializer(user).data, "message": "Google login successful"}, status=status.HTTP_200_OK)
            set_jwt_cookies(response, access, str(refresh))
            return response

        except ValueError as e:
            # Invalid token
            logger.exception("Google login failed")
            return Response({"error": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            logger.exception("Unexpected error during Google login")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
