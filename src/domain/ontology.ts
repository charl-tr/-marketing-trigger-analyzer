// L'ontologie Glypheur : la seule source de vérité du produit.
// Le moteur d'analyse (prompt), l'interface (couleurs, glyphes, Codex), les métriques, l'export
// et, plus tard, le Dojo et l'API lisent tous ces définitions — on ne les répète nulle part ailleurs.

export const NODE_TYPES = ["big_idea", "hook", "pain", "mechanism", "proof", "offer", "cta", "transition"] as const;
export type NodeType = (typeof NODE_TYPES)[number];

/** Macro : l'énergie et le flux du texte. Micro : les détails et sous-mécanismes. Liant : ce qui relie et fait agir. */
export type Scale = "macro" | "micro" | "liant";

/** Grammaire visuelle du document : chaque type a une couleur et un « trait ». */
export type Stroke = "solid" | "dotted" | "hatched" | "outline" | "underline" | "notch";

export interface NodeDef {
  id: NodeType;
  label: string;
  scale: Scale;
  color: string; // jeton de couleur (voir COLORS)
  stroke: Stroke;
  definition: string; // affichée en infobulle et dans le Codex
  principle: string; // la règle à retenir (carte runique)
  check: string; // la question de contrôle rapide
  example: string;
  antiExample: string;
}

export const COLORS = {
  turquoise: "#3aa6a0",
  forest: "#2f5d43",
  gold: "#a8823e",
  sand: "#c9b48a",
} as const;

export const NODES: Record<NodeType, NodeDef> = {
  big_idea: {
    id: "big_idea", label: "Big Idea", scale: "macro", color: "turquoise", stroke: "solid",
    definition: "L'idée centrale, neuve et crédible, que tout le texte sert à installer.",
    principle: "Une seule Big Idea par texte ; tout le reste la soutient.",
    check: "Puis-je la résumer en une phrase qui surprend ?",
    example: "« Ce n'est pas votre offre qui ne vend pas, c'est l'ordre dans lequel vous la racontez. »",
    antiExample: "« Notre méthode est la meilleure du marché. » (affirmation, pas idée)",
  },
  hook: {
    id: "hook", label: "Hook", scale: "macro", color: "turquoise", stroke: "dotted",
    definition: "L'accroche qui capte l'attention et donne envie de lire la suite, souvent par une image sensorielle.",
    principle: "Le hook ouvre une tension que le texte promet de résoudre.",
    check: "Est-ce qu'on a envie de lire la phrase suivante ?",
    example: "« Imaginez le bruit sec d'un dossier qu'on referme, signé. »",
    antiExample: "« Bonjour, aujourd'hui je vais vous parler de… »",
  },
  pain: {
    id: "pain", label: "Douleur", scale: "micro", color: "forest", stroke: "solid",
    definition: "Le problème vécu par le lecteur, décrit avec ses mots et ses conséquences concrètes.",
    principle: "Nommer la douleur mieux que le lecteur ne le ferait lui-même.",
    check: "Le lecteur se dirait-il « c'est exactement moi » ?",
    example: "« Vous relancez trois fois, et le prospect disparaît quand même. »",
    antiExample: "« Beaucoup d'entreprises ont des difficultés commerciales. »",
  },
  mechanism: {
    id: "mechanism", label: "Mécanisme", scale: "micro", color: "forest", stroke: "hatched",
    definition: "Le « comment ça marche » : la raison logique pour laquelle la solution fonctionne.",
    principle: "Un mécanisme nommé et compréhensible rend la promesse crédible.",
    check: "Pourrait-on l'expliquer à un enfant de douze ans ?",
    example: "« On inverse l'ordre : preuve d'abord, offre ensuite. »",
    antiExample: "« Grâce à notre technologie révolutionnaire… »",
  },
  proof: {
    id: "proof", label: "Preuve", scale: "liant", color: "gold", stroke: "outline",
    definition: "Ce qui rend vrai ce qui est affirmé : chiffre, témoignage, démonstration, autorité.",
    principle: "Chaque promesse forte appelle sa preuve, juste après.",
    check: "Un sceptique serait-il convaincu par ce passage ?",
    example: "« 37 clients sur 40 ont signé dans la semaine. »",
    antiExample: "« Nos clients sont très satisfaits. »",
  },
  offer: {
    id: "offer", label: "Offre", scale: "liant", color: "gold", stroke: "solid",
    definition: "Ce que le lecteur obtient concrètement, à quelles conditions, et pourquoi c'est une bonne affaire.",
    principle: "La valeur perçue doit dépasser nettement le prix demandé.",
    check: "Sait-on exactement ce qu'on reçoit et ce qu'on donne ?",
    example: "« Trois séances, le modèle complet, et vos deux premières pages réécrites. »",
    antiExample: "« Contactez-nous pour en savoir plus. »",
  },
  cta: {
    id: "cta", label: "Appel à l'action", scale: "liant", color: "gold", stroke: "notch",
    definition: "L'invitation explicite à agir maintenant, avec l'élan accumulé par le texte.",
    principle: "Un seul geste, clair, facile, au bon moment.",
    check: "Le lecteur sait-il quoi faire dans la seconde ?",
    example: "« Réservez votre créneau ci-dessous, il en reste quatre. »",
    antiExample: "« N'hésitez pas à revenir vers nous. »",
  },
  transition: {
    id: "transition", label: "Transition", scale: "liant", color: "sand", stroke: "underline",
    definition: "Le pont qui fait passer d'un bloc au suivant sans rupture d'attention.",
    principle: "Chaque transition prépare le bloc suivant et relance la curiosité.",
    check: "Le passage au bloc suivant paraît-il inévitable ?",
    example: "« Et c'est précisément là que tout bascule. »",
    antiExample: "« Passons maintenant à autre chose. »",
  },
};

