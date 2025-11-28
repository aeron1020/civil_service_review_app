# import os
# import json
# from django.core.management.base import BaseCommand
# from quizzes.models import Quiz, Question, Choice

# BASE_DIR = os.path.join("quizzes", "json_quizzes")

# class Command(BaseCommand):
#     help = "Loads all quiz JSON files inside json_quizzes/. Missing JSON files are simply skipped."

#     def handle(self, *args, **kwargs):
#         self.stdout.write(self.style.WARNING("\n📥 Loading all quiz JSON files...\n"))

#         if not os.path.isdir(BASE_DIR):
#             self.stdout.write(self.style.ERROR(f"json_quizzes folder not found: {BASE_DIR}"))
#             return

#         # Track all JSON files found
#         json_files_found = set()

#         # Find and load all JSON files first
#         for root, dirs, files in os.walk(BASE_DIR):
#             for file in files:
#                 if not file.endswith(".json"):
#                     continue

#                 filepath = os.path.join(root, file)
#                 json_files_found.add(file)

#                 quiz_title = (
#                     file.replace(".json", "")
#                         .replace("_", " ")
#                         .title()
#                 )

#                 self.stdout.write(self.style.NOTICE(f"\n📘 Processing quiz: {quiz_title}"))
#                 self.stdout.write(f"  Path: {filepath}")

#                 quiz = Quiz.objects.filter(title__iexact=quiz_title).first()

#                 if not quiz:
#                     self.stdout.write(self.style.WARNING(
#                         f"  ⚠️ Quiz '{quiz_title}' is NOT defined in seed_quizzes.py (skipped)"
#                     ))
#                     continue

#                 # Load JSON
#                 try:
#                     with open(filepath, "r", encoding="utf-8") as f:
#                         data = json.load(f)
#                 except Exception as e:
#                     self.stdout.write(self.style.ERROR(f"  ❌ Failed to load JSON: {e}"))
#                     continue

#                 question_count = 0
#                 new_count = 0

#                 for q in data:
#                     question_count += 1
#                     question, created = Question.objects.get_or_create(
#                         quiz=quiz,
#                         text=q["text"],
#                         defaults={
#                             "explanation": q.get("explanation", ""),
#                             "question_type": q.get("question_type", "MCQ"),
#                         }
#                     )

#                     if created:
#                         new_count += 1

#                     # Save choices
#                     for choice in q.get("choices", []):
#                         Choice.objects.get_or_create(
#                             question=question,
#                             text=choice["text"],
#                             defaults={"is_correct": choice.get("is_correct", False)},
#                         )

#                 self.stdout.write(self.style.SUCCESS(
#                     f"  ✓ Loaded {question_count} questions ({new_count} new)"
#                 ))

#         # Now detect quizzes with NO JSON file
#         self.stdout.write(self.style.WARNING("\n🔍 Checking for quizzes with missing JSON files...\n"))

#         for quiz in Quiz.objects.all():
#             expected_filename = quiz.title.lower().replace(" ", "_") + ".json"

#             if expected_filename not in json_files_found:
#                 self.stdout.write(self.style.WARNING(
#                     f"  ⚠️ No JSON found for quiz: {quiz.title} — (this is OK, left empty)"
#                 ))

#         self.stdout.write(self.style.SUCCESS("\n🎉 Finished loading all quiz JSON files!\n"))


import os
import json
from django.core.management.base import BaseCommand
from quizzes.models import Quiz, Question, Choice

BASE_DIR = os.path.join("quizzes", "json_quizzes")

# JSON files we want to SKIP
SKIP_FILES = {
    "reading_comprehension.json",
    "data_interpretation.json",
}

class Command(BaseCommand):
    help = "Loads all quiz JSON files inside json_quizzes/. Missing JSON files are simply skipped."

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING("\n📥 Loading all quiz JSON files...\n"))

        if not os.path.isdir(BASE_DIR):
            self.stdout.write(self.style.ERROR(f"json_quizzes folder not found: {BASE_DIR}"))
            return

        json_files_found = set()

        for root, dirs, files in os.walk(BASE_DIR):
            for file in files:
                if not file.endswith(".json"):
                    continue

                # 👉 Skip special JSONs
                if file in SKIP_FILES:
                    self.stdout.write(self.style.WARNING(
                        f"\n⏭️ Skipped special loader JSON: {file}"
                    ))
                    continue

                filepath = os.path.join(root, file)
                json_files_found.add(file)

                quiz_title = (
                    file.replace(".json", "")
                        .replace("_", " ")
                        .title()
                )

                self.stdout.write(self.style.NOTICE(f"\n📘 Processing quiz: {quiz_title}"))
                self.stdout.write(f"  Path: {filepath}")

                quiz = Quiz.objects.filter(title__iexact=quiz_title).first()

                if not quiz:
                    self.stdout.write(self.style.WARNING(
                        f"  ⚠️ Quiz '{quiz_title}' is NOT defined in seed_quizzes.py (skipped)"
                    ))
                    continue

                try:
                    with open(filepath, "r", encoding="utf-8") as f:
                        data = json.load(f)
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"  ❌ Failed to load JSON: {e}"))
                    continue

                question_count = 0
                new_count = 0

                for q in data:
                    question_count += 1
                    question, created = Question.objects.get_or_create(
                        quiz=quiz,
                        text=q["text"],
                        defaults={
                            "explanation": q.get("explanation", ""),
                            "question_type": q.get("question_type", "MCQ"),
                        }
                    )

                    if created:
                        new_count += 1

                    for choice in q.get("choices", []):
                        Choice.objects.get_or_create(
                            question=question,
                            text=choice["text"],
                            defaults={"is_correct": choice.get("is_correct", False)},
                        )

                self.stdout.write(self.style.SUCCESS(
                    f"  ✓ Loaded {question_count} questions ({new_count} new)"
                ))

        self.stdout.write(self.style.SUCCESS("\n🎉 Finished loading all quiz JSON files!\n"))
