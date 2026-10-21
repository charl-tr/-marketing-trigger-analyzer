// Transforme des passages qui s'emboîtent ou se chevauchent en un arbre affichable :
// chaque nœud est entièrement contenu dans son parent. Un passage qui déborde de son parent
// est coupé en morceaux (même identifiant) — le texte reste intact, chaque morceau garde son style.
import type { Span } from "@/domain/schema";

export interface Node { span: Span | null; start: number; end: number; children: Node[] }

export function nest(text: string, spans: Span[]): Node {
  const root: Node = { span: null, start: 0, end: text.length, children: [] };
  const queue = [...spans].filter(s => s.end > s.start).sort((a, b) => a.start - b.start || b.end - a.end);
  const insert = (parent: Node, s: Span, start: number, end: number) => {
    // Descend dans le dernier enfant tant qu'il contient le morceau.
    let node = parent;
    for (;;) {
      const last = node.children[node.children.length - 1];
      if (last && last.start <= start && end <= last.end) node = last;
      else break;
    }
    const last = node.children[node.children.length - 1];
    if (last && start < last.end && end > last.end) {
      // Chevauchement partiel : la partie qui entre dans le frère précédent y va, le reste suit.
      insert(last, s, start, last.end);
      insert(node, s, last.end, end);
      return;
    }
    node.children.push({ span: s, start, end, children: [] });
  };
  for (const s of queue) insert(root, s, Math.max(0, s.start), Math.min(text.length, s.end));
  return root;
}

/** Segments à afficher : texte brut entre les enfants, et enfants récursifs. */
export type Piece = { kind: "text"; text: string; start: number } | { kind: "span"; node: Node };

export function pieces(text: string, node: Node): Piece[] {
  const out: Piece[] = [];
  let pos = node.start;
  for (const child of node.children) {
    if (child.start > pos) out.push({ kind: "text", text: text.slice(pos, child.start), start: pos });
    out.push({ kind: "span", node: child });
    pos = child.end;
  }
  if (pos < node.end) out.push({ kind: "text", text: text.slice(pos, node.end), start: pos });
  return out;
}
