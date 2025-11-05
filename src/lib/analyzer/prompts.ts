// Prompts centralisés pour chaque trigger
export const TRIGGER_PROMPTS = {
  urgency: {
    name: "Urgency",
    description: "Encourages immediate action",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et repère le trigger marketing "Urgency".

DÉTECTION : Trouve les passages qui créent un sentiment d'urgence, de pression temporelle, ou qui encouragent une action immédiate.

EXEMPLES DE MOTS-CLÉS : "maintenant", "urgent", "limité", "dernière chance", "avant qu'il ne soit trop tard", "immédiatement", "sans délai", "rapidement", "vite", "dépêche-toi", "ne perds pas de temps", "cette semaine seulement", "offre limitée dans le temps".

INSTRUCTIONS :
- Retourne un JSON strict avec ce format exact :
[
  {"start": int, "end": int, "text": str, "comment": str, "intensity": float}
]
- Si rien n'est trouvé, renvoie []
- Les positions start/end doivent être exactes (comptage de caractères)
- IMPORTANT : Les positions doivent couvrir des phrases ou mots COMPLETS, jamais des fragments
- L'intensité doit être entre 0 et 1 (0.8 = très urgent, 0.3 = légèrement urgent)
- Le comment doit expliquer pourquoi ce passage crée de l'urgence
- Compte les caractères très précisément, y compris les espaces et la ponctuation

TEXTE À ANALYSER :
---`
  },

  scarcity: {
    name: "Scarcity",
    description: "Highlights rarity or limited availability",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et repère le trigger marketing "Scarcity".

DÉTECTION : Trouve les passages qui évoquent la rareté, la limitation, ou l'exclusivité d'une offre.

EXEMPLES DE MOTS-CLÉS : "limité", "rare", "exclusif", "seulement X places", "stock limité", "quantité limitée", "dernières unités", "plus que X restants", "épuisé", "indisponible", "réservé à", "membres seulement", "invitation uniquement".

INSTRUCTIONS :
- Retourne un JSON strict avec ce format exact :
[
  {"start": int, "end": int, "text": str, "comment": str, "intensity": float}
]
- Si rien n'est trouvé, renvoie []
- Les positions start/end doivent être exactes (comptage de caractères)
- IMPORTANT : Les positions doivent couvrir des phrases ou mots COMPLETS, jamais des fragments
- L'intensité doit être entre 0 et 1 (0.9 = très rare, 0.4 = légèrement limité)
- Le comment doit expliquer pourquoi ce passage crée un sentiment de rareté
- Compte les caractères très précisément, y compris les espaces et la ponctuation

TEXTE À ANALYSER :
---`
  },

  social_proof: {
    name: "Social Proof",
    description: "Uses testimonials, reviews, or social validation",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et repère le trigger marketing "Social Proof".

DÉTECTION : Trouve les passages qui utilisent la preuve sociale, les témoignages, ou la validation par d'autres personnes.

EXEMPLES DE MOTS-CLÉS : "témoignages", "avis clients", "recommandations", "ils ont choisi", "nos clients disent", "plus de X personnes", "rejoint par", "comme eux", "ils ont réussi", "leurs résultats", "ils témoignent", "ils recommandent", "ils confirment".

INSTRUCTIONS :
- Retourne un JSON strict avec ce format exact :
[
  {"start": int, "end": int, "text": str, "comment": str, "intensity": float}
]
- Si rien n'est trouvé, renvoie []
- Les positions start/end doivent être exactes (comptage de caractères)
- IMPORTANT : Les positions doivent couvrir des phrases ou mots COMPLETS, jamais des fragments
- L'intensité doit être entre 0 et 1 (0.8 = forte preuve sociale, 0.3 = légère validation)
- Le comment doit expliquer pourquoi ce passage utilise la preuve sociale
- Compte les caractères très précisément, y compris les espaces et la ponctuation

TEXTE À ANALYSER :
---`
  },

  authority: {
    name: "Authority",
    description: "Establishes credibility and expertise",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et repère le trigger marketing "Authority".

DÉTECTION : Trouve les passages où une figure d'autorité, un expert, ou un statut crédible est mis en avant.

EXEMPLES DE MOTS-CLÉS : "expert", "spécialiste", "professionnel", "certifié", "diplômé", "expérience", "années d'expérience", "reconnu", "primé", "référence", "leader", "pionnier", "inventeur", "créateur", "fondateur", "directeur", "docteur", "professeur".

INSTRUCTIONS :
- Retourne un JSON strict avec ce format exact :
[
  {"start": int, "end": int, "text": str, "comment": str, "intensity": float}
]
- Si rien n'est trouvé, renvoie []
- Les positions start/end doivent être exactes (comptage de caractères)
- IMPORTANT : Les positions doivent couvrir des phrases ou mots COMPLETS, jamais des fragments
- L'intensité doit être entre 0 et 1 (0.9 = très forte autorité, 0.4 = légère crédibilité)
- Le comment doit expliquer pourquoi ce passage établit l'autorité
- Compte les caractères très précisément, y compris les espaces et la ponctuation

TEXTE À ANALYSER :
---`
  },

  fear: {
    name: "Fear",
    description: "Creates anxiety about negative outcomes",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et repère le trigger marketing "Fear".

DÉTECTION : Trouve les passages qui créent de l'anxiété, de la peur, ou qui évoquent des conséquences négatives.

EXEMPLES DE MOTS-CLÉS : "attention", "danger", "risque", "perte", "échec", "problème", "difficulté", "crise", "urgence", "catastrophe", "ne pas rater", "éviter", "prévenir", "protéger", "sécuriser", "garantir", "assurer".

INSTRUCTIONS :
- Retourne un JSON strict avec ce format exact :
[
  {"start": int, "end": int, "text": str, "comment": str, "intensity": float}
]
- Si rien n'est trouvé, renvoie []
- Les positions start/end doivent être exactes (comptage de caractères)
- IMPORTANT : Les positions doivent couvrir des phrases ou mots COMPLETS, jamais des fragments
- L'intensité doit être entre 0 et 1 (0.8 = très anxiogène, 0.3 = légère inquiétude)
- Le comment doit expliquer pourquoi ce passage crée de la peur ou de l'anxiété
- Compte les caractères très précisément, y compris les espaces et la ponctuation

TEXTE À ANALYSER :
---`
  },

  exclusivity: {
    name: "Exclusivity",
    description: "Creates sense of privilege and exclusiveness",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et repère le trigger marketing "Exclusivity".

DÉTECTION : Trouve les passages qui créent un sentiment de privilège, d'exclusivité, ou d'appartenance à un groupe restreint.

EXEMPLES DE MOTS-CLÉS : "exclusif", "privé", "réservé", "membres seulement", "invitation", "sélectionné", "élite", "VIP", "premium", "luxe", "haut de gamme", "sélect", "choisi", "privilégié", "insider", "initié".

INSTRUCTIONS :
- Retourne un JSON strict avec ce format exact :
[
  {"start": int, "end": int, "text": str, "comment": str, "intensity": float}
]
- Si rien n'est trouvé, renvoie []
- Les positions start/end doivent être exactes (comptage de caractères)
- IMPORTANT : Les positions doivent couvrir des phrases ou mots COMPLETS, jamais des fragments
- L'intensité doit être entre 0 et 1 (0.9 = très exclusif, 0.4 = légèrement privilégié)
- Le comment doit expliquer pourquoi ce passage crée un sentiment d'exclusivité
- Compte les caractères très précisément, y compris les espaces et la ponctuation

TEXTE À ANALYSER :
---`
  },

  storytelling: {
    name: "Storytelling",
    description: "Uses narrative to engage and persuade",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et repère le trigger marketing "Storytelling".

DÉTECTION : Trouve les passages qui utilisent la narration, racontent une histoire, ou créent un scénario imaginaire.

EXEMPLES DE MOTS-CLÉS : "imaginez", "histoire", "récit", "scénario", "il était une fois", "conte", "légende", "témoignage", "expérience", "voyage", "parcours", "transformation", "évolution", "changement", "révolution".

INSTRUCTIONS :
- Retourne un JSON strict avec ce format exact :
[
  {"start": int, "end": int, "text": str, "comment": str, "intensity": float}
]
- Si rien n'est trouvé, renvoie []
- Les positions start/end doivent être exactes (comptage de caractères)
- IMPORTANT : Les positions doivent couvrir des phrases ou mots COMPLETS, jamais des fragments
- L'intensité doit être entre 0 et 1 (0.8 = forte narration, 0.3 = légère histoire)
- Le comment doit expliquer pourquoi ce passage utilise le storytelling
- Compte les caractères très précisément, y compris les espaces et la ponctuation

TEXTE À ANALYSER :
---`
  },

  contrast: {
    name: "Contrast",
    description: "Creates comparison between options or states",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et repère le trigger marketing "Contrast".

DÉTECTION : Trouve les passages qui créent une comparaison, un contraste, ou opposent deux situations.

EXEMPLES DE MOTS-CLÉS : "contrairement à", "alors que", "tandis que", "au lieu de", "plutôt que", "contrairement", "différemment", "autrement", "sinon", "ou bien", "soit... soit", "d'un côté... de l'autre", "avant/après", "avec/sans".

INSTRUCTIONS :
- Retourne un JSON strict avec ce format exact :
[
  {"start": int, "end": int, "text": str, "comment": str, "intensity": float}
]
- Si rien n'est trouvé, renvoie []
- Les positions start/end doivent être exactes (comptage de caractères)
- IMPORTANT : Les positions doivent couvrir des phrases ou mots COMPLETS, jamais des fragments
- L'intensité doit être entre 0 et 1 (0.7 = fort contraste, 0.3 = légère comparaison)
- Le comment doit expliquer pourquoi ce passage crée un contraste
- Compte les caractères très précisément, y compris les espaces et la ponctuation

TEXTE À ANALYSER :
---`
  },

  call_to_action: {
    name: "Call to Action",
    description: "Encourages specific action or decision",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et repère le trigger marketing "Call to Action".

DÉTECTION : Trouve les passages qui encouragent une action spécifique, une décision, ou un comportement.

EXEMPLES DE MOTS-CLÉS : "cliquez", "inscrivez-vous", "commandez", "achetez", "réservez", "contactez", "appelez", "écrivez", "visitez", "découvrez", "essayez", "testez", "profitez", "bénéficiez", "obtenez", "recevez".

INSTRUCTIONS :
- Retourne un JSON strict avec ce format exact :
[
  {"start": int, "end": int, "text": str, "comment": str, "intensity": float}
]
- Si rien n'est trouvé, renvoie []
- Les positions start/end doivent être exactes (comptage de caractères)
- IMPORTANT : Les positions doivent couvrir des phrases ou mots COMPLETS, jamais des fragments
- L'intensité doit être entre 0 et 1 (0.9 = appel très direct, 0.4 = suggestion douce)
- Le comment doit expliquer pourquoi ce passage est un appel à l'action
- Compte les caractères très précisément, y compris les espaces et la ponctuation

TEXTE À ANALYSER :
---`
  },

  loss_aversion: {
    name: "Loss Aversion",
    description: "Emphasizes what will be lost if no action is taken",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et repère le trigger marketing "Loss Aversion".

DÉTECTION : Trouve les passages qui mettent l'accent sur ce qui sera perdu, raté, ou manqué si aucune action n'est entreprise.

EXEMPLES DE MOTS-CLÉS : "ne ratez pas", "ne manquez pas", "perdre", "rater", "manquer", "échapper", "passer à côté", "laisser filer", "gaspiller", "perdre l'occasion", "regretter", "déplorer", "se mordre les doigts", "se lamenter".

INSTRUCTIONS :
- Retourne un JSON strict avec ce format exact :
[
  {"start": int, "end": int, "text": str, "comment": str, "intensity": float}
]
- Si rien n'est trouvé, renvoie []
- Les positions start/end doivent être exactes (comptage de caractères)
- IMPORTANT : Les positions doivent couvrir des phrases ou mots COMPLETS, jamais des fragments
- L'intensité doit être entre 0 et 1 (0.8 = forte peur de perdre, 0.3 = légère inquiétude)
- Le comment doit expliquer pourquoi ce passage utilise l'aversion à la perte
- Compte les caractères très précisément, y compris les espaces et la ponctuation

TEXTE À ANALYSER :
---`
  },

  commitment: {
    name: "Commitment & Consistency",
    description: "Encourages commitment to decisions",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et repère le trigger marketing "Commitment & Consistency".

DÉTECTION : Trouve les passages qui encouragent l'engagement, la cohérence avec les décisions passées, ou qui créent un sentiment d'obligation.

EXEMPLES DE MOTS-CLÉS : "engagement", "cohérent", "logique", "naturel", "évident", "logique", "cohérence", "engagement", "promesse", "décision", "choix", "option", "préférence", "habitude", "routine".

INSTRUCTIONS :
- Retourne un JSON strict avec ce format exact :
[
  {"start": int, "end": int, "text": str, "comment": str, "intensity": float}
]
- Si rien n'est trouvé, renvoie []
- Les positions start/end doivent être exactes (comptage de caractères)
- IMPORTANT : Les positions doivent couvrir des phrases ou mots COMPLETS, jamais des fragments
- L'intensité doit être entre 0 et 1 (0.8 = fort engagement, 0.3 = légère cohérence)
- Le comment doit expliquer pourquoi ce passage encourage l'engagement
- Compte les caractères très précisément, y compris les espaces et la ponctuation

TEXTE À ANALYSER :
---`
  },

  greed: {
    name: "Greed",
    description: "Appeals to desire for gain",
    prompt: `Tu es un expert en marketing. Analyse le texte suivant et repère le trigger marketing "Greed".

DÉTECTION : Trouve les passages qui font appel à la cupidité, au désir de gain, ou à l'appât du profit.

EXEMPLES DE MOTS-CLÉS : "profit", "gain", "argent", "richesse", "fortune", "réussite", "succès", "opportunité", "chance", "bénéfice", "revenus", "salaire", "investissement", "retour", "rentabilité", "croissance".

INSTRUCTIONS :
- Retourne un JSON strict avec ce format exact :
[
  {"start": int, "end": int, "text": str, "comment": str, "intensity": float}
]
- Si rien n'est trouvé, renvoie []
- Les positions start/end doivent être exactes (comptage de caractères)
- IMPORTANT : Les positions doivent couvrir des phrases ou mots COMPLETS, jamais des fragments
- L'intensité doit être entre 0 et 1 (0.9 = très cupide, 0.4 = légère attraction)
- Le comment doit expliquer pourquoi ce passage fait appel à la cupidité
- Compte les caractères très précisément, y compris les espaces et la ponctuation

TEXTE À ANALYSER :
---`
  }
};

// Fonction utilitaire pour obtenir le prompt d'un trigger
export function getTriggerPrompt(triggerType: string): string {
  const trigger = TRIGGER_PROMPTS[triggerType as keyof typeof TRIGGER_PROMPTS];
  if (!trigger) {
    throw new Error(`Trigger inconnu: ${triggerType}`);
  }
  return trigger.prompt;
}

// Fonction pour obtenir la description d'un trigger
export function getTriggerDescription(triggerType: string): string {
  const trigger = TRIGGER_PROMPTS[triggerType as keyof typeof TRIGGER_PROMPTS];
  return trigger?.description || "Trigger non défini";
}
