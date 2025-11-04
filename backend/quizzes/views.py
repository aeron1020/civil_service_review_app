from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import QuizSerializer, QuizResultSerializer
import random
from rest_framework import status
from .models import Quiz, Question, Choice, QuizResult
from rest_framework.permissions import IsAuthenticated, AllowAny 


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

#     # Custom limits per quiz type
#     QUESTION_LIMITS = {
#         'NUM': 20,
#         'CLE': 20,
#         'GEN': 20,
#         'VER': 20,  # standalone + passage questions
#         'ANA': 20,  # standalone + dataset questions
#     }

#     def get_object(self):
#         """Retrieve and prepare randomized quiz questions."""
#         if hasattr(self, "_cached_quiz"):
#             return self._cached_quiz

#         quiz = super().get_object()
#         quiz_type = quiz.quiz_type
#         limit = self.QUESTION_LIMITS.get(quiz_type, 20)

#         # 🔹 Randomize standalone (non-passage, non-dataset) questions
#         standalone_qs = list(
#             quiz.questions.filter(passage__isnull=True, dataset__isnull=True).distinct()
#         )
#         random.shuffle(standalone_qs)
#         quiz.sampled_questions = standalone_qs[:limit]

#         # Initialize
#         quiz.randomized_passages = []
#         quiz.randomized_datasets = []

#         # 🔹 VERBAL ABILITY: add one random passage + its questions
#         if quiz_type == "VER":
#             passages = list(quiz.passages.all())
#             if passages:
#                 chosen_passage = random.choice(passages)
#                 quiz.randomized_passages = [chosen_passage]
#                 passage_questions = list(chosen_passage.questions.all())
#                 quiz.sampled_questions += passage_questions

#         # 🔹 ANALYTICAL ABILITY: add one random dataset + its questions
#         elif quiz_type == "ANA":
#             if hasattr(quiz, "datasets"):
#                 datasets = list(quiz.datasets.all())
#                 if datasets:
#                     chosen_dataset = random.choice(datasets)
#                     quiz.randomized_datasets = [chosen_dataset]
#                     dataset_questions = list(chosen_dataset.questions.all())
#                     quiz.sampled_questions += dataset_questions

#         # ✅ Final failsafe — enforce absolute max of 20 questions
#         MAX_QUESTIONS = 20
#         quiz.sampled_questions = quiz.sampled_questions[:MAX_QUESTIONS]

#         # 🧠 Debug info (for backend console)
#         print("📘 QUIZ DEBUG INFO ------------------------------")
#         print(f"Quiz: {quiz.title}")
#         print(f"Displayed questions (shown to user): {len(quiz.sampled_questions)}")
#         print(f"Total questions in database: {quiz.questions.count()}")
#         print("--------------------------------------------------")

#         # Cache
#         self._cached_quiz = quiz
#         return quiz

#     def get_serializer_context(self):
#         """Include randomized data in serializer context."""
#         context = super().get_serializer_context()
#         quiz = self.get_object()
#         context.update({
#             "sampled_questions": getattr(quiz, "sampled_questions", []),
#             "randomized_passages": getattr(quiz, "randomized_passages", []),
#             "randomized_datasets": getattr(quiz, "randomized_datasets", []),
#         })
#         return context

