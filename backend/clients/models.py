from django.db import models
from django.core.validators import MinValueValidator


class TypePieceIdentite(models.TextChoices):
    CIN = 'CIN', 'Carte d\'Identité Nationale'
    PASSEPORT = 'PASSEPORT', 'Passeport'
    CARTE_SEJOUR = 'CARTE_SEJOUR', 'Carte de séjour'


class Client(models.Model):
    """Client ou vendeur pour les transactions"""
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    telephone = models.CharField(max_length=20)
    
    # Document d'identité
    type_piece = models.CharField(max_length=20, choices=TypePieceIdentite.choices)
    numero_piece = models.CharField(max_length=50)
    
    # Documents stockés
    photo_piece = models.ImageField(upload_to='pieces_identite/', blank=True, null=True)
    signature = models.ImageField(upload_to='signatures/', blank=True, null=True)
    
    # Informations supplémentaires
    email = models.EmailField(blank=True)
    adresse = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    
    # Dates
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Client"
        verbose_name_plural = "Clients"
        ordering = ['-date_creation']
    
    def __str__(self):
        return f"{self.prenom} {self.nom} ({self.telephone})"
    
    @property
    def nom_complet(self):
        return f"{self.prenom} {self.nom}"


class TypeTransaction(models.TextChoices):
    VENTE_CLIENT = 'VENTE', 'Vente client'
    ACHAT_OCCAZ = 'ACHAT', 'Achat occasion'


class ModePaiement(models.TextChoices):
    ESPECES = 'ESPECES', 'Espèces'
    CARTE_BANCAIRE = 'CARTE', 'Carte bancaire'
    VIREMENT = 'VIREMENT', 'Virement'
    AVOIR = 'AVOIR', 'Avoir en magasin'
    PAIEMENT_FRACTIONNE = 'FRACTIONNE', 'Paiement fractionné'


class Transaction(models.Model):
    """Transaction d'achat ou de vente"""
    type_transaction = models.CharField(max_length=10, choices=TypeTransaction.choices)
    client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True, related_name='transactions')
    
    date_transaction = models.DateTimeField(auto_now_add=True)
    montant_total = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    mode_paiement = models.CharField(max_length=20, choices=ModePaiement.choices)
    
    # Pour les achats d'occasion
    contrat_pdf = models.FileField(upload_to='contrats/', blank=True, null=True)
    
    # Facture PDF
    facture_pdf = models.FileField(upload_to='factures/', blank=True, null=True)
    numero_facture = models.CharField(max_length=50, unique=True, blank=True, null=True)
    
    # Statut
    statut = models.CharField(max_length=20, choices=[
        ('EN_COURS', 'En cours'),
        ('COMPLETE', 'Complétée'),
        ('ANNULEE', 'Annulée'),
    ], default='EN_COURS')
    
    notes = models.TextField(blank=True)
    
    class Meta:
        verbose_name = "Transaction"
        verbose_name_plural = "Transactions"
        ordering = ['-date_transaction']
    
    def __str__(self):
        return f"{self.get_type_transaction_display()} - {self.client} - {self.montant_total}€"
    
    def save(self, *args, **kwargs):
        if not self.numero_facture and self.type_transaction == 'VENTE':
            from django.utils import timezone
            year = timezone.now().year
            month = timezone.now().month
            count = Transaction.objects.filter(
                type_transaction='VENTE',
                date_transaction__year=year,
                date_transaction__month=month
            ).count() + 1
            self.numero_facture = f"FAC-{year}{month:02d}-{count:04d}"
        super().save(*args, **kwargs)


class LigneTransaction(models.Model):
    """Ligne de transaction (produit vendu/acheté)"""
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='lignes')
    produit = models.ForeignKey('produits.Produit', on_delete=models.SET_NULL, null=True, related_name='lignes_transaction')
    telephone_occasion = models.ForeignKey('produits.TelephoneOccasion', on_delete=models.SET_NULL, blank=True, null=True, related_name='lignes_transaction')
    
    quantite = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    prix_unitaire = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    
    # Garantie associée
    garantie_mois = models.IntegerField(default=12)
    
    class Meta:
        verbose_name = "Ligne de transaction"
        verbose_name_plural = "Lignes de transaction"
    
    def __str__(self):
        return f"{self.produit or self.telephone_occasion} x{self.quantite} - {self.prix_unitaire}€"
    
    @property
    def total(self):
        return self.quantite * self.prix_unitaire