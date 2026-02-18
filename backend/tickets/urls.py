from django.urls import path
from .views import *

urlpatterns = [
    path('', TicketCreateView.as_view()),
    path('list/', TicketListView.as_view()),
    path('<int:pk>/', TicketUpdateView.as_view()),
    path('stats/', TicketStatsView.as_view()),
    path('classify/', TicketClassifyView.as_view()),
]
