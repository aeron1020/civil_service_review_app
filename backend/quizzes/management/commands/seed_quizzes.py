from django.core.management.base import BaseCommand
from quizzes.models import Quiz

class Command(BaseCommand):
    """
    Seeds default Civil Service Exam (CSE) quiz categories and quizzes.

    This script populates the database with:
    - Quiz types (Numerical, Verbal, Analytical, Clerical, General Information)
    - Predefined quizzes under each quiz type

    Run:
        python manage.py seed_quizzes
    """

    help = "Seed Civil Service Exam quizzes into the database."

    # Structured quiz data grouped by Quiz Type Code
    QUIZ_STRUCTURE = {
        "NUM": {
            "Numerical Ability": [
                ("Number Series", "Solve missing numbers based on patterns."),
                ("Word Problems", "Apply arithmetic reasoning to real-life problems."),
                ("Basic Arithmetic", "CSE-level operations and equations."),
                ("Data Interpretation", "Interpret data from tables, charts, and graphs."),
            ]
        },
        "VER": {
            "Verbal Ability": [
                ("Reading Comprehension", "Understand passages and answer related questions."),
                ("Vocabulary Mastery", "Identify synonyms, antonyms, and word meanings."),
                ("Grammar and Correct Usage", "Spot grammatical errors and improve sentences."),
                ("Paragraph Organization", "Determine logical flow and correct sequence."),
            ]
        },
        "ANA": {
            "Analytical Ability": [
                ("Logical Reasoning", "Solve logic-based scenarios and arguments."),
                ("Pattern Analysis", "Analyze number, letter, and figure patterns."),
                ("Critical Thinking", "Evaluate information and draw valid conclusions."),
            ]
        },
        "CLE": {
            "Clerical Ability": [
                ("Filing and Coding", "Arrange information alphabetically and numerically."),
                ("Clerical Operations", "Basic office operations and record handling."),
                ("Attention to Detail", "Spot inaccuracies and inconsistencies."),
            ]
        },
        "GEN": {
            "General Information": [
                ("Philippine Constitution", "Study key articles and citizen rights."),
                ("Current Events", "National and international socio-political updates."),
                ("History", "Important historical events and national heroes."),
                ("Geography", "Philippine and world geographic facts."),
            ]
        },
    }

    def handle(self, *args, **kwargs):
        """
        Main execution method for seeding quizzes.
        """
        self.stdout.write(self.style.WARNING("Starting CSE Quiz Seeding..."))

        for quiz_type_code, type_data in self.QUIZ_STRUCTURE.items():
            for type_name, quizzes in type_data.items():

                self.stdout.write(self.style.NOTICE(f"\nSeeding Quiz Type: {type_name} ({quiz_type_code})"))

                for title, description in quizzes:

                    quiz, created = Quiz.objects.get_or_create(
                        title=title,
                        quiz_type=quiz_type_code,
                        defaults={
                            "description": description,
                            "time_limit": 20,
                            "is_random": False,
                        }
                    )

                    if created:
                        self.stdout.write(self.style.SUCCESS(f"  ✓ Created: {title}"))
                    else:
                        self.stdout.write(self.style.WARNING(f"  • Already exists: {title}"))

        self.stdout.write(self.style.SUCCESS("\nCSE quiz seeding complete! 🎉"))
