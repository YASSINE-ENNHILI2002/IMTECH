from django.db import models
from django.core.validators import MinValueValidator


class CategorieProduit(models.Model):
    nom = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    
    class Meta:
        verbose_name = "Catégorie de produit"
        verbose_name_plural = "Catégories de produits"
    
    def __str__(self):
        return self.nom


class TypeStock(models.TextChoices):
    UNITE_UNIQUE_IMEI = 'UNIQUE_IMEI', 'Unité unique (avec IMEI)'
    QUANTITE_VRAC = 'QUANTITE', 'Quantité en vrac'


class Produit(models.Model):
    code_barres = models.CharField(max_length=50, unique=True, blank=True, null=True)
    nom = models.CharField(max_length=200)
    categorie = models.ForeignKey(CategorieProduit, on_delete=models.SET_NULL, null=True, related_name='produits')
    type_stock = models.CharField(max_length=20, choices=TypeStock.choices, default=TypeStock.QUANTITE_VRAC)
    
    # Pour les téléphones avec IMEI
    marque = models.CharField(max_length=100, blank=True)
    modele = models.CharField(max_length=100, blank=True)
    capacite = models.CharField(max_length=50, blank=True)  # ex: "64 Go"
    couleur = models.CharField(max_length=50, blank=True)
    
    # Prix et stock
    prix_achat = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    prix_vente = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    stock = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    stock_min = models.IntegerField(default=5, validators=[MinValueValidator(0)])
    
    # Informations supplémentaires
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True, help_text="URL de l'image du produit")
    garantie_mois = models.IntegerField(default=12, help_text="Garantie en mois")
    
    # Statut et dates
    est_actif = models.BooleanField(default=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Produit"
        verbose_name_plural = "Produits"
        ordering = ['-date_creation']
    
    def __str__(self):
        return f"{self.nom} ({self.code_barres or 'Sans code-barres'})"
    
    @property
    def est_stock_faible(self):
        return self.stock <= self.stock_min


class TelephoneOccasion(models.Model):
    """Téléphone d'occasion avec IMEI unique"""
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE, related_name='telephones_occasion')
    imei1 = models.CharField(max_length=15, unique=True)
    imei2 = models.CharField(max_length=15, blank=True, null=True)
    numero_serie = models.CharField(max_length=50, blank=True)
    
    # État du téléphone
    grade = models.CharField(max_length=1, choices=[('A', 'Grade A'), ('B', 'Grade B'), ('C', 'Grade C')], default='B')
    etat_cosmetique = models.TextField(help_text="Description de l'état (rayures, fissures, etc.)")
    etat_batterie = models.IntegerField(help_text="État de la batterie en %", validators=[MinValueValidator(0)])
    
    # Statut
    statut = models.CharField(max_length=20, choices=[
        ('EN_TEST', 'En test'),
        ('EN_RECONDITIONNEMENT', 'En reconditionnement'),
        ('EN_STOCK', 'En stock prêt pour la vente'),
        ('VENDU', 'Vendu'),
        ('RESTITUE', 'Restitué'),
    ], default='EN_TEST')
    
    # Historique d'achat
    date_achat = models.DateTimeField(auto_now_add=True)
    prix_achat = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        verbose_name = "Téléphone d'occasion"
        verbose_name_plural = "Téléphones d'occasion"
    
    def __str__(self):
        return f"{self.produit.nom} - IMEI: {self.imei1}"