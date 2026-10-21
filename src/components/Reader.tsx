"use client";
// Le texte, surligné. Les passages emboîtés sont rendus en arbre (lib/nest) ; chaque morceau de texte brut
// porte son décalage (data-o) pour qu'une sélection à la souris ou au doigt redevienne des positions exactes.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LensType } from "@/domain/lenses";
import type { Span } from "@/domain/schema";
import { type Node, nest, pieces } from "@/lib/nest";
import { Glyph } from "./Glyph";

interface Props {
  text: string;
  spans: Span[];
  types: LensType[];
  selectedId: string | null;
  relatedIds: Set<string>;
  focusType: string | null;
  reveal: boolean;
  onSelect: (id: string | null) => void;
  onCreate: (start: number, end: number, type: string) => void;
}

export function Reader({ text, spans, types, selectedId, relatedIds, focusType, reveal, onSelect, onCreate }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const tree = useMemo(() => nest(text, spans), [text, spans]);
  const byId = useMemo(() => new Map(types.map(t => [t.id, t])), [types]);
  const order = useMemo(() => new Map(spans.map((s, i) => [s.id, i])), [spans]);
  const [pick, setPick] = useState<{ start: number; end: number; x: number; y: number } | null>(null);

  // Sélection → positions dans le texte. Debounce léger : sur mobile, la sélection se règle par poignées.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onChange = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const sel = document.getSelection();
        const root = ref.current;
        if (!sel || sel.isCollapsed || !sel.rangeCount || !root) return setPick(null);
        const range = sel.getRangeAt(0);
        if (!root.contains(range.commonAncestorContainer)) return setPick(null);
        let start = offsetOf(range.startContainer, range.startOffset, root);
        let end = offsetOf(range.endContainer, range.endOffset, root);
        if (start == null || end == null) return setPick(null);
        while (start < end && /\s/.test(text[start])) start++;
        while (end > start && /\s/.test(text[end - 1])) end--;
        if (end - start < 2) return setPick(null);
        const r = range.getBoundingClientRect();
        setPick({ start, end, x: Math.min(Math.max(r.left + r.width / 2, 150), window.innerWidth - 150), y: Math.max(r.top, 120) });
      }, 120);
    };
    document.addEventListener("selectionchange", onChange);
    return () => { clearTimeout(timer); document.removeEventListener("selectionchange", onChange); };
  }, [text]);

  const choose = useCallback((type: string) => {
    if (!pick) return;
    onCreate(pick.start, pick.end, type);
    document.getSelection()?.removeAllRanges();
    setPick(null);
  }, [pick, onCreate]);

  useEffect(() => {
    if (!pick) return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= Math.min(9, types.length)) { e.preventDefault(); choose(types[n - 1].id); }
      if (e.key === "Escape") { document.getSelection()?.removeAllRanges(); setPick(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pick, types, choose]);

  const onClick = (e: React.MouseEvent) => {
    if (!document.getSelection()?.isCollapsed) return;
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-id]");
    if (el) return onSelect(el.dataset.id ?? null);
    // Clic dans l'interligne : on retrouve la position du texte la plus proche, puis le passage le plus intérieur.
    const caret = document.caretRangeFromPoint?.(e.clientX, e.clientY);
    const at = caret && ref.current ? offsetOf(caret.startContainer, caret.startOffset, ref.current) : null;
    const hit = at == null ? undefined : spans
      .filter(s => s.start <= at && at < s.end)
      .sort((a, b) => (a.end - a.start) - (b.end - b.start))[0];
    onSelect(hit?.id ?? null);
  };

  const render = (node: Node): React.ReactNode =>
    pieces(text, node).map((p) => {
      if (p.kind === "text") return <span key={`t${p.start}`} data-o={p.start}>{p.text}</span>;
      const s = p.node.span!;
      const t = byId.get(s.type);
      const cls = [
        "g", `s-${t?.stroke ?? "solid"}`,
        s.source === "manual" && "manual",
        s.id === selectedId && "is-selected",
        relatedIds.has(s.id) && "is-related",
        focusType === s.type && "on-focus",
      ].filter(Boolean).join(" ");
      return (
        <mark key={`${s.id}:${p.node.start}`} className={cls} data-id={s.id} title={t?.label}
          style={{ "--c": t?.color ?? "#999", "--i": order.get(s.id) ?? 0 } as React.CSSProperties}>
          {render(p.node)}
        </mark>
      );
    });

  return (
    <>
      <div ref={ref} className={`reader${focusType ? " focusing" : ""}${reveal ? " reveal" : ""}`} onClick={onClick}>
        {render(tree)}
      </div>
      {pick && (
        <div className="palette" role="toolbar" aria-label="Annoter la sélection" style={{ left: pick.x, top: pick.y }}
          onMouseDown={e => e.preventDefault()}>
          {types.map((t, i) => (
            <button key={t.id} onClick={() => choose(t.id)} style={{ "--c": t.color } as React.CSSProperties} title={t.definition}>
              {types.length <= 9 ? <Glyph type={t.id} size={16} /> : <span className="dot" />}
              <span>{t.label}</span>
              {i < 9 && <kbd>{i + 1}</kbd>}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

/** Position dans le texte d'un point du DOM (nœud + décalage), via les data-o des morceaux de texte. */
function offsetOf(node: globalThis.Node, offset: number, root: HTMLElement): number | null {
  if (node.nodeType === 3) {
    const host = node.parentElement?.closest<HTMLElement>("[data-o]");
    return host && root.contains(host) ? Number(host.dataset.o) + offset : null;
  }
  // Point entre deux enfants d'un élément : on prend le début du suivant, ou la fin du précédent.
  const el = node as Element;
  const next = el.childNodes[offset];
  if (next) { const t = firstText(next); if (t) return offsetOf(t, 0, root); }
  const prev = el.childNodes[offset - 1];
  if (prev) { const t = lastText(prev); if (t) return offsetOf(t, t.textContent?.length ?? 0, root); }
  return null;
}
function firstText(n: globalThis.Node): globalThis.Node | null {
  if (n.nodeType === 3) return n;
  for (const c of Array.from(n.childNodes)) { const t = firstText(c); if (t) return t; }
  return null;
}
function lastText(n: globalThis.Node): globalThis.Node | null {
  if (n.nodeType === 3) return n;
  for (const c of Array.from(n.childNodes).reverse()) { const t = lastText(c); if (t) return t; }
  return null;
}
