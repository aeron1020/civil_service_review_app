from django.urls import path
from . import views
from .views import QuizByTypeView, QuizGroupedAPIView, RandomizedByTypeAPIView, RandomizedQuizSubmitAPIView, RandomizedQuizResultAPIView

urlpatterns = [
    path('', views.QuizListAPIView.as_view(), name='quiz-list'),
    path('grouped/', views.QuizGroupedAPIView.as_view(), name='quiz-grouped'),
    path('<int:pk>/', views.QuizDetailAPIView.as_view(), name='quiz-detail'),
    path('<int:pk>/submit/', views.QuizSubmissionAPIView.as_view(), name='quiz-submit'),
    path('results/my/', views.UserResultsAPIView.as_view(), name='user-results'),  
    
    path('by-type/', QuizByTypeView.as_view(), name='quiz-by-type'),
    path('quizzes/grouped/', QuizGroupedAPIView.as_view(), name='quiz-grouped'),
    path("random/", RandomizedByTypeAPIView.as_view(), name="random-quiz-by-type"),
    path("random/submit/", RandomizedQuizSubmitAPIView.as_view(), name="random-quiz-submit"),
    path("random/results/", RandomizedQuizResultAPIView.as_view(), name="randomized_quiz_results"),

]

