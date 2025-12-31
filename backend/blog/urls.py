from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogPostViewSet
from .views_media import image_proxy

router = DefaultRouter()
router.register(r'posts', BlogPostViewSet, basename='blogpost')

urlpatterns = [
    path('', include(router.urls)),
    path("media/proxy/", image_proxy, name="image-proxy")
]