from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import FileResponse
from django_filters.rest_framework import DjangoFilterBackend
from .models import Client, Transaction, LigneTransaction
from .serializers import (ClientSerializer, TransactionSerializer, 
                          TransactionListSerializer, LigneTransactionSerializer)
from .pdf_generator import generate_facture_pdf


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type_piece']
    search_fields = ['nom', 'prenom', 'telephone', 'numero_piece']
    ordering_fields = ['nom', 'prenom', 'date_creation']
    ordering = ['-date_creation']


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type_transaction', 'mode_paiement', 'statut']
    search_fields = ['client__nom', 'client__prenom', 'client__telephone']
    ordering_fields = ['date_transaction', 'montant_total']
    ordering = ['-date_transaction']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return TransactionListSerializer
        return TransactionSerializer
    
    @action(detail=True, methods=['post'])
    def completer(self, request, pk=None):
        """Marque une transaction comme complétée"""
        transaction = self.get_object()
        transaction.statut = 'COMPLETE'
        transaction.save()
        
        # Mise à jour des stocks
        for ligne in transaction.lignes.all():
            if ligne.produit:
                if transaction.type_transaction == 'VENTE':
                    ligne.produit.stock -= ligne.quantite
                elif transaction.type_transaction == 'ACHAT':
                    ligne.produit.stock += ligne.quantite
                ligne.produit.save()
        
        # Générer la facture PDF pour les ventes
        if transaction.type_transaction == 'VENTE':
            try:
                pdf_path = generate_facture_pdf(transaction)
                transaction.facture_pdf.name = f'factures/{pdf_path.split("/")[-1]}'
                transaction.save()
            except Exception as e:
                print(f"Erreur lors de la génération de la facture: {e}")
        
        serializer = self.get_serializer(transaction)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def facture_pdf(self, request, pk=None):
        """Retourne le fichier PDF de la facture"""
        transaction = self.get_object()
        
        if not transaction.facture_pdf:
            # Générer la facture si elle n'existe pas
            try:
                pdf_path = generate_facture_pdf(transaction)
                transaction.facture_pdf.name = f'factures/{pdf_path.split("/")[-1]}'
                transaction.save()
            except Exception as e:
                return Response({'error': f'Erreur lors de la génération de la facture: {str(e)}'}, status=500)
        
        if transaction.facture_pdf:
            return FileResponse(
                transaction.facture_pdf.open('rb'),
                content_type='application/pdf',
                filename=f'facture_{transaction.numero_facture}.pdf'
            )
        
        return Response({'error': 'Facture non disponible'}, status=404)


class LigneTransactionViewSet(viewsets.ModelViewSet):
    queryset = LigneTransaction.objects.all()
    serializer_class = LigneTransactionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['transaction', 'produit']
    search_fields = ['produit__nom']