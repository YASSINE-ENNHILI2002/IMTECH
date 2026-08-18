from django.core.management.base import BaseCommand
from reparations.models import TicketReparation, PieceUtilisee
from clients.models import Client
from produits.models import Produit
from decimal import Decimal
from datetime import datetime, timedelta


class Command(BaseCommand):
    help = 'Alimente la base de donnees avec des tickets de reparation d\'exemple'

    def handle(self, *args, **options):
        self.stdout.write('Creation des tickets de reparation d\'exemple...')
        
        # Récupérer des clients existants ou en créer
        client1, _ = Client.objects.get_or_create(
            telephone='0612345678',
            defaults={
                'nom': 'Dupont',
                'prenom': 'Jean',
                'type_piece': 'CIN',
                'numero_piece': '1234567890123',
                'email': 'jean.dupont@email.com',
                'adresse': '15 Rue de la Paix, 75001 Paris',
            }
        )
        
        client2, _ = Client.objects.get_or_create(
            telephone='0623456789',
            defaults={
                'nom': 'Martin',
                'prenom': 'Marie',
                'type_piece': 'CIN',
                'numero_piece': '2345678901234',
                'email': 'marie.martin@email.com',
                'adresse': '22 Avenue des Champs, 75008 Paris',
            }
        )
        
        # Récupérer des produits pour les pièces
        ecran_iphone, _ = Produit.objects.get_or_create(
            code_barres='3456789012345',
            defaults={
                'nom': 'Ecran iPhone 14 Pro Max OLED',
                'prix_achat': Decimal('120.00'),
                'prix_vente': Decimal('250.00'),
                'stock': 8,
            }
        )
        
        batterie_iphone, _ = Produit.objects.get_or_create(
            code_barres='3456789012346',
            defaults={
                'nom': 'Batterie iPhone 13',
                'prix_achat': Decimal('25.00'),
                'prix_vente': Decimal('60.00'),
                'stock': 15,
            }
        )
        
        # Créer les tickets de réparation
        tickets_data = [
            {
                'client': client1,
                'nom_client': 'Jean Dupont',
                'telephone_client': '0612345678',
                'marque_appareil': 'Apple',
                'modele_appareil': 'iPhone 14 Pro Max',
                'imei_ou_serie': '353245123456789',
                'code_deverrouillage': '1234',
                'panne_declaree': 'Ecran fissuré, tactile fonctionne partiellement',
                'constat_entree': 'Ecran avec fissure en bas à gauche, tactile réactif à 70%',
                'etat_esthetique': 'Rayures légères sur le dos, coque en bon état',
                'estimation_prix': Decimal('180.00'),
                'acompte': Decimal('50.00'),
                'statut': 'EN_REPARATION',
                'date_reception': datetime.now() - timedelta(days=2),
            },
            {
                'client': client2,
                'nom_client': 'Marie Martin',
                'telephone_client': '0623456789',
                'marque_appareil': 'Samsung',
                'modele_appareil': 'Galaxy S22',
                'imei_ou_serie': '356789012345678',
                'code_deverrouillage': '5678',
                'panne_declaree': 'Batterie se décharge très rapidement',
                'constat_entree': 'Batterie à 65% de santé maximale, téléphone chaud en utilisation',
                'etat_esthetique': 'Bon état général',
                'estimation_prix': Decimal('80.00'),
                'acompte': Decimal('30.00'),
                'statut': 'PRET',
                'date_reception': datetime.now() - timedelta(days=5),
                'date_fin': datetime.now() - timedelta(days=1),
            },
            {
                'client': None,
                'nom_client': 'Pierre Bernard',
                'telephone_client': '0634567890',
                'marque_appareil': 'Apple',
                'modele_appareil': 'iPhone 13',
                'imei_ou_serie': '353245123456790',
                'code_deverrouillage': '',
                'panne_declaree': 'Ne charge plus, port USB-C endommagé',
                'constat_entree': 'Port de charge oxydé, câble ne tient pas en place',
                'etat_esthetique': 'Usure normale',
                'estimation_prix': Decimal('120.00'),
                'acompte': Decimal('0.00'),
                'statut': 'EN_DIAGNOSTIC',
                'date_reception': datetime.now() - timedelta(hours=3),
            },
            {
                'client': client1,
                'nom_client': 'Jean Dupont',
                'telephone_client': '0612345678',
                'marque_appareil': 'Xiaomi',
                'modele_appareil': 'Redmi Note 12',
                'imei_ou_serie': '865432109876543',
                'code_deverrouillage': '9999',
                'panne_declaree': 'Haut-parleur ne fonctionne plus',
                'constat_entree': 'Haut-parleur muet, vibreur OK',
                'etat_esthetique': 'Très bon état',
                'estimation_prix': Decimal('45.00'),
                'acompte': Decimal('20.00'),
                'statut': 'LIVRE',
                'date_reception': datetime.now() - timedelta(days=10),
                'date_fin': datetime.now() - timedelta(days=8),
            },
            {
                'client': None,
                'nom_client': 'Sophie Petit',
                'telephone_client': '0645678901',
                'marque_appareil': 'Google',
                'modele_appareil': 'Pixel 7',
                'imei_ou_serie': '351234567890123',
                'code_deverrouillage': '',
                'panne_declaree': 'Appareil ne s\'allume plus',
                'constat_entree': 'Aucune réaction, pas de charge, pas de vibration',
                'etat_esthetique': 'Écran intact',
                'estimation_prix': Decimal('0.00'),
                'acompte': Decimal('0.00'),
                'statut': 'NON_REPARABLE',
                'date_reception': datetime.now() - timedelta(days=7),
                'date_fin': datetime.now() - timedelta(days=6),
            },
        ]
        
        tickets_creates = 0
        for ticket_data in tickets_data:
            client = ticket_data.pop('client', None)
            date_reception = ticket_data.pop('date_reception', None)
            date_fin = ticket_data.pop('date_fin', None)
            
            ticket, created = TicketReparation.objects.get_or_create(
                nom_client=ticket_data['nom_client'],
                marque_appareil=ticket_data['marque_appareil'],
                modele_appareil=ticket_data['modele_appareil'],
                defaults=ticket_data
            )
            
            if created:
                if client:
                    ticket.client = client
                if date_reception:
                    ticket.date_reception = date_reception
                if date_fin:
                    ticket.date_fin = date_fin
                ticket.save()
                tickets_creates += 1
                self.stdout.write(f'OK - Ticket cree: {ticket.code_ticket}')
                
                # Ajouter des pièces pour certains tickets
                if ticket.marque_appareil == 'Apple' and ticket.modele_appareil == 'iPhone 14 Pro Max':
                    PieceUtilisee.objects.create(
                        ticket=ticket,
                        produit=ecran_iphone,
                        quantite=1,
                        cout_unitaire=Decimal('120.00')
                    )
                    self.stdout.write(f'  - Piece ajoutee: Ecran iPhone')
                
                if ticket.marque_appareil == 'Samsung' and ticket.statut == 'PRET':
                    PieceUtilisee.objects.create(
                        ticket=ticket,
                        produit=batterie_iphone,
                        quantite=1,
                        cout_unitaire=Decimal('25.00')
                    )
                    self.stdout.write(f'  - Piece ajoutee: Batterie')
            else:
                self.stdout.write(f'OK - Ticket existe deja: {ticket.code_ticket}')
        
        self.stdout.write(self.style.SUCCESS(f'Succes! {tickets_creates} tickets de reparation crees.'))
