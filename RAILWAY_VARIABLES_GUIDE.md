# Guide pour ajouter les variables dans Railway

## Étape 1: Trouver l'onglet Variables

1. **Connectez-vous à Railway** - https://railway.app/
2. **Ouvrez votre projet** IMTECH
3. **Cliquez sur votre service Django** (pas la base de données PostgreSQL)
4. **Cherchez l'onglet "Variables"** dans le menu en haut ou à gauche

## Étape 2: Ajouter les variables une par une

Dans l'onglet "Variables", cliquez sur **"New Variable"** pour chaque variable:

### Variable 1: SECRET_KEY
- **Name:** `SECRET_KEY`
- **Value:** `n87ibnfn5yg^dg)(9a4a2e-p9a^4h!$q(gvfou4)3fn1kp0kho`
- Cliquez "Add"

### Variable 2: DEBUG
- **Name:** `DEBUG`
- **Value:** `False`
- Cliquez "Add"

### Variable 3: ALLOWED_HOSTS
- **Name:** `ALLOWED_HOSTS`
- **Value:** `.railway.app`
- Cliquez "Add"

### Variable 4: CSRF_TRUSTED_ORIGINS
- **Name:** `CSRF_TRUSTED_ORIGINS`
- **Value:** `https://*.railway.app,http://*.railway.app`
- Cliquez "Add"

### Variable 5: CORS_ALLOWED_ORIGINS
- **Name:** `CORS_ALLOWED_ORIGINS`
- **Value:** `https://*.railway.app,http://*.railway.app`
- Cliquez "Add"

## Étape 3: Vérifier la base de données

1. **Cliquez sur "+ New Service"** (en haut)
2. **Sélectionnez "Database"**
3. **Cliquez sur "PostgreSQL"**
4. Railway créera automatiquement la base de données
5. Railway ajoutera automatiquement `DATABASE_URL` (vous n'avez rien à faire)

## Étape 4: Vérifier les paramètres de build

1. **Dans votre service Django**, allez dans l'onglet "Settings"
2. **Section "Build"**:
   - **Builder:** Changez "Railpack" → "Dockerfile"
   - **Custom Build Command:** Effacez `npm run build` (laissez vide)

## Étape 5: Redéployer

1. **Cliquez sur "Deploy"** (bouton en haut à droite)
2. Attendez que le build se termine
3. Vérifiez que le healthcheck passe

## Résumé des variables à ajouter:

```
SECRET_KEY=n87ibnfn5yg^dg)(9a4a2e-p9a^4h!$q(gvfou4)3fn1kp0kho
DEBUG=False
ALLOWED_HOSTS=.railway.app
CSRF_TRUSTED_ORIGINS=https://*.railway.app,http://*.railway.app
CORS_ALLOWED_ORIGINS=https://*.railway.app,http://*.railway.app
```

**IMPORTANT:** `DATABASE_URL` est ajouté automatiquement par Railway quand vous créez le service PostgreSQL. Ne l'ajoutez pas manuellement.
