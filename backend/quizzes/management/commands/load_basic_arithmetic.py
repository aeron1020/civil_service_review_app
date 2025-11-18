import json
from django.core.management.base import BaseCommand
from quizzes.models import Quiz, Question, Choice

class Command(BaseCommand):
    help = "Load Basic Arithmetic questions with choices"

    def handle(self, *args, **kwargs):
        # Step 1 — Fetch the quiz
        quiz = Quiz.objects.filter(title="Basic Arithmetic").first()
        if not quiz:
            self.stdout.write(self.style.ERROR("❌ Quiz 'Basic Arithmetic' not found!"))
            return

        # Step 2 — Load JSON
        with open("basic_arithmetic.json", "r", encoding="utf-8") as f:
            questions = json.load(f)

        # Step 3 — Loop through questions and create them
        for q in questions:
            question, created = Question.objects.get_or_create(
                quiz=quiz,
                text=q["text"],
                defaults={
                    "explanation": q.get("explanation", ""),
                    "question_type": "MCQ",
                },
            )

            # Step 4 — Add choices
            for choice in q["choices"]:
                Choice.objects.get_or_create(
                    question=question,
                    text=choice["text"],
                    defaults={"is_correct": choice["is_correct"]},
                )

        self.stdout.write(self.style.SUCCESS("✅ Basic Arithmetic questions loaded successfully!"))
