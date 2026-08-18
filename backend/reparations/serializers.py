from rest_framework import serializers
from .models import TicketReparation, PieceUtilisee


class PieceUtiliseeSerializer(serializers.ModelSerializer):
    produit_nom = serializers.CharField(source='produit.nom', read_only=True)
    cout_total = serializers.DecimalField(read_only=True, max_digits=10, decimal_places=2)
    
    class Meta:
        model = PieceUtilisee
        fields = '__all__'


class TicketReparationSerializer(serializers.ModelSerializer):
    pieces_utilisees = PieceUtiliseeSerializer(many=True, read_only=True)
    reste_a_payer = serializers.DecimalField(read_only=True, max_digits=10, decimal_places=2)
    cout_total = serializers.DecimalField(read_only=True, max_digits=10, decimal_places=2)
    
    class Meta:
        model = TicketReparation
        fields = '__all__'


class TicketReparationListSerializer(serializers.ModelSerializer):
    client_nom = serializers.SerializerMethodField()
    nom_appareil = serializers.SerializerMethodField()
    
    class Meta:
        model = TicketReparation
        fields = ['id', 'code_ticket', 'client_nom', 'nom_appareil', 'statut', 
                  'date_reception', 'estimation_prix', 'acompte']
    
    def get_client_nom(self, obj):
        return f"{obj.nom_client}"
    
    def get_nom_appareil(self, obj):
        return f"{obj.marque_appareil} {obj.modele_appareil}"