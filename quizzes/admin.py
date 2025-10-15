from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Category, Question, Choice

class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 2  # how many blank choices appear by default


class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question_text', 'category', 'difficulty')
    inlines = [ChoiceInline]


admin.site.register(Category)
admin.site.register(Question, QuestionAdmin)
