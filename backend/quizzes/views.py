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

class QuizDetailAPIView(generics.RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [AllowAny]

    # Custom limits per quiz type
    QUESTION_LIMITS = {
        'NUM': 20,
        'CLE': 20,
        'GEN': 20,
        'VER': 17,  # standalone + passage questions
        'ANA': 17,  # standalone + dataset questions
    }

    def get_object(self):
        """Retrieve and prepare randomized quiz questions."""
        if hasattr(self, "_cached_quiz"):
            return self._cached_quiz

        quiz = super().get_object()
        quiz_type = quiz.quiz_type
        limit = self.QUESTION_LIMITS.get(quiz_type, 20)

        # 🔹 Randomize standalone (non-passage, non-dataset) questions
        standalone_qs = list(
            quiz.questions.filter(passage__isnull=True, dataset__isnull=True).distinct()
        )
        random.shuffle(standalone_qs)
        quiz.sampled_questions = standalone_qs[:limit]

        # Initialize
        quiz.randomized_passages = []
        quiz.randomized_datasets = []

        # 🔹 VERBAL ABILITY: add one random passage + its questions
        if quiz_type == "VER":
            passages = list(quiz.passages.all())
            if passages:
                chosen_passage = random.choice(passages)
                quiz.randomized_passages = [chosen_passage]
                passage_questions = list(chosen_passage.questions.all())
                quiz.sampled_questions += passage_questions

        # 🔹 ANALYTICAL ABILITY: add one random dataset + its questions
        elif quiz_type == "ANA":
            if hasattr(quiz, "datasets"):
                datasets = list(quiz.datasets.all())
                if datasets:
                    chosen_dataset = random.choice(datasets)
                    quiz.randomized_datasets = [chosen_dataset]
                    dataset_questions = list(chosen_dataset.questions.all())
                    quiz.sampled_questions += dataset_questions

        # ✅ Final failsafe — enforce absolute max of 20 questions
        MAX_QUESTIONS = 20
        quiz.sampled_questions = quiz.sampled_questions[:MAX_QUESTIONS]

        # 🧠 Debug info (for backend console)
        print("📘 QUIZ DEBUG INFO ------------------------------")
        print(f"Quiz: {quiz.title}")
        print(f"Displayed questions (shown to user): {len(quiz.sampled_questions)}")
        print(f"Total questions in database: {quiz.questions.count()}")
        print("--------------------------------------------------")

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

# class QuizSubmissionAPIView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request, pk):
#         try:
#             quiz = Quiz.objects.get(pk=pk)
#         except Quiz.DoesNotExist:
#             return Response({"error": "Quiz not found."}, status=status.HTTP_404_NOT_FOUND)

#         answers = request.data.get('answers', [])
#         user_answers = {
#             a.get('question'): a.get('choice')
#             for a in answers if a.get('question') and a.get('choice')
#         }

#         quiz_type = quiz.quiz_type
#         QUESTION_LIMIT = 20

#                 # ✅ Collect only the actual questions that were displayed to the user

#         # Standalone (non-passage/non-dataset)
#         standalone_questions = list(
#             quiz.questions.filter(passage__isnull=True, dataset__isnull=True)
#         )

#         # Passage-based questions
#         passage_questions = []
#         for passage in quiz.passages.all():
#             passage_questions.extend(list(passage.questions.all()))

#         # Dataset-based questions
#         dataset_questions = []
#         for dataset in getattr(quiz, "datasets", []).all():
#             dataset_questions.extend(list(dataset.questions.all()))

#         # Combine all visible questions (no duplicates)
#         all_questions = standalone_questions + passage_questions + dataset_questions
#         all_questions = list({q.id: q for q in all_questions}.values())

#         # Cap to your quiz limit (usually 20)
#         QUESTION_LIMIT = 20
#         if len(all_questions) > QUESTION_LIMIT:
#             all_questions = all_questions[:QUESTION_LIMIT]

#         total_questions = len(all_questions)
#         correct_answers = 0
#         details = []


#         # 🔹 Check each question
#         for question in all_questions:
#             choice_id = user_answers.get(question.id)
#             if choice_id:
#                 try:
#                     choice = Choice.objects.get(pk=choice_id, question=question)
#                     is_correct = choice.is_correct
#                     result = "correct" if is_correct else "wrong"
#                     if is_correct:
#                         correct_answers += 1
#                     your_answer = choice.text
#                 except Choice.DoesNotExist:
#                     result = "unanswered"
#                     your_answer = "No answer selected"
#             else:
#                 result = "unanswered"
#                 your_answer = "No answer selected"

#             details.append({
#                 "question": question.text,
#                 "your_answer": your_answer,
#                 "result": result,
#                 "explanation": question.explanation,
#             })

#         # ✅ Validation: ensure all questions answered
#         answered_count = len(user_answers)
#         if answered_count < total_questions:
#             print("📘 QUIZ DEBUG INFO ------------------------------")
#             print(f"Quiz: {quiz.title}")
#             print(f"Displayed questions (shown to user): {total_questions}")
#             print(f"Total questions in DB: {quiz.questions.count()}")
#             print(f"User answered: {answered_count} questions")
#             print("--------------------------------------------------")

#             return Response(
#                 {"error": f"Please answer all questions before submitting. ({answered_count}/{total_questions} answered)"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         # ✅ Compute score accurately
#         score = round((correct_answers / total_questions) * 100, 2)

#         if request.user.is_authenticated:
#             QuizResult.objects.create(
#                 quiz=quiz,
#                 user=request.user,
#                 score=score,
#                 correct=correct_answers,
#                 total=total_questions,
#             )

#         # 🧠 Debug info
#         print("📘 QUIZ DEBUG INFO ------------------------------")
#         print(f"Quiz: {quiz.title}")
#         print(f"Displayed questions (shown to user): {total_questions}")
#         print(f"Total questions in DB: {quiz.questions.count()}")
#         print(f"User answered: {answered_count} questions")
#         print(f"Correct answers: {correct_answers}")
#         print(f"Final score: {score}%")
#         print("--------------------------------------------------")

#         return Response({
#             "quiz": quiz.title,
#             "score": score,
#             "correct": correct_answers,
#             "total": total_questions,
#             "details": details,
#         }, status=status.HTTP_200_OK)

class QuizSubmissionAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, pk):
        try:
            quiz = Quiz.objects.get(pk=pk)
        except Quiz.DoesNotExist:
            return Response({"error": "Quiz not found."}, status=status.HTTP_404_NOT_FOUND)

        # 🧠 Step 1: Parse submitted answers
        answers = request.data.get('answers', [])
        user_answers = {
            a.get('question'): a.get('choice')
            for a in answers if a.get('question') and a.get('choice')
        }

        quiz_type = quiz.quiz_type
        QUESTION_LIMIT = 20

        # 🧠 Step 2: Collect all questions that were actually shown to user
        standalone_questions = list(
            quiz.questions.filter(passage__isnull=True, dataset__isnull=True)
        )

        passage_questions = []
        for passage in quiz.passages.all():
            passage_questions.extend(list(passage.questions.all()))

        dataset_questions = []
        if hasattr(quiz, "datasets"):
            for dataset in quiz.datasets.all():
                dataset_questions.extend(list(dataset.questions.all()))

        # Combine and remove duplicates (by question.id)
        all_questions = {q.id: q for q in (standalone_questions + passage_questions + dataset_questions)}.values()
        all_questions = list(all_questions)

        # Enforce the quiz’s max question limit
        if len(all_questions) > QUESTION_LIMIT:
            all_questions = all_questions[:QUESTION_LIMIT]

        total_questions = len(all_questions)
        correct_answers = 0
        details = []

        # 🧮 Step 3: Check answers
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
                    result = "invalid_choice"
                    your_answer = "Invalid choice (not found)"
            else:
                result = "unanswered"
                your_answer = "No answer selected"

            details.append({
                "question": question.text,
                "your_answer": your_answer,
                "result": result,
                "explanation": question.explanation,
            })

        answered_count = len(user_answers)

        # 🚨 Step 4: Validation
        if answered_count < total_questions:
            print("\n⚠️ QUIZ VALIDATION FAILED ------------------------------")
            print(f"Quiz: {quiz.title}")
            print(f"Displayed questions (shown to user): {total_questions}")
            print(f"Total questions in DB: {quiz.questions.count()}")
            print(f"Standalone questions: {len(standalone_questions)}")
            print(f"Passage-based questions: {len(passage_questions)}")
            print(f"Dataset-based questions: {len(dataset_questions)}")
            print(f"User answered: {answered_count} questions")
            print(f"Unanswered IDs: {[q.id for q in all_questions if q.id not in user_answers]}")
            print("--------------------------------------------------\n")

            return Response(
                {"error": f"Please answer all questions before submitting. ({answered_count}/{total_questions} answered)"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 🧾 Step 5: Compute score
        score = round((correct_answers / total_questions) * 100, 2)

        # 🗂️ Step 6: Save result for logged-in user
        if request.user.is_authenticated:
            QuizResult.objects.create(
                quiz=quiz,
                user=request.user,
                score=score,
                correct=correct_answers,
                total=total_questions,
            )

        # 🧩 Step 7: Debug log (for your terminal)
        print("📘 QUIZ DEBUG INFO ------------------------------")
        print(f"Quiz: {quiz.title}")
        print(f"Displayed (visible) questions sent to user: {total_questions}")
        print(f"Total questions stored in database: {quiz.questions.count()}")
        print(f"Standalone questions: {len(standalone_questions)}")
        print(f"Passage-based questions: {len(passage_questions)}")
        print(f"Dataset-based questions: {len(dataset_questions)}")
        print(f"User answered: {answered_count} / {total_questions}")
        print(f"Correct answers so far: {correct_answers}")
        print("--------------------------------------------------")

        # 🧠 Step 8: Return the API response
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