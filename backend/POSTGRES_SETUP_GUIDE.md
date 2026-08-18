# Guide d'installation et configuration PostgreSQL pour Jimi

## Étape 1: Installer PostgreSQL sur Windows

### Option A: Télécharger depuis le site officiel
1. Allez sur https://www.postgresql.org/download/windows/
2. Téléchargez la dernière version (PostgreSQL 16.x recommandé)
3. Exécutez l'installateur
4. Pendant l'installation:
   - **Mot de passe postgres**: yassine (important!)
   - **Port**: 5432 (par défaut)
   - Cochez "Stack Builder" pour installer pgAdmin (optionnel mais recommandé)

### Option B: Utiliser Chocolatey (si installé)
```powershell
choco install postgresql
```

### Option C: Utiliser Docker (recommandé pour développement)
```powershell
docker run --name jimi-postgres -e POSTGRES_PASSWORD=yassine -p 5432:5432 -d postgres:16
```

## Étape 2: Créer la base de données

### Option A: Utiliser pgAdmin (interface graphique)
1. Ouvrez pgAdmin
2. Connectez-vous avec:
   - Utilisateur: postgres
   - Mot de passe: yassine
3. Clic droit sur "Databases" → "Create" → "Database"
4. Nom: jimi_db
5. Cliquez sur "Save"

### Option B: Utiliser psql (ligne de commande)
```powershell
# Ouvrez SQL Shell (psql) depuis le menu Démarrer
# Entrez le mot de passe: yassine

CREATE DATABASE jimi_db;
\q
```

### Option C: Utiliser le script SQL fourni
```powershell
psql -U postgres -f setup_postgres.sql
# Mot de passe: yassine
```

## Étape 3: Installer les dépendances Python

```powershell
cd c:\Users\yassi\Desktop\jimi\backend
venv\Scripts\activate
pip install -r requirements.txt
```

## Étape 4: Exécuter les migrations Django

```powershell
python manage.py migrate
```

## Étape 5: Charger les données d'exemple

```powershell
# Charger les clients
python manage.py seed_clients

# Charger les produits
python manage.py seed_produits

# Charger les réparations
python manage.py seed_reparations
```

## Étape 6: Créer un superutilisateur (optionnel)

```powershell
python manage.py createsuperuser
```

## Étape 7: Démarrer le serveur

```powershell
python manage.py runserver
```

## Vérification de la connexion

Pour vérifier que PostgreSQL fonctionne correctement:

```powershell
python manage.py dbshell
```

Si vous voyez le prompt PostgreSQL, la connexion est réussie!

## Dépannage

### Erreur: "psql: error: connection failed"
- Vérifiez que PostgreSQL est en cours d'exécution (Services Windows → postgresql-x64-16)
- Vérifiez le mot de passe dans .env (doit être "yassine")
- Vérifiez que le port 5432 n'est pas bloqué par un firewall

### Erreur: "no module named 'psycopg2'"
```powershell
pip install psycopg2-binary
```

### Erreur: "no module named 'decouple'"
```powershell
pip install python-decouple
```

## Structure des données d'exemple

Après avoir chargé les données, vous aurez:

### Clients (5 exemples)
- Jean Dupont
- Marie Martin
- Pierre Bernard
- Sophie Petit
- Luc Robert

### Produits (10 exemples)
- 3 Smartphones (iPhone 15 Pro Max, Galaxy S24 Ultra, Pixel 8 Pro)
- 3 Accessoires (coque, câble, chargeur)
- 2 Pièces de rechange (écran, batterie)
- 1 Carte SIM
- 1 Écouteurs (AirPods Pro)

### Téléphones d'occasion (3 exemples)
- 1 Grade A (comme neuf)
- 1 Grade B (petites rayures)
- 1 Grade C (rayures visibles)

### Tickets de réparation (5 exemples)
- 1 En cours de réparation
- 1 Prêt à être récupéré
- 1 En diagnostic
- 1 Livré
- 1 Non réparable

## Configuration de l'environnement

Le fichier `.env` contient:
```
DB_NAME=jimi_db
DB_USER=postgres
DB_PASSWORD=yassine
DB_HOST=localhost
DB_PORT=5432
```

Vous pouvez modifier ces valeurs selon votre configuration PostgreSQL.
