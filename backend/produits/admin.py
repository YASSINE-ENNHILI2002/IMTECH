from django.contrib import admin
from .models import CategorieProduit, Produit, TelephoneOccasion


@admin.register(CategorieProduit)
class CategorieProduitAdmin(admin.ModelAdmin):
    list_display = ['nom', 'description']
    search_fields = ['nom']


@admin.register(Produit)
class ProduitAdmin(admin.ModelAdmin):
    list_display = ['nom', 'code_barres', 'categorie', 'type_stock', 'prix_vente', 'stock', 'est_stock_faible', 'est_actif']
    list_filter = ['categorie', 'type_stock', 'est_actif']
    search_fields = ['nom', 'code_barres', 'marque', 'modele']
    list_editable = ['prix_vente', 'stock', 'est_actif']
    readonly_fields = ['date_creation', 'date_modification']


@admin.register(TelephoneOccasion)
class TelephoneOccasionAdmin(admin.ModelAdmin):
    list_display = ['produit', 'imei1', 'imei2', 'grade', 'etat_batterie', 'statut', 'date_achat', 'prix_achat']
    list_filter = ['grade', 'statut', 'date_achat']
    search_fields = ['imei1', 'imei2', 'numero_serie', 'produit__nom']
    readonly_fields = ['date_achat']
