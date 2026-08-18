from rest_framework import serializers
from .models import Client, Transaction, LigneTransaction


class ClientSerializer(serializers.ModelSerializer):
    nom_complet = serializers.CharField(read_only=True)
    
    class Meta:
        model = Client
        fields = '__all__'


class LigneTransactionSerializer(serializers.ModelSerializer):
    produit_nom = serializers.CharField(source='produit.nom', read_only=True)
    total = serializers.DecimalField(read_only=True, max_digits=10, decimal_places=2)
    
    class Meta:
        model = LigneTransaction
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    client_details = ClientSerializer(source='client', read_only=True)
    client_nom = serializers.SerializerMethodField()
    lignes = LigneTransactionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Transaction
        fields = '__all__'
    
    def get_client_nom(self, obj):
        if obj.client:
            return f"{obj.client.prenom} {obj.client.nom}"
        return "Client inconnu"


class TransactionListSerializer(serializers.ModelSerializer):
    client_nom = serializers.SerializerMethodField()
    nombre_articles = serializers.SerializerMethodField()
    
    class Meta:
        model = Transaction
        fields = ['id', 'type_transaction', 'client_nom', 'date_transaction', 
                  'montant_total', 'mode_paiement', 'statut', 'nombre_articles']
    
    def get_client_nom(self, obj):
        if obj.client:
            return f"{obj.client.prenom} {obj.client.nom}"
        return "Client inconnu"
    
    def get_nombre_articles(self, obj):
        return obj.lignes.count()