class QuizDetailAPIView(generics.RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [AllowAny]

    # Define question limits
    QUESTION_LIMITS = {
        'NUM': 20,
        'GEN': 20,
        'CLE': 20,
        'VER': 20,  # fallback limit if not passage-based
        'ANA': 20,  # fallback limit if not dataset-based
    }

    def get_object(self):
        """Retrieve and prepare randomized quiz questions per quiz type."""
        if hasattr(self, "_cached_quiz"):
            return self._cached_quiz

        quiz = super().get_object()
        quiz_type = quiz.quiz_type

        # Initialize dynamic attributes
        quiz.sampled_questions = []
        quiz.randomized_passages = []
        quiz.randomized_datasets = []

        # Handle NUM, CLE, GEN → simple standalone question sampling
        if quiz_type in ['NUM', 'CLE', 'GEN']:
            questions = list(
                quiz.questions.filter(passage__isnull=True, dataset__isnull=True)
            )
            random.shuffle(questions)
            quiz.sampled_questions = questions[: self.QUESTION_LIMITS[quiz_type]]

        # Handle VERBAL → Reading Comprehension special logic
        elif quiz_type == 'VER':
            passages = list(quiz.passages.all())

            # ✅ Reading comprehension version
            if passages:
                random.shuffle(passages)
                selected_passages = passages[:2]  # pick 2 passages only
                quiz.randomized_passages = selected_passages

                passage_questions = []
                for p in selected_passages:
                    qset = list(p.questions.all())
                    random.shuffle(qset)
                    passage_questions.extend(qset[:5])  # 5 Qs per passage

                quiz.sampled_questions = passage_questions

            else:
                # fallback to standalone verbal questions
                standalone = list(
                    quiz.questions.filter(passage__isnull=True, dataset__isnull=True)
                )
                random.shuffle(standalone)
                quiz.sampled_questions = standalone[: self.QUESTION_LIMITS[quiz_type]]

        # Handle ANALYTICAL → Data Analysis special logic
        elif quiz_type == 'ANA':
            datasets = list(quiz.datasets.all())

            # ✅ Data analysis version
            if datasets:
                random.shuffle(datasets)
                selected_datasets = datasets[:2]
                quiz.randomized_datasets = selected_datasets

                dataset_questions = []
                for d in selected_datasets:
                    qset = list(d.questions.all())
                    random.shuffle(qset)
                    dataset_questions.extend(qset[:5])  # 5 Qs per dataset

                quiz.sampled_questions = dataset_questions

            else:
                # fallback to standalone analytical questions
                standalone = list(
                    quiz.questions.filter(passage__isnull=True, dataset__isnull=True)
                )
                random.shuffle(standalone)
                quiz.sampled_questions = standalone[: self.QUESTION_LIMITS[quiz_type]]

        # ✅ Hard limit (safety cap)
        MAX_QUESTIONS = 20
        quiz.sampled_questions = quiz.sampled_questions[:MAX_QUESTIONS]

        print("📘 QUIZ MODE 1 DEBUG ------------------------------")
        print(f"Quiz: {quiz.title}")
        print(f"Type: {quiz.get_quiz_type_display()}")
        print(f"Total questions delivered: {len(quiz.sampled_questions)}")
        print(f"Passages included: {len(quiz.randomized_passages)}")
        print(f"Datasets included: {len(quiz.randomized_datasets)}")
        print("--------------------------------------------------")

        self._cached_quiz = quiz
        return quiz

    def get_serializer_context(self):
        context = super().get_serializer_context()
        quiz = self.get_object()
        context.update({
            "sampled_questions": getattr(quiz, "sampled_questions", []),
            "randomized_passages": getattr(quiz, "randomized_passages", []),
            "randomized_datasets": getattr(quiz, "randomized_datasets", []),
        })
        return context


class QuizGroupedAPIView(APIView):
    """Return quizzes grouped by quiz_type with readable labels."""

    permission_classes = [AllowAny]

    def get(self, request):
        grouped = []

        for code, label in Quiz.QUIZ_TYPES:
            quizzes = Quiz.objects.filter(quiz_type=code)
            serialized = QuizSerializer(quizzes, many=True).data

            grouped.append({
                "code": code,
                "label": label,
                "quizzes": serialized,
                "count": quizzes.count()
            })

        return Response({
            "groups": grouped,
            "total": Quiz.objects.count()
        })


# class QuizSubmissionAPIView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request, pk):
#         try:
#             quiz = Quiz.objects.get(pk=pk)
#         except Quiz.DoesNotExist:
#             return Response({"error": "Quiz not found."}, status=status.HTTP_404_NOT_FOUND)

#         # 🧠 Step 1: Parse submitted answers
#         answers = request.data.get('answers', [])
#         user_answers = {
#             a.get('question'): a.get('choice')
#             for a in answers if a.get('question') and a.get('choice')
#         }

#         QUESTION_LIMIT = 20

#         # 🧠 Step 2: Collect all questions that were actually shown to user
#         standalone_questions = list(
#             quiz.questions.filter(passage__isnull=True, dataset__isnull=True)
#         )

#         passage_questions = []
#         for passage in quiz.passages.all():
#             passage_questions.extend(list(passage.questions.all()))

#         dataset_questions = []
#         if hasattr(quiz, "datasets"):
#             for dataset in quiz.datasets.all():
#                 dataset_questions.extend(list(dataset.questions.all()))

#         visible_question_ids = request.data.get("visible_questions", [])
#         if visible_question_ids:
#             # Use only the questions the frontend said were visible
#             all_questions = list(Question.objects.filter(id__in=visible_question_ids))
#         else:
#             # fallback (old logic)
#             all_questions = list({
#                 q.id: q for q in (
#                     quiz.questions.filter(passage__isnull=True, dataset__isnull=True) |
#                     Question.objects.filter(passage__quiz=quiz) |
#                     Question.objects.filter(dataset__quiz=quiz)
#                 )
#             }.values())
#             all_questions = all_questions[:QUESTION_LIMIT]

#         print(f"User answered IDs: {list(user_answers.keys())}")
#         print(f"Visible question IDs: {visible_question_ids}")
#         print(f"Backend checking IDs: {[q.id for q in all_questions]}")



#         total_questions = len(all_questions)
#         correct_answers = 0
#         details = []

#         # 🧮 Step 3: Check answers
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
#                     result = "invalid_choice"
#                     your_answer = "Invalid choice (not found)"
#             else:
#                 result = "unanswered"
#                 your_answer = "No answer selected"

#             details.append({
#                 "question": question.text,
#                 "your_answer": your_answer,
#                 "result": result,
#                 "explanation": question.explanation,
#             })

#         answered_count = len(user_answers)

#         # 🚨 Step 4: Validation
#         if answered_count < total_questions:
#             print("\n⚠️ QUIZ VALIDATION FAILED ------------------------------")
#             print(f"Quiz: {quiz.title}")
#             print(f"Displayed questions (shown to user): {total_questions}")
#             print(f"Total questions in DB: {quiz.questions.count()}")
#             print(f"Standalone questions: {len(standalone_questions)}")
#             print(f"Passage-based questions: {len(passage_questions)}")
#             print(f"Dataset-based questions: {len(dataset_questions)}")
#             print(f"User answered: {answered_count} questions")
#             print(f"Unanswered IDs: {[q.id for q in all_questions if q.id not in user_answers]}")
#             print("--------------------------------------------------\n")

#             return Response(
#                 {"error": f"Please answer all questions before submitting. ({answered_count}/{total_questions} answered)"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         # 🧾 Step 5: Compute score
#         score = round((correct_answers / total_questions) * 100, 2)

#         # 🗂️ Step 6: Save result for logged-in user
#         if request.user.is_authenticated:
#             QuizResult.objects.create(
#                 quiz=quiz,
#                 user=request.user,
#                 score=score,
#                 correct=correct_answers,
#                 total=total_questions,
#             )

#         # 🧩 Step 7: Debug log (for your terminal)
#         print("📘 QUIZ DEBUG INFO ------------------------------")
#         print(f"Quiz: {quiz.title}")
#         print(f"Displayed (visible) questions sent to user: {total_questions}")
#         print(f"Total questions stored in database: {quiz.questions.count()}")
#         print(f"Standalone questions: {len(standalone_questions)}")
#         print(f"Passage-based questions: {len(passage_questions)}")
#         print(f"Dataset-based questions: {len(dataset_questions)}")
#         print(f"User answered: {answered_count} / {total_questions}")
#         print(f"Correct answers so far: {correct_answers}")
#         print("--------------------------------------------------")

#         # 🧠 Step 8: Return the API response

#         debug_info = {
#         "user_answers": user_answers,  # question_id → choice_id
#         "checked_questions": [q.id for q in all_questions],
#         "checked_question_texts": [q.text for q in all_questions],
#         "standalone_count": len(standalone_questions),
#         "passage_count": len(passage_questions),
#         "dataset_count": len(dataset_questions),
#         "quiz_type": quiz.quiz_type,

        
# }
#         print("\n🧩 QUIZ DEBUG FRONTEND TRACE ------------------------------")
#         print(f"Quiz ID: {quiz.id} | {quiz.title}")
#         print(f"Quiz type: {quiz.quiz_type}")
#         print(f"User answered IDs: {list(user_answers.keys())}")
#         print(f"Backend checked IDs: {[q.id for q in all_questions]}")
#         print(f"Answered count: {answered_count} / {total_questions}")
#         print(f"Score: {score}")
#         print("-----------------------------------------------------------\n")

#         return Response({
#             "quiz": quiz.title,
#             "score": score,
#             "correct": correct_answers,
#             "total": total_questions,
#             "details": details,
#             "debug": debug_info,
#         }, status=status.HTTP_200_OK)


class QuizSubmissionAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, pk):
        """
        Handles quiz submission and scoring. Supports all quiz types:
        - Regular quizzes (20 questions)
        - Reading comprehension / data analysis (10 questions = 2 passages × 5)
        - Uses `visible_questions` sent from frontend to ensure 1:1 match.
        """

        # 🧱 Step 1 — Validate Quiz
        try:
            quiz = Quiz.objects.get(pk=pk)
        except Quiz.DoesNotExist:
            return Response({"error": "Quiz not found."}, status=status.HTTP_404_NOT_FOUND)

        # 🧠 Step 2 — Parse Submitted Answers
        answers = request.data.get("answers", [])
        user_answers = {
            str(a.get("question")): a.get("choice")
            for a in answers
            if a.get("question") and a.get("choice")
        }

        # 🧩 Step 3 — Identify which questions were shown to the user
        visible_question_ids = request.data.get("visible_questions", [])
        if visible_question_ids:
            # ✅ Use IDs provided by frontend (most accurate)
            all_questions = list(Question.objects.filter(id__in=visible_question_ids))
        else:
            # ⚠️ Fallback to DB sampling (less accurate)
            standalone_qs = quiz.questions.filter(passage__isnull=True, dataset__isnull=True)
            passage_qs = Question.objects.filter(passage__quiz=quiz)
            dataset_qs = Question.objects.filter(dataset__quiz=quiz)
            all_questions = list(set(list(standalone_qs) + list(passage_qs) + list(dataset_qs)))[:20]

        total_questions = len(all_questions)
        correct_answers = 0
        details = []

        # 🧮 Step 4 — Evaluate Answers
        for question in all_questions:
            qid = str(question.id)
            choice_id = user_answers.get(qid)
            if choice_id:
                try:
                    choice = Choice.objects.get(pk=choice_id, question=question)
                    is_correct = choice.is_correct
                    result = "correct" if is_correct else "wrong"
                    your_answer = choice.text
                    if is_correct:
                        correct_answers += 1
                except Choice.DoesNotExist:
                    result = "invalid_choice"
                    your_answer = "Invalid choice"
            else:
                result = "unanswered"
                your_answer = "No answer selected"

            details.append({
                "id": question.id,
                "question": question.text,
                "your_answer": your_answer,
                "result": result,
                "explanation": question.explanation,
            })

        answered_count = len(user_answers)

        # 🚨 Step 5 — Validate Completion
        if answered_count < total_questions:
            print("\n⚠️ QUIZ VALIDATION WARNING ------------------------------")
            print(f"Quiz: {quiz.title} ({quiz.quiz_type})")
            print(f"Displayed questions: {total_questions}")
            print(f"User answered: {answered_count}")
            print(f"Missing IDs: {[q.id for q in all_questions if str(q.id) not in user_answers]}")
            print("-----------------------------------------------------------\n")

            return Response(
                {"error": f"Please answer all questions before submitting. ({answered_count}/{total_questions})"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 🧾 Step 6 — Compute Score
        score = round((correct_answers / total_questions) * 100, 2)

        # 🗂️ Step 7 — Save Result (if authenticated)
        if request.user.is_authenticated:
            QuizResult.objects.create(
                quiz=quiz,
                user=request.user,
                score=score,
                correct=correct_answers,
                total=total_questions,
            )

        # 🧩 Step 8 — Debug + Response
        debug_info = {
            "quiz_id": quiz.id,
            "quiz_type": quiz.quiz_type,
            "visible_question_ids": visible_question_ids,
            "checked_question_ids": [q.id for q in all_questions],
            "answered_question_ids": list(user_answers.keys()),
            "standalone_count": quiz.questions.filter(passage__isnull=True, dataset__isnull=True).count(),
            "passage_count": quiz.passages.count(),
            "dataset_count": getattr(quiz, "datasets", []).count() if hasattr(quiz, "datasets") else 0,
        }

        print("\n📘 QUIZ SUBMISSION LOG ------------------------------")
        print(f"Quiz: {quiz.title} ({quiz.quiz_type})")
        print(f"User answered {answered_count}/{total_questions}")
        print(f"Score: {score}% | Correct: {correct_answers}/{total_questions}")
        print("------------------------------------------------------\n")

        return Response({
            "quiz": quiz.title,
            "quiz_type": quiz.quiz_type,
            "score": score,
            "correct": correct_answers,
            "total": total_questions,
            "details": details,
            "debug": debug_info,
        }, status=status.HTTP_200_OK)


class UserResultsAPIView(generics.ListAPIView):
    serializer_class = QuizResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return QuizResult.objects.filter(user=self.request.user).order_by('-submitted_at')
    

class QuizByTypeView(APIView):
    def get(self, request):
        quizzes = Quiz.objects.all()
        grouped = {}

        for quiz in quizzes:
            qtype = quiz.quiz_type
            if qtype not in grouped:
                grouped[qtype] = []
            grouped[qtype].append(QuizSerializer(quiz).data)

        return Response(grouped)