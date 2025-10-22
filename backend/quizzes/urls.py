from django.urls import path
from . import views

urlpatterns = [
    path('', views.QuizListAPIView.as_view(), name='quiz-list'),
    path('grouped/', views.QuizGroupedAPIView.as_view(), name='quiz-grouped'),
    path('<int:pk>/', views.QuizDetailAPIView.as_view(), name='quiz-detail'),
    path('<int:pk>/submit/', views.QuizSubmissionAPIView.as_view(), name='quiz-submit'),
]
