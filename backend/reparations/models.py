from django.db import models
from django.core.validators import MinValueValidator
import uuid


class StatutReparation(models.TextChoices):
    RECU = 'RECU', 'Reçu'
    EN_DIAGNOSTIC = 'DIAGNOSTIC', 'En cours de diagnostic'
    ATTENTE_PIECE = 'ATTENTE_PIECE', 'En attente de pièce'
    EN_REPARATION = 'EN_REPARATION', 'En réparation'
    PRET = 'PRET', 'Réparé / Prêt'
    LIVRE = 'LIVRE', 'Livré & Réglé'
    NON_REPARABLE = 'NON_REPARABLE', 'Non réparable'


class TicketReparation(models.Model):
    """Ticket de réparation SAV"""
    # Identifiant unique pour le code-barres
    code_ticket = models.CharField(max_length=20, unique=True, editable=False)
    
    # Client
    client = models.ForeignKey('clients.Client', on_delete=models.SET_NULL, null=True, related_name='reparations')
    nom_client = models.CharField(max_length=100)  # Duplication pour rapidité
    telephone_client = models.CharField(max_length=20)
    
    # Appareil
    marque_appareil = models.CharField(max_length=100)
    modele_appareil = models.CharField(max_length=100)
    imei_ou_serie = models.CharField(max_length=50, blank=True)
    code_deverrouillage = models.CharField(max_length=200, blank=True, help_text="Code PIN ou schéma de déverrouillage")
    
    # Problème et état
    panne_declaree = models.TextField()
    constat_entree = models.TextField(help_text="État général de l'appareil à la réception")
    etat_esthetique = models.TextField(blank=True)
    
    # Coûts
    estimation_prix = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    acompte = models.DecimalField(max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    
    # Statut et dates
    statut = models.CharField(max_length=20, choices=StatutReparation.choices, default=StatutReparation.RECU)
    date_reception = models.DateTimeField(auto_now_add=True)
    date_estimation = models.DateTimeField(blank=True, null=True)
    date_fin = models.DateTimeField(blank=True, null=True)
    
    # Notification
    notification_envoyee = models.BooleanField(default=False)
    
    notes = models.TextField(blank=True)
    
    class Meta:
        verbose_name = "Ticket de réparation"
        verbose_name_plural = "Tickets de réparation"
        ordering = ['-date_reception']
    
    def __str__(self):
        return f"Ticket {self.code_ticket} - {self.marque_appareil} {self.modele_appareil}"
    
    def save(self, *args, **kwargs):
        if not self.code_ticket:
            self.code_ticket = self.generate_code_ticket()
        super().save(*args, **kwargs)
    
    def generate_code_ticket(self):
        """Génère un code unique pour le ticket"""
        return f"REP-{uuid.uuid4().hex[:8].upper()}"
    
    @property
    def reste_a_payer(self):
        total_pieces = sum(piece.cout_total for piece in self.pieces_utilisees.all())
        return self.estimation_prix - self.acompte
    
    @property
    def cout_total(self):
        total_pieces = sum(piece.cout_total for piece in self.pieces_utilisees.all())
        return total_pieces + (self.estimation_prix - total_pieces)  # Main d'œuvre incluse dans estimation


class PieceUtilisee(models.Model):
    """Pièce utilisée pour une réparation"""
    ticket = models.ForeignKey(TicketReparation, on_delete=models.CASCADE, related_name='pieces_utilisees')
    produit = models.ForeignKey('produits.Produit', on_delete=models.SET_NULL, null=True, related_name='utilisations')
    
    quantite = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    cout_unitaire = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    
    class Meta:
        verbose_name = "Pièce utilisée"
        verbose_name_plural = "Pièces utilisées"
    
    def __str__(self):
        return f"{self.produit} x{self.quantite} pour ticket {self.ticket.code_ticket}"
    
    @property
    def cout_total(self):
        return self.quantite * self.cout_unitaire