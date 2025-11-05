// Prompts ultra-simples et efficaces basés sur votre logique
export const SIMPLE_TRIGGER_PROMPTS = {
  urgency: {
    name: "Urgency",
    description: "Encourages immediate action",
    prompt: `Tu es un expert en marketing et persuasion.

Ta mission est d'analyser le texte ci-dessous pour identifier **tous les passages exacts** qui correspondent au trigger marketing suivant : **"Urgency"**.

### 🎯 Règles à respecter strictement :

1. **Copie mot pour mot** les passages du texte original.  
   - Ne paraphrase pas.  
   - Garde exactement les mêmes majuscules, accents, ponctuation et espaces.  
   - Je dois pouvoir retrouver chaque passage dans le texte original avec une recherche exacte.

2. **Tu peux détecter plusieurs passages** si ce trigger apparaît à différents endroits du texte.  
   - Liste-les tous, séparément.  
   - Même un mot ou une courte phrase peuvent être pertinents.

3. Si aucun passage ne correspond, renvoie simplement une liste vide : \`[]\`.

4. **Réponds uniquement en JSON strict** au format suivant :
   \`\`\`json
   [
     {
       "text": "le passage exact du texte original",
       "comment": "courte explication du lien avec le trigger"
     }
   ]
   \`\`\`

**Trigger à détecter : Urgency** (créer un sentiment d'urgence, pression temporelle, action immédiate)

**Texte à analyser :**
---`
  },

  authority: {
    name: "Authority",
    description: "Establishes credibility and expertise",
    prompt: `Tu es un expert en marketing et persuasion.

Ta mission est d'analyser le texte ci-dessous pour identifier **tous les passages exacts** qui correspondent au trigger marketing suivant : **"Authority"**.

### 🎯 Règles à respecter strictement :

1. **Copie mot pour mot** les passages du texte original.  
   - Ne paraphrase pas.  
   - Garde exactement les mêmes majuscules, accents, ponctuation et espaces.  
   - Je dois pouvoir retrouver chaque passage dans le texte original avec une recherche exacte.

2. **Tu peux détecter plusieurs passages** si ce trigger apparaît à différents endroits du texte.  
   - Liste-les tous, séparément.  
   - Même un mot ou une courte phrase peuvent être pertinents.

3. Si aucun passage ne correspond, renvoie simplement une liste vide : \`[]\`.

4. **Réponds uniquement en JSON strict** au format suivant :
   \`\`\`json
   [
     {
       "text": "le passage exact du texte original",
       "comment": "courte explication du lien avec le trigger"
     }
   ]
   \`\`\`

**Trigger à détecter : Authority** (établir la crédibilité, l'expertise, l'autorité)

**Texte à analyser :**
---`
  },

  scarcity: {
    name: "Scarcity",
    description: "Highlights rarity or limited availability",
    prompt: `Tu es un expert en marketing et persuasion.

Ta mission est d'analyser le texte ci-dessous pour identifier **tous les passages exacts** qui correspondent au trigger marketing suivant : **"Scarcity"**.

### 🎯 Règles à respecter strictement :

1. **Copie mot pour mot** les passages du texte original.  
   - Ne paraphrase pas.  
   - Garde exactement les mêmes majuscules, accents, ponctuation et espaces.  
   - Je dois pouvoir retrouver chaque passage dans le texte original avec une recherche exacte.

2. **Tu peux détecter plusieurs passages** si ce trigger apparaît à différents endroits du texte.  
   - Liste-les tous, séparément.  
   - Même un mot ou une courte phrase peuvent être pertinents.

3. Si aucun passage ne correspond, renvoie simplement une liste vide : \`[]\`.

4. **Réponds uniquement en JSON strict** au format suivant :
   \`\`\`json
   [
     {
       "text": "le passage exact du texte original",
       "comment": "courte explication du lien avec le trigger"
     }
   ]
   \`\`\`

**Trigger à détecter : Scarcity** (rareté, limitation, exclusivité)

**Texte à analyser :**
---`
  },

  social_proof: {
    name: "Social Proof",
    description: "Uses testimonials, reviews, or social validation",
    prompt: `Tu es un expert en marketing et persuasion.

Ta mission est d'analyser le texte ci-dessous pour identifier **tous les passages exacts** qui correspondent au trigger marketing suivant : **"Social Proof"**.

### 🎯 Règles à respecter strictement :

1. **Copie mot pour mot** les passages du texte original.  
   - Ne paraphrase pas.  
   - Garde exactement les mêmes majuscules, accents, ponctuation et espaces.  
   - Je dois pouvoir retrouver chaque passage dans le texte original avec une recherche exacte.

2. **Tu peux détecter plusieurs passages** si ce trigger apparaît à différents endroits du texte.  
   - Liste-les tous, séparément.  
   - Même un mot ou une courte phrase peuvent être pertinents.

3. Si aucun passage ne correspond, renvoie simplement une liste vide : \`[]\`.

4. **Réponds uniquement en JSON strict** au format suivant :
   \`\`\`json
   [
     {
       "text": "le passage exact du texte original",
       "comment": "courte explication du lien avec le trigger"
     }
   ]
   \`\`\`

**Trigger à détecter : Social Proof** (preuve sociale, témoignages, validation par d'autres)

**Texte à analyser :**
---`
  },

  call_to_action: {
    name: "Call to Action",
    description: "Encourages specific action or decision",
    prompt: `Tu es un expert en marketing et persuasion.

Ta mission est d'analyser le texte ci-dessous pour identifier **tous les passages exacts** qui correspondent au trigger marketing suivant : **"Call to Action"**.

### 🎯 Règles à respecter strictement :

1. **Copie mot pour mot** les passages du texte original.  
   - Ne paraphrase pas.  
   - Garde exactement les mêmes majuscules, accents, ponctuation et espaces.  
   - Je dois pouvoir retrouver chaque passage dans le texte original avec une recherche exacte.

2. **Tu peux détecter plusieurs passages** si ce trigger apparaît à différents endroits du texte.  
   - Liste-les tous, séparément.  
   - Même un mot ou une courte phrase peuvent être pertinents.

3. Si aucun passage ne correspond, renvoie simplement une liste vide : \`[]\`.

4. **Réponds uniquement en JSON strict** au format suivant :
   \`\`\`json
   [
     {
       "text": "le passage exact du texte original",
       "comment": "courte explication du lien avec le trigger"
     }
   ]
   \`\`\`

**Trigger à détecter : Call to Action** (appel à l'action, encouragement à agir)

**Texte à analyser :**
---`
  },

  reciprocity: {
    name: "Reciprocity",
    description: "Creates obligation to return favors",
    prompt: `Tu es un expert en marketing et persuasion.

Ta mission est d'analyser le texte ci-dessous pour identifier **tous les passages exacts** qui correspondent au trigger marketing suivant : **"Reciprocity"**.

### 🎯 Règles à respecter strictement :

1. **Copie mot pour mot** les passages du texte original.  
   - Ne paraphrase pas.  
   - Garde exactement les mêmes majuscules, accents, ponctuation et espaces.  
   - Je dois pouvoir retrouver chaque passage dans le texte original avec une recherche exacte.

2. **Tu peux détecter plusieurs passages** si ce trigger apparaît à différents endroits du texte.  
   - Liste-les tous, séparément.  
   - Même un mot ou une courte phrase peuvent être pertinents.

3. Si aucun passage ne correspond, renvoie simplement une liste vide : \`[]\`.

4. **Réponds uniquement en JSON strict** au format suivant :
   \`\`\`json
   [
     {
       "text": "le passage exact du texte original",
       "comment": "courte explication du lien avec le trigger"
     }
   ]
   \`\`\`

**Trigger à détecter : Reciprocity** (réciprocité, obligation de rendre la pareille)

**Texte à analyser :**
---`
  },

  commitment: {
    name: "Commitment & Consistency",
    description: "Encourages commitment to decisions",
    prompt: `Tu es un expert en marketing et persuasion.

Ta mission est d'analyser le texte ci-dessous pour identifier **tous les passages exacts** qui correspondent au trigger marketing suivant : **"Commitment & Consistency"**.

### 🎯 Règles à respecter strictement :

1. **Copie mot pour mot** les passages du texte original.  
   - Ne paraphrase pas.  
   - Garde exactement les mêmes majuscules, accents, ponctuation et espaces.  
   - Je dois pouvoir retrouver chaque passage dans le texte original avec une recherche exacte.

2. **Tu peux détecter plusieurs passages** si ce trigger apparaît à différents endroits du texte.  
   - Liste-les tous, séparément.  
   - Même un mot ou une courte phrase peuvent être pertinents.

3. Si aucun passage ne correspond, renvoie simplement une liste vide : \`[]\`.

4. **Réponds uniquement en JSON strict** au format suivant :
   \`\`\`json
   [
     {
       "text": "le passage exact du texte original",
       "comment": "courte explication du lien avec le trigger"
     }
   ]
   \`\`\`

**Trigger à détecter : Commitment & Consistency** (engagement, cohérence, promesses)

**Texte à analyser :**
---`
  },

  liking: {
    name: "Liking",
    description: "Creates affinity and connection",
    prompt: `Tu es un expert en marketing et persuasion.

Ta mission est d'analyser le texte ci-dessous pour identifier **tous les passages exacts** qui correspondent au trigger marketing suivant : **"Liking"**.

### 🎯 Règles à respecter strictement :

1. **Copie mot pour mot** les passages du texte original.  
   - Ne paraphrase pas.  
   - Garde exactement les mêmes majuscules, accents, ponctuation et espaces.  
   - Je dois pouvoir retrouver chaque passage dans le texte original avec une recherche exacte.

2. **Tu peux détecter plusieurs passages** si ce trigger apparaît à différents endroits du texte.  
   - Liste-les tous, séparément.  
   - Même un mot ou une courte phrase peuvent être pertinents.

3. Si aucun passage ne correspond, renvoie simplement une liste vide : \`[]\`.

4. **Réponds uniquement en JSON strict** au format suivant :
   \`\`\`json
   [
     {
       "text": "le passage exact du texte original",
       "comment": "courte explication du lien avec le trigger"
     }
   ]
   \`\`\`

**Trigger à détecter : Liking** (affinité, connexion, sympathie)

**Texte à analyser :**
---`
  }
};

// Fonction utilitaire pour obtenir le prompt d'un trigger
export function getSimpleTriggerPrompt(triggerType: string): string {
  const trigger = SIMPLE_TRIGGER_PROMPTS[triggerType as keyof typeof SIMPLE_TRIGGER_PROMPTS];
  if (!trigger) {
    throw new Error(`Trigger inconnu: ${triggerType}`);
  }
  return trigger.prompt;
}
