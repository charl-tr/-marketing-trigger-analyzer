# 🔬 Guide des Outils de Debug - Prism Analyzer

## 🎯 **Analyse Micro Segment par Segment**

### **Qu'est-ce que c'est ?**
L'analyse micro décompose votre texte en segments individuels et montre exactement comment chaque trigger marketing est détecté et analysé.

### **Comment l'utiliser :**
1. **Lancez une analyse** avec votre texte
2. **Cliquez sur "Show Micro Analysis"** dans les contrôles de debug
3. **Explorez chaque segment** :
   - Cliquez sur un segment de trigger pour le sélectionner
   - Utilisez les flèches pour développer/réduire les détails
   - Voyez le contexte autour de chaque trigger

### **Informations disponibles :**
- **Position exacte** : Start/End dans le texte
- **Intensité** : Score de confiance (0-100%)
- **Contexte** : Texte avant et après le trigger
- **Métadonnées** : Type, longueur, etc.

---

## 🛠️ **Panel de Debug Avancé**

### **4 Onglets Disponibles :**

#### **1. Raw Data** 📊
- **Données brutes** de l'API OpenAI
- **Structure JSON complète** de la réponse
- **Métadonnées** de l'analyse

#### **2. Segments** 🎯
- **Liste détaillée** de chaque trigger détecté
- **Position et intensité** de chaque segment
- **Excerpt exact** du texte analysé
- **Couleurs et types** des triggers

#### **3. Processing** ⚙️
- **Étapes de traitement** visuelles
- **Pipeline d'analyse** étape par étape
- **Métriques de performance**
- **Temps de traitement** par étape

#### **4. Test Mode** 🧪
- **Mode test interactif**
- **Scénarios de test** prédéfinis
- **Métriques de performance** en temps réel
- **Tests de différents types de texte**

---

## 🧪 **Tests et Expérimentation**

### **Textes de Test Recommandés :**

#### **Test Urgence Simple :**
```
"Buy now! Limited time offer! Only 24 hours left!"
```

#### **Test Preuve Sociale :**
```
"Join 10,000+ satisfied customers who have transformed their lives with our program."
```

#### **Test Rareté :**
```
"Only 5 spots left in our exclusive program. Once they're gone, this offer disappears forever."
```

#### **Test Autorité :**
```
"Dr. Smith, Harvard professor and bestselling author, recommends this approach."
```

#### **Test Mixte Complexe :**
```
"Imagine waking up tomorrow and realizing that the one problem that has been quietly eating at you for years has finally disappeared. This is exactly what happened to Sarah, a 35-year-old mother of two, who discovered our simple, repeatable framework that people just like her are already using to create breakthroughs in weeks, not years. But here's the catch. This presentation won't be online forever. In fact, once the spots for our private program are gone, this page disappears. So hit the button below now before it's gone."
```

---

## 📈 **Métriques et Performance**

### **Métriques Disponibles :**
- **Temps de réponse API** : ~10-15 secondes
- **Nombre de triggers détectés** : Variable selon le texte
- **Efficacité de traitement** : Triggers par 1000 caractères
- **Couverture du texte** : % du texte couvert par des triggers

### **Optimisations Possibles :**
- **Textes plus courts** : Analyse plus rapide
- **Triggers spécifiques** : Meilleure précision
- **Contexte clair** : Détection améliorée

---

## 🔍 **Débogage des Problèmes**

### **Problèmes Courants :**

#### **1. Aucun trigger détecté**
- **Cause** : Texte trop neutre ou trop court
- **Solution** : Utilisez des mots-clés de persuasion

#### **2. Triggers incorrects**
- **Cause** : Contexte ambigu
- **Solution** : Ajoutez plus de contexte

#### **3. Intensité faible**
- **Cause** : Langage subtil
- **Solution** : Renforcez les mots de persuasion

#### **4. Performance lente**
- **Cause** : Texte très long
- **Solution** : Divisez en segments plus courts

---

## 🎨 **Personnalisation**

### **Couleurs des Triggers :**
- **Urgency** : Rouge (#DFAE6A)
- **Scarcity** : Orange (#C6A664)
- **Social Proof** : Bleu (#0057A7)
- **Authority** : Marron (#8B4513)
- **Reciprocity** : Beige (#CD853F)
- **Et plus...**

### **Seuils d'Intensité :**
- **0-30%** : Faible
- **30-60%** : Modéré
- **60-80%** : Fort
- **80-100%** : Très fort

---

## 🚀 **Conseils d'Utilisation**

### **Pour les Débutants :**
1. Commencez par des textes courts et simples
2. Utilisez le mode test pour comprendre les patterns
3. Regardez les segments individuels pour apprendre

### **Pour les Avancés :**
1. Utilisez l'analyse micro pour optimiser chaque phrase
2. Testez différents angles d'approche
3. Analysez les patterns de succès

### **Pour les Experts :**
1. Créez vos propres scénarios de test
2. Analysez les métriques de performance
3. Optimisez le pipeline d'analyse

---

## 💡 **Astuces Pro**

- **Sauvegardez vos analyses** : Utilisez l'historique pour comparer
- **Testez A/B** : Comparez différentes versions
- **Analysez la concurrence** : Testez leurs textes
- **Optimisez progressivement** : Améliorez segment par segment

---

**🎯 L'objectif : Comprendre et maîtriser l'art de la persuasion à travers l'analyse de données précises !**
