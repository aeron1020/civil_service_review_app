from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Quiz
from .serializers import QuizSerializer
import random
from rest_framework import status
from .models import Quiz, Question, Choice, QuizResult
from rest_framework.permissions import IsAuthenticated
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


class QuizDetailAPIView(generics.RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

    QUESTION_LIMITS = {
        'NUM': 40,  # Numerical Ability
        'VER': 30,  # Verbal Ability
        'ANA': 40,  # Analytical Ability
        'CLE': 30,  # Clerical Ability
        'GEN': 20,  # General Information
    }

    def get_object(self):
        quiz = super().get_object()
        limit = self.QUESTION_LIMITS.get(quiz.quiz_type, 40)

        # Pull all questions for this quiz
        all_questions = list(quiz.questions.all())

        # Randomly sample questions if needed
        if len(all_questions) > limit:
            quiz.sampled_questions = random.sample(all_questions, limit)
        else:
            quiz.sampled_questions = all_questions

        return quiz

    def get_serializer_context(self):
        context = super().get_serializer_context()
        quiz = self.get_object()
        if hasattr(quiz, 'sampled_questions'):
            context['sampled_questions'] = quiz.sampled_questions
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
    permission_classes = [IsAuthenticated]  

    def post(self, request, pk):
        try:
            quiz = Quiz.objects.get(pk=pk)
        except Quiz.DoesNotExist:
            return Response({"error": "Quiz not found."}, status=status.HTTP_404_NOT_FOUND)

        answers = request.data.get('answers', [])
        if not answers:
            return Response({"error": "No answers provided."}, status=status.HTTP_400_BAD_REQUEST)

        total_questions = 0
        correct_answers = 0
        details = []

        for ans in answers:
            q_id = ans.get('question')
            c_id = ans.get('choice')
            try:
                question = Question.objects.get(pk=q_id, quiz=quiz)
                choice = Choice.objects.get(pk=c_id, question=question)
                total_questions += 1

                result = "correct" if choice.is_correct else "wrong"
                if choice.is_correct:
                    correct_answers += 1

                details.append({
                    "question": question.text,
                    "your_answer": choice.text,
                    "result": result,
                    "explanation": question.explanation,
                })
            except (Question.DoesNotExist, Choice.DoesNotExist):
                continue

        score = round((correct_answers / total_questions) * 100, 2) if total_questions > 0 else 0

        # ✅ Save with logged-in user
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