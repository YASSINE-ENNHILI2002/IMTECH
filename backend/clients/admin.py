from django.contrib import admin
from .models import Client, Transaction, LigneTransaction


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ['nom', 'prenom', 'telephone', 'type_piece', 'numero_piece', 'date_creation']
    list_filter = ['type_piece', 'date_creation']
    search_fields = ['nom', 'prenom', 'telephone', 'numero_piece']
    readonly_fields = ['date_creation', 'date_modification']


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['type_transaction', 'client', 'date_transaction', 'montant_total', 'mode_paiement', 'statut']
    list_filter = ['type_transaction', 'mode_paiement', 'statut', 'date_transaction']
    search_fields = ['client__nom', 'client__prenom', 'client__telephone']
    readonly_fields = ['date_transaction']


@admin.register(LigneTransaction)
class LigneTransactionAdmin(admin.ModelAdmin):
    list_display = ['transaction', 'produit', 'telephone_occasion', 'quantite', 'prix_unitaire', 'total']
    list_filter = ['transaction__type_transaction']
    search_fields = ['produit__nom', 'telephone_occasion__imei1']
