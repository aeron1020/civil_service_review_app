import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "635060906660-2vnkcrum87ealqjjgpg7bqlspaiggnnk.apps.googleusercontent.com")

BASE_DIR = Path(__file__).resolve().parent.parent

# --- PRODUCTION SECURITY ---
SECRET_KEY = os.getenv("SECRET_KEY")
DEBUG = False 
# Split the string from .env into a list
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "").split(",")

# --- APPS ---
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',   

    # Third-party apps
    'rest_framework',
    'api',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
    'corsheaders',
    'rest_framework_simplejwt.token_blacklist',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',

    # Local apps
    'users.apps.UsersConfig',
    'quizzes',
    'results',
    'blog',
]

SITE_ID = 1

# --- MIDDLEWARE ---
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', 
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

ROOT_URLCONF = 'backend.urls'

# --- DATABASE (PostgreSQL) ---
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv("DATABASE_NAME"),
        'USER': os.getenv("DATABASE_USER"),
        'PASSWORD': os.getenv("DATABASE_PASSWORD"),
        'HOST': os.getenv("DATABASE_HOST"),
        'PORT': os.getenv("DATABASE_PORT"),
    }
}

# --- CORS & CSRF ---
FRONTEND_URL = os.getenv("FRONTEND_URL")
# --- CORS & CSRF ---
# We use a list here to allow multiple frontend addresses
CORS_ALLOWED_ORIGINS = [
    "https://freecsereview.online",
    "https://freecserev-git-main-olsenaerons-projects.vercel.app",
]

CSRF_TRUSTED_ORIGINS = [
    "https://freecsereview.online",
    "https://www.freecsereview.online",
    "https://api.freecsereview.online",

]

# Allow any Vercel preview URL from your account
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://freecserev-.*\.vercel\.app$",
    
]

# Standard production settings for cookies
CORS_ALLOW_CREDENTIALS = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# Match session to the 7-day refresh token
SESSION_COOKIE_AGE = 604800 # 7 days
CSRF_COOKIE_AGE = 604800    # 7 days
SESSION_EXPIRE_AT_BROWSER_CLOSE = False

# --- SECURITY HANDSHAKE ---
# Add this so Django trusts the HTTPS headers coming from NGINX
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# This allows the cookie to be shared across subdomains
CSRF_COOKIE_DOMAIN = ".freecsereview.online"
SESSION_COOKIE_DOMAIN = ".freecsereview.online"

SESSION_COOKIE_SAMESITE = 'None'
CSRF_COOKIE_SAMESITE = 'None'


# --- JWT COOKIE SECURITY (Production Settings) ---
# JWT_ACCESS_COOKIE_NAME = "access"
# JWT_REFRESH_COOKIE_NAME = "refresh"
# JWT_COOKIE_SAMESITE = "None"
# SECURE_COOKIE_FOR_JWT = True  # Required for HTTPS

# --- SIMPLE JWT CONFIG ---
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_COOKIE": "access",
    "AUTH_COOKIE_REFRESH": "refresh",
    "AUTH_COOKIE_SECURE": True, 
    "AUTH_COOKIE_HTTP_ONLY": True,
    "AUTH_COOKIE_SAMESITE": "None",
    # "AUTH_COOKIE_MAX_AGE": 604800, # 7 days in seconds
}

# --- STATIC & MEDIA ---
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles') # Where collectstatic will put files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# --- REST FRAMEWORK ---
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.AllowAny'],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_AUTHENTICATION_CLASSES': (
        "users.authentication.CookieJWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ),
}

# --- AUTHENTICATION & ALLAUTH ---
AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
]
ACCOUNT_LOGIN_METHODS = {"username"}
ACCOUNT_SIGNUP_FIELDS = {
    "email": {"required": True},
    "username": {"required": True},
    "password1": {"required": True},
    "password2": {"required": True},
}
ACCOUNT_AUTHENTICATION_METHOD = "username"
ACCOUNT_USERNAME_REQUIRED = True
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = "none"
SOCIALACCOUNT_QUERY_EMAIL = True
# SOCIALACCOUNT_PROVIDERS = {
#     "google": {
#         "SCOPE": ["profile", "email"],
#         "AUTH_PARAMS": {"access_type": "online"},
#     }
# }

SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "APPS": [
            {
                "client_id": os.getenv("GOOGLE_CLIENT_ID"), 
                "secret": os.getenv("GOOGLE_CLIENT_SECRET"),
                "key": ""
            },
        ],
        "SCOPE": ["profile", "email"],
        "AUTH_PARAMS": {"access_type": "online"},
        "OAUTH_PKCE_ENABLED": True,
    }
}

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'