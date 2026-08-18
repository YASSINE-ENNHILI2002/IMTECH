# Application de Gestion de Magasin Mobile

Application web complète pour la gestion d'un magasin de téléphones mobiles avec:
- Gestion des produits et stocks
- Rachat de téléphones d'occasion avec registre légal
- Gestion des réparations (SAV)
- Caisse / Point de vente
- Gestion des clients
- **Vitrine publique pour les clients**
- **Génération automatique de factures PDF**

## Architecture

- **Backend**: Django 5.0 + Django REST Framework
- **Frontend**: React + Vite
- **Base de données**: SQLite (développement) / PostgreSQL (production)

## Structure du projet

```
jimi/
├── backend/                 # API Django
│   ├── magasin_app/        # Configuration Django
│   ├── produits/          # Gestion des produits
│   ├── clients/           # Gestion des clients et transactions
│   ├── reparations/       # Gestion des réparations
│   └── venv/              # Environnement virtuel Python
└── frontend/              # Application React
    ├── src/
    │   ├── components/    # Composants React
    │   ├── pages/         # Pages de l'application
    │   └── services/      # Services API
    └── package.json
```

## Installation

### Prérequis

- Python 3.8+
- Node.js 16+
- npm ou yarn

### Backend (Django)

```bash
cd backend

# Créer l'environnement virtuel
python -m venv venv

# Activer l'environnement (Windows)
venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Exécuter les migrations
python manage.py migrate

# Créer un superutilisateur (optionnel)
python manage.py createsuperuser

# Démarrer le serveur
python manage.py runserver
```

L'API sera accessible sur `http://localhost:8000`

### Frontend (React)

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Fonctionnalités

### 0. Vitrine Publique (Nouveau!)
- Page publique accessible pour les clients
- Catalogue des produits disponibles
- Recherche et filtrage par catégorie
- Informations de contact du magasin
- Design moderne et responsive
- Accessible via `/vitrine`

### 1. Gestion des Produits
- Catalogue avec catégories
- Gestion des codes-barres
- Types de stock: quantité ou unité unique (IMEI)
- Alertes de stock faible
- Téléphones neufs et d'occasion

### 2. Rachat d'Occasion
- Formulaire complet en 5 étapes
- Capture des informations du vendeur
- Saisie des IMEI et caractéristiques
- Évaluation de l'état (grade A/B/C)
- Signature numérique
- Génération de documents légaux

### 3. Réparations (SAV)
- Création de tickets de réparation
- Suivi du statut (Reçu → Diagnostic → Réparation → Prêt → Livré)
- Gestion des pièces utilisées
- Déstockage automatique
- Notification client

### 4. Caisse / POS
- Panier de vente
- Scan de code-barres
- Gestion des clients
- Modes de paiement multiples
- Déstockage automatique
- **Génération automatique de factures PDF** (Nouveau!)
- Numérotation automatique des factures
- Panier de vente
- Scan de code-barres
- Gestion des clients
- Modes de paiement multiples
- Déstockage automatique

### 5. Tableau de bord
- Statistiques en temps réel
- Alertes de stock faible
- Réparations en cours
- Chiffre d'affaires du jour

## API Endpoints

### Produits
- `GET /api/produits/` - Liste des produits
- `POST /api/produits/` - Créer un produit
- `GET /api/produits/par_code_barres/?code=XXX` - Rechercher par code-barres
- `GET /api/produits/stock_faible/` - Produits en stock faible

### Clients
- `GET /api/clients/` - Liste des clients
- `POST /api/clients/` - Créer un client

### Transactions
- `GET /api/transactions/` - Liste des transactions
- `POST /api/transactions/` - Créer une transaction
- `POST /api/transactions/{id}/completer/` - Compléter une transaction

### Réparations
- `GET /api/tickets/` - Liste des tickets
- `POST /api/tickets/` - Créer un ticket
- `POST /api/tickets/{id}/changer_statut/` - Changer le statut
- `POST /api/tickets/{id}/ajouter_piece/` - Ajouter une pièce

## Développement

### Ajouter de nouvelles fonctionnalités

1. **Backend**: Créer un nouveau modèle dans l'application Django appropriée
2. **Serializers**: Ajouter le serializer dans `serializers.py`
3. **Views**: Créer la viewset dans `views.py`
4. **URLs**: Ajouter les routes dans `urls.py`
5. **Frontend**: Créer le composant React et le service API

### Base de données

Pour voir les données via l'admin Django:
```bash
python manage.py createsuperuser
# Accéder à http://localhost:8000/admin
```

## Déploiement

### Production

- Changer `DEBUG = False` dans `settings.py`
- Configurer PostgreSQL
- Configurer les variables d'environnement
- Utiliser un serveur WSGI (Gunicorn)
- Configurer Nginx ou Apache

### Sécurité

- Changer la `SECRET_KEY`
- Configurer `ALLOWED_HOSTS`
- Utiliser HTTPS
- Configurer les CORS de manière restrictive

## Licence

Ce projet est développé pour la gestion d'un magasin de téléphones mobiles.

## Support

Pour toute question ou problème, veuillez contacter l'équipe de développement.
