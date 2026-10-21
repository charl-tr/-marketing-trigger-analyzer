// Schémas d'échange (zod) : ce que produit le moteur, ce que lit l'interface, ce qu'exporte l'API.
import { z } from "zod";
import { PATTERN_KINDS, RELATION_KINDS } from "./ontology";

/** Ce que le modèle renvoie : des citations exactes, jamais de positions (il les compterait mal). */
export const ModelOutput = z.object({
  summary: z.object({
    big_idea: z.string().describe("La Big Idea du texte en une phrase, ou chaîne vide s'il n'y en a pas."),
    verdict: z.string().describe("Diagnostic en deux phrases : la principale force et le principal manque structurel."),
  }),
  spans: z.array(z.object({
    id: z.string().describe("Identifiant court : s1, s2…"),
    type: z.string().describe("Un identifiant de type de la lentille demandée."),
    quote: z.string().describe("Extrait copié caractère pour caractère depuis le texte, en phrases ou propositions entières."),
    confidence: z.number().describe("Entre 0 et 1."),
    note: z.string().describe("Pourquoi ce passage relève de ce type, en une phrase."),
  })),
  relations: z.array(z.object({
    from: z.string(),
    to: z.string(),
    kind: z.enum(RELATION_KINDS),
  })),
  patterns: z.array(z.object({
    kind: z.enum(PATTERN_KINDS),
    span_ids: z.array(z.string()),
    status: z.enum(["open", "closed", "na"]).describe("Pour une boucle : ouverte (jamais refermée) ou fermée ; sinon na."),
    note: z.string(),
  })),
});
export type ModelOutput = z.infer<typeof ModelOutput>;

/** Un passage annoté, positionné dans le texte. */
export const Span = z.object({
  id: z.string(),
  lens: z.enum(["structure", "triggers"]),
  type: z.string(),
  start: z.number().int().nonnegative(),
  end: z.number().int().positive(),
  quote: z.string(),
  confidence: z.number().min(0).max(1),
  note: z.string(),
  source: z.enum(["ai", "manual"]),
});
export type Span = z.infer<typeof Span>;

export const Relation = z.object({ from: z.string(), to: z.string(), kind: z.enum(RELATION_KINDS) });
export type Relation = z.infer<typeof Relation>;

export const PatternHit = z.object({
  kind: z.enum(PATTERN_KINDS),
  spanIds: z.array(z.string()),
  status: z.enum(["open", "closed", "na"]),
  note: z.string(),
});
export type PatternHit = z.infer<typeof PatternHit>;

export const Analysis = z.object({
  schema: z.literal("glypheur.analysis/1"),
  lens: z.enum(["structure", "triggers"]),
  text: z.string(),
  spans: z.array(Span),
  relations: z.array(Relation),
  patterns: z.array(PatternHit),
  summary: z.object({ bigIdea: z.string(), verdict: z.string() }),
  meta: z.object({ model: z.string(), createdAt: z.string(), unmatched: z.number().int() }),
});
export type Analysis = z.infer<typeof Analysis>;

/** Un document de l'utilisateur : son texte et ses analyses par lentille. */
export const Doc = z.object({
  id: z.string(),
  title: z.string(),
  text: z.string(),
  analyses: z.record(z.string(), Analysis),
  updatedAt: z.string(),
});
export type Doc = z.infer<typeof Doc>;
