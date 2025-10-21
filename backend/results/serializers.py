from rest_framework import serializers
from .models import Result
from quizzes.models import Quiz, Question, Choice

class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = ['id', 'user', 'quiz', 'score', 'total_questions', 'date_taken']


class SubmitQuizSerializer(serializers.Serializer):
    quiz_id = serializers.IntegerField()
    answers = serializers.DictField(
        child=serializers.IntegerField(),
        help_text="Dictionary mapping question_id -> choice_id"
    )

    def validate(self, data):
        try:
            quiz = Quiz.objects.get(id=data['quiz_id'])
        except Quiz.DoesNotExist:
            raise serializers.ValidationError("Quiz not found.")
        data['quiz'] = quiz
        return data

    def create(self, validated_data):
        user = self.context['request'].user if self.context['request'].user.is_authenticated else None
        quiz = validated_data['quiz']
        answers = validated_data['answers']

        total_questions = quiz.questions.count()
        correct = 0

        for question in quiz.questions.all():
            selected_choice_id = answers.get(str(question.id))
            if selected_choice_id:
                try:
                    choice = question.choices.get(id=selected_choice_id)
                    if choice.is_correct:
                        correct += 1
                except Choice.DoesNotExist:
                    pass

        score = (correct / total_questions) * 100 if total_questions > 0 else 0

        return Result.objects.create(
            user=user,
            quiz=quiz,
            score=score,
            total_questions=total_questions
        )
