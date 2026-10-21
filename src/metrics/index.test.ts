import { describe, expect, it } from "vitest";
import type { Analysis, Span } from "@/domain/schema";
import { balance, coverage, loops, sequence, unionLength } from "./index";

const span = (type: string, start: number, end: number, confidence = 0.9): Span =>
  ({ id: `${type}-${start}`, lens: "structure", type, start, end, quote: "", confidence, note: "", source: "ai" });

const analysis = (spans: Span[], len = 100, patterns: Analysis["patterns"] = []): Analysis => ({
  schema: "glypheur.analysis/1", lens: "structure", text: "x".repeat(len), spans, relations: [], patterns,
  summary: { bigIdea: "", verdict: "" }, meta: { model: "test", createdAt: "", unmatched: 0 },
});

describe("unionLength", () => {
  it("compte une seule fois les chevauchements", () => {
    expect(unionLength([{ start: 0, end: 10 }, { start: 5, end: 15 }, { start: 20, end: 25 }])).toBe(20);
  });
});

describe("coverage", () => {
  it("respecte le seuil de confiance", () => {
    const a = analysis([span("hook", 0, 10, 0.9), span("pain", 10, 30, 0.4)]);
    expect(coverage(a, 0).total).toBeCloseTo(0.3);
    expect(coverage(a, 0.5).total).toBeCloseTo(0.1);
  });
});

describe("balance", () => {
  it("signale l'absence de preuve et la surdose de douleur", () => {
    const ids = balance(analysis([span("hook", 0, 5), span("pain", 5, 60)])).flags.map(f => f.id);
    expect(ids).toContain("proof_missing");
    expect(ids).toContain("pain_overdose");
  });
});

describe("sequence", () => {
  it("détecte une offre placée avant la preuve", () => {
    const s = sequence(analysis([span("hook", 0, 5), span("offer", 10, 20), span("proof", 30, 40), span("cta", 50, 60)]));
    expect(s.observed).toEqual(["hook", "offer", "proof", "cta"]);
    expect(s.inversions).toEqual([["proof", "offer"]]);
    expect(s.score).toBeCloseTo(3 / 4);
  });

  it("donne 1 à une séquence canonique", () => {
    expect(sequence(analysis([span("hook", 0, 5), span("pain", 10, 20), span("cta", 30, 40)])).score).toBe(1);
  });
});

describe("loops", () => {
  it("compte boucles ouvertes et refermées", () => {
    const a = analysis([], 10, [
      { kind: "open_loop", spanIds: ["a"], status: "open", note: "" },
      { kind: "open_loop", spanIds: ["b"], status: "closed", note: "" },
      { kind: "cliffhanger", spanIds: ["c"], status: "na", note: "" },
    ]);
    expect(loops(a)).toEqual({ open: 1, closed: 1 });
  });
});
