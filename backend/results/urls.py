from django.urls import path
from .views import ResultListCreateAPIView, SubmitQuizAPIView

urlpatterns = [
    path('', ResultListCreateAPIView.as_view(), name='result-list-create'),
    path('submit/', SubmitQuizAPIView.as_view(), name='submit-quiz'),
]
