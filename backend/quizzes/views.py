from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Quiz
from .serializers import QuizSerializer
import random
from rest_framework import status
from .models import Quiz, Question, Choice, QuizResult, DataSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import QuizResult
from .serializers import QuizResultSerializer 


class QuizListAPIView(generics.ListAPIView):
    serializer_class = QuizSerializer

    def get_queryset(self):
        queryset = Quiz.objects.all()

        # filter by quiz type (NUM, VER, GEN, ANA, CLE)
        quiz_type = self.request.query_params.get('type')
        if quiz_type:
            queryset = queryset.filter(quiz_type=quiz_type)

        # optional filter — show only timed quizzes
        time_only = self.request.query_params.get('timed')
        if time_only == 'true':
            queryset = queryset.exclude(time_limit=0)

        return queryset


# class QuizDetailAPIView(generics.RetrieveAPIView):
#     queryset = Quiz.objects.all()
#     serializer_class = QuizSerializer
#     permission_classes = [AllowAny]

#     QUESTION_LIMITS = {
#         'NUM': 40,  # Numerical Ability
#         'VER': 30,  # Verbal Ability
#         'ANA': 40,  # Analytical Ability
#         'CLE': 30,  # Clerical Ability
#         'GEN': 20,  # General Information
#     }

#     def get_object(self):
#         quiz = super().get_object()
#         limit = self.QUESTION_LIMITS.get(quiz.quiz_type, 40)

#         # Randomize standalone (non-passage, non-dataset) questions
#         non_passage_questions = list(
#             quiz.questions.filter(passage__isnull=True, dataset__isnull=True)
#         )
#         if len(non_passage_questions) > limit:
#             quiz.sampled_questions = random.sample(non_passage_questions, limit)
#         else:
#             quiz.sampled_questions = non_passage_questions

#         # Randomize passages and datasets (optional)
#         passages = list(quiz.passages.all())
#         datasets = list(quiz.datasets.all())
#         random.shuffle(passages)
#         random.shuffle(datasets)

#         quiz.randomized_passages = passages
#         quiz.randomized_datasets = datasets
#         return quiz


#     def get_serializer_context(self):
#         context = super().get_serializer_context()
#         quiz = self.get_object()
#         context['sampled_questions'] = getattr(quiz, 'sampled_questions', [])
#         context['randomized_passages'] = getattr(quiz, 'randomized_passages', [])
#         context['randomized_datasets'] = getattr(quiz, 'randomized_datasets', [])
#         return context

class QuizDetailAPIView(generics.RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [AllowAny]

    QUESTION_LIMITS = {
        'NUM': 20,
        'CLE': 20,
        'GEN': 20,
        'VER': 15,  # standalone questions (plus 1 passage)
        'ANA': 15,  # standalone questions (plus 1 dataset)
    }

    def get_object(self):
        """Retrieve and prepare randomized quiz questions."""
        if hasattr(self, "_cached_quiz"):
            return self._cached_quiz

        quiz = super().get_object()
        quiz_type = quiz.quiz_type
        limit = self.QUESTION_LIMITS.get(quiz_type, 20)

        # Randomize standalone (non-passage, non-dataset) questions
        standalone_qs = list(
            quiz.questions.filter(passage__isnull=True, dataset__isnull=True).distinct()
        )
        random.shuffle(standalone_qs)
        quiz.sampled_questions = standalone_qs[:limit]

        # Default (no passage/dataset)
        quiz.randomized_passages = []
        quiz.randomized_datasets = []

        # 🔹 VERBAL ABILITY: 1 reading comprehension + 15 standalone
        if quiz_type == "VER":
            passages = list(quiz.passages.all())
            if passages:
                # randomly select one passage
                chosen_passage = random.choice(passages)
                quiz.randomized_passages = [chosen_passage]
                # include all questions from that passage
                passage_questions = list(chosen_passage.questions.all())
                quiz.sampled_questions += passage_questions

        # 🔹 ANALYTICAL ABILITY: 1 dataset + 15 standalone
        elif quiz_type == "ANA":
            if hasattr(quiz, "datasets"):
                datasets = list(quiz.datasets.all())
                if datasets:
                    chosen_dataset = random.choice(datasets)
                    quiz.randomized_datasets = [chosen_dataset]
                    dataset_questions = list(chosen_dataset.questions.all())
                    quiz.sampled_questions += dataset_questions

        # ✅ Ensure we don’t exceed total expected number (failsafe)
        quiz.sampled_questions = quiz.sampled_questions[:60]

        # Cache
        self._cached_quiz = quiz
        return quiz

    def get_serializer_context(self):
        """Include randomized data in serializer context."""
        context = super().get_serializer_context()
        quiz = self.get_object()
        context.update({
            "sampled_questions": getattr(quiz, "sampled_questions", []),
            "randomized_passages": getattr(quiz, "randomized_passages", []),
            "randomized_datasets": getattr(quiz, "randomized_datasets", []),
        })
        return context



class QuizGroupedAPIView(APIView):
    """Returns quizzes grouped by quiz_type, with counts."""

    def get(self, request):
        grouped = {}
        summary = []

        for code, label in Quiz.QUIZ_TYPES:
            quizzes = Quiz.objects.filter(quiz_type=code)
            serialized = QuizSerializer(quizzes, many=True).data

            grouped[label] = serialized
            summary.append({
                "type": label,
                "count": quizzes.count()
            })

        return Response({
            "summary": summary,
            "groups": grouped
        })

class QuizSubmissionAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, pk):
        try:
            quiz = Quiz.objects.get(pk=pk)
        except Quiz.DoesNotExist:
            return Response({"error": "Quiz not found."}, status=status.HTTP_404_NOT_FOUND)

        answers = request.data.get('answers', [])
        user_answers = {a.get('question'): a.get('choice') for a in answers if a.get('question') and a.get('choice')}

        # Get all questions belonging to this quiz (including those under passages)
        all_questions = list(quiz.questions.all()) + list(
            Question.objects.filter(passage__quiz=quiz)
        )

        total_questions = len(all_questions)
        correct_answers = 0
        details = []

        for question in all_questions:
            choice_id = user_answers.get(question.id)
            if choice_id:
                try:
                    choice = Choice.objects.get(pk=choice_id, question=question)
                    is_correct = choice.is_correct
                    result = "correct" if is_correct else "wrong"
                    if is_correct:
                        correct_answers += 1
                    your_answer = choice.text
                except Choice.DoesNotExist:
                    result = "unanswered"
                    your_answer = "No answer selected"
            else:
                result = "unanswered"
                your_answer = "No answer selected"

            details.append({
                "question": question.text,
                "your_answer": your_answer,
                "result": result,
                "explanation": question.explanation,
            })

        score = round((correct_answers / total_questions) * 100, 2) if total_questions > 0 else 0

        # ✅ Only save if user is authenticated
        if request.user.is_authenticated:
            QuizResult.objects.create(
                quiz=quiz,
                user=request.user,
                score=score,
                correct=correct_answers,
                total=total_questions,
            )

        return Response({
            "quiz": quiz.title,
            "score": score,
            "correct": correct_answers,
            "total": total_questions,
            "details": details,
        }, status=status.HTTP_200_OK)



class UserResultsAPIView(generics.ListAPIView):
    serializer_class = QuizResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return QuizResult.objects.filter(user=self.request.user).order_by('-submitted_at')