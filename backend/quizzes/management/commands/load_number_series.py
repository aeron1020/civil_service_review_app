import json
from django.core.management.base import BaseCommand
from quizzes.models import Quiz, Question, Choice


class Command(BaseCommand):
    help = "Load Number Series questions with choices"

    def handle(self, *args, **kwargs):
        # Find the specific quiz
        quiz = Quiz.objects.filter(title="Number Series").first()

        if not quiz:
            self.stdout.write(self.style.ERROR("❌ Quiz 'Number Series' not found!"))
            return

        # Load JSON file
        try:
            with open("number_series.json", "r", encoding="utf-8") as f:
                questions = json.load(f)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR("❌ File 'number_series.json' not found!"))
            return

        created_count = 0

        for q in questions:
            question, created = Question.objects.get_or_create(
                quiz=quiz,
                text=q["text"],
                defaults={
                    "explanation": q.get("explanation", ""),
                    "question_type": "MCQ",
                },
            )

            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"  → Added question: {q['text']}"))
            else:
                self.stdout.write(self.style.WARNING(f"  → Question already exists: {q['text']}"))

            # Process choices
            for choice in q["choices"]:
                Choice.objects.get_or_create(
                    question=question,
                    text=choice["text"],
                    defaults={"is_correct": choice.get("is_correct", False)},
                )

        self.stdout.write(
            self.style.SUCCESS(f"\n✅ Number Series questions loaded successfully! ({created_count} new questions)")
        )
