# blog/views.py
import requests
from django.http import HttpResponse, HttpResponseBadRequest

def image_proxy(request):
    image_url = request.GET.get("url")

    if not image_url:
        return HttpResponseBadRequest("Missing url parameter")

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        ),
        "Referer": "https://www.facebook.com/",
        "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    }

    try:
        resp = requests.get(image_url, headers=headers, timeout=10)
        resp.raise_for_status()
    except requests.RequestException as e:
        return HttpResponseBadRequest(f"Image fetch failed: {e}")

    content_type = resp.headers.get("Content-Type", "image/jpeg")

    return HttpResponse(resp.content, content_type=content_type)


