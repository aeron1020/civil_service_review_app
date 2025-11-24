# from django.contrib import admin
# from django.urls import path, include
# from django.conf import settings
# from django.conf.urls.static import static
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# urlpatterns = [

#     # Admin
#     path('admin/', admin.site.urls),

#     # App routes
#     path('api/quizzes/', include('quizzes.urls')),
#     path('api/results/', include('results.urls')),
#     path('api/users/', include('users.urls')),
#     path('api/', include('api.urls')),

#     # JWT
#     path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

#     # dj-rest-auth
#     path('dj-rest-auth/', include('dj_rest_auth.urls')),
#     path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),

#     # allauth routes (required for Google login)
#     path('accounts/', include('allauth.urls')),
# ]

# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/quizzes/', include('quizzes.urls')),
    path('api/', include('api.urls')),
    path('api/results/', include('results.urls')),
    path('api/users/', include('users.urls')),

    path('accounts/', include('allauth.urls')),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
