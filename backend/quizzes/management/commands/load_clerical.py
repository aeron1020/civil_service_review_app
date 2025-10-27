import json
from django.core.management.base import BaseCommand
from quizzes.models import Quiz, Question, Choice

class Command(BaseCommand):
    help = "Load Clerical Ability questions with choices"

    def handle(self, *args, **kwargs):
        quiz = Quiz.objects.filter(title="Clerical Ability").first()
        if not quiz:
            self.stdout.write(self.style.ERROR("❌ Quiz 'Clerical Ability' not found!"))
            return

        try:
            with open("clerical_questions.json", "r", encoding="utf-8") as f:
                questions = json.load(f)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR("❌ File 'clerical_questions.json' not found in project root!"))
            return

        for q in questions:
            question, created = Question.objects.get_or_create(
                quiz=quiz,
                text=q["text"],
                defaults={
                    "explanation": q.get("explanation", ""),
                    "question_type": "MCQ",
                },
            )

            for choice in q["choices"]:
                Choice.objects.get_or_create(
                    question=question,
                    text=choice["text"],
                    defaults={"is_correct": choice["is_correct"]},
                )

        self.stdout.write(self.style.SUCCESS("✅ Clerical Ability questions loaded successfully!"))
