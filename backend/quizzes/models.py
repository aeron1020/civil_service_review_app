from django.db import models
from django.conf import settings
from django.contrib.auth.models import User 


class Quiz(models.Model):
    QUIZ_TYPES = [
        ('NUM', 'Numerical Ability'),
        ('VER', 'Verbal Ability'),
        ('ANA', 'Analytical Ability'),
        ('CLE', 'Clerical Ability'),
        ('GEN', 'General Information'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    quiz_type = models.CharField(max_length=3, choices=QUIZ_TYPES, default='GEN')
    time_limit = models.IntegerField(default=0, help_text="Time limit in minutes (0 = untimed)")

    def __str__(self):
        return f"{self.get_quiz_type_display()} - {self.title}"


class Passage(models.Model):
    quiz = models.ForeignKey(Quiz, related_name='passages', on_delete=models.CASCADE)
    title = models.CharField(max_length=255, blank=True)
    text = models.TextField()

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.title or f"Passage {self.id}"
    
class DataSet(models.Model):
    quiz = models.ForeignKey(Quiz, related_name='datasets', on_delete=models.CASCADE)
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='datasets/', blank=True, null=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.title or f"Data Set {self.id}"



class Question(models.Model):
    QUESTION_TYPES = [
        ('MCQ', 'Multiple Choice'),
        ('TF', 'True or False'),
        ('ID', 'Identification'),
    ]

    quiz = models.ForeignKey(Quiz, related_name='questions', on_delete=models.CASCADE, null=True, blank=True)
    passage = models.ForeignKey(Passage, related_name='questions', on_delete=models.CASCADE, null=True, blank=True)
    dataset = models.ForeignKey(DataSet, related_name='questions', on_delete=models.CASCADE, null=True, blank=True)
    
    text = models.CharField(max_length=500)
    explanation = models.TextField(blank=True)
    question_type = models.CharField(max_length=3, choices=QUESTION_TYPES, default='MCQ')

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.text



class Choice(models.Model):
    question = models.ForeignKey(Question, related_name='choices', on_delete=models.CASCADE)
    text = models.CharField(max_length=255, null=True, blank=True)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text or "(No text)"
    

class QuizResult(models.Model):
    quiz = models.ForeignKey('Quiz', on_delete=models.CASCADE, related_name='results', null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quiz_results', null=True, blank=True)
    quiz_type = models.CharField(max_length=3, blank=True, null=True)  
    score = models.FloatField(default=0)
    correct = models.IntegerField(default=0)
    total = models.IntegerField(default=0)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        username = self.user.username if self.user else "Anonymous"

        if self.quiz:
            # Normal quiz submissions
            return f"{username} - {self.quiz.get_quiz_type_display()} - {self.quiz.title} ({self.score}%)"
        
        elif self.quiz_type:
            # Random quiz submissions (no specific quiz)
            quiz_type_code = self.quiz_type.upper().strip()
            type_display = dict(Quiz.QUIZ_TYPES).get(quiz_type_code, quiz_type_code)
            return f"{username} - {type_display} - Random Quiz ({self.score}%)"
        
        # Fallback
        return f"{username} - Random Quiz ({self.score}%)"






