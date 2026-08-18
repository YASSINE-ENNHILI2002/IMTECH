from django.core.management.base import BaseCommand
from clients.models import Client
from decimal import Decimal


class Command(BaseCommand):
    help = 'Alimente la base de donnees avec des clients d\'exemple'

    def handle(self, *args, **options):
        self.stdout.write('Creation des clients d\'exemple...')
        
        clients_data = [
            {
                'nom': 'Dupont',
                'prenom': 'Jean',
                'telephone': '0612345678',
                'type_piece': 'CIN',
                'numero_piece': '1234567890123',
                'email': 'jean.dupont@email.com',
                'adresse': '15 Rue de la Paix, 75001 Paris',
            },
            {
                'nom': 'Martin',
                'prenom': 'Marie',
                'telephone': '0623456789',
                'type_piece': 'CIN',
                'numero_piece': '2345678901234',
                'email': 'marie.martin@email.com',
                'adresse': '22 Avenue des Champs, 75008 Paris',
            },
            {
                'nom': 'Bernard',
                'prenom': 'Pierre',
                'telephone': '0634567890',
                'type_piece': 'PASSEPORT',
                'numero_piece': '12AB34567',
                'email': 'pierre.bernard@email.com',
                'adresse': '8 Boulevard Haussmann, 75009 Paris',
            },
            {
                'nom': 'Petit',
                'prenom': 'Sophie',
                'telephone': '0645678901',
                'type_piece': 'CIN',
                'numero_piece': '3456789012345',
                'email': 'sophie.petit@email.com',
                'adresse': '33 Rue du Commerce, 75015 Paris',
            },
            {
                'nom': 'Robert',
                'prenom': 'Luc',
                'telephone': '0656789012',
                'type_piece': 'CARTE_SEJOUR',
                'numero_piece': '9876543210987',
                'email': 'luc.robert@email.com',
                'adresse': '10 Place de la Concorde, 75008 Paris',
            },
        ]
        
        clients_creates = 0
        for client_data in clients_data:
            client, created = Client.objects.get_or_create(
                telephone=client_data['telephone'],
                defaults=client_data
            )
            if created:
                clients_creates += 1
                self.stdout.write(f'OK - Client cree: {client.prenom} {client.nom}')
            else:
                # Mettre a jour si existe deja
                for key, value in client_data.items():
                    setattr(client, key, value)
                client.save()
                self.stdout.write(f'OK - Client mis a jour: {client.prenom} {client.nom}')
        
        self.stdout.write(self.style.SUCCESS(f'Succes! {clients_creates} clients crees/mis a jour.'))