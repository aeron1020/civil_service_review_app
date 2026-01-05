import json
import os
from django.core.management.base import BaseCommand
from quizzes.models import Quiz, Question, Choice, DataSet


class Command(BaseCommand):
    help = "Load Data Interpretation datasets with images and questions"

    def handle(self, *args, **kwargs):

        quiz = Quiz.objects.filter(title="Data Interpretation").first()
        if not quiz:
            self.stdout.write(self.style.ERROR("❌ Quiz 'Data Interpretation' not found!"))
            return

        base_path = "quizzes/json_quizzes/numerical_ability"
        file_path = os.path.join(base_path, "data_interpretation.json")

        if not os.path.exists(file_path):
            self.stdout.write(self.style.WARNING("⚠ data_interpretation.json not found. Skipping..."))
            return

        # 🔥 CLEAN OLD DATA
        DataSet.objects.filter(quiz=quiz).delete()
        Question.objects.filter(quiz=quiz).delete()

        with open(file_path, "r", encoding="utf-8") as f:
            datasets = json.load(f)

        for index, data in enumerate(datasets, start=1):

            dataset = DataSet.objects.create(
                quiz=quiz,
                title=data["title"],
                description=data.get("description", ""),
                image=data.get("image", None),
                order=index
            )

            for q in data.get("questions", []):

                question = Question.objects.create(
                    quiz=quiz,
                    text=q["text"],
                    explanation=q.get("explanation", ""),
                    question_type=q.get("question_type", "MCQ"),
                    dataset=dataset
                )

                for choice in q.get("choices", []):
                    if choice.get("text", "").strip():
                        Choice.objects.create(
                            question=question,
                            text=choice["text"].strip(),
                            is_correct=choice.get("is_correct", False)
                        )

        self.stdout.write(self.style.SUCCESS("✅ Data Interpretation loaded successfully!"))
