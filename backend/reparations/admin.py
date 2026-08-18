from django.contrib import admin
from .models import TicketReparation, PieceUtilisee


@admin.register(TicketReparation)
class TicketReparationAdmin(admin.ModelAdmin):
    list_display = ['code_ticket', 'nom_client', 'telephone_client', 'marque_appareil', 'modele_appareil', 'statut', 'date_reception', 'estimation_prix']
    list_filter = ['statut', 'date_reception', 'date_fin']
    search_fields = ['code_ticket', 'nom_client', 'telephone_client', 'imei_ou_serie']
    readonly_fields = ['code_ticket', 'date_reception', 'reste_a_payer', 'cout_total']


@admin.register(PieceUtilisee)
class PieceUtiliseeAdmin(admin.ModelAdmin):
    list_display = ['ticket', 'produit', 'quantite', 'cout_unitaire', 'cout_total']
    list_filter = ['ticket__statut']
    search_fields = ['produit__nom', 'ticket__code_ticket']
