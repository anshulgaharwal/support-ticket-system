from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Avg
from django.db.models.functions import TruncDate
from django.db.models import F
from .models import Ticket
from .serializers import TicketSerializer
from .services.llm_service import classify_ticket


class TicketCreateView(generics.CreateAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer



class TicketListView(generics.ListAPIView):
    queryset = Ticket.objects.all().order_by('-created_at')
    serializer_class = TicketSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'priority', 'status']
    search_fields = ['title', 'description']



class TicketUpdateView(generics.UpdateAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    http_method_names = ['patch']


class TicketStatsView(APIView):

    def get(self, request):

        total_tickets = Ticket.objects.count()
        open_tickets = Ticket.objects.filter(status='open').count()

        # DB-level aggregation for average tickets per day
        daily_counts = (
            Ticket.objects
            .annotate(day=TruncDate('created_at'))
            .values('day')
            .annotate(count=Count('id'))
        )

        avg_tickets_per_day = daily_counts.aggregate(
            avg=Avg('count')
        )['avg'] or 0

        # Priority breakdown
        priority_data = (
            Ticket.objects
            .values('priority')
            .annotate(count=Count('id'))
        )

        priority_breakdown = {
            item['priority']: item['count']
            for item in priority_data
        }

        # Category breakdown
        category_data = (
            Ticket.objects
            .values('category')
            .annotate(count=Count('id'))
        )

        category_breakdown = {
            item['category']: item['count']
            for item in category_data
        }

        return Response({
            "total_tickets": total_tickets,
            "open_tickets": open_tickets,
            "avg_tickets_per_day": round(avg_tickets_per_day, 2),
            "priority_breakdown": priority_breakdown,
            "category_breakdown": category_breakdown,
        })


class TicketClassifyView(APIView):

    def post(self, request):
        description = request.data.get("description")

        if not description:
            return Response(
                {"error": "Description required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        result = classify_ticket(description)

        if not result:
            return Response({
                "suggested_category": None,
                "suggested_priority": None
            })

        # Validate suggestion against allowed choices
        valid_categories = dict(Ticket.CATEGORY_CHOICES).keys()
        valid_priorities = dict(Ticket.PRIORITY_CHOICES).keys()

        category = result.get("suggested_category")
        priority = result.get("suggested_priority")

        if category not in valid_categories:
            category = None

        if priority not in valid_priorities:
            priority = None

        return Response({
            "suggested_category": category,
            "suggested_priority": priority
        })
