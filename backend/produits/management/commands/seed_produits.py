from django.core.management.base import BaseCommand
from produits.models import Produit, CategorieProduit, TelephoneOccasion
from decimal import Decimal


class Command(BaseCommand):
    help = 'Alimente la base de donnees avec des produits d\'exemple'

    def handle(self, *args, **options):
        self.stdout.write('Creation des categories et produits d\'exemple...')
        
        # Créer les catégories
        categories_data = [
            {'nom': 'Smartphones', 'description': 'Téléphones intelligents neufs'},
            {'nom': 'Accessoires', 'description': 'Coques, câbles, chargeurs'},
            {'nom': 'Pièces de rechange', 'description': 'Écrans, batteries, composants'},
            {'nom': 'Cartes SIM', 'description': 'Cartes SIM et forfaits'},
            {'nom': 'Écouteurs', 'description': 'Écouteurs et casques audio'},
        ]
        
        for cat_data in categories_data:
            categorie, created = CategorieProduit.objects.get_or_create(
                nom=cat_data['nom'],
                defaults=cat_data
            )
            if created:
                self.stdout.write(f'OK - Categorie creee: {categorie.nom}')
        
        # Récupérer les catégories
        smartphones_cat = CategorieProduit.objects.get(nom='Smartphones')
        accessoires_cat = CategorieProduit.objects.get(nom='Accessoires')
        pieces_cat = CategorieProduit.objects.get(nom='Pièces de rechange')
        cartes_cat = CategorieProduit.objects.get(nom='Cartes SIM')
        ecouteurs_cat = CategorieProduit.objects.get(nom='Écouteurs')
        
        # Créer les produits
        produits_data = [
            # Smartphones
            {
                'code_barres': '1234567890123',
                'nom': 'iPhone 15 Pro Max 256GB',
                'categorie': smartphones_cat,
                'type_stock': 'QUANTITE',
                'marque': 'Apple',
                'modele': 'iPhone 15 Pro Max',
                'capacite': '256 Go',
                'couleur': 'Titane naturel',
                'prix_achat': Decimal('950.00'),
                'prix_vente': Decimal('1299.00'),
                'stock': 5,
                'stock_min': 2,
                'description': 'iPhone 15 Pro Max avec puce A17 Pro, titanium',
                'image_url': 'https://example.com/iphone15.jpg',
                'garantie_mois': 24,
            },
            {
                'code_barres': '1234567890124',
                'nom': 'Samsung Galaxy S24 Ultra 512GB',
                'categorie': smartphones_cat,
                'type_stock': 'QUANTITE',
                'marque': 'Samsung',
                'modele': 'Galaxy S24 Ultra',
                'capacite': '512 Go',
                'couleur': 'Noir titane',
                'prix_achat': Decimal('850.00'),
                'prix_vente': Decimal('1199.00'),
                'stock': 3,
                'stock_min': 2,
                'description': 'Samsung Galaxy S24 Ultra avec S Pen et IA',
                'image_url': 'https://example.com/s24.jpg',
                'garantie_mois': 24,
            },
            {
                'code_barres': '1234567890125',
                'nom': 'Google Pixel 8 Pro 128GB',
                'categorie': smartphones_cat,
                'type_stock': 'QUANTITE',
                'marque': 'Google',
                'modele': 'Pixel 8 Pro',
                'capacite': '128 Go',
                'couleur': 'Obsidienne',
                'prix_achat': Decimal('650.00'),
                'prix_vente': Decimal('899.00'),
                'stock': 4,
                'stock_min': 2,
                'description': 'Google Pixel 8 Pro avec IA avancée',
                'image_url': 'https://example.com/pixel8.jpg',
                'garantie_mois': 24,
            },
            # Accessoires
            {
                'code_barres': '2345678901234',
                'nom': 'Coque iPhone 15 Pro Max - Silicone',
                'categorie': accessoires_cat,
                'type_stock': 'QUANTITE',
                'marque': 'Apple',
                'modele': 'Coque Silicone',
                'prix_achat': Decimal('15.00'),
                'prix_vente': Decimal('29.00'),
                'stock': 20,
                'stock_min': 5,
                'description': 'Coque officielle Apple en silicone',
                'image_url': 'https://example.com/coque.jpg',
                'garantie_mois': 12,
            },
            {
                'code_barres': '2345678901235',
                'nom': 'Cable USB-C vers Lightning 1m',
                'categorie': accessoires_cat,
                'type_stock': 'QUANTITE',
                'marque': 'Apple',
                'modele': 'Cable USB-C Lightning',
                'prix_achat': Decimal('12.00'),
                'prix_vente': Decimal('25.00'),
                'stock': 30,
                'stock_min': 10,
                'description': 'Cable de charge officiel Apple',
                'image_url': 'https://example.com/cable.jpg',
                'garantie_mois': 12,
            },
            {
                'code_barres': '2345678901236',
                'nom': 'Chargeur rapide 20W USB-C',
                'categorie': accessoires_cat,
                'type_stock': 'QUANTITE',
                'marque': 'Apple',
                'modele': 'Chargeur 20W',
                'prix_achat': Decimal('18.00'),
                'prix_vente': Decimal('35.00'),
                'stock': 25,
                'stock_min': 8,
                'description': 'Chargeur rapide USB-C 20W Apple',
                'image_url': 'https://example.com/chargeur.jpg',
                'garantie_mois': 12,
            },
            # Pièces de rechange
            {
                'code_barres': '3456789012345',
                'nom': 'Ecran iPhone 14 Pro Max OLED',
                'categorie': pieces_cat,
                'type_stock': 'QUANTITE',
                'marque': 'Apple',
                'modele': 'Ecran OLED',
                'prix_achat': Decimal('120.00'),
                'prix_vente': Decimal('250.00'),
                'stock': 8,
                'stock_min': 3,
                'description': 'Ecran de remplacement OLED pour iPhone 14 Pro Max',
                'image_url': 'https://example.com/ecran.jpg',
                'garantie_mois': 6,
            },
            {
                'code_barres': '3456789012346',
                'nom': 'Batterie iPhone 13',
                'categorie': pieces_cat,
                'type_stock': 'QUANTITE',
                'marque': 'Apple',
                'modele': 'Batterie',
                'prix_achat': Decimal('25.00'),
                'prix_vente': Decimal('60.00'),
                'stock': 15,
                'stock_min': 5,
                'description': 'Batterie de remplacement pour iPhone 13',
                'image_url': 'https://example.com/batterie.jpg',
                'garantie_mois': 6,
            },
            # Cartes SIM
            {
                'code_barres': '4567890123456',
                'nom': 'Carte SIM Orange Prépayée',
                'categorie': cartes_cat,
                'type_stock': 'QUANTITE',
                'marque': 'Orange',
                'modele': 'SIM Prépayée',
                'prix_achat': Decimal('2.00'),
                'prix_vente': Decimal('9.99'),
                'stock': 50,
                'stock_min': 20,
                'description': 'Carte SIM prépayée Orange avec 10€ de crédit',
                'image_url': 'https://example.com/sim.jpg',
                'garantie_mois': 3,
            },
            # Écouteurs
            {
                'code_barres': '5678901234567',
                'nom': 'AirPods Pro 2ème génération',
                'categorie': ecouteurs_cat,
                'type_stock': 'QUANTITE',
                'marque': 'Apple',
                'modele': 'AirPods Pro 2',
                'prix_achat': Decimal('180.00'),
                'prix_vente': Decimal('279.00'),
                'stock': 10,
                'stock_min': 3,
                'description': 'AirPods Pro avec boîtier Mag USB-C',
                'image_url': 'https://example.com/airpods.jpg',
                'garantie_mois': 24,
            },
        ]
        
        produits_creates = 0
        for prod_data in produits_data:
            code_barres = prod_data.pop('code_barres')
            produit, created = Produit.objects.get_or_create(
                code_barres=code_barres,
                defaults=prod_data
            )
            if created:
                produits_creates += 1
                self.stdout.write(f'OK - Produit cree: {produit.nom}')
            else:
                for key, value in prod_data.items():
                    setattr(produit, key, value)
                produit.save()
                self.stdout.write(f'OK - Produit mis a jour: {produit.nom}')
        
        # Créer des téléphones d'occasion avec IMEI
        iphone_occasion = Produit.objects.get(nom='iPhone 15 Pro Max 256GB')
        
        telephones_data = [
            {
                'produit': iphone_occasion,
                'imei1': '353245123456789',
                'imei2': '353245123456790',
                'numero_serie': 'DNPXK2XXXXX',
                'grade': 'A',
                'etat_cosmetique': 'Comme neuf, aucune rayure visible',
                'etat_batterie': 95,
                'statut': 'EN_STOCK',
                'prix_achat': Decimal('750.00'),
            },
            {
                'produit': iphone_occasion,
                'imei1': '353245123456791',
                'imei2': '353245123456792',
                'numero_serie': 'DNPXK2YYYYY',
                'grade': 'B',
                'etat_cosmetique': 'Petites rayures sur le dos, écran parfait',
                'etat_batterie': 88,
                'statut': 'EN_STOCK',
                'prix_achat': Decimal('680.00'),
            },
            {
                'produit': iphone_occasion,
                'imei1': '353245123456793',
                'imei2': None,
                'numero_serie': 'DNPXK2ZZZZZ',
                'grade': 'C',
                'etat_cosmetique': 'Rayures sur écran et coque, fonctionne parfaitement',
                'etat_batterie': 75,
                'statut': 'EN_TEST',
                'prix_achat': Decimal('550.00'),
            },
        ]
        
        for tel_data in telephones_data:
            telephone, created = TelephoneOccasion.objects.get_or_create(
                imei1=tel_data['imei1'],
                defaults=tel_data
            )
            if created:
                self.stdout.write(f'OK - Telephone occasion cree: IMEI {telephone.imei1}')
        
        self.stdout.write(self.style.SUCCESS(f'Succes! {produits_creates} produits crees/mis a jour.'))
