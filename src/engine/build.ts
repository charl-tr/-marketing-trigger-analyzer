// Construction d'une analyse à partir de citations : pur, sans SDK, utilisable côté serveur comme côté navigateur.
import { LENSES, type Lens } from "@/domain/lenses";
import type { Analysis, ModelOutput, Span } from "@/domain/schema";
import { alignAll } from "./align";

/** Transforme la sortie du modèle en analyse fiable : types connus, positions recalées, liens valides. */
export function buildAnalysis(text: string, lensId: Lens["id"], out: ModelOutput, model: string): Analysis {
  const known = new Set(LENSES[lensId].types.map(t => t.id));
  const candidates = out.spans.filter(s => known.has(s.type) && s.quote.trim());
  const located = alignAll(text, candidates.map(s => s.quote));

  const spans: Span[] = [];
  candidates.forEach((s, i) => {
    const at = located[i];
    if (!at) return;
    spans.push({
      id: s.id, lens: lensId, type: s.type, start: at.start, end: at.end, quote: text.slice(at.start, at.end),
      confidence: Math.min(1, Math.max(0, s.confidence)), note: s.note, source: "ai",
    });
  });
  spans.sort((a, b) => a.start - b.start || b.end - a.end);

  const ids = new Set(spans.map(s => s.id));
  return {
    schema: "glypheur.analysis/1",
    lens: lensId,
    text,
    spans,
    relations: out.relations.filter(r => ids.has(r.from) && ids.has(r.to) && r.from !== r.to),
    patterns: out.patterns
      .map(p => ({ kind: p.kind, spanIds: p.span_ids.filter(id => ids.has(id)), status: p.status, note: p.note }))
      .filter(p => p.spanIds.length),
    summary: { bigIdea: out.summary.big_idea, verdict: out.summary.verdict },
    meta: { model, createdAt: new Date().toISOString(), unmatched: candidates.length - spans.length },
  };
}

/** Analyse vide : point de départ du surlignage manuel. */
export function emptyAnalysis(text: string, lensId: Lens["id"]): Analysis {
  return {
    schema: "glypheur.analysis/1", lens: lensId, text, spans: [], relations: [], patterns: [],
    summary: { bigIdea: "", verdict: "" },
    meta: { model: "manuel", createdAt: new Date().toISOString(), unmatched: 0 },
  };
}
