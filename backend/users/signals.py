# users/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Profile

@receiver(post_save, sender=User)
def create_or_update_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    else:
        # Ensure profile exists then save
        Profile.objects.get_or_create(user=instance)
        try:
            instance.profile.save()
        except Exception:
            # In rare races profile may not exist; using get_or_create above ensures it exists
            pass
