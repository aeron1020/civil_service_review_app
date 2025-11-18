import json
from django.core.management.base import BaseCommand
from quizzes.models import Quiz, Question, Choice

class Command(BaseCommand):
    help = "Load Paragraph Organization questions"

    def handle(self, *args, **kwargs):
        quiz = Quiz.objects.filter(title="Paragraph Organization").first()
        if not quiz:
            self.stdout.write(self.style.ERROR("❌ Quiz 'Paragraph Organization' not found!"))
            return

        with open("paragraph_organization.json", "r", encoding="utf-8") as f:
            data = json.load(f)

        for item in data:
            question, created = Question.objects.get_or_create(
                quiz=quiz,
                text=item["text"],
                defaults={
                    "explanation": item.get("explanation", ""),
                    "question_type": "MCQ"
                }
            )

            if created:
                for choice in item["choices"]:
                    Choice.objects.create(
                        question=question,
                        text=choice["text"],
                        is_correct=choice["is_correct"]
                    )

        self.stdout.write(self.style.SUCCESS("✅ Paragraph Organization questions loaded successfully!"))
