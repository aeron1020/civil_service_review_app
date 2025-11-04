import json
from django.core.management.base import BaseCommand
from quizzes.models import Quiz, Question, Choice, Passage

class Command(BaseCommand):
    help = "Load Reading Comprehension passages and questions"

    def handle(self, *args, **kwargs):
        quiz = Quiz.objects.filter(title="Reading Comprehension").first()
        if not quiz:
            self.stdout.write(self.style.ERROR("❌ Quiz 'Reading Comprehension' not found!"))
            return

        try:
            with open("reading_comprehension_questions.json", "r", encoding="utf-8") as f:
                data = json.load(f)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR("❌ File 'reading_comprehension_questions.json' not found!"))
            return

        for index, item in enumerate(data, start=1):
            passage_obj, created = Passage.objects.get_or_create(
                quiz=quiz,
                text=item["passage"],
                defaults={"title": f"Passage {index}"}
            )

            for q in item["questions"]:
                question, created = Question.objects.get_or_create(
                    quiz=quiz,
                    text=q["text"],
                    defaults={
                        "explanation": q.get("explanation", ""),
                        "question_type": "RC",
                        "passage": passage_obj,
                    },
                )

                for choice in q["choices"]:
                    Choice.objects.get_or_create(
                        question=question,
                        text=choice["text"],
                        defaults={"is_correct": choice["is_correct"]},
                    )

        self.stdout.write(self.style.SUCCESS("✅ Reading Comprehension questions loaded successfully!"))
