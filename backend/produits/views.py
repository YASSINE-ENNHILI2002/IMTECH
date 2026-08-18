from rest_framework import viewsets, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import F
from django_filters.rest_framework import DjangoFilterBackend
from .models import CategorieProduit, Produit, TelephoneOccasion
from .serializers import (CategorieProduitSerializer, ProduitSerializer, 
                          ProduitListSerializer, TelephoneOccasionSerializer)


class CategorieProduitViewSet(viewsets.ModelViewSet):
    queryset = CategorieProduit.objects.all()
    serializer_class = CategorieProduitSerializer


class ProduitViewSet(viewsets.ModelViewSet):
    queryset = Produit.objects.all()
    serializer_class = ProduitSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categorie', 'type_stock', 'est_actif']
    search_fields = ['nom', 'code_barres', 'marque', 'modele']
    ordering_fields = ['nom', 'prix_vente', 'stock', 'date_creation']
    ordering = ['-date_creation']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProduitListSerializer
        return ProduitSerializer
    
    @action(detail=False, methods=['get'])
    def stock_faible(self, request):
        """Retourne les produits avec stock faible"""
        produits = self.queryset.filter(stock__lte=F('stock_min'))
        serializer = self.get_serializer(produits, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def par_code_barres(self, request):
        """Recherche un produit par code-barres"""
        code_barres = request.query_params.get('code', None)
        if code_barres:
            produit = self.queryset.filter(code_barres=code_barres).first()
            if produit:
                serializer = self.get_serializer(produit)
                return Response(serializer.data)
        return Response({'error': 'Produit non trouvé'}, status=404)


class TelephoneOccasionViewSet(viewsets.ModelViewSet):
    queryset = TelephoneOccasion.objects.all()
    serializer_class = TelephoneOccasionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['produit', 'grade', 'statut']
    search_fields = ['imei1', 'imei2', 'numero_serie']
    ordering_fields = ['date_achat', 'prix_achat']
    ordering = ['-date_achat']


# Public API endpoints for storefront
@api_view(['GET'])
@permission_classes([AllowAny])
def public_catalog(request):
    """API publique pour la vitrine - produits actifs uniquement"""
    products = Produit.objects.filter(est_actif=True, stock__gt=0)
    serializer = ProduitListSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def public_categories(request):
    """API publique pour les catégories"""
    categories = CategorieProduit.objects.all()
    serializer = CategorieProduitSerializer(categories, many=True)
    return Response(serializer.data)