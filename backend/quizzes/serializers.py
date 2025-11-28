from rest_framework import serializers
from .models import Quiz, Passage, Question, Choice, QuizResult, DataSet

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text',] #i hide is_correct


class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)
    quiz_name = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ['id', 'text', 'explanation', 'question_type', 'quiz_name', 'choices']

    def get_quiz_name(self, obj):
        # Prefer direct attributes if present (select_related in view makes these cheap)
        if getattr(obj, "quiz_id", None):
            return getattr(obj.quiz, "title", "Unknown Quiz")
        if getattr(obj, "passage_id", None) and getattr(obj, "passage", None):
            return getattr(obj.passage.quiz, "title", "Unknown Quiz")
        if getattr(obj, "dataset_id", None) and getattr(obj, "dataset", None):
            return getattr(obj.dataset.quiz, "title", "Unknown Quiz")
        return "Unknown Quiz"



class PassageSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Passage
        fields = ['id', 'title', 'text', 'questions']


class DataSetSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()  # use a method to ensure full URL

    class Meta:
        model = DataSet
        fields = ['id', 'title', 'description', 'image', 'questions']

    def get_image(self, obj):
        """Return full absolute URL for the image, or None if no image."""
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None

class QuizSerializer(serializers.ModelSerializer):
    passages = PassageSerializer(many=True, read_only=True)
    datasets = serializers.SerializerMethodField()  # <-- changed to method field
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
            'is_random',
            'questions',
            'total_questions',
        ]

    def get_datasets(self, obj):
        """Return datasets with context to properly generate image URLs."""
        # Pass the request context to DataSetSerializer so image URLs are absolute
        return DataSetSerializer(
            obj.datasets.all(),
            many=True,
            context=self.context
        ).data

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
        """Ensure the serializer uses randomized versions for questions, passages, datasets."""
        data = super().to_representation(instance)

        # Use randomized questions if provided in context
        sampled_questions = self.context.get('sampled_questions')
        if sampled_questions:
            data['questions'] = QuestionSerializer(sampled_questions, many=True).data

        # Use randomized passages if available in context
        randomized_passages = self.context.get('randomized_passages')
        if randomized_passages:
            data['passages'] = PassageSerializer(randomized_passages, many=True, context=self.context).data

        # Use randomized datasets if available in context
        randomized_datasets = self.context.get('randomized_datasets')
        if randomized_datasets:
            data['datasets'] = DataSetSerializer(randomized_datasets, many=True, context=self.context).data

        return data


class QuizResultSerializer(serializers.ModelSerializer):
    quiz_title = serializers.SerializerMethodField()
    quiz_type = serializers.SerializerMethodField()

    class Meta:
        model = QuizResult
        fields = [
            'id',
            'quiz_title',
            'quiz_type',
            'score',
            'correct',
            'total',
            'time_spent',  
            'submitted_at',
        ]

    def get_quiz_title(self, obj):
        # Case 1: Linked to an existing quiz
        if obj.quiz:
            return obj.quiz.title
        # Case 2: Random quiz (quiz=None but quiz_type exists)
        elif obj.quiz_type:
            type_display = dict(Quiz.QUIZ_TYPES).get(obj.quiz_type, "Unknown Type")
            return f"{type_display} - Random Quiz"
        # Case 3: No info at all
        return "Random Quiz"

    def get_quiz_type(self, obj):
        # Case 1: Linked quiz has a type
        if obj.quiz:
            return obj.quiz.get_quiz_type_display()
        # Case 2: Random quiz uses quiz_type field
        elif obj.quiz_type:
            return dict(Quiz.QUIZ_TYPES).get(obj.quiz_type, "Unknown Type")
        # Case 3: Fallback
        return "Unknown Type"
