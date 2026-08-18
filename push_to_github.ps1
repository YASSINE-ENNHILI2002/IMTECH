# Script pour pousser le projet sur GitHub
# Exécutez ce script après avoir installé Git

Write-Host "=== Configuration Git et push vers GitHub ===" -ForegroundColor Green

# Vérifier si Git est installé
try {
    git --version
    Write-Host "Git est installé" -ForegroundColor Green
} catch {
    Write-Host "Git n'est pas installé. Veuillez l'installer depuis https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}

# Aller dans le répertoire du projet
Set-Location "c:\Users\yassi\Desktop\jimi"

# Configurer Git si ce n'est pas déjà fait
Write-Host "`nConfiguration Git..." -ForegroundColor Yellow
git config --global user.name "YASSINE-ENNHILI2002"
git config --global user.email "yassine.ennhili2002@gmail.com"

# Initialiser le repository
Write-Host "`nInitialisation du repository Git..." -ForegroundColor Yellow
git init

# Ajouter tous les fichiers
Write-Host "`nAjout des fichiers..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "`nCréation du commit..." -ForegroundColor Yellow
git commit -m "Initial commit - Django project with PostgreSQL and Railway configuration"

# Ajouter le remote GitHub
Write-Host "`nAjout du remote GitHub..." -ForegroundColor Yellow
git remote add origin https://github.com/YASSINE-ENNHILI2002/IMTECH.git

# Renommer la branche en main
Write-Host "`nRenommage de la branche en main..." -ForegroundColor Yellow
git branch -M main

# Pousser sur GitHub
Write-Host "`nPush vers GitHub..." -ForegroundColor Yellow
Write-Host "Vous devrez peut-être vous authentifier avec GitHub" -ForegroundColor Cyan
git push -u origin main

Write-Host "`n=== Succès! Le projet est maintenant sur GitHub ===" -ForegroundColor Green
Write-Host "URL du repository: https://github.com/YASSINE-ENNHILI2002/IMTECH.git" -ForegroundColor Cyan
