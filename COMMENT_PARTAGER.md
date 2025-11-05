# 🚀 Guide Pratique : Comment Partager Votre Code

## Méthode 1 : GitHub (Recommandé) ⭐

### Étape 1 : Créer un repository sur GitHub

1. Allez sur [github.com](https://github.com)
2. Cliquez sur le bouton **"+"** en haut à droite → **"New repository"**
3. Remplissez :
   - **Repository name** : `marketing-trigger-analyzer`
   - **Description** : "Analyseur de triggers marketing avec IA"
   - **Visibilité** : Public (ou Private si vous préférez)
   - Ne cochez PAS "Initialize with README" (vous avez déjà un README)
4. Cliquez sur **"Create repository"**

### Étape 2 : Initialiser Git et pousser le code

Ouvrez votre terminal dans le dossier du projet et exécutez :

```bash
# 1. Initialiser git (si pas déjà fait)
git init

# 2. Ajouter tous les fichiers
git add .

# 3. Faire le premier commit
git commit -m "Initial commit: Marketing Trigger Analyzer"

# 4. Renommer la branche en 'main' (si nécessaire)
git branch -M main

# 5. Ajouter le remote GitHub (remplacez VOTRE_USERNAME par votre nom GitHub)
git remote add origin https://github.com/VOTRE_USERNAME/marketing-trigger-analyzer.git

# 6. Pousser le code sur GitHub
git push -u origin main
```

**Note** : Si GitHub vous demande de vous authentifier, utilisez un **Personal Access Token** au lieu du mot de passe.

### Étape 3 : Partager le lien

Une fois le code poussé, vous obtiendrez une URL comme :
```
https://github.com/VOTRE_USERNAME/marketing-trigger-analyzer
```

**Partagez simplement cette URL** avec les personnes qui veulent accéder à votre code.

---

## Méthode 2 : Archive ZIP (Simple et rapide)

### Créer une archive propre

```bash
# Dans le terminal, depuis le dossier du projet
cd /Users/charlesterrier/marketing-trigger-analyzer

# Créer une archive en excluant les fichiers inutiles
zip -r marketing-trigger-analyzer.zip . \
  -x "node_modules/*" \
  -x ".next/*" \
  -x ".git/*" \
  -x "*.log" \
  -x ".DS_Store" \
  -x ".env*"
```

L'archive sera créée dans votre dossier. Vous pouvez ensuite :
- L'envoyer par email
- La mettre sur Google Drive / Dropbox
- La partager via WeTransfer

---

## Méthode 3 : Via Cursor (si disponible)

1. Dans Cursor, ouvrez la palette de commandes :
   - **Mac** : `Cmd + Shift + P`
   - **Windows/Linux** : `Ctrl + Shift + P`

2. Tapez "Share" ou "Export"

3. Suivez les instructions pour créer un lien de partage

---

## 🎯 Commande Rapide (Copier-Coller)

Si vous voulez utiliser GitHub, voici toutes les commandes en une fois :

```bash
cd /Users/charlesterrier/marketing-trigger-analyzer
git init
git add .
git commit -m "Initial commit: Marketing Trigger Analyzer"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/marketing-trigger-analyzer.git
git push -u origin main
```

**⚠️ Important** : Remplacez `VOTRE_USERNAME` par votre vrai nom d'utilisateur GitHub !

---

## 📋 Checklist avant de partager

Avant de pousser sur GitHub, vérifiez que :

- [x] ✅ Aucune clé API dans le code (déjà vérifié)
- [x] ✅ `.gitignore` ignore bien les fichiers sensibles
- [x] ✅ Documentation à jour

**Fichiers qui seront automatiquement exclus** (grâce à `.gitignore`) :
- `node_modules/` (dépendances)
- `.next/` (build Next.js)
- `.env*` (variables d'environnement)
- Fichiers de logs

---

## 🔐 Pour les personnes qui recevront votre code

Elles devront simplement :

1. **Cloner le repo** :
   ```bash
   git clone https://github.com/VOTRE_USERNAME/marketing-trigger-analyzer.git
   cd marketing-trigger-analyzer
   ```

2. **Installer** :
   ```bash
   npm install
   ```

3. **Lancer** :
   ```bash
   npm run dev
   ```

4. **Entrer leur clé API** via l'interface web (stockée uniquement dans leur navigateur)

---

## 💡 Astuce : GitHub Desktop (Interface graphique)

Si vous préférez une interface graphique plutôt que la ligne de commande :

1. Téléchargez [GitHub Desktop](https://desktop.github.com/)
2. Installez-le
3. Connectez-vous avec votre compte GitHub
4. Cliquez sur "File" → "Add Local Repository"
5. Sélectionnez votre dossier `marketing-trigger-analyzer`
6. Cliquez sur "Publish repository" en haut

C'est tout ! 🎉

---

## ✅ Votre code est prêt !

Votre projet est **100% prêt à être partagé**. Aucune information sensible n'est exposée.

**Bon partage ! 🚀**

