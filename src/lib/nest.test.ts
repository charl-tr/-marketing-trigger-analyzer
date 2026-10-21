import { describe, expect, it } from "vitest";
import type { Span } from "@/domain/schema";
import { nest, pieces, type Node } from "./nest";

const sp = (id: string, start: number, end: number): Span =>
  ({ id, lens: "structure", type: "hook", start, end, quote: "", confidence: 1, note: "", source: "ai" });

// Reconstitue le texte à partir de l'arbre : il doit être identique à l'original.
const flatten = (text: string, n: Node): string =>
  pieces(text, n).map(p => (p.kind === "text" ? p.text : flatten(text, p.node))).join("");

const text = "abcdefghijklmnopqrstuvwxyz";

describe("nest", () => {
  it("emboîte un passage dans un autre", () => {
    const root = nest(text, [sp("out", 0, 20), sp("in", 5, 10)]);
    expect(root.children).toHaveLength(1);
    expect(root.children[0].children[0].span!.id).toBe("in");
    expect(flatten(text, root)).toBe(text);
  });

  it("coupe un chevauchement partiel sans perdre de texte", () => {
    const root = nest(text, [sp("a", 0, 10), sp("b", 5, 15)]);
    const ids = JSON.stringify(root, (k, v) => (k === "span" ? v?.id : v));
    expect(ids).toContain('"b"');
    expect(root.children.map(c => [c.span!.id, c.start, c.end])).toEqual([["a", 0, 10], ["b", 10, 15]]);
    expect(root.children[0].children.map(c => [c.span!.id, c.start, c.end])).toEqual([["b", 5, 10]]);
    expect(flatten(text, root)).toBe(text);
  });

  it("garde le texte intact avec des passages en désordre", () => {
    const root = nest(text, [sp("c", 18, 24), sp("a", 2, 8), sp("b", 6, 20), sp("d", 0, 26)]);
    expect(flatten(text, root)).toBe(text);
  });
});
