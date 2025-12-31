from django.contrib import admin
from .models import BlogPost

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    # What you see in the list view
    list_display = ('title', 'author', 'created_at')
    # Search bar functionality
    search_fields = ('title', 'content')
    # Automatically fills the slug as you type the title
    prepopulated_fields = {'slug': ('title',)}
    # Adds a date filter sidebar
    list_filter = ('created_at', 'author')