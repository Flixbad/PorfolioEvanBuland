# Déployer le portfolio sur GitHub

Le dépôt GitHub est déjà créé et vide : https://github.com/Flixbad/PorfolioEvanBuland

---

## Étape 0 : Installer Git (obligatoire)

Si PowerShell affiche *« git n'est pas reconnu »*, Git n’est pas installé ou pas dans le PATH.

1. **Télécharge Git pour Windows** : https://git-scm.com/download/win  
2. Lance l’installateur et valide les options par défaut (cocher **« Add Git to PATH »** si proposé).  
3. **Ferme puis rouvre** PowerShell (ou Cursor) pour que `git` soit reconnu.  
4. Vérifie avec : `git --version`

Ensuite, exécute les commandes ci‑dessous.

---

## Configurer ton identité Git (première fois uniquement)

Git a besoin d’un nom et d’un email pour signer les commits. Remplace par ton email (ex. celui de ton compte GitHub) et le nom affiché :

```bash
git config --global user.email "ton-email@exemple.com"
git config --global user.name "Ton Nom"
```

---

## Commandes à exécuter

Ouvre **PowerShell** ou **Git Bash**, va dans le dossier du projet puis lance :

```bash
cd "c:/Users/samyd/Desktop/Projet/Portfolio"

# 1. Initialiser Git (si pas déjà fait)
git init

# 2. Ajouter le dépôt distant
git remote add origin https://github.com/Flixbad/PorfolioEvanBuland.git

# 3. Ajouter tous les fichiers
git add .

# 4. Premier commit
git commit -m "Portfolio Evan Buland - version initiale"

# 5. Branche principale et envoi
git branch -M main
git push -u origin main
```

Si Git te demande de te connecter, utilise ton compte GitHub (identifiants ou token).

---

**Activer les GitHub Pages (site en ligne)**  
Une fois le push fait :
1. Va sur https://github.com/Flixbad/PorfolioEvanBuland
2. **Settings** → **Pages**
3. Source : **Deploy from a branch**
4. Branch : **main** → **/ (root)** → **Save**
5. Le site sera disponible à : `https://flixbad.github.io/PorfolioEvanBuland/`
