# Guide de déploiement Railway - Instructions exactes

## Étape 1: Créer un compte Railway
1. Allez sur https://railway.app/
2. Cliquez sur "Login" et connectez-vous avec votre compte GitHub
3. Autorisez Railway à accéder à vos repositories GitHub

## Étape 2: Créer un nouveau projet Railway
1. Cliquez sur "New Project" (en haut à droite)
2. Sélectionnez "Deploy from GitHub repo"
3. Si ce n'est pas fait, cliquez sur "Configure GitHub App" pour autoriser Railway
4. Dans la liste des repositories, sélectionnez `YASSINE-ENNHILI2002/IMTECH`
5. Cliquez sur "Deploy Now"

## Étape 3: Ajouter une base de données PostgreSQL
1. Une fois le projet créé, vous verrez votre application Django
2. Cliquez sur "+ New Service" (en haut)
3. Sélectionnez "Database" puis "PostgreSQL"
4. Railway va créer automatiquement une base de données

## Étape 4: Configurer les variables d'environnement
1. Cliquez sur votre service Django (pas la base de données)
2. Allez dans l'onglet "Variables"
3. Cliquez sur "New Variable"

**Variables à ajouter:**

```
SECRET_KEY=generer_une_cle_secrete_aleatoire_ici
DEBUG=False
ALLOWED_HOSTS=.railway.app
```

**IMPORTANT:** Railway fournit automatiquement `DATABASE_URL` depuis le service PostgreSQL. Vous n'avez PAS besoin de l'ajouter manuellement.

Pour générer une SECRET_KEY, vous pouvez utiliser:
```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## Étape 5: Redéployer l'application
1. Après avoir ajouté les variables, cliquez sur "Deploy" (bouton en haut)
2. Railway va reconstruire votre application avec les nouvelles variables
3. Le Procfile exécutera automatiquement:
   - `python manage.py migrate --noinput` (création des tables)
   - `python manage.py collectstatic --noinput` (fichiers statiques)
   - `gunicorn magasin_app.wsgi:application` (démarrage du serveur)

## Étape 6: Charger les données d'exemple
Une fois le déploiement terminé:

1. Cliquez sur votre service Django
2. Allez dans l'onglet "Console" (ou cliquez sur "New Terminal")
3. Exécutez ces commandes une par une:

```bash
python manage.py seed_clients
python manage.py seed_produits
python manage.py seed_reparations
```

## Étape 7: Vérifier le déploiement
1. Dans votre service Django, allez dans l'onglet "Networking"
2. Vous verrez une URL publique (ex: https://imtech-production.up.railway.app)
3. Cliquez sur cette URL pour accéder à votre application
4. L'API sera accessible sur cette URL

## Structure des variables Railway

Railway fournit automatiquement ces variables depuis le service PostgreSQL:
- `DATABASE_URL` - URL de connexion complète à la base de données
- `PGDATABASE` - Nom de la base de données
- `PGUSER` - Utilisateur PostgreSQL
- `PGPASSWORD` - Mot de passe PostgreSQL
- `PGHOST` - Hôte de la base de données
- `PGPORT` - Port de la base de données

Votre code Django utilise `dj-database-url` pour lire automatiquement `DATABASE_URL`.

## Dépannage

### Erreur: "ModuleNotFoundError: No module named 'dj-database-url'"
- Vérifiez que `dj-database-url==2.1.0` est dans requirements.txt
- Redéployez l'application

### Erreur de connexion à la base de données
- Vérifiez que le service PostgreSQL est démarré
- Vérifiez que `DATABASE_URL` est présent dans les variables (fourni automatiquement par Railway)

### Erreur: "Static files not found"
- Le Procfile exécute `collectstatic` automatiquement
- Vérifiez les logs de déploiement

### Pour voir les logs de déploiement
1. Cliquez sur votre service Django
2. Allez dans l'onglet "Deployments"
3. Cliquez sur un déploiement pour voir les logs

### Pour accéder à la base de données Railway
1. Cliquez sur le service PostgreSQL
2. Allez dans l'onglet "Console"
3. Vous pouvez exécuter des commandes SQL directement

## URL finale

Après déploiement, votre application sera accessible via:
- URL Railway: https://votre-prod.up.railway.app
- API endpoints: https://votre-prod.up.railway.app/api/

## Résumé des fichiers modifiés pour Railway

1. `backend/requirements.txt` - Ajout de `dj-database-url==2.1.0`
2. `backend/magasin_app/settings.py` - Configuration DATABASE_URL automatique
3. `backend/Procfile` - Exécution automatique des migrations et collectstatic
4. `backend/runtime.txt` - Python 3.12 spécifié

Le projet est maintenant configuré pour Railway avec déploiement automatique!
