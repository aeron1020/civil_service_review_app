# import re
# from rest_framework import serializers
# from .models import BlogPost

# class BlogPostSerializer(serializers.ModelSerializer):
#     # We override the thumbnail field to add custom logic
#     thumbnail = serializers.SerializerMethodField()

#     class Meta:
#         model = BlogPost
#         fields = ['id', 'title', 'slug', 'author', 'content', 'thumbnail', 'created_at']

#     def get_thumbnail(self, obj):
#         # 1. Check if there is already an image in the thumbnail field
#         # Use .url if it's an ImageField, or just the string if it's a URLField
#         if obj.thumbnail:
#             try:
#                 return obj.thumbnail.url
#             except AttributeError:
#                 return str(obj.thumbnail)

#         # 2. If thumbnail is empty, search 'content' for the first image URL
#         content = obj.content
#         if not content:
#             return None

#         # This regex captures image URLs even with complex query parameters (like Facebook/Unsplash)
#         img_regex = r'(https?://[^\s"\'<>]+?\.(?:jpe?g|png|gif|webp|bmp)(?:\?[^\s"\'<>]*)?)'
#         match = re.search(img_regex, content, re.IGNORECASE)
        
#         if match:
#             return match.group(0)
            
#         return None

import re
from urllib.parse import quote
from rest_framework import serializers
from .models import BlogPost

class BlogPostSerializer(serializers.ModelSerializer):
    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            "id",
            "title",
            "slug",
            "author",
            "content",
            "thumbnail",
            "created_at",
        ]

    def get_thumbnail(self, obj):
        """
        Returns a proxied thumbnail URL.
        Priority:
        1. Explicit thumbnail field
        2. First image URL found in content
        """

        request = self.context.get("request")
        if not request:
            return None

        image_url = None

        # 1️⃣ Explicit thumbnail field
        if obj.thumbnail:
            try:
                image_url = obj.thumbnail.url  # for ImageField
            except AttributeError:
                image_url = str(obj.thumbnail)  # for URLField or string

        # 2️⃣ Fallback: extract first image from content
        if not image_url and obj.content:
            img_regex = (
                r"(https?://[^\s\"'<>]+?"
                r"\.(?:jpe?g|png|gif|webp|bmp)"
                r"(?:\?[^\s\"'<>]*)?)"
            )
            match = re.search(img_regex, obj.content, re.IGNORECASE)
            if match:
                image_url = match.group(0)

        if not image_url:
            return None

        # 3️⃣ Proxy + encode (CRITICAL)
        encoded_url = quote(image_url, safe="")
        base_url = f"{request.scheme}://{request.get_host()}"
        return f"{base_url}/api/blog/media/proxy/?url={encoded_url}"
