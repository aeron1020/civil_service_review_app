from django.urls import path
from . import views

urlpatterns = [
    path('', views.QuizListAPIView.as_view(), name='quiz-list'),
    path('<int:pk>/', views.QuizDetailAPIView.as_view(), name='quiz-detail'),
]
