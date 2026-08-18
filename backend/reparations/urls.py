from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'tickets', views.TicketReparationViewSet, basename='ticket-reparation')
router.register(r'pieces-utilisees', views.PieceUtiliseeViewSet, basename='piece-utilisee')

urlpatterns = [
    path('', include(router.urls)),
]