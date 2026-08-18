from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import TicketReparation, PieceUtilisee
from .serializers import (TicketReparationSerializer, TicketReparationListSerializer, 
                          PieceUtiliseeSerializer)


class TicketReparationViewSet(viewsets.ModelViewSet):
    queryset = TicketReparation.objects.all()
    serializer_class = TicketReparationSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['statut', 'date_reception']
    search_fields = ['code_ticket', 'nom_client', 'telephone_client', 'imei_ou_serie']
    ordering_fields = ['date_reception', 'date_fin']
    ordering = ['-date_reception']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return TicketReparationListSerializer
        return TicketReparationSerializer
    
    @action(detail=True, methods=['post'])
    def changer_statut(self, request, pk=None):
        """Change le statut du ticket de réparation"""
        ticket = self.get_object()
        nouveau_statut = request.data.get('statut')
        
        if nouveau_statut in [choice[0] for choice in ticket.StatutReparation.choices]:
            ticket.statut = nouveau_statut
            if nouveau_statut == 'PRET':
                from django.utils import timezone
                ticket.date_fin = timezone.now()
            ticket.save()
            
            serializer = self.get_serializer(ticket)
            return Response(serializer.data)
        
        return Response({'error': 'Statut invalide'}, status=400)
    
    @action(detail=True, methods=['post'])
    def ajouter_piece(self, request, pk=None):
        """Ajoute une pièce utilisée à la réparation"""
        ticket = self.get_object()
        produit_id = request.data.get('produit_id')
        quantite = request.data.get('quantite', 1)
        cout_unitaire = request.data.get('cout_unitaire')
        
        from produits.models import Produit
        try:
            produit = Produit.objects.get(id=produit_id)
        except Produit.DoesNotExist:
            return Response({'error': 'Produit non trouvé'}, status=404)
        
        piece = PieceUtilisee.objects.create(
            ticket=ticket,
            produit=produit,
            quantite=quantite,
            cout_unitaire=cout_unitaire
        )
        
        # Déduction du stock
        produit.stock -= quantite
        produit.save()
        
        serializer = PieceUtiliseeSerializer(piece)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def notifier_client(self, request, pk=None):
        """Marque la notification comme envoyée"""
        ticket = self.get_object()
        ticket.notification_envoyee = True
        ticket.save()
        
        serializer = self.get_serializer(ticket)
        return Response(serializer.data)


class PieceUtiliseeViewSet(viewsets.ModelViewSet):
    queryset = PieceUtilisee.objects.all()
    serializer_class = PieceUtiliseeSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['ticket', 'produit']
    search_fields = ['produit__nom']