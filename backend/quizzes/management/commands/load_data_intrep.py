import json
import os
from django.core.management.base import BaseCommand
from quizzes.models import Quiz, Question, Choice, DataSet

class Command(BaseCommand):
    help = "Load Data Interpretation datasets with questions"

    def handle(self, *args, **kwargs):
        # 1. Look for the target Quiz
        quiz = Quiz.objects.filter(title="Data Interpretation").first()
        if not quiz:
            self.stdout.write(self.style.ERROR("❌ Quiz 'Data Interpretation' not found!"))
            return

        # 2. Path to your JSON file
        base_path = "quizzes/json_quizzes/numerical_ability"
        file_path = os.path.join(base_path, "data_interpretation.json")

        if not os.path.exists(file_path):
            self.stdout.write(self.style.WARNING(f"⚠ {file_path} not found. Skipping..."))
            return

        # 🔥 CLEAN OLD DATA 
        # (This deletes old records to prevent duplicates when you re-run the script)
        DataSet.objects.filter(quiz=quiz).delete()
        Question.objects.filter(quiz=quiz).delete()

        with open(file_path, "r", encoding="utf-8") as f:
            datasets = json.load(f)

        for data in datasets:
            # Create DataSet without 'order' or 'image'
            # You will add the image manually in the Django Admin later.
            dataset = DataSet.objects.create(
                quiz=quiz,
                title=data["title"],
                description=data.get("description", ""),
            )

            for q in data.get("questions", []):
                # IMPORTANT: If your Question model does NOT have 'question_type', 
                # remove that line below as well to avoid another TypeError.
                question = Question.objects.create(
                    quiz=quiz,
                    text=q["text"],
                    explanation=q.get("explanation", ""),
                    dataset=dataset
                )

                for choice in q.get("choices", []):
                    if choice.get("text", "").strip():
                        Choice.objects.create(
                            question=question,
                            text=choice["text"].strip(),
                            is_correct=choice.get("is_correct", False)
                        )

        self.stdout.write(self.style.SUCCESS("✅ Data Interpretation loaded! Now you can add images in the Admin panel."))