# 🚀 Configuration de l'Analyseur de Triggers Marketing

## 📋 Prérequis

- Node.js 18+
- npm ou yarn
- Clé API OpenAI (optionnelle, pour l'analyse intelligente)

## ⚙️ Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd marketing-trigger-analyzer
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer le serveur de développement**
```bash
npm run dev
```

4. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

## 🧠 Configuration de l'analyse intelligente (Optionnel)

### **Sans clé API (Mode basique)**
- L'application fonctionne avec une analyse par mots-clés
- Moins précise mais gratuite
- Parfait pour tester l'interface

### **Avec clé API OpenAI (Mode intelligent)**
- Analyse sémantique et structurelle avancée
- Détection des patterns psychologiques subtils
- Beaucoup plus précise et intelligente

#### **Étapes pour activer l'analyse intelligente :**

1. **Obtenir une clé API OpenAI**
   - Aller sur [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Créer un compte ou se connecter
   - Générer une nouvelle clé API

2. **Configurer la clé API**
   - Créer un fichier `.env.local` à la racine du projet
   - Ajouter la ligne suivante :
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. **Redémarrer le serveur**
   ```bash
   npm run dev
   ```

4. **Vérifier l'activation**
   - L'interface affichera "Analyse intelligente activée" en vert
   - L'analyse sera beaucoup plus précise

## 🎯 Fonctionnalités

### **Mode Basique (sans clé API)**
- ✅ Analyse par mots-clés et patterns
- ✅ 15+ déclencheurs marketing
- ✅ Interface d'administration
- ✅ Sauvegarde des analyses
- ✅ Gratuit

### **Mode Intelligent (avec clé API)**
- ✅ Analyse sémantique avancée
- ✅ Compréhension du contexte
- ✅ Détection des patterns psychologiques subtils
- ✅ Surlignage précis des segments
- ✅ Explications détaillées
- 💰 Coût : ~0.01$ par analyse

## 🛠️ Administration

### **Accéder à l'interface admin**
```
http://localhost:3000/admin
```

### **Fonctionnalités admin**
- ✅ Activer/désactiver les déclencheurs
- ✅ Modifier les définitions
- ✅ Changer les couleurs
- ✅ Voir les statistiques
- ✅ Sauvegarder les modifications

## 📊 Déclencheurs disponibles

1. **Urgency** - Créer de l'urgence
2. **Scarcity** - Créer de la rareté
3. **Social Proof** - Preuve sociale
4. **Authority** - Autorité et expertise
5. **Reciprocity** - Réciprocité
6. **Commitment** - Engagement et cohérence
7. **Liking** - Sympathie et similarité
8. **Fear** - Peur et perte
9. **Greed** - Cupidité et gain
10. **Mystery** - Mystère et curiosité
11. **Curiosity** - Créer des gaps d'information
12. **Exclusivity** - Exclusivité et VIP
13. **Storytelling** - Récit et narration
14. **Contrast** - Contraste et comparaison
15. **Call to Action** - Appel à l'action

## 🔧 Développement

### **Structure du projet**
```
src/
├── app/
│   ├── api/analyze/     # API d'analyse
│   ├── admin/           # Interface admin
│   └── page.tsx         # Page principale
├── components/
│   ├── ui/              # Composants UI
│   ├── TextAnalyzer.tsx # Composant principal
│   └── AnalysisStatus.tsx # Statut d'analyse
├── lib/
│   ├── triggers.ts      # Ancien système (fallback)
│   └── config.ts        # Configuration
└── public/
    └── triggers.json    # Base de données des triggers
```

### **Ajouter un nouveau déclencheur**
1. Modifier `public/triggers.json`
2. Ajouter le trigger avec sa définition
3. Tester via l'interface admin

### **Modifier l'analyse**
1. Éditer `src/app/api/analyze/route.ts`
2. Ajuster les prompts LLM
3. Modifier la logique de fallback

## 🚀 Déploiement

### **Vercel (Recommandé)**
1. Connecter le repository GitHub
2. Ajouter la variable d'environnement `OPENAI_API_KEY`
3. Déployer automatiquement

### **Netlify**
1. Connecter le repository
2. Configurer les variables d'environnement
3. Déployer

### **Docker**
```bash
docker build -t marketing-trigger-analyzer .
docker run -p 3000:3000 -e OPENAI_API_KEY=your-key marketing-trigger-analyzer
```

## 📈 Roadmap

### **MVP (Actuel)**
- ✅ Interface d'analyse
- ✅ Administration des triggers
- ✅ Analyse basique et intelligente
- ✅ Sauvegarde localStorage

### **V2 (Prochainement)**
- 🔄 Base de données Supabase
- 🔄 Authentification utilisateur
- 🔄 Historique des analyses
- 🔄 Export PDF des résultats
- 🔄 API publique

### **V3 (Futur)**
- 🔄 Intégration d'autres LLMs
- 🔄 Analyse d'images et vidéos
- 🔄 Suggestions d'amélioration
- 🔄 Analytics avancées

## 🆘 Support

### **Problèmes courants**

**L'analyse ne fonctionne pas**
- Vérifier que le serveur est démarré
- Vérifier la console pour les erreurs
- Tester avec un texte simple

**L'analyse intelligente ne s'active pas**
- Vérifier que la clé API est correcte
- Vérifier le fichier `.env.local`
- Redémarrer le serveur

**Erreur de clé API**
- Vérifier que la clé est valide
- Vérifier les crédits OpenAI
- Vérifier les permissions de la clé

### **Contact**
- GitHub Issues pour les bugs
- Discussions pour les questions
- Email pour le support commercial

---

**🎯 L'analyseur de triggers marketing - Révélez les techniques psychologiques cachées dans vos textes !**
