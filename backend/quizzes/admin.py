from django.contrib import admin
from .models import Quiz, Passage, Question, Choice
from .models import QuizResult


class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 4


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1
    show_change_link = True


class PassageInline(admin.TabularInline):
    model = Passage
    extra = 1
    show_change_link = True


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'quiz_type', 'time_limit', 'description')
    list_filter = ('quiz_type',)
    search_fields = ('title', 'description')
    inlines = [PassageInline]


@admin.register(Passage)
class PassageAdmin(admin.ModelAdmin):
    list_display = ('title', 'quiz')
    inlines = [QuestionInline]


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('text', 'quiz', 'passage', 'question_type')
    inlines = [ChoiceInline]


@admin.register(Choice)
class ChoiceAdmin(admin.ModelAdmin):
    list_display = ('text', 'question', 'is_correct')


@admin.register(QuizResult)
class QuizResultAdmin(admin.ModelAdmin):
    list_display = ('quiz', 'score', 'correct', 'total', 'submitted_at')
    list_filter = ('quiz', 'submitted_at')
