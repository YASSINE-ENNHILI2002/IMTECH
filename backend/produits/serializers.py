from rest_framework import serializers
from .models import CategorieProduit, Produit, TelephoneOccasion


class CategorieProduitSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategorieProduit
        fields = '__all__'


class TelephoneOccasionSerializer(serializers.ModelSerializer):
    produit_nom = serializers.CharField(source='produit.nom', read_only=True)
    
    class Meta:
        model = TelephoneOccasion
        fields = '__all__'


class ProduitSerializer(serializers.ModelSerializer):
    categorie_nom = serializers.CharField(source='categorie.nom', read_only=True)
    est_stock_faible = serializers.BooleanField(read_only=True)
    telephones_occasion = TelephoneOccasionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Produit
        fields = '__all__'


class ProduitListSerializer(serializers.ModelSerializer):
    categorie_nom = serializers.CharField(source='categorie.nom', read_only=True)
    est_stock_faible = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Produit
        fields = ['id', 'code_barres', 'nom', 'categorie_nom', 'type_stock', 'marque', 'modele', 
                  'capacite', 'couleur', 'prix_vente', 'stock', 'est_stock_faible', 'est_actif', 'image_url']