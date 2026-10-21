import { describe, expect, it } from "vitest";
import { buildAnalysis } from "@/engine/build";
import { metrics } from "@/metrics";
import { EXAMPLE_ANNOTATION, EXAMPLE_TEXT } from "./lettre";

describe("exemple de référence", () => {
  const a = buildAnalysis(EXAMPLE_TEXT, "structure", EXAMPLE_ANNOTATION, "annotation manuelle");

  it("recale toutes les citations sur le texte", () => {
    expect(a.meta.unmatched).toBe(0);
    for (const s of a.spans) expect(EXAMPLE_TEXT.slice(s.start, s.end)).toBe(s.quote);
  });

  it("produit une séquence quasi canonique et aucune alerte bloquante", () => {
    const m = metrics(a);
    expect(m.sequence.score).toBeGreaterThan(0.8);
    expect(m.balance.flags.map(f => f.id)).not.toContain("proof_missing");
    expect(m.loops).toEqual({ open: 0, closed: 1 });
  });
});
