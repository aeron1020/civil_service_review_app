from rest_framework import serializers
from .models import Quiz, Passage, Question, Choice, QuizResult, DataSet

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text',] #i hide is_correct


# class QuestionSerializer(serializers.ModelSerializer):
#     choices = ChoiceSerializer(many=True, read_only=True)

#     class Meta:
#         model = Question
#         fields = ['id', 'text', 'explanation', 'question_type', 'choices']

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)
    quiz_name = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ['id', 'text', 'explanation', 'question_type', 'quiz_name', 'choices']

    def get_quiz_name(self, obj):
        # Get the parent quiz title whether from quiz, passage, or dataset
        if obj.quiz:
            return obj.quiz.title
        elif obj.passage:
            return obj.passage.quiz.title
        elif obj.dataset:
            return obj.dataset.quiz.title
        return "Unknown Quiz"



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
    total_questions = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = [
            'id',
            'title',
            'description',
            'quiz_type',
            'time_limit',
            'passages',
            'datasets',
            'questions',
            'total_questions',
        ]
    

    def get_questions(self, obj):
        """Return only the sampled/randomized questions if present in context."""
        sampled_questions = self.context.get('sampled_questions')
        if sampled_questions:
            return QuestionSerializer(sampled_questions, many=True).data
        return QuestionSerializer(obj.questions.all(), many=True).data

    def get_total_questions(self, obj):
        """Return the count of randomized questions actually included."""
        sampled_questions = self.context.get('sampled_questions', [])
        return len(sampled_questions)

    def to_representation(self, instance):
        """Ensure the serializer uses randomized versions for questions and passages."""
        data = super().to_representation(instance)

        # Use randomized questions if provided in context
        sampled_questions = self.context.get('sampled_questions')
        if sampled_questions:
            data['questions'] = QuestionSerializer(sampled_questions, many=True).data

        # Use randomized passages if available in context
        randomized_passages = self.context.get('randomized_passages')
        if randomized_passages:
            data['passages'] = PassageSerializer(randomized_passages, many=True).data

        # Use randomized datasets if available in context (for Analytical)
        randomized_datasets = self.context.get('randomized_datasets')
        if randomized_datasets:
            data['datasets'] = DataSetSerializer(randomized_datasets, many=True).data

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

