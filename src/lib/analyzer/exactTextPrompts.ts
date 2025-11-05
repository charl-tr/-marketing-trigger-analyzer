// Nouveaux prompts optimisés pour retourner uniquement les segments textuels
export const EXACT_TEXT_PROMPTS = {
  urgency: {
    name: "Urgency",
    description: "Encourages immediate action",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et trouve EXACTEMENT les passages qui créent un sentiment d'urgence.

DÉTECTION : Trouve les passages qui créent une pression temporelle ou encouragent une action immédiate.

EXEMPLES : "maintenant", "urgent", "limité", "dernière chance", "avant qu'il ne soit trop tard", "immédiatement", "sans délai", "rapidement", "vite", "dépêche-toi", "ne perds pas de temps", "cette semaine seulement", "offre limitée dans le temps".

INSTRUCTIONS CRITIQUES :
- Retourne UNIQUEMENT les passages EXACTS du texte original
- Format JSON strict :
[
  {"text": "passage exact du texte", "comment": "pourquoi ce passage crée de l'urgence", "intensity": 0.8}
]
- Si rien n'est trouvé, renvoie []
- Le "text" doit être EXACTEMENT tel qu'il apparaît dans le texte original
- L'intensité doit être entre 0 et 1
- Ne modifie JAMAIS le texte original

TEXTE À ANALYSER :
---`
  },

  scarcity: {
    name: "Scarcity",
    description: "Highlights rarity or limited availability",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et trouve EXACTEMENT les passages qui évoquent la rareté.

DÉTECTION : Trouve les passages qui évoquent la limitation, l'exclusivité ou la rareté d'une offre.

EXEMPLES : "limité", "rare", "exclusif", "seulement X places", "stock limité", "quantité limitée", "dernières unités", "plus que X restants", "épuisé", "indisponible", "réservé à", "membres seulement", "invitation uniquement".

INSTRUCTIONS CRITIQUES :
- Retourne UNIQUEMENT les passages EXACTS du texte original
- Format JSON strict :
[
  {"text": "passage exact du texte", "comment": "pourquoi ce passage crée un sentiment de rareté", "intensity": 0.8}
]
- Si rien n'est trouvé, renvoie []
- Le "text" doit être EXACTEMENT tel qu'il apparaît dans le texte original
- L'intensité doit être entre 0 et 1
- Ne modifie JAMAIS le texte original

TEXTE À ANALYSER :
---`
  },

  social_proof: {
    name: "Social Proof",
    description: "Uses testimonials, reviews, or social validation",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et trouve EXACTEMENT les passages qui utilisent la preuve sociale.

DÉTECTION : Trouve les passages qui utilisent la validation par d'autres personnes, témoignages, ou preuves sociales.

EXEMPLES : "témoignages", "avis clients", "recommandations", "ils ont choisi", "nos clients disent", "plus de X personnes", "rejoint par", "comme eux", "ils ont réussi", "leurs résultats", "ils témoignent", "ils recommandent", "ils confirment".

INSTRUCTIONS CRITIQUES :
- Retourne UNIQUEMENT les passages EXACTS du texte original
- Format JSON strict :
[
  {"text": "passage exact du texte", "comment": "pourquoi ce passage utilise la preuve sociale", "intensity": 0.8}
]
- Si rien n'est trouvé, renvoie []
- Le "text" doit être EXACTEMENT tel qu'il apparaît dans le texte original
- L'intensité doit être entre 0 et 1
- Ne modifie JAMAIS le texte original

TEXTE À ANALYSER :
---`
  },

  authority: {
    name: "Authority",
    description: "Establishes credibility and expertise",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et trouve EXACTEMENT les passages qui établissent l'autorité.

DÉTECTION : Trouve les passages où une figure d'autorité, un expert, ou un statut crédible est mis en avant.

EXEMPLES : "expert", "spécialiste", "professionnel", "certifié", "diplômé", "expérience", "années d'expérience", "reconnu", "primé", "référence", "leader", "pionnier", "inventeur", "créateur", "fondateur", "directeur", "docteur", "professeur", "nous créons", "nous développons", "notre équipe", "nos experts", "notre méthode", "notre approche", "notre expertise", "notre savoir-faire".

INSTRUCTIONS CRITIQUES :
- Retourne UNIQUEMENT les passages EXACTS du texte original
- Format JSON strict :
[
  {"text": "passage exact du texte", "comment": "pourquoi ce passage établit l'autorité", "intensity": 0.8}
]
- Si rien n'est trouvé, renvoie []
- Le "text" doit être EXACTEMENT tel qu'il apparaît dans le texte original
- L'intensité doit être entre 0 et 1
- Ne modifie JAMAIS le texte original

TEXTE À ANALYSER :
---`
  },

  fear: {
    name: "Fear",
    description: "Creates anxiety about negative outcomes",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et trouve EXACTEMENT les passages qui créent de l'anxiété.

DÉTECTION : Trouve les passages qui créent de la peur, de l'anxiété, ou évoquent des conséquences négatives.

EXEMPLES : "attention", "danger", "risque", "perte", "échec", "problème", "difficulté", "crise", "urgence", "catastrophe", "ne pas rater", "éviter", "prévenir", "protéger", "sécuriser", "garantir", "assurer".

INSTRUCTIONS CRITIQUES :
- Retourne UNIQUEMENT les passages EXACTS du texte original
- Format JSON strict :
[
  {"text": "passage exact du texte", "comment": "pourquoi ce passage crée de la peur", "intensity": 0.8}
]
- Si rien n'est trouvé, renvoie []
- Le "text" doit être EXACTEMENT tel qu'il apparaît dans le texte original
- L'intensité doit être entre 0 et 1
- Ne modifie JAMAIS le texte original

TEXTE À ANALYSER :
---`
  },

  exclusivity: {
    name: "Exclusivity",
    description: "Creates sense of privilege and exclusiveness",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et trouve EXACTEMENT les passages qui créent un sentiment d'exclusivité.

DÉTECTION : Trouve les passages qui créent un sentiment de privilège, d'exclusivité, ou d'appartenance à un groupe restreint.

EXEMPLES : "exclusif", "privé", "réservé", "membres seulement", "invitation", "sélectionné", "élite", "VIP", "premium", "luxe", "haut de gamme", "sélect", "choisi", "privilégié", "insider", "initié".

INSTRUCTIONS CRITIQUES :
- Retourne UNIQUEMENT les passages EXACTS du texte original
- Format JSON strict :
[
  {"text": "passage exact du texte", "comment": "pourquoi ce passage crée un sentiment d'exclusivité", "intensity": 0.8}
]
- Si rien n'est trouvé, renvoie []
- Le "text" doit être EXACTEMENT tel qu'il apparaît dans le texte original
- L'intensité doit être entre 0 et 1
- Ne modifie JAMAIS le texte original

TEXTE À ANALYSER :
---`
  },

  storytelling: {
    name: "Storytelling",
    description: "Uses narrative to engage and persuade",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et trouve EXACTEMENT les passages qui utilisent la narration.

DÉTECTION : Trouve les passages qui racontent une histoire, créent un scénario imaginaire, ou utilisent la narration.

EXEMPLES : "imaginez", "histoire", "récit", "scénario", "il était une fois", "conte", "légende", "témoignage", "expérience", "voyage", "parcours", "transformation", "évolution", "changement", "révolution".

INSTRUCTIONS CRITIQUES :
- Retourne UNIQUEMENT les passages EXACTS du texte original
- Format JSON strict :
[
  {"text": "passage exact du texte", "comment": "pourquoi ce passage utilise le storytelling", "intensity": 0.8}
]
- Si rien n'est trouvé, renvoie []
- Le "text" doit être EXACTEMENT tel qu'il apparaît dans le texte original
- L'intensité doit être entre 0 et 1
- Ne modifie JAMAIS le texte original

TEXTE À ANALYSER :
---`
  },

  contrast: {
    name: "Contrast",
    description: "Creates comparison between options or states",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et trouve EXACTEMENT les passages qui créent un contraste.

DÉTECTION : Trouve les passages qui créent une comparaison, un contraste, ou opposent deux situations.

EXEMPLES : "contrairement à", "alors que", "tandis que", "au lieu de", "plutôt que", "contrairement", "différemment", "autrement", "sinon", "ou bien", "soit... soit", "d'un côté... de l'autre", "avant/après", "avec/sans".

INSTRUCTIONS CRITIQUES :
- Retourne UNIQUEMENT les passages EXACTS du texte original
- Format JSON strict :
[
  {"text": "passage exact du texte", "comment": "pourquoi ce passage crée un contraste", "intensity": 0.8}
]
- Si rien n'est trouvé, renvoie []
- Le "text" doit être EXACTEMENT tel qu'il apparaît dans le texte original
- L'intensité doit être entre 0 et 1
- Ne modifie JAMAIS le texte original

TEXTE À ANALYSER :
---`
  },

  call_to_action: {
    name: "Call to Action",
    description: "Encourages specific action or decision",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et trouve EXACTEMENT les passages qui encouragent une action.

DÉTECTION : Trouve les passages qui encouragent une action spécifique, une décision, ou un comportement.

EXEMPLES : "cliquez", "inscrivez-vous", "commandez", "achetez", "réservez", "contactez", "appelez", "écrivez", "visitez", "découvrez", "essayez", "testez", "profitez", "bénéficiez", "obtenez", "recevez".

INSTRUCTIONS CRITIQUES :
- Retourne UNIQUEMENT les passages EXACTS du texte original
- Format JSON strict :
[
  {"text": "passage exact du texte", "comment": "pourquoi ce passage est un appel à l'action", "intensity": 0.8}
]
- Si rien n'est trouvé, renvoie []
- Le "text" doit être EXACTEMENT tel qu'il apparaît dans le texte original
- L'intensité doit être entre 0 et 1
- Ne modifie JAMAIS le texte original

TEXTE À ANALYSER :
---`
  },

  loss_aversion: {
    name: "Loss Aversion",
    description: "Emphasizes what will be lost if no action is taken",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et trouve EXACTEMENT les passages qui utilisent l'aversion à la perte.

DÉTECTION : Trouve les passages qui mettent l'accent sur ce qui sera perdu, raté, ou manqué si aucune action n'est entreprise.

EXEMPLES : "ne ratez pas", "ne manquez pas", "perdre", "rater", "manquer", "échapper", "passer à côté", "laisser filer", "gaspiller", "perdre l'occasion", "regretter", "déplorer", "se mordre les doigts", "se lamenter".

INSTRUCTIONS CRITIQUES :
- Retourne UNIQUEMENT les passages EXACTS du texte original
- Format JSON strict :
[
  {"text": "passage exact du texte", "comment": "pourquoi ce passage utilise l'aversion à la perte", "intensity": 0.8}
]
- Si rien n'est trouvé, renvoie []
- Le "text" doit être EXACTEMENT tel qu'il apparaît dans le texte original
- L'intensité doit être entre 0 et 1
- Ne modifie JAMAIS le texte original

TEXTE À ANALYSER :
---`
  },

  commitment: {
    name: "Commitment & Consistency",
    description: "Encourages commitment to decisions",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et trouve EXACTEMENT les passages qui encouragent l'engagement.

DÉTECTION : Trouve les passages qui encouragent l'engagement, la cohérence avec les décisions passées, ou créent un sentiment d'obligation.

EXEMPLES : "engagement", "cohérent", "logique", "naturel", "évident", "logique", "cohérence", "engagement", "promesse", "décision", "choix", "option", "préférence", "habitude", "routine", "exactement", "précisément", "spécifiquement", "particulièrement", "notamment", "surtout", "en particulier".

INSTRUCTIONS CRITIQUES :
- Retourne UNIQUEMENT les passages EXACTS du texte original
- Format JSON strict :
[
  {"text": "passage exact du texte", "comment": "pourquoi ce passage encourage l'engagement", "intensity": 0.8}
]
- Si rien n'est trouvé, renvoie []
- Le "text" doit être EXACTEMENT tel qu'il apparaît dans le texte original
- L'intensité doit être entre 0 et 1
- Ne modifie JAMAIS le texte original

TEXTE À ANALYSER :
---`
  },

  greed: {
    name: "Greed",
    description: "Appeals to desire for gain",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et trouve EXACTEMENT les passages qui font appel à la cupidité.

DÉTECTION : Trouve les passages qui font appel à la cupidité, au désir de gain, ou à l'appât du profit.

EXEMPLES : "profit", "gain", "argent", "richesse", "fortune", "réussite", "succès", "opportunité", "chance", "bénéfice", "revenus", "salaire", "investissement", "retour", "rentabilité", "croissance".

INSTRUCTIONS CRITIQUES :
- Retourne UNIQUEMENT les passages EXACTS du texte original
- Format JSON strict :
[
  {"text": "passage exact du texte", "comment": "pourquoi ce passage fait appel à la cupidité", "intensity": 0.8}
]
- Si rien n'est trouvé, renvoie []
- Le "text" doit être EXACTEMENT tel qu'il apparaît dans le texte original
- L'intensité doit être entre 0 et 1
- Ne modifie JAMAIS le texte original

TEXTE À ANALYSER :
---`
  },

  reciprocity: {
    name: "Reciprocity",
    description: "Creates obligation to return favors",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et trouve EXACTEMENT les passages qui utilisent la réciprocité.

DÉTECTION : Trouve les passages qui créent un sentiment d'obligation de rendre la pareille, d'offrir quelque chose en retour.

EXEMPLES : "gratuit", "offert", "cadeau", "bonus", "en plus", "sans frais", "gratuitement", "à vos frais", "pour vous", "en votre faveur", "spécialement pour vous", "juste pour vous", "exclusivement pour vous".

INSTRUCTIONS CRITIQUES :
- Retourne UNIQUEMENT les passages EXACTS du texte original
- Format JSON strict :
[
  {"text": "passage exact du texte", "comment": "pourquoi ce passage utilise la réciprocité", "intensity": 0.8}
]
- Si rien n'est trouvé, renvoie []
- Le "text" doit être EXACTEMENT tel qu'il apparaît dans le texte original
- L'intensité doit être entre 0 et 1
- Ne modifie JAMAIS le texte original

TEXTE À ANALYSER :
---`
  },

  liking: {
    name: "Liking",
    description: "Creates affinity and connection",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et trouve EXACTEMENT les passages qui créent de l'affinité.

DÉTECTION : Trouve les passages qui créent une connexion, de l'affinité, ou qui rendent le lecteur sympathique.

EXEMPLES : "comme vous", "comme nous", "ensemble", "nous sommes", "nous partageons", "nous comprenons", "nous savons", "nous avons", "nous connaissons", "nous avons vécu", "nous avons ressenti", "nous avons éprouvé".

INSTRUCTIONS CRITIQUES :
- Retourne UNIQUEMENT les passages EXACTS du texte original
- Format JSON strict :
[
  {"text": "passage exact du texte", "comment": "pourquoi ce passage crée de l'affinité", "intensity": 0.8}
]
- Si rien n'est trouvé, renvoie []
- Le "text" doit être EXACTEMENT tel qu'il apparaît dans le texte original
- L'intensité doit être entre 0 et 1
- Ne modifie JAMAIS le texte original

TEXTE À ANALYSER :
---`
  }
};

// Fonction utilitaire pour obtenir le prompt d'un trigger
export function getExactTextPrompt(triggerType: string): string {
  const trigger = EXACT_TEXT_PROMPTS[triggerType as keyof typeof EXACT_TEXT_PROMPTS];
  if (!trigger) {
    throw new Error(`Trigger inconnu: ${triggerType}`);
  }
  return trigger.prompt;
}
