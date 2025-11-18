import json
from django.core.management.base import BaseCommand
from quizzes.models import Quiz, Question, Choice


class Command(BaseCommand):
    help = "Load Word Problems questions with choices into the Quiz model"

    def handle(self, *args, **kwargs):
        # Find the correct quiz
        quiz = Quiz.objects.filter(title="Word Problems").first()

        if not quiz:
            self.stdout.write(self.style.ERROR("❌ Quiz 'Word Problems' not found!"))
            return

        # Load JSON file
        try:
            with open("word_problems.json", "r", encoding="utf-8") as f:
                questions = json.load(f)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR("❌ File 'word_problems.json' not found!"))
            return

        # Save questions
        for q in questions:
            question, created = Question.objects.get_or_create(
                quiz=quiz,
                text=q["text"],
                defaults={
                    "explanation": q.get("explanation", ""),
                    "question_type": "MCQ",
                },
            )

            # Create choices
            for choice in q["choices"]:
                Choice.objects.get_or_create(
                    question=question,
                    text=choice["text"],
                    defaults={"is_correct": choice["is_correct"]},
                )

            status = "Created" if created else "Already exists"
            self.stdout.write(self.style.SUCCESS(f"✔ {status}: {q['text'][:50]}..."))

        self.stdout.write(self.style.SUCCESS("✅ Word Problems loaded successfully!"))
