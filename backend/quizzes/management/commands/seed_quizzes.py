from django.core.management.base import BaseCommand
from quizzes.models import Quiz, Question, Choice
import random

class Command(BaseCommand):
    help = "Seeds the database with sample Civil Service quizzes and questions."

    def handle(self, *args, **options):
        Quiz.objects.all().delete()
        self.stdout.write(self.style.WARNING("🧹 Cleared existing quizzes..."))

        quiz_data = [
            ("Numerical Ability", "Basic math operations and problem solving", "NUM"),
            ("Verbal Ability", "Grammar, vocabulary, and comprehension", "VER"),
            ("Analytical Ability", "Logic, reasoning, and pattern recognition", "ANA"),
            ("General Information", "Philippine laws, history, and current events", "GEN"),
            ("Clerical Ability", "Office routines and document organization", "CLE"),
        ]

        for title, desc, qtype in quiz_data:
            quiz = Quiz.objects.create(
                title=title,
                description=desc,
                quiz_type=qtype,
                time_limit=random.choice([30, 45, 60]),
            )

            for i in range(1, 6):  # create 5 sample questions
                q = Question.objects.create(
                    quiz=quiz,
                    text=f"Sample Question {i} for {title}?",
                    explanation="Explanation: This is just a sample.",
                )

                for j in range(1, 4):  # create 3 choices per question
                    Choice.objects.create(
                        question=q,
                        text=f"Choice {j} for Q{i}",
                        is_correct=(j == 1),
                    )

        self.stdout.write(self.style.SUCCESS("✅ Successfully seeded sample quizzes!"))
