from django.db import models


class Quiz(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Question(models.Model):
    quiz = models.ForeignKey(
        Quiz,
        related_name='questions',
        on_delete=models.CASCADE,
        null=True,  # allow empty while still adding data
        blank=True, # makes it optional in admin forms too
    )
    text = models.CharField(max_length=500, null=True, blank=True)
    explanation = models.TextField(blank=True)

    def __str__(self):
        return self.text or "Untitled Question"



class Choice(models.Model):
    question = models.ForeignKey(Question, related_name='choices', on_delete=models.CASCADE)
    text = models.CharField(max_length=500, null=True, blank=True)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text
