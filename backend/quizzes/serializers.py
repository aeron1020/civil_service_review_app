from rest_framework import serializers
from .models import Quiz, Passage, Question, Choice, QuizResult, DataSet

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

class DataSetSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = DataSet
        fields = ['id', 'title', 'description', 'image', 'questions']

    def get_questions(self, obj):
        questions = obj.questions.all()  # related_name='questions' in Question model (we’ll add next)
        return QuestionSerializer(questions, many=True).data


class QuizSerializer(serializers.ModelSerializer):
    passages = PassageSerializer(many=True, read_only=True)
    datasets = DataSetSerializer(many=True, read_only=True)
    questions = serializers.SerializerMethodField()


    class Meta:
        model = Quiz
        fields = [
            'id', 'title', 'description',
            'quiz_type', 'time_limit',
            'passages', 'datasets', 'questions'
        ]


    def get_questions(self, obj):
        sampled_questions = self.context.get('sampled_questions')
        if sampled_questions:
            return QuestionSerializer(sampled_questions, many=True).data
        return QuestionSerializer(obj.questions.all(), many=True).data
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        
        # Replace questions with sampled ones if available
        sampled_questions = self.context.get('sampled_questions')
        if sampled_questions:
            data['questions'] = QuestionSerializer(sampled_questions, many=True).data

        # Replace passages with randomized ones if available
        randomized_passages = self.context.get('randomized_passages')
        if randomized_passages:
            data['passages'] = PassageSerializer(randomized_passages, many=True).data

        return data
    
    

class QuizResultSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    quiz_type = serializers.CharField(source='quiz.get_quiz_type_display', read_only=True)

    class Meta:
        model = QuizResult
        fields = [
            'id',
            'quiz_title',
            'quiz_type',
            'score',
            'correct',
            'total',
            'submitted_at',
        ]

