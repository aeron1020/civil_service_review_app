import json
from django.core.management.base import BaseCommand
from quizzes.models import Quiz, Passage, Question, Choice

class Command(BaseCommand):
    help = "Load Verbal Ability passage-based questions"

    def handle(self, *args, **kwargs):
        quiz = Quiz.objects.filter(title="Verbal Ability").first()
        if not quiz:
            self.stdout.write(self.style.ERROR("❌ Quiz 'Verbal Ability' not found!"))
            return

        with open("verbal_passage_questions.json", "r", encoding="utf-8") as f:
            data = json.load(f)

        for entry in data:
            passage_data = entry["passage"]
            passage, _ = Passage.objects.get_or_create(
                quiz=quiz,
                title=passage_data.get("title", ""),
                text=passage_data.get("text", "")
            )

            for q in entry["questions"]:
                question, _ = Question.objects.get_or_create(
                    passage=passage,
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

        self.stdout.write(self.style.SUCCESS("✅ Verbal Ability passage-based questions loaded successfully!"))
