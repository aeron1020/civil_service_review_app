# import json
# import os
# from django.core.management.base import BaseCommand
# from quizzes.models import Quiz, Question, Choice, Passage

# class Command(BaseCommand):
#     help = "Load Reading Comprehension passages and questions from json_quizzes folder"

#     def handle(self, *args, **kwargs):
#         quiz = Quiz.objects.filter(title="Reading Comprehension").first()
#         if not quiz:
#             self.stdout.write(self.style.ERROR("❌ Quiz 'Reading Comprehension' not found!"))
#             return

#         # Correct path based on your folder structure
#         base_path = "quizzes/json_quizzes/verbal_ability"
#         file_path = os.path.join(base_path, "reading_comprehension.json")

#         if not os.path.exists(file_path):
#             self.stdout.write(self.style.WARNING("⚠ No reading_comprehension.json found. Skipping..."))
#             return

#         with open(file_path, "r", encoding="utf-8") as f:
#             data = json.load(f)

#         for index, item in enumerate(data, start=1):

#             passage_obj, created = Passage.objects.get_or_create(
#                 quiz=quiz,
#                 text=item["passage"],
#                 defaults={"title": f"Passage {index}"}
#             )

#             for q in item["questions"]:
                
#                 question, created = Question.objects.get_or_create(
#                     quiz=quiz,
#                     text=q["text"],
#                     defaults={
#                         "explanation": q.get("explanation", ""),
#                         "question_type": "RC",
#                         "passage": passage_obj,
#                     },
#                 )

#                 for choice in q["choices"]:
#                     Choice.objects.get_or_create(
#                         question=question,
#                         text=choice["text"],
#                         defaults={"is_correct": choice["is_correct"]},
#                     )

#         self.stdout.write(self.style.SUCCESS("✅ Reading Comprehension updated from JSON!"))


import json
import os
from django.core.management.base import BaseCommand
from quizzes.models import Quiz, Question, Choice, Passage

class Command(BaseCommand):
    help = "Load Reading Comprehension passages and questions from json_quizzes folder"

    def handle(self, *args, **kwargs):
        quiz = Quiz.objects.filter(title="Reading Comprehension").first()
        if not quiz:
            self.stdout.write(self.style.ERROR("❌ Quiz 'Reading Comprehension' not found!"))
            return

        base_path = "quizzes/json_quizzes/verbal_ability"
        file_path = os.path.join(base_path, "reading_comprehension.json")

        if not os.path.exists(file_path):
            self.stdout.write(self.style.WARNING("⚠ No reading_comprehension.json found. Skipping..."))
            return

        # 🔥 Clean old data FIRST
        Passage.objects.filter(quiz=quiz).delete()
        Question.objects.filter(quiz=quiz).delete()

        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        for index, item in enumerate(data, start=1):

            passage_obj = Passage.objects.create(
                quiz=quiz,
                text=item["passage"],
                title=f"Passage {index}"
            )

            for q in item["questions"]:

                question = Question.objects.create(
                    quiz=quiz,
                    text=q["text"],
                    explanation=q.get("explanation", ""),
                    question_type="MCQ",   # 🔥 FIXED
                    passage=passage_obj,
                )

                for choice in q.get("choices", []):
                    if choice["text"].strip():      # 🔥 avoid empty choices
                        Choice.objects.create(
                            question=question,
                            text=choice["text"].strip(),
                            is_correct=choice["is_correct"]
                        )

        self.stdout.write(self.style.SUCCESS("✅ Reading Comprehension loaded cleanly!"))
