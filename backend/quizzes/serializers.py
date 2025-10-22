from rest_framework import serializers
from .models import Quiz, Passage, Question, Choice

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text', 'is_correct']


class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'explanation', 'question_type', 'choices']


class PassageSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Passage
        fields = ['id', 'title', 'text', 'questions']


class QuizSerializer(serializers.ModelSerializer):
    passages = PassageSerializer(many=True, read_only=True)
    questions = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = [
            'id', 'title', 'description',
            'quiz_type', 'time_limit',
            'passages', 'questions'
        ]

    def get_questions(self, obj):
        sampled_questions = self.context.get('sampled_questions')
        if sampled_questions:
            return QuestionSerializer(sampled_questions, many=True).data
        return QuestionSerializer(obj.questions.all(), many=True).data
