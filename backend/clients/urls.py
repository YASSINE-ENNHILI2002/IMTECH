from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'clients', views.ClientViewSet, basename='client')
router.register(r'transactions', views.TransactionViewSet, basename='transaction')
router.register(r'lignes-transaction', views.LigneTransactionViewSet, basename='ligne-transaction')

urlpatterns = [
    path('', include(router.urls)),
]