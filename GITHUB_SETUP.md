# 🚀 Guide GitHub - Solution au Problème Git

Vous avez un conflit entre Homebrew et Anaconda. Voici la solution **la plus rapide** :

## ✅ Solution Rapide : Utiliser le Git Système

Au lieu d'utiliser `git`, utilisez `/usr/bin/git` :

```bash
# 1. Initialiser le repo
/usr/bin/git init

# 2. Ajouter tous les fichiers
/usr/bin/git add .

# 3. Faire le commit
/usr/bin/git commit -m "Initial commit: Marketing Trigger Analyzer"

# 4. Renommer la branche
/usr/bin/git branch -M main

# 5. Ajouter le remote (remplacez VOTRE_USERNAME)
/usr/bin/git remote add origin https://github.com/VOTRE_USERNAME/marketing-trigger-analyzer.git

# 6. Pousser sur GitHub
/usr/bin/git push -u origin main
```

## 📋 Étapes Détaillées

### Étape 1 : Créer le repository sur GitHub

1. Allez sur [github.com](https://github.com)
2. Cliquez sur **"+"** → **"New repository"**
3. Nommez-le : `marketing-trigger-analyzer`
4. Choisissez Public ou Private
5. **Ne cochez PAS** "Initialize with README" (vous avez déjà un README)
6. Cliquez **"Create repository"**

### Étape 2 : Exécuter les commandes

Copiez-collez ces commandes dans votre terminal :

```bash
cd /Users/charlesterrier/marketing-trigger-analyzer

# Initialiser git
/usr/bin/git init

# Ajouter tous les fichiers (sauf ceux dans .gitignore)
/usr/bin/git add .

# Commit
/usr/bin/git commit -m "Initial commit: Marketing Trigger Analyzer"

# Branche main
/usr/bin/git branch -M main

# Ajouter remote (REMPLACEZ VOTRE_USERNAME par votre vrai nom GitHub)
/usr/bin/git remote add origin https://github.com/VOTRE_USERNAME/marketing-trigger-analyzer.git

# Pousser
/usr/bin/git push -u origin main
```

**Note** : Si GitHub vous demande de vous authentifier, utilisez un **Personal Access Token** au lieu du mot de passe.

### Étape 3 : Partager

Une fois fait, partagez simplement l'URL :
```
https://github.com/VOTRE_USERNAME/marketing-trigger-analyzer
```

---

## 🎯 Alternative : GitHub Desktop (Plus Simple)

Si vous préférez une interface graphique :

1. Téléchargez [GitHub Desktop](https://desktop.github.com/)
2. Installez-le et connectez-vous
3. **File** → **Add Local Repository**
4. Sélectionnez `/Users/charlesterrier/marketing-trigger-analyzer`
5. Cliquez sur **"Publish repository"** en haut

C'est tout ! 🎉

---

## ✅ Vérification

Votre projet est prêt :
- ✅ Toutes les dépendances sont dans `package.json`
- ✅ `.gitignore` exclut `node_modules`, `.env*`, etc.
- ✅ Documentation complète
- ✅ Aucune clé API en dur

Les personnes qui cloneront votre repo n'auront qu'à faire :
```bash
npm install
npm run dev
```

Et c'est tout ! 🚀

