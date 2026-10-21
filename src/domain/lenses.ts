// Les lentilles : des façons de lire un même texte. « Structure » applique l'ontologie du document ;
// « Déclencheurs » reprend la taxonomie du prototype (public/triggers.json, devenue src/domain/triggers.json).
// Ajouter une lentille (Blair Warren, Schwartz…) = ajouter une entrée ici : moteur, interface et export suivent.
import { COLORS, NODES, NODE_TYPES } from "./ontology";
import triggersJson from "./triggers.json";

export interface LensType {
  id: string;
  label: string;
  color: string; // valeur CSS
  stroke: string;
  definition: string;
  examples: string[];
  antiExamples: string[];
}

export interface Lens {
  id: "structure" | "triggers";
  label: string;
  description: string;
  types: LensType[];
}

const TRIGGERS_FR: Record<string, [string, string]> = {
  urgency: ["Urgence", "Pousser à agir maintenant en s'appuyant sur une vraie contrainte de temps."],
  scarcity: ["Rareté", "Créer le désir en limitant réellement la quantité ou l'accès."],
  social_proof: ["Preuve sociale", "Montrer que d'autres, semblables au lecteur, l'ont déjà fait et s'en félicitent."],
  authority: ["Autorité", "S'appuyer sur une expertise, un titre ou une référence reconnue."],
  reciprocity: ["Réciprocité", "Donner d'abord de la valeur pour susciter l'envie de rendre."],
  commitment: ["Engagement", "Obtenir de petits accords qui rendent le grand accord cohérent."],
  liking: ["Sympathie", "Créer la proximité : ressemblance, compliment, valeurs partagées."],
  fear: ["Peur", "Montrer le coût de l'inaction ou de ce qu'on risque de perdre."],
  greed: ["Appât du gain", "Faire miroiter un gain supérieur, plus rapide ou plus facile."],
  mystery: ["Mystère", "Ne pas tout dire pour entretenir l'envie d'en savoir plus."],
  curiosity: ["Curiosité", "Ouvrir un écart d'information que le lecteur veut combler."],
  exclusivity: ["Exclusivité", "Réserver l'accès à un cercle choisi."],
  storytelling: ["Récit", "Faire passer le message par une histoire incarnée."],
  contrast: ["Contraste", "Opposer avant / après, problème / solution pour rendre l'écart évident."],
  call_to_action: ["Appel à l'action", "Indiquer clairement le geste à faire."],
};

type RawTrigger = { id: string; color: string; positive_examples: string[]; negative_examples: string[] };

export const LENSES: Record<Lens["id"], Lens> = {
  structure: {
    id: "structure",
    label: "Structure",
    description: "Les métastructures : Big Idea, hook, douleur, mécanisme, preuve, offre, appel à l'action, transitions.",
    types: NODE_TYPES.map(t => {
      const n = NODES[t];
      return { id: t, label: n.label, color: COLORS[n.color as keyof typeof COLORS], stroke: n.stroke,
               definition: n.definition, examples: [n.example], antiExamples: [n.antiExample] };
    }),
  },
  triggers: {
    id: "triggers",
    label: "Déclencheurs",
    description: "Les leviers psychologiques à l'œuvre phrase par phrase.",
    types: (triggersJson.triggers as RawTrigger[]).map(t => ({
      id: t.id, label: TRIGGERS_FR[t.id]?.[0] ?? t.id, color: t.color, stroke: "solid",
      definition: TRIGGERS_FR[t.id]?.[1] ?? "", examples: t.positive_examples, antiExamples: t.negative_examples,
    })),
  },
};

export const typeOf = (lens: Lens["id"], id: string) => LENSES[lens].types.find(t => t.id === id);
