from django.core.management.base import BaseCommand
from produits.models import CategorieProduit, Produit
from decimal import Decimal


class Command(BaseCommand):
    help = 'Alimente la base de données avec des données d\'exemple'

    def handle(self, *args, **options):
        self.stdout.write('Creation des donnees d\'exemple...')
        
        # Créer les catégories
        categories_data = [
            {'nom': 'Téléphones Neufs', 'description': 'Smartphones neufs avec garantie constructeur'},
            {'nom': 'Téléphones Occasion', 'description': 'Smartphones reconditionnés et d\'occasion'},
            {'nom': 'Protection Écran', 'description': 'Verres trempés et films de protection'},
            {'nom': 'Coques & Étuis', 'description': 'Coques de protection pour tous les modèles'},
            {'nom': 'Chargeurs & Câbles', 'description': 'Chargeurs et câbles de recharge'},
            {'nom': 'Audio & Écouteurs', 'description': 'Écouteurs et casques audio'},
            {'nom': 'Batteries & Pièces', 'description': 'Batteries et pièces de rechange'},
            {'nom': 'Accessoires Auto', 'description': 'Supports et accessoires voiture'},
        ]
        
        categories = {}
        for cat_data in categories_data:
            categorie, created = CategorieProduit.objects.get_or_create(
                nom=cat_data['nom'],
                defaults={'description': cat_data['description']}
            )
            categories[categorie.nom] = categorie
            if created:
                self.stdout.write(f'OK - Categorie creee: {categorie.nom}')
        
        # Créer les produits avec images du web
        produits_data = [
            # Téléphones Neufs
            {
                'nom': 'iPhone 15 Pro Max 256GB',
                'code_barres': '190199764845',
                'categorie': categories['Téléphones Neufs'],
                'type_stock': 'UNIQUE_IMEI',
                'marque': 'Apple',
                'modele': 'iPhone 15 Pro Max',
                'capacite': '256 Go',
                'couleur': 'Titane Naturel',
                'prix_achat': Decimal('900.00'),
                'prix_vente': Decimal('1299.00'),
                'stock': 5,
                'stock_min': 2,
                'garantie_mois': 24,
                'description': 'iPhone 15 Pro Max avec puce A17 Pro, système photo avancé et design en titane.',
                'image_url': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=400',
            },
            {
                'nom': 'Samsung Galaxy S24 Ultra 512GB',
                'code_barres': '8806094259123',
                'categorie': categories['Téléphones Neufs'],
                'type_stock': 'UNIQUE_IMEI',
                'marque': 'Samsung',
                'modele': 'Galaxy S24 Ultra',
                'capacite': '512 Go',
                'couleur': 'Titanium Violet',
                'prix_achat': Decimal('950.00'),
                'prix_vente': Decimal('1399.00'),
                'stock': 3,
                'stock_min': 2,
                'garantie_mois': 24,
                'description': 'Samsung Galaxy S24 Ultra avec IA, S Pen et caméra 200MP.',
                'image_url': 'https://images.samsung.com/is/image/samsung/p6pim/fr/2401/gallery/fr-galaxy-s24-s928-sm-s928bztqef-thumb-539573063',
            },
            {
                'nom': 'Google Pixel 8 Pro 128GB',
                'code_barres': '193575003121',
                'categorie': categories['Téléphones Neufs'],
                'type_stock': 'UNIQUE_IMEI',
                'marque': 'Google',
                'modele': 'Pixel 8 Pro',
                'capacite': '128 Go',
                'couleur': 'Obsidienne',
                'prix_achat': Decimal('650.00'),
                'prix_vente': Decimal('899.00'),
                'stock': 4,
                'stock_min': 2,
                'garantie_mois': 24,
                'description': 'Google Pixel 8 Pro avec intelligence artificielle et caméra exceptionnelle.',
                'image_url': 'https://store.google.com/product/image/pixel_8_pro_obsidian/3753377714538746144?width=400',
            },
            {
                'nom': 'Xiaomi Redmi Note 13 Pro 256GB',
                'code_barres': '6941812702955',
                'categorie': categories['Téléphones Neufs'],
                'type_stock': 'UNIQUE_IMEI',
                'marque': 'Xiaomi',
                'modele': 'Redmi Note 13 Pro',
                'capacite': '256 Go',
                'couleur': 'Noir',
                'prix_achat': Decimal('280.00'),
                'prix_vente': Decimal('399.00'),
                'stock': 8,
                'stock_min': 3,
                'garantie_mois': 24,
                'description': 'Xiaomi Redmi Note 13 Pro avec écran AMOLED 120Hz et caméra 200MP.',
                'image_url': 'https://image.cdn.is.nexu.com/image/9e8f3a2f-4d1a-4e9a-8c5f-1d8e2c3a4b5f?width=400',
            },
            
            # Protection Écran
            {
                'nom': 'Verre Trempé iPhone 15 Series',
                'code_barres': '3700609402951',
                'categorie': categories['Protection Écran'],
                'type_stock': 'QUANTITE',
                'marque': 'Spigen',
                'modele': 'iPhone 15',
                'prix_achat': Decimal('2.50'),
                'prix_vente': Decimal('9.99'),
                'stock': 50,
                'stock_min': 10,
                'garantie_mois': 6,
                'description': 'Verre trempé 9H ultra-résistant pour iPhone 15, 15 Plus, 15 Pro, 15 Pro Max.',
                'image_url': 'https://www.spigen.com/cdn/shop/products/1_front_1_975x975.jpg?v=1695145200',
            },
            {
                'nom': 'Film Protection Galaxy S24 Ultra',
                'code_barres': '3700609402952',
                'categorie': categories['Protection Écran'],
                'type_stock': 'QUANTITE',
                'marque': 'Samsung',
                'modele': 'Galaxy S24 Ultra',
                'prix_achat': Decimal('3.00'),
                'prix_vente': Decimal('12.99'),
                'stock': 40,
                'stock_min': 10,
                'garantie_mois': 6,
                'description': 'Film de protection officiel Samsung pour Galaxy S24 Ultra.',
                'image_url': 'https://images.samsung.com/is/image/samsung/p6pim/fr/2401/gallery/fr-galaxy-s24-s928-sm-s928bzafeuf-thumb-539573149',
            },
            {
                'nom': 'Verre Trempé Universel 6.5"',
                'code_barres': '3700609402953',
                'categorie': categories['Protection Écran'],
                'type_stock': 'QUANTITE',
                'marque': 'Générique',
                'modele': 'Universel',
                'prix_achat': Decimal('1.50'),
                'prix_vente': Decimal('5.99'),
                'stock': 100,
                'stock_min': 20,
                'garantie_mois': 3,
                'description': 'Verre trempé universel pour écrans jusqu\'à 6.5 pouces.',
                'image_url': 'https://m.media-amazon.com/images/I/61ZqF7uJfPL._AC_SL1500_',
            },
            
            # Coques & Étuis
            {
                'nom': 'Coque iPhone 15 Pro Max - Silicone',
                'code_barres': '190199764846',
                'categorie': categories['Coques & Étuis'],
                'type_stock': 'QUANTITE',
                'marque': 'Apple',
                'modele': 'iPhone 15 Pro Max',
                'couleur': 'Bleu Océan',
                'prix_achat': Decimal('15.00'),
                'prix_vente': Decimal('49.99'),
                'stock': 25,
                'stock_min': 5,
                'garantie_mois': 12,
                'description': 'Coque officielle Apple en silicone pour iPhone 15 Pro Max.',
                'image_url': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MYMP3?wid=400',
            },
            {
                'nom': 'Coque Galaxy S24 Ultra - Armor Case',
                'code_barres': '8806094259124',
                'categorie': categories['Coques & Étuis'],
                'type_stock': 'QUANTITE',
                'marque': 'Spigen',
                'modele': 'Galaxy S24 Ultra',
                'couleur': 'Noir',
                'prix_achat': Decimal('12.00'),
                'prix_vente': Decimal('34.99'),
                'stock': 30,
                'stock_min': 8,
                'garantie_mois': 12,
                'description': 'Coque de protection renforcée Spigen Armor Case pour Galaxy S24 Ultra.',
                'image_url': 'https://www.spigen.com/cdn/shop/products/1_front_975x975.jpg?v=1705000000',
            },
            {
                'nom': 'Étui Magnétique AirPods Pro',
                'code_barres': '190199764847',
                'categorie': categories['Coques & Étuis'],
                'type_stock': 'QUANTITE',
                'marque': 'Apple',
                'modele': 'AirPods Pro',
                'prix_achat': Decimal('8.00'),
                'prix_vente': Decimal('29.99'),
                'stock': 20,
                'stock_min': 5,
                'garantie_mois': 12,
                'description': 'Étui de protection magnétique pour AirPods Pro.',
                'image_url': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MWYF3?wid=400',
            },
            
            # Chargeurs & Câbles
            {
                'nom': 'Chargeur Rapide 20W USB-C Apple',
                'code_barres': '190199764848',
                'categorie': categories['Chargeurs & Câbles'],
                'type_stock': 'QUANTITE',
                'marque': 'Apple',
                'modele': '20W USB-C Power Adapter',
                'prix_achat': Decimal('12.00'),
                'prix_vente': Decimal('29.99'),
                'stock': 35,
                'stock_min': 10,
                'garantie_mois': 12,
                'description': 'Chargeur rapide 20W officiel Apple pour iPhone et iPad.',
                'image_url': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MHDA3?wid=400',
            },
            {
                'nom': 'Câble Lightning vers USB-C 1m',
                'code_barres': '190199764849',
                'categorie': categories['Chargeurs & Câbles'],
                'type_stock': 'QUANTITE',
                'marque': 'Apple',
                'modele': 'Lightning to USB-C Cable',
                'prix_achat': Decimal('8.00'),
                'prix_vente': Decimal('22.99'),
                'stock': 50,
                'stock_min': 15,
                'garantie_mois': 12,
                'description': 'Câble de charge et synchronisation Lightning vers USB-C officiel Apple.',
                'image_url': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MTLN3?wid=400',
            },
            {
                'nom': 'Chargeur Sans Fil MagSafe',
                'code_barres': '190199764850',
                'categorie': categories['Chargeurs & Câbles'],
                'type_stock': 'QUANTITE',
                'marque': 'Apple',
                'modele': 'MagSafe Charger',
                'prix_achat': Decimal('25.00'),
                'prix_vente': Decimal('49.99'),
                'stock': 20,
                'stock_min': 5,
                'garantie_mois': 12,
                'description': 'Chargeur sans fil MagSafe officiel Apple pour iPhone 12 et supérieurs.',
                'image_url': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MHXH3?wid=400',
            },
            {
                'nom': 'Batterie Externe 20000mAh USB-C',
                'code_barres': '3700609402954',
                'categorie': categories['Chargeurs & Câbles'],
                'type_stock': 'QUANTITE',
                'marque': 'Anker',
                'modele': 'PowerCore 20000',
                'prix_achat': Decimal('25.00'),
                'prix_vente': Decimal('49.99'),
                'stock': 25,
                'stock_min': 8,
                'garantie_mois': 18,
                'description': 'Batterie externe Anker 20000mAh avec charge rapide USB-C.',
                'image_url': 'https://m.media-amazon.com/images/I/61Gwv+UyP4L._AC_SL1500_',
            },
            
            # Audio & Écouteurs
            {
                'nom': 'AirPods Pro 2ème Génération',
                'code_barres': '190199764851',
                'categorie': categories['Audio & Écouteurs'],
                'type_stock': 'QUANTITE',
                'marque': 'Apple',
                'modele': 'AirPods Pro (2e génération)',
                'prix_achat': Decimal('180.00'),
                'prix_vente': Decimal('279.99'),
                'stock': 15,
                'stock_min': 3,
                'garantie_mois': 24,
                'description': 'AirPods Pro 2ème génération avec réduction active du bruit et son spatial.',
                'image_url': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=400',
            },
            {
                'nom': 'Galaxy Buds2 Pro',
                'code_barres': '8806094259125',
                'categorie': categories['Audio & Écouteurs'],
                'type_stock': 'QUANTITE',
                'marque': 'Samsung',
                'modele': 'Galaxy Buds2 Pro',
                'couleur': 'Noir',
                'prix_achat': Decimal('120.00'),
                'prix_vente': Decimal('199.99'),
                'stock': 18,
                'stock_min': 5,
                'garantie_mois': 24,
                'description': 'Écouteurs Bluetooth Samsung Galaxy Buds2 Pro avec réduction de bruit.',
                'image_url': 'https://images.samsung.com/is/image/samsung/p6pim/fr/2208/gallery/fr-galaxy-buds2-pro-r510-sm-r510nzaeb-thumb-535838006',
            },
            {
                'nom': 'Écouteurs Bluetooth TWS Pro',
                'code_barres': '3700609402955',
                'categorie': categories['Audio & Écouteurs'],
                'type_stock': 'QUANTITE',
                'marque': 'Xiaomi',
                'modele': 'Redmi Buds 5 Pro',
                'prix_achat': Decimal('35.00'),
                'prix_vente': Decimal('69.99'),
                'stock': 30,
                'stock_min': 10,
                'garantie_mois': 12,
                'description': 'Écouteurs Bluetooth Xiaomi Redmi Buds 5 Pro avec réduction de bruit.',
                'image_url': 'https://image.cdn.is.nexu.com/image/a1b2c3d4-5e6f-7g8h-9i0j-1k2l3m4n5o6p?width=400',
            },
            
            # Batteries & Pièces
            {
                'nom': 'Batterie iPhone 14 Pro Max',
                'code_barres': '190199764852',
                'categorie': categories['Batteries & Pièces'],
                'type_stock': 'QUANTITE',
                'marque': 'Apple',
                'modele': 'iPhone 14 Pro Max',
                'prix_achat': Decimal('35.00'),
                'prix_vente': Decimal('89.99'),
                'stock': 10,
                'stock_min': 3,
                'garantie_mois': 12,
                'description': 'Batterie de remplacement officielle Apple pour iPhone 14 Pro Max.',
                'image_url': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MYEP3?wid=400',
            },
            {
                'nom': 'Écran Remplacement iPhone 13',
                'code_barres': '190199764853',
                'categorie': categories['Batteries & Pièces'],
                'type_stock': 'QUANTITE',
                'marque': 'OEM',
                'modele': 'iPhone 13',
                'prix_achat': Decimal('45.00'),
                'prix_vente': Decimal('129.99'),
                'stock': 8,
                'stock_min': 2,
                'garantie_mois': 6,
                'description': 'Écran OLED de remplacement pour iPhone 13 avec tactile.',
                'image_url': 'https://m.media-amazon.com/images/I/61QqF7uJfPL._AC_SL1500_',
            },
            
            # Accessoires Auto
            {
                'nom': 'Support Voiture MagSafe',
                'code_barres': '190199764854',
                'categorie': categories['Accessoires Auto'],
                'type_stock': 'QUANTITE',
                'marque': 'Apple',
                'modele': 'MagSafe Charger Mount',
                'prix_achat': Decimal('20.00'),
                'prix_vente': Decimal('49.99'),
                'stock': 20,
                'stock_min': 5,
                'garantie_mois': 12,
                'description': 'Support de voiture avec charge MagSafe pour iPhone.',
                'image_url': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MXNF3?wid=400',
            },
            {
                'nom': 'Support Ventouse Universel',
                'code_barres': '3700609402956',
                'categorie': categories['Accessoires Auto'],
                'type_stock': 'QUANTITE',
                'marque': 'Générique',
                'modele': 'Universel',
                'prix_achat': Decimal('5.00'),
                'prix_vente': Decimal('14.99'),
                'stock': 40,
                'stock_min': 10,
                'garantie_mois': 6,
                'description': 'Support de voiture avec ventouse pour smartphones 4-7 pouces.',
                'image_url': 'https://m.media-amazon.com/images/I/71Gwv+UyP4L._AC_SL1500_',
            },
        ]
        
        produits_creates = 0
        for produit_data in produits_data:
            image_url = produit_data.pop('image_url', None)
            produit, created = Produit.objects.get_or_create(
                code_barres=produit_data['code_barres'],
                defaults=produit_data
            )
            if created:
                produits_creates += 1
                self.stdout.write(f'OK - Produit cree: {produit.nom} - {produit.prix_vente}€')
            else:
                # Mettre à jour si existe déjà
                for key, value in produit_data.items():
                    setattr(produit, key, value)
                produit.save()
                self.stdout.write(f'OK - Produit mis a jour: {produit.nom}')
        
        self.stdout.write(self.style.SUCCESS(f'Succes! {produits_creates} produits crees/mis a jour.'))