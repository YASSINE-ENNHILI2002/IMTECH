# Guide d'installation Git et déploiement Railway

## Étape 1: Installer Git sur Windows

### Option A: Télécharger depuis le site officiel
1. Allez sur https://git-scm.com/download/win
2. Téléchargez et exécutez l'installateur
3. Acceptez les options par défaut
4. Redémarrez votre terminal/IDE après l'installation

### Option B: Utiliser Chocolatey (si installé)
```powershell
choco install git
```

### Option C: Utiliser GitHub Desktop (interface graphique)
1. Téléchargez depuis https://desktop.github.com/
2. Installez et configurez avec votre compte GitHub

## Étape 2: Configurer Git

Après installation, ouvrez un terminal et configurez Git:

```powershell
git config --global user.name "YASSINE-ENNHILI2002"
git config --global user.email "votre@email.com"
```

## Étape 3: Initialiser et pousser sur GitHub

```powershell
cd c:\Users\yassi\Desktop\jimi

# Initialiser le repository
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - Django project with PostgreSQL"

# Ajouter le remote GitHub
git remote add origin https://github.com/YASSINE-ENNHILI2002/IMTECH.git

# Renommer la branche en main
git branch -M main

# Pousser sur GitHub
git push -u origin main
```

## Étape 4: Configuration Railway

### Créer les fichiers de configuration Railway

#### 1. `railway.json` (à la racine du projet)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### 2. `Procfile` (dans backend/)
```
web: gunicorn magasin_app.wsgi:application --bind 0.0.0.0:$PORT
```

#### 3. `requirements.txt` (déjà existant dans backend/)

#### 4. `.gitignore` (à la racine)
```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
.venv

# Django
*.log
local_settings.py
db.sqlite3
db.sqlite3-journal
/media
/staticfiles

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Railway
.railway/
```

## Étape 5: Déploiement sur Railway

### Option A: Via l'interface Web Railway
1. Allez sur https://railway.app/
2. Connectez-vous avec votre compte GitHub
3. Cliquez sur "New Project"
4. Sélectionnez "Deploy from GitHub repo"
5. Choisissez `YASSINE-ENNHILI2002/IMTECH`
6. Railway détectera automatiquement Django
7. Configurez les variables d'environnement (voir ci-dessous)

### Option B: Via CLI Railway
```powershell
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login

# Initialiser le projet
railway init

# Ajouter les variables d'environnement
railway variables set DB_NAME=jimi_db
railway variables set DB_USER=postgres
railway variables set DB_PASSWORD=votre_mot_de_passe_railway
railway variables set DB_HOST=localhost
railway variables set DB_PORT=5432
railway variables set SECRET_KEY=votre_secret_key
railway variables set DEBUG=False
railway variables set ALLOWED_HOSTS=.railway.app

# Déployer
railway up
```

## Étape 6: Variables d'environnement Railway

Dans Railway, ajoutez ces variables:

```
DB_NAME=jimi_db
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_postgresql_railway
DB_HOST=votre_host_postgresql_railway
DB_PORT=5432
SECRET_KEY=generer_une_cle_secrete_aleatoire
DEBUG=False
ALLOWED_HOSTS=.railway.app,localhost
```

**Note**: Railway va créer automatiquement une base de données PostgreSQL. Utilisez les credentials fournis par Railway.

## Étape 7: Configuration Django pour Railway

Modifier `backend/magasin_app/settings.py` pour le déploiement:

```python
# Ajouter ces lignes après les imports
import os

# Configuration pour Railway
if os.environ.get('RAILWAY_ENVIRONMENT'):
    DEBUG = False
    ALLOWED_HOSTS = ['*']
    
    # Railway PostgreSQL
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('DB_NAME'),
            'USER': os.environ.get('DB_USER'),
            'PASSWORD': os.environ.get('DB_PASSWORD'),
            'HOST': os.environ.get('DB_HOST'),
            'PORT': os.environ.get('DB_PORT'),
        }
    }
    
    # Secret key depuis Railway
    SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-fallback')
    
    # Static files
    STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
```

## Étape 8: Exécuter les migrations sur Railway

Après le déploiement, vous devrez exécuter les migrations:

```powershell
# Via Railway CLI
railway run python manage.py migrate

# Via interface Railway
# Console → Run Command → python manage.py migrate
```

## Étape 9: Charger les données d'exemple sur Railway

```powershell
# Via Railway CLI
railway run python manage.py seed_clients
railway run python manage.py seed_produits
railway run python manage.py seed_reparations
```

## Étape 10: Vérifier le déploiement

1. Railway vous donnera une URL publique (ex: https://imtech.railway.app)
2. Vérifiez que l'API est accessible
3. Testez les endpoints

## Dépannage

### Erreur: "git not recognized"
- Installez Git depuis https://git-scm.com/download/win
- Redémarrez votre terminal/IDE

### Erreur: "ModuleNotFoundError: No module named 'psycopg2'"
- Ajoutez `psycopg2-binary==2.9.9` dans requirements.txt

### Erreur: "Static files not found"
- Ajoutez `whitenoise` dans requirements.txt
- Configurez STATIC_ROOT dans settings.py

### Erreur de connexion PostgreSQL sur Railway
- Utilisez les variables d'environnement fournies par Railway
- Vérifiez que le service PostgreSQL est démarré sur Railway

## Structure finale du projet

```
jimi/
├── .gitignore
├── railway.json
├── backend/
│   ├── .env (ne pas commit)
│   ├── Procfile
│   ├── manage.py
│   ├── magasin_app/
│   ├── produits/
│   ├── clients/
│   ├── reparations/
│   └── requirements.txt
└── frontend/
    └── (application React)
```

## Prochaines étapes

1. Installer Git
2. Initialiser le repository
3. Pousser sur GitHub
4. Créer un compte Railway
5. Déployer depuis GitHub
6. Configurer les variables d'environnement
7. Exécuter les migrations
8. Tester l'application en production
