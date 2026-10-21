// Métriques « pour matérialiser l'invisible ». Fonctions pures : mêmes résultats dans l'interface, l'export et l'API.
import { CANONICAL_SEQUENCE, NODES, type NodeType, type Scale } from "@/domain/ontology";
import type { Analysis, Span } from "@/domain/schema";

/** Longueur couverte par une liste d'intervalles (chevauchements comptés une fois). */
export function unionLength(spans: Pick<Span, "start" | "end">[]): number {
  const sorted = [...spans].sort((a, b) => a.start - b.start);
  let total = 0, curS = -1, curE = -1;
  for (const s of sorted) {
    if (s.start > curE) { if (curE > curS) total += curE - curS; curS = s.start; curE = s.end; }
    else curE = Math.max(curE, s.end);
  }
  if (curE > curS) total += curE - curS;
  return total;
}

export const visible = (a: Analysis, minConfidence: number) => a.spans.filter(s => s.confidence >= minConfidence);

/** Part du texte couverte, au total et par type (0 à 1). */
export function coverage(a: Analysis, minConfidence = 0) {
  const spans = visible(a, minConfidence);
  const len = a.text.length || 1;
  const byType: Record<string, number> = {};
  for (const type of new Set(spans.map(s => s.type))) byType[type] = unionLength(spans.filter(s => s.type === type)) / len;
  return { total: unionLength(spans) / len, byType };
}

export interface Balance { shares: Record<Scale, number>; flags: { id: string; label: string }[] }

/** Équilibre macro / micro / liants (structure seulement) et signaux d'alerte du document. */
export function balance(a: Analysis, minConfidence = 0): Balance {
  const spans = visible(a, minConfidence).filter(s => s.lens === "structure");
  const shares: Record<Scale, number> = { macro: 0, micro: 0, liant: 0 };
  const per = (t: NodeType) => unionLength(spans.filter(s => s.type === t));
  const annotated = unionLength(spans) || 1;
  for (const s of new Set(spans.map(s => s.type as NodeType))) shares[NODES[s].scale] += per(s) / annotated;

  const has = (t: NodeType) => spans.some(s => s.type === t);
  const flags: Balance["flags"] = [];
  if (per("pain") / annotated > 0.35) flags.push({ id: "pain_overdose", label: "Surdose de douleur : plus d'un tiers du texte annoté appuie sur le problème." });
  if (!has("proof")) flags.push({ id: "proof_missing", label: "Aucune preuve : les promesses ne sont pas étayées." });
  else if (spans.filter(s => s.type === "proof").length < spans.filter(s => s.type === "mechanism" || s.type === "offer").length / 2)
    flags.push({ id: "proof_thin", label: "Preuves rares au regard des promesses faites." });
  if (!has("mechanism")) flags.push({ id: "mechanism_missing", label: "Mécanisme absent : on ne comprend pas pourquoi ça marche." });
  if (!has("cta")) flags.push({ id: "cta_missing", label: "Pas d'appel à l'action explicite." });
  if (!has("big_idea")) flags.push({ id: "big_idea_missing", label: "Pas de Big Idea identifiable." });
  return { shares, flags };
}

export interface Sequence { observed: NodeType[]; missing: NodeType[]; inversions: [NodeType, NodeType][]; score: number }

/**
 * Ordre d'apparition des blocs (première occurrence) comparé à l'ordre canonique
 * Hook → Big Idea → Douleur → Mécanisme → Preuve → Offre → Appel à l'action.
 * score = part des blocs présents qui respectent l'ordre (plus longue sous-suite commune).
 */
export function sequence(a: Analysis, minConfidence = 0): Sequence {
  const spans = visible(a, minConfidence).filter(s => s.lens === "structure");
  const first = new Map<NodeType, number>();
  for (const s of spans) {
    const t = s.type as NodeType;
    if (CANONICAL_SEQUENCE.includes(t) && (!first.has(t) || s.start < first.get(t)!)) first.set(t, s.start);
  }
  const observed = [...first.entries()].sort((x, y) => x[1] - y[1]).map(([t]) => t);
  const missing = CANONICAL_SEQUENCE.filter(t => !first.has(t));
  const rank = (t: NodeType) => CANONICAL_SEQUENCE.indexOf(t);
  const inversions: [NodeType, NodeType][] = [];
  for (let i = 0; i < observed.length; i++)
    for (let j = i + 1; j < observed.length; j++)
      if (rank(observed[i]) > rank(observed[j])) inversions.push([observed[j], observed[i]]);
  // Plus longue sous-suite croissante (selon l'ordre canonique).
  const ranks = observed.map(rank), lis: number[] = [];
  for (const r of ranks) { const k = lis.findIndex(x => x >= r); if (k < 0) lis.push(r); else lis[k] = r; }
  return { observed, missing, inversions, score: observed.length ? lis.length / observed.length : 0 };
}

/** Boucles ouvertes / refermées (cohérence). */
export function loops(a: Analysis) {
  const ol = a.patterns.filter(p => p.kind === "open_loop");
  return { open: ol.filter(p => p.status === "open").length, closed: ol.filter(p => p.status === "closed").length };
}

/** Tout en un, pour l'export et l'API. */
export function metrics(a: Analysis, minConfidence = 0) {
  return { coverage: coverage(a, minConfidence), balance: balance(a, minConfidence), sequence: sequence(a, minConfidence), loops: loops(a) };
}
