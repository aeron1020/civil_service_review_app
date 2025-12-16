from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # 1. Try to get token from header first (SimpleJWT default)
        header = self.get_header(request)
        if header is not None:
            raw_token = self.get_raw_token(header)
        else:
            # 2. Fallback to Cookie
            raw_token = request.COOKIES.get(settings.JWT_ACCESS_COOKIE_NAME)

        if not raw_token:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
            return self.get_user(validated_token), validated_token
        except Exception:
            return None # Fail silently so other auth classes can try