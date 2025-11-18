import json
from django.core.management.base import BaseCommand
from quizzes.models import Quiz, Question, Choice

class Command(BaseCommand):
    help = "Load Grammar & Correct Usage questions"

    def handle(self, *args, **kwargs):
        quiz = Quiz.objects.filter(title="Grammar and Correct Usage").first()
        if not quiz:
            self.stdout.write(self.style.ERROR("❌ Quiz 'Grammar & Correct Usage' not found!"))
            return

        with open("grammar_usage_questions.json", "r", encoding="utf-8") as f:
            data = json.load(f)

        for q in data:
            question, _ = Question.objects.get_or_create(
                quiz=quiz,
                passage=None,
                text=q["text"],
                defaults={
                    "explanation": q.get("explanation", ""),
                    "question_type": "MCQ"
                }
            )

            for choice in q["choices"]:
                Choice.objects.get_or_create(
                    question=question,
                    text=choice["text"],
                    defaults={"is_correct": choice["is_correct"]}
                )

        self.stdout.write(self.style.SUCCESS("✅ Grammar & Correct Usage questions loaded successfully!"))
