# from django.contrib import admin
# from .models import Quiz, Passage, Question, Choice, QuizResult, DataSet



# class ChoiceInline(admin.TabularInline):
#     model = Choice
#     extra = 0


# class QuestionInline(admin.TabularInline):
#     model = Question
#     extra = 1
#     show_change_link = True


# class PassageInline(admin.TabularInline):
#     model = Passage
#     extra = 1
#     show_change_link = True


# @admin.register(Quiz)
# class QuizAdmin(admin.ModelAdmin):
#     list_display = ('title', 'quiz_type', 'time_limit', 'description', "is_random")
#     list_filter = ('quiz_type', 'is_random')
#     search_fields = ('title', 'description')
#     inlines = [PassageInline]


# @admin.register(Passage)
# class PassageAdmin(admin.ModelAdmin):
#     list_display = ('title', 'quiz')
#     inlines = [QuestionInline]


# @admin.register(Question)
# class QuestionAdmin(admin.ModelAdmin):
#     list_display = ('text', 'quiz', 'passage', 'question_type')
#     inlines = [ChoiceInline]


# @admin.register(Choice)
# class ChoiceAdmin(admin.ModelAdmin):
#     list_display = ('text', 'question', 'is_correct')


# @admin.register(QuizResult)
# class QuizResultAdmin(admin.ModelAdmin):
#     list_display = ('quiz', 'score', 'correct', 'total', 'submitted_at')
#     list_filter = ('quiz', 'submitted_at')

# @admin.register(DataSet)
# class DataSetAdmin(admin.ModelAdmin):
#     list_display = ('title', 'quiz')

from django.contrib import admin
from django.db.models import Count
from django.utils.html import format_html
from .models import Quiz, Passage, Question, Choice, QuizResult, DataSet, ReviewerMaterial

# 1. Tighter, more functional Inlines
class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 1
    fields = ('text', 'is_correct')

class QuestionInline(admin.StackedInline): # Stacked gives more room for text
    model = Question
    extra = 0
    classes = ['collapse'] # Keeps the quiz page clean
    show_change_link = True

# 2. Advanced Question Admin
@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('truncated_text', 'quiz_link', 'passage', 'choice_count', 'question_type')
    list_filter = ('quiz', 'question_type', 'passage')
    search_fields = ('text',)
    autocomplete_fields = ['quiz', 'passage'] # Much faster for large datasets
    inlines = [ChoiceInline]
    actions = ['mark_duplicates']

    def truncated_text(self, obj):
        return obj.text[:80] + "..." if len(obj.text) > 80 else obj.text
    truncated_text.short_description = "Question Text"

    def quiz_link(self, obj):
        if obj.quiz:
            return format_html('<a href="/admin/your_app/quiz/{}/change/">{}</a>', obj.quiz.id, obj.quiz.title)
        return "-"
    quiz_link.short_description = "Quiz"

    def choice_count(self, obj):
        return obj.choices.count()
    choice_count.short_description = "Choices"

    # Action to find duplicates based on text
    @admin.action(description="Highlight duplicate questions (Experimental)")
    def mark_duplicates(self, request, queryset):
        duplicates = Question.objects.values('text').annotate(name_count=Count('text')).filter(name_count__gt=1)
        duplicate_texts = [item['text'] for item in duplicates]
        
        # We can't easily "color" them in a message, so we filter the view
        self.message_user(request, f"Found {len(duplicate_texts)} question texts that have duplicates.")

# 3. Enhanced Quiz Admin
@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'quiz_type', 'is_random', 'stat_summary')
    list_filter = ('quiz_type', 'is_random', 'created_at') if hasattr(Quiz, 'created_at') else ('quiz_type', 'is_random')
    search_fields = ('title',)
    ordering = ('-id',)
    # Use autocomplete_fields in other admins by defining search_fields here
    search_fields = ('title',) 

    fieldsets = (
        ("Core Information", {
            'fields': ('title', 'description', 'quiz_type')
        }),
        ("Settings", {
            'fields': (('time_limit', 'is_random'),),
            'classes': ('wide',)
        }),
    )

    def stat_summary(self, obj):
        q_count = obj.questions.count()
        p_count = obj.passages.count()
        return format_html("<b>{}</b> Qs | <b>{}</b> Passages", q_count, p_count)
    stat_summary.short_description = "Stats"

# 4. Organizing the rest
@admin.register(Passage)
class PassageAdmin(admin.ModelAdmin):
    list_display = ('title', 'quiz')
    search_fields = ('title', 'text')
    autocomplete_fields = ['quiz']
    inlines = [QuestionInline]

@admin.register(DataSet)
class DataSetAdmin(admin.ModelAdmin):
    list_display = ('title', 'quiz')
    autocomplete_fields = ['quiz']

@admin.register(QuizResult)
class QuizResultAdmin(admin.ModelAdmin):
    list_display = ('user', 'quiz', 'score_progress', 'submitted_at')
    list_filter = ('quiz', 'submitted_at')
    readonly_fields = ('submitted_at',)

    def score_progress(self, obj):
        color = "green" if obj.score >= 75 else "orange" if obj.score >= 50 else "red"
        return format_html(
            '<span style="color: {}; font-weight:bold;">{}% ({} / {})</span>',
            color, obj.score, obj.correct, obj.total
        )
    score_progress.short_description = "Result"


@admin.register(ReviewerMaterial)
class ReviewerMaterialAdmin(admin.ModelAdmin):
    list_display = ('title', 'uploaded_at', 'is_active')