/** Ordre canonique d'un texte persuasif (sert à la métrique de séquence). */
export const CANONICAL_SEQUENCE: NodeType[] = ["hook", "big_idea", "pain", "mechanism", "proof", "offer", "cta"];

export const RELATION_KINDS = ["supports", "triggers", "answers", "prepares", "validates"] as const;
export type RelationKind = (typeof RELATION_KINDS)[number];
export const RELATIONS: Record<RelationKind, { label: string; definition: string }> = {
  supports: { label: "soutient", definition: "Renforce l'autre élément sans en dépendre." },
  triggers: { label: "déclenche", definition: "Provoque l'apparition ou le besoin de l'autre élément." },
  answers: { label: "répond à", definition: "Résout la tension ou l'objection ouverte par l'autre élément." },
  prepares: { label: "prépare", definition: "Installe ce qu'il faut pour que l'autre élément fonctionne." },
  validates: { label: "valide", definition: "Prouve ce que l'autre élément affirme." },
};

/** Bibliothèque de patterns (motifs récurrents qui combinent plusieurs nœuds). */
export const PATTERN_KINDS = ["open_loop", "cliffhanger", "future_pace", "objection_sandwich"] as const;
export type PatternKind = (typeof PATTERN_KINDS)[number];
export const PATTERNS: Record<PatternKind, { label: string; definition: string }> = {
  open_loop: { label: "Boucle ouverte", definition: "Une question ou promesse laissée en suspens, refermée plus loin (ou jamais : c'est un défaut)." },
  cliffhanger: { label: "Cliffhanger", definition: "Une fin de bloc qui coupe au moment le plus tendu pour forcer la lecture." },
  future_pace: { label: "Projection", definition: "Le lecteur est placé mentalement dans l'après, solution déjà obtenue." },
  objection_sandwich: { label: "Objection-sandwich", definition: "Bénéfice, objection traitée, bénéfice : l'objection est absorbée entre deux gains." },
};

export const SCALE_LABEL: Record<Scale, string> = { macro: "Macro-structure", micro: "Micro-structure", liant: "Liants" };
