# 🔍 Guide de Debug - Prism Analyzer

## Comment débugger l'analyse de texte

### 1. **Ouvrir la Console du Navigateur**
- **Chrome/Edge** : `F12` ou `Ctrl+Shift+I` → onglet "Console"
- **Firefox** : `F12` ou `Ctrl+Shift+I` → onglet "Console"
- **Safari** : `Cmd+Option+I` → onglet "Console"

### 2. **Logs Frontend (Côté Client)**
Quand vous cliquez sur "Reveal the triggers", vous verrez ces logs :

```
🚀 Starting analysis...
📝 Text to analyze: Votre texte ici...
🔑 API Key present: true/false
📡 Sending request to /api/analyze...
📊 Response status: 200
📊 Response ok: true
📋 Response data: {success: true, results: [...]}
✅ Analysis successful
🎯 Analysis mode: llm/fallback
🔑 Has API key: true/false
📈 Results count: 5
🎯 Converted results: [...]
🏁 Analysis completed
```

### 3. **Logs Backend (Côté Serveur)**
Dans votre terminal où `npm run dev` tourne, vous verrez :

```
🔍 API: Starting analysis request
📝 API: Text length: 150
⚙️ API: Options: {}
✅ API: Input validation passed
🔑 OpenAI: API key present: true
📡 OpenAI: Sending request to OpenAI API...
📊 OpenAI: Response status: 200
📊 OpenAI: Response ok: true
📊 API: OpenAI response received
🔄 API: Processing results...
✅ API: Analysis completed successfully
```

### 4. **Indicateur de Progression Visuel**
Pendant l'analyse, vous verrez une modal avec :
- **Étape 1** : "Validating input..." (25%)
- **Étape 2** : "Sending to AI..." (50%)
- **Étape 3** : "Processing results..." (75%)
- **Étape 4** : "Analysis complete!" (100%)

### 5. **Problèmes Courants et Solutions**

#### ❌ **"API Key not configured"**
- **Cause** : Pas de clé API OpenAI
- **Solution** : Cliquer sur "Add API Key" et entrer votre clé

#### ❌ **"Analysis failed"**
- **Cause** : Erreur dans la requête OpenAI
- **Vérifier** : 
  - Clé API valide
  - Connexion internet
  - Crédits OpenAI disponibles

#### ❌ **"Text must be under 5000 characters"**
- **Cause** : Texte trop long
- **Solution** : Réduire la taille du texte

#### ❌ **"No results found"**
- **Cause** : Aucun trigger détecté
- **Solution** : Essayer un texte plus persuasif

### 6. **Vérification des Données**

#### **Structure de la Réponse API**
```json
{
  "success": true,
  "analysisMode": "llm",
  "hasApiKey": true,
  "results": [
    {
      "trigger": "urgency",
      "segment": "Limited time offer!",
      "confidence": 0.85,
      "highlighted_text": "Limited time offer!"
    }
  ],
  "allTriggers": [...]
}
```

#### **Structure des Résultats Convertis**
```javascript
[
  {
    trigger: {
      id: "urgency",
      name: "Urgency",
      color: "#DFAE6A",
      description: "Encourage immediate action..."
    },
    matches: [
      {
        text: "Limited time offer!",
        start: 0,
        end: 20
      }
    ],
    confidence: 0.85
  }
]
```

### 7. **Test de Debug**

#### **Test 1 : Texte Simple**
```
"Buy now! Limited time offer!"
```
**Attendu** : Triggers "Urgency" et "Call to Action"

#### **Test 2 : Texte Complexe**
```
"Join 10,000+ satisfied customers who have transformed their lives with our exclusive program. Don't miss out on this once-in-a-lifetime opportunity!"
```
**Attendu** : Triggers "Social Proof", "Exclusivity", "Loss Aversion"

### 8. **Commandes de Debug Utiles**

#### **Vérifier la Clé API**
```javascript
console.log('API Key:', localStorage.getItem('openai_api_key'));
```

#### **Vérifier les Triggers**
```javascript
console.log('Analysis:', analysis);
```

#### **Tester l'API Directement**
```javascript
fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'Test text' })
}).then(r => r.json()).then(console.log);
```

### 9. **Logs de Performance**
- **Temps de validation** : ~500ms
- **Temps d'envoi** : 1-3 secondes (selon OpenAI)
- **Temps de traitement** : ~200ms
- **Total** : 2-4 secondes

### 10. **Support**
Si le problème persiste :
1. Vérifiez tous les logs ci-dessus
2. Copiez les messages d'erreur
3. Vérifiez votre clé API OpenAI
4. Testez avec un texte simple d'abord

---
**💡 Astuce** : Gardez la console ouverte pendant vos tests pour voir tous les logs en temps réel !
