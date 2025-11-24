
# users/models.py
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

class Profile(models.Model):
    AUTH_CHOICES = [
        ("local", "Local"),
        ("google", "Google"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_premium = models.BooleanField(default=False)
    premium_until = models.DateTimeField(null=True, blank=True)

    # New fields for Google login
    auth_provider = models.CharField(max_length=20, choices=AUTH_CHOICES, default="local")
    google_id = models.CharField(max_length=255, blank=True, null=True)

    def activate_premium(self, days=30):
        now = timezone.now()
        if self.premium_until and self.premium_until > now:
            self.premium_until += timedelta(days=days)
        else:
            self.premium_until = now + timedelta(days=days)
        self.is_premium = True
        self.save()

    def check_premium_status(self):
        if self.premium_until and self.premium_until < timezone.now():
            self.is_premium = False
            self.save()
        return self.is_premium

    def __str__(self):
        return f"{self.user.username} Profile"
