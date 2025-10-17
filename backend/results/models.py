from django.db import models
from django.contrib.auth.models import User
from quizzes.models import Quiz

class Result(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    quiz = models.ForeignKey(Quiz, on_delete=models.SET_NULL, null=True)
    score = models.FloatField(default=0)
    total_questions = models.IntegerField(default=0)
    date_taken = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        user_display = self.user.username if self.user else "Anonymous"
        return f"{user_display} - {self.quiz} ({self.score}%)"
