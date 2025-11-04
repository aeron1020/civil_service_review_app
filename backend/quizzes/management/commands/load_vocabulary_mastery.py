import json
from django.core.management.base import BaseCommand
from quizzes.models import Quiz, Question, Choice

class Command(BaseCommand):
    help = "Load Vocabulary Mastery questions into the database"

    def handle(self, *args, **kwargs):
        quiz = Quiz.objects.filter(title="Vocabulary Mastery").first()
        if not quiz:
            self.stdout.write(self.style.ERROR("❌ Quiz 'Vocabulary Mastery' not found!"))
            return

        try:
            with open("vocabulary_mastery_questions.json", "r", encoding="utf-8") as file:
                questions = json.load(file)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR("❌ File 'vocabulary_mastery_questions.json' not found in project root!"))
            return
        except json.JSONDecodeError:
            self.stdout.write(self.style.ERROR("❌ JSON format error in 'vocabulary_mastery_questions.json'"))
            return

        for q in questions:
            question, created = Question.objects.get_or_create(
                quiz=quiz,
                text=q["text"],
                defaults={
                    "explanation": q.get("explanation", ""),
                    "question_type": "MCQ",   # Multiple Choice by default
                },
            )

            for choice in q["choices"]:
                Choice.objects.get_or_create(
                    question=question,
                    text=choice["text"],
                    defaults={"is_correct": choice["is_correct"]},
                )

        self.stdout.write(self.style.SUCCESS("✅ Vocabulary Mastery questions loaded successfully!"))
