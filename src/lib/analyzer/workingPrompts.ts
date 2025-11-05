// Prompts intelligents avec granularité adaptée au contexte
export const WORKING_TRIGGER_PROMPTS = {
  urgency: {
    name: "Urgency",
    description: "Encourages immediate action",
    prompt: `Analyse ce texte et trouve les segments qui créent de l'urgence temporelle.

ADAPTATION INTELLIGENTE :
- Pour des mots isolés : "maintenant", "immédiatement", "urgent", "rapidement", "aujourd'hui", "avant qu'il soit trop tard", "dernière chance", "expire bientôt"
- Pour des expressions : "dans l'heure", "offre limitée dans le temps", "ne tardez pas", "dépêchez-vous", "sans attendre", "tout de suite", "ASAP"
- Pour des phrases complètes : quand l'urgence est construite sur plusieurs mots ("Cette offre exceptionnelle expire dans 24h")

IMPORTANT : 
- Sois intelligent : un mot seul si c'est suffisant, une phrase si nécessaire
- Évalue l'intensité de 0 à 100% (0% = très faible, 100% = très fort)
- Le segment doit être compréhensible pour le lecteur

Retourne UNIQUEMENT du JSON valide :
[{"text": "mot, expression ou phrase", "comment": "pourquoi c'est urgent", "intensity": 85}]

Texte à analyser :`
  },

  authority: {
    name: "Authority", 
    description: "Establishes credibility",
    prompt: `Analyse ce texte et trouve les MOTS ou EXPRESSIONS COURTES qui établissent l'autorité, l'expertise ou la crédibilité.

Cherche spécifiquement : "expert", "spécialiste", "certifié", "approuvé par", "recommandé par", "études montrent", "selon les recherches", "docteur", "professeur", "ingénieur", "analyste", "consultant", "agence", "institut", "laboratoire", "université", "ministère", "gouvernement", "officiel", "agréé", "validé", "testé", "prouvé".

ADAPTATION INTELLIGENTE :
- Pour des mots isolés : "expert", "professionnel", "certifié", "diplômé", "spécialiste"
- Pour des expressions : "selon les études", "les recherches montrent", "il est prouvé que"
- Pour des phrases complètes : quand l'autorité est établie par le contexte ("Dr. Martin, spécialiste reconnu, affirme que")

IMPORTANT : 
- Sois intelligent : adapte la taille selon le contexte d'autorité
- Évalue l'intensité de 0 à 100% (0% = très faible, 100% = très fort)
- Le segment doit être compréhensible pour le lecteur

Retourne UNIQUEMENT du JSON valide :
[{"text": "mot, expression ou phrase", "comment": "pourquoi c'est de l'autorité", "intensity": 75}]

Texte à analyser :`
  },

  scarcity: {
    name: "Scarcity",
    description: "Highlights rarity",
    prompt: `Analyse ce texte et trouve les MOTS ou EXPRESSIONS COURTES qui évoquent la rareté, la limitation ou l'exclusivité.

Cherche spécifiquement : "limité", "rare", "exclusif", "seulement", "derniers", "plus que", "stock limité", "quantité limitée", "offre limitée", "premiers arrivés", "premiers servis", "uniquement", "rien que", "pas pour tous", "sélectionné", "choisi", "élite", "privilégié", "réservé à", "disponible uniquement".

ADAPTATION INTELLIGENTE :
- Pour des mots isolés : "limité", "rare", "exclusif", "seulement", "derniers"
- Pour des expressions : "stock limité", "quantité limitée", "premiers arrivés", "premiers servis"
- Pour des phrases complètes : quand la rareté est construite ("Plus que 3 places disponibles pour cette formation exclusive")

IMPORTANT : 
- Sois intelligent : adapte la taille selon le contexte de rareté
- Évalue l'intensité de 0 à 100% (0% = très faible, 100% = très fort)
- Le segment doit être compréhensible pour le lecteur

Retourne UNIQUEMENT du JSON valide :
[{"text": "mot, expression ou phrase", "comment": "pourquoi c'est de la rareté", "intensity": 80}]

Texte à analyser :`
  },

  social_proof: {
    name: "Social Proof",
    description: "Uses testimonials",
    prompt: `Analyse ce texte et trouve les MOTS ou EXPRESSIONS COURTES qui utilisent la preuve sociale, les témoignages ou la validation par d'autres.

Cherche spécifiquement : "témoignage", "avis", "recommandation", "satisfait", "clients", "utilisateurs", "membres", "communauté", "réseau", "partenaires", "collaborateurs", "équipe", "groupe", "collectif", "ensemble", "tous", "beaucoup", "nombreux", "majorité", "la plupart", "généralement", "souvent", "habituellement".

ADAPTATION INTELLIGENTE :
- Pour des mots isolés : "clients", "utilisateurs", "membres", "communauté", "tous", "beaucoup"
- Pour des expressions : "nos clients satisfaits", "plus de 1000 utilisateurs", "rejoignez notre communauté"
- Pour des phrases complètes : quand la preuve sociale est développée ("Plus de 10 000 entrepreneurs ont déjà transformé leur business avec cette méthode")

IMPORTANT : 
- Sois intelligent : adapte la taille selon le contexte de preuve sociale
- Évalue l'intensité de 0 à 100% (0% = très faible, 100% = très fort)
- Le segment doit être compréhensible pour le lecteur

Retourne UNIQUEMENT du JSON valide :
[{"text": "mot, expression ou phrase", "comment": "pourquoi c'est de la preuve sociale", "intensity": 70}]

Texte à analyser :`
  },

  call_to_action: {
    name: "Call to Action",
    description: "Encourages action",
    prompt: `Analyse ce texte et trouve les MOTS ou EXPRESSIONS COURTES qui encouragent une action spécifique ou une décision.

Cherche spécifiquement : "cliquez", "clique", "cliquez ici", "découvrez", "essayez", "testez", "commandez", "achetez", "réservez", "inscrivez-vous", "abonnez-vous", "téléchargez", "obtenez", "recevez", "profitez", "bénéficiez", "accédez", "contactez", "appelez", "écrivez", "envoyez", "partagez", "likez", "suivez".

IMPORTANT : Retourne seulement les MOTS/EXPRESSIONS spécifiques, pas toute la phrase.

Retourne UNIQUEMENT du JSON valide :
[{"text": "mot ou expression courte", "comment": "pourquoi c'est un appel à l'action"}]

Texte à analyser :`
  },

  reciprocity: {
    name: "Reciprocity",
    description: "Creates obligation",
    prompt: `Analyse ce texte et trouve les MOTS ou EXPRESSIONS COURTES qui créent une obligation de rendre la pareille ou offrent quelque chose gratuitement.

Cherche spécifiquement : "gratuit", "gratuitement", "offert", "cadeau", "bonus", "en plus", "supplémentaire", "extra", "sans frais", "sans coût", "à vos frais", "pour vous", "en votre faveur", "rendre service", "aider", "soutenir", "accompagner", "guider", "conseiller", "partager", "donner", "offrir".

IMPORTANT : Retourne seulement les MOTS/EXPRESSIONS spécifiques, pas toute la phrase.

Retourne UNIQUEMENT du JSON valide :
[{"text": "mot ou expression courte", "comment": "pourquoi c'est de la réciprocité"}]

Texte à analyser :`
  },

  commitment: {
    name: "Commitment",
    description: "Encourages commitment",
    prompt: `Analyse ce texte et trouve les MOTS ou EXPRESSIONS COURTES qui encouragent l'engagement, la cohérence ou créent des promesses.

Cherche spécifiquement : "promesse", "engagement", "garantie", "assurance", "certitude", "confiance", "fiable", "sûr", "sécurisé", "protégé", "couvert", "remboursé", "satisfait", "satisfaction", "qualité", "excellence", "perfection", "optimal", "meilleur", "supérieur", "premium", "haut de gamme".

IMPORTANT : Retourne seulement les MOTS/EXPRESSIONS spécifiques, pas toute la phrase.

Retourne UNIQUEMENT du JSON valide :
[{"text": "mot ou expression courte", "comment": "pourquoi c'est de l'engagement"}]

Texte à analyser :`
  },

  liking: {
    name: "Liking",
    description: "Creates affinity",
    prompt: `Analyse ce texte et trouve les MOTS ou EXPRESSIONS COURTES qui créent de l'affinité, de la connexion ou de la sympathie.

Cherche spécifiquement : "vous", "votre", "vos", "nous", "notre", "nos", "ensemble", "avec vous", "pour vous", "à vos côtés", "comme vous", "comme nous", "similaire", "pareil", "identique", "commun", "partagé", "famille", "équipe", "partenaire", "ami", "allié", "collaborateur".

IMPORTANT : 
- Retourne seulement les MOTS/EXPRESSIONS spécifiques, pas toute la phrase
- Évalue l'intensité de 0 à 100% (0% = très faible, 100% = très fort)
- Sois précis dans la sélection du segment

Retourne UNIQUEMENT du JSON valide :
[{"text": "mot ou expression courte", "comment": "pourquoi c'est de l'affinité", "intensity": 60}]

Texte à analyser :`
  },

  mystery: {
    name: "Mystery",
    description: "Creates intrigue",
    prompt: `Analyse ce texte et trouve les MOTS ou EXPRESSIONS COURTES qui créent du mystère, de l'intrigue ou de la curiosité.

Cherche spécifiquement : "secret", "mystère", "mystérieux", "énigme", "puzzle", "révélation", "découverte", "surprise", "inattendu", "incroyable", "extraordinaire", "exceptionnel", "unique", "inédit", "nouveau", "révolutionnaire", "innovant", "révolutionnaire", "breakthrough", "révélation", "découvrir", "révéler", "dévoiler".

IMPORTANT : 
- Retourne seulement les MOTS/EXPRESSIONS spécifiques, pas toute la phrase
- Évalue l'intensité de 0 à 100% (0% = très faible, 100% = très fort)
- Sois précis dans la sélection du segment

Retourne UNIQUEMENT du JSON valide :
[{"text": "mot ou expression courte", "comment": "pourquoi c'est mystérieux", "intensity": 70}]

Texte à analyser :`
  },

  curiosity: {
    name: "Curiosity",
    description: "Sparks interest",
    prompt: `Analyse ce texte et trouve les MOTS ou EXPRESSIONS COURTES qui éveillent la curiosité ou créent un désir d'en savoir plus.

Cherche spécifiquement : "comment", "pourquoi", "quoi", "qui", "quand", "où", "et si", "imaginez", "supposez", "pensez", "réfléchissez", "considérez", "envisagez", "visualisez", "concevez", "créez", "développez", "construisez", "formez", "apprenez", "découvrez", "explorez", "investiguez".

IMPORTANT : 
- Retourne seulement les MOTS/EXPRESSIONS spécifiques, pas toute la phrase
- Évalue l'intensité de 0 à 100% (0% = très faible, 100% = très fort)
- Sois précis dans la sélection du segment

Retourne UNIQUEMENT du JSON valide :
[{"text": "mot ou expression courte", "comment": "pourquoi c'est curieux", "intensity": 55}]

Texte à analyser :`
  },

  exclusivity: {
    name: "Exclusivity",
    description: "Creates exclusivity",
    prompt: `Analyse ce texte et trouve les MOTS ou EXPRESSIONS COURTES qui créent un sentiment d'exclusivité ou de privilège.

Cherche spécifiquement : "exclusif", "exclusivement", "privé", "privé", "réservé", "sélectionné", "choisi", "élite", "premium", "luxe", "haut de gamme", "VIP", "premium", "spécial", "unique", "personnalisé", "sur mesure", "adapté", "tailor-made", "custom", "bespoke", "artisanal", "fait main".

IMPORTANT : 
- Retourne seulement les MOTS/EXPRESSIONS spécifiques, pas toute la phrase
- Évalue l'intensité de 0 à 100% (0% = très faible, 100% = très fort)
- Sois précis dans la sélection du segment

Retourne UNIQUEMENT du JSON valide :
[{"text": "mot ou expression courte", "comment": "pourquoi c'est exclusif", "intensity": 85}]

Texte à analyser :`
  },

  storytelling: {
    name: "Storytelling",
    description: "Uses narrative",
    prompt: `Analyse ce texte et trouve les segments qui utilisent la narration, racontent une histoire ou créent un récit.

ADAPTATION INTELLIGENTE :
- Pour des amorces : "je vais vous raconter", "il était une fois", "laissez-moi vous dire", "figurez-vous que"
- Pour des transitions narratives : "c'est alors que", "soudain", "finalement", "au bout du compte"
- Pour des phrases complètes : quand une histoire est racontée en une phrase ("Il y a 3 ans, j'ai découvert cette méthode révolutionnaire")
- Pour des paragraphes entiers : quand une histoire complète est développée sur plusieurs lignes

IMPORTANT : 
- Sois intelligent : adapte la taille selon le contexte narratif
- Évalue l'intensité de 0 à 100% (0% = très faible, 100% = très fort)
- Le segment doit être compréhensible pour le lecteur

Retourne UNIQUEMENT du JSON valide :
[{"text": "mot, phrase ou paragraphe", "comment": "pourquoi c'est du storytelling", "intensity": 50}]

Texte à analyser :`
  }
};

export function getWorkingPrompt(triggerType: string): string {
  const trigger = WORKING_TRIGGER_PROMPTS[triggerType as keyof typeof WORKING_TRIGGER_PROMPTS];
  if (!trigger) {
    throw new Error(`Trigger inconnu: ${triggerType}`);
  }
  return trigger.prompt;
}
