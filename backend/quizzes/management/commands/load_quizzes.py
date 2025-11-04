from django.core.management.base import BaseCommand
from quizzes.models import Quiz
import json

class Command(BaseCommand):
    help = 'Load initial quiz types and titles'

    def handle(self, *args, **options):
        with open('quiz_loader.json', 'r') as f:
            data = json.load(f)
            count = 0
            for item in data:
                # Map readable quiz_type name to its short code in your model
                quiz_type_map = {
                    'Numerical Ability': 'NUM',
                    'Verbal Ability': 'VER',
                    'Analytical Ability': 'ANA',
                    'Clerical Ability': 'CLE',
                    'General Information': 'GEN',
                }

                quiz_type_code = quiz_type_map.get(item['quiz_type'])
                if not quiz_type_code:
                    self.stdout.write(
                        self.style.WARNING(f"⚠️ Skipping unknown quiz type: {item['quiz_type']}")
                    )
                    continue

                for title in item['titles']:
                    quiz, created = Quiz.objects.get_or_create(
                        title=title,
                        quiz_type=quiz_type_code,
                        defaults={"description": f"{title} quiz under {item['quiz_type']}"}
                    )
                    if created:
                        count += 1
                        self.stdout.write(self.style.SUCCESS(f"✅ Created: {quiz.title}"))
                    else:
                        self.stdout.write(f"➡️ Already exists: {quiz.title}")

            self.stdout.write(self.style.SUCCESS(f"\n🎯 Loaded {count} new quizzes successfully!"))
