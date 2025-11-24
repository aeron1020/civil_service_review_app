from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Quiz, Question, Choice, QuizResult, Passage, DataSet
from .serializers import (
    QuizSerializer,
    QuizResultSerializer,
    QuestionSerializer,
    PassageSerializer, DataSetSerializer
)

import random



class QuizListAPIView(generics.ListAPIView):
    queryset = Quiz.objects.filter(is_random=False)
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

    # Define question limits
    QUESTION_LIMITS = {
        'NUM': 20,
        'GEN': 20,
        'CLE': 20,
        'VER': 20, 
        'ANA': 20,  
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

        # Handle ANA, CLE, GEN → simple standalone question sampling
        if quiz_type in ['ANA', 'CLE', 'GEN']:
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

        # Handle NUMERICAL → Data Analysis special logic
        elif quiz_type == 'NUM':
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
        # normalize keys and values to ints (frontend may send strings)
        user_answers = {}
        for a in answers:
            q = a.get("question")
            c = a.get("choice")
            if q is None or c is None:
                continue
            try:
                user_answers[int(q)] = int(c)
            except (ValueError, TypeError):
                # skip malformed entries
                continue

        # 🧩 Step 3 — Identify which questions were shown to the user
        visible_question_ids = request.data.get("visible_questions", [])
        if visible_question_ids:
            # ✅ Use IDs provided by frontend (most accurate)
            all_questions = list(Question.objects.filter(id__in=visible_question_ids))
        else:
            # ⚠️ Fallback to DB sampling (less accurate)
            standalone_qs = quiz.questions.filter(passage__isnull=True, dataset__isnull=True).values_list("id", flat=True)
            passage_qs = Question.objects.filter(passage__quiz=quiz).values_list("id", flat=True)
            dataset_qs = Question.objects.filter(dataset__quiz=quiz).values_list("id", flat=True)
            combined_ids = list(standalone_qs) + list(passage_qs) + list(dataset_qs)
            # remove duplicates while preserving order
            unique_ids = list(dict.fromkeys(combined_ids))
            all_questions = list(Question.objects.filter(id__in=unique_ids)[:20])

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
    

class RandomizedByTypeAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        quiz_type = request.query_params.get("type")
        if not quiz_type:
            return Response({"error": "Missing ?type= parameter."}, status=400)

        quizzes = Quiz.objects.filter(quiz_type=quiz_type)
        if not quizzes.exists():
            return Response({"error": f"No quizzes found for type '{quiz_type}'."}, status=404)

        total_quizzes = quizzes.count()
        final_questions = []
        standalone_questions = []

        passage_data = None
        dataset_data = None

        # ============================================================
        # VERBAL (PASSAGE MODE)
        # ============================================================
        if quiz_type == "VER":
            # Pick one random passage
            passage_source = Passage.objects.filter(quiz__in=quizzes).order_by("?").first()
            passage_question_ids = set()

            if passage_source:
                passage_qs = list(passage_source.questions.all()[:5])
                passage_question_ids = {q.id for q in passage_qs}
                passage_data = PassageSerializer(passage_source, context={"request": request}).data
            else:
                passage_qs = []

            # Fetch standalone questions excluding passage questions
            per_quiz = max(1, 25 // total_quizzes)
            print("PER QUIZ VERBAL:", per_quiz)
            for quiz in quizzes:
                qs = (
                    Question.objects.filter(quiz=quiz, passage__isnull=True)
                    .exclude(id__in=passage_question_ids)
                    .order_by("?")[:per_quiz]
                )
                standalone_questions.extend(qs)

            # Shuffle standalone and combine with passage questions
            standalone_only = standalone_questions[:15]
            random.shuffle(standalone_only)
            final_questions = standalone_only + passage_qs

        # ============================================================
        # NUMERICAL (DATASET MODE)
        # ============================================================
        elif quiz_type == "NUM":
            # Pick one random dataset
            dataset_source = DataSet.objects.filter(quiz__in=quizzes).order_by("?").first()
            dataset_question_ids = set()

            if dataset_source:
                dataset_qs = list(dataset_source.questions.all()[:5])
                dataset_question_ids = {q.id for q in dataset_qs}
                dataset_data = DataSetSerializer(dataset_source, context={"request": request}).data
            else:
                dataset_qs = []

            # Fetch standalone questions excluding dataset questions
            per_quiz = max(1, 15 // total_quizzes)
            for quiz in quizzes:
                qs = (
                    Question.objects.filter(quiz=quiz, dataset__isnull=True)
                    .exclude(id__in=dataset_question_ids)
                    .order_by("?")[:per_quiz]
                )
                standalone_questions.extend(qs)

            standalone_only = standalone_questions[:15]
            random.shuffle(standalone_only)
            final_questions = standalone_only + dataset_qs

        # ============================================================
        # OTHER TYPES - SIMPLE RANDOM
        # ============================================================
        else:
            per_quiz = max(1, 20 // total_quizzes)
            all_qs = []
            for quiz in quizzes:
                qs = Question.objects.filter(quiz=quiz).order_by("?")[:per_quiz]
                all_qs.extend(qs)
            final_questions = list(all_qs)[:20]
            standalone_only = final_questions  # all questions are "standalone"

        # ============================================================
        # SERIALIZE QUESTIONS
        # ============================================================
        if passage_data or dataset_data:
            # Only serialize standalone questions at top level
            serialized_questions = QuestionSerializer(standalone_only, many=True, context={"request": request}).data
        else:
            serialized_questions = QuestionSerializer(final_questions, many=True, context={"request": request}).data

        # ============================================================
        # RETURN RESPONSE
        # ============================================================
        return Response({
            "mode": "random_by_type",
            "quiz_type": quiz_type,
            "delivered": len(final_questions),
            "has_passage": bool(passage_data),
            "has_dataset": bool(dataset_data),
            "passage": passage_data,
            "datasets": [dataset_data] if dataset_data else [],
            "questions": serialized_questions
        })

               

class RandomizedQuizSubmitAPIView(APIView):
    """
    Handles submission of randomized quizzes (mode 2).
    """

    def post(self, request):
        answers = request.data.get("answers", [])
        quiz_type = request.data.get("quiz_type")
        visible_ids = request.data.get("visible_questions", [])

        if not answers or not quiz_type:
            return Response({"error": "Missing required data."}, status=status.HTTP_400_BAD_REQUEST)

        total = len(visible_ids)
        correct = 0
        details = []

        # Build a mapping for submitted answers
        answer_map = {}
        for a in answers:
            q = a.get("question")
            c = a.get("choice")
            if q is None or c is None:
                continue
            try:
                answer_map[int(q)] = int(c)
            except (ValueError, TypeError):
                continue

        # Get only visible questions
        questions = Question.objects.filter(id__in=visible_ids).select_related('quiz', 'passage__quiz', 'dataset__quiz').prefetch_related('choices')

        for q in questions:
            selected_choice_id = answer_map.get(int(q.id))
            correct_choice = next((c for c in q.choices.all() if c.is_correct), None)
            if not correct_choice:
                continue

            is_correct = selected_choice_id == correct_choice.id
            if is_correct:
                correct += 1

            your_answer = None
            if selected_choice_id:
                your_choice = next((c for c in q.choices.all() if c.id == selected_choice_id), None)
                your_answer = your_choice.text if your_choice else "N/A"
            else:
                your_answer = "No answer"

            details.append({
                "id": q.id,
                "question": q.text,
                "your_answer": your_answer,
                "correct_answer": correct_choice.text,
                "result": "Correct" if is_correct else "Wrong",
                "explanation": q.explanation or "No explanation provided.",
            })

        score = round((correct / total) * 100, 2) if total > 0 else 0

        # ✅ Create or link a pseudo "Random Quiz" instance
        if request.user.is_authenticated:
            type_map = {
                "VER": "Verbal Ability",
                "ANA": "Analytical Ability",
                "NUM": "Numerical Ability",
                "GEN": "General Information",
                "CLE": "Clerical Ability",
            }
            quiz_title = f"Random Quiz"

            # Create or reuse a "Random Quiz" entry for this type
            quiz_obj, _ = Quiz.objects.get_or_create(
                title=quiz_title,
                quiz_type=quiz_type,
                defaults={"description": "Auto-generated random quiz set.",
                          "is_random": True,},
                
            )

            QuizResult.objects.create(
                quiz=quiz_obj,  # ✅ now linked
                user=request.user,
                quiz_type=quiz_type,
                score=score,
                correct=correct,
                total=total,
            )

        return Response({
            "quiz_type": quiz_type,
            "score": score,
            "correct": correct,
            "total": total,
            "details": details
        }, status=status.HTTP_200_OK)




class RandomizedQuizResultAPIView(APIView):
    """
    Fetch all past randomized quiz results by type for the authenticated user.
    Example: GET /api/quizzes/random/results/?type=VER
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        quiz_type = request.query_params.get("type")
        if not quiz_type:
            return Response({"error": "Missing ?type= parameter."}, status=400)

        results = QuizResult.objects.filter(
            user=request.user,
            quiz__quiz_type=quiz_type
        ).order_by('-submitted_at')

        serialized = QuizResultSerializer(results, many=True).data
        return Response({
            "quiz_type": quiz_type,
            "count": len(serialized),
            "results": serialized
        })


class UserSummaryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        summary = []
        quiz_types = dict(Quiz.QUIZ_TYPES)

        for code, name in quiz_types.items():
            results = QuizResult.objects.filter(user=user, quiz_type=code)
            if results.exists():
                avg_score = round(sum(r.score for r in results) / len(results), 2)
                best_score = max(r.score for r in results)
                total_quizzes = results.count()
            else:
                avg_score = 0
                best_score = 0
                total_quizzes = 0

            summary.append({
                "code": code,
                "name": name,
                "average_score": avg_score,
                "best_score": best_score,
                "total_quizzes": total_quizzes,
            })

        return Response(summary)