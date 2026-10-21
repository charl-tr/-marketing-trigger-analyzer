"use client";
// Deux vues d'ensemble : la frise (où sont les blocs dans le texte) et la tablette (le squelette, bloc par bloc).
import type { LensType } from "@/domain/lenses";
import type { Span } from "@/domain/schema";
import { Glyph } from "./Glyph";

const cssVar = (c: string) => ({ "--c": c }) as React.CSSProperties;

export function Frieze({ length, spans, types, selectedId, onSelect }: {
  length: number; spans: Span[]; types: LensType[]; selectedId: string | null; onSelect: (id: string) => void;
}) {
  const color = new Map(types.map(t => [t.id, t.color]));
  // Un passage contenu dans un autre passe sur la voie intérieure, plus étroite.
  const inner = new Set(spans.filter(s => spans.some(o => o !== s && o.start <= s.start && s.end <= o.end)).map(s => s.id));
  return (
    <nav className="frieze" aria-label="Frise du texte">
      <div className="frieze-track">
        {spans.map(s => (
          <button key={s.id} className={`${inner.has(s.id) ? "lane-1" : ""}${s.id === selectedId ? " on" : ""}`}
            style={{ ...cssVar(color.get(s.type) ?? "#999"), top: `${(s.start / length) * 100}%`, height: `${((s.end - s.start) / length) * 100}%` }}
            title={types.find(t => t.id === s.type)?.label} aria-label={types.find(t => t.id === s.type)?.label}
            onClick={() => onSelect(s.id)} />
        ))}
      </div>
    </nav>
  );
}

export function Tablet({ spans, types, onSelect }: { spans: Span[]; types: LensType[]; onSelect: (id: string) => void }) {
  if (!spans.length) return <p className="empty">Aucun bloc visible à ce seuil de confiance.</p>;
  const byId = new Map(types.map(t => [t.id, t]));
  return (
    <ol className="tablet">
      {spans.map(s => {
        const t = byId.get(s.type);
        const nested = spans.some(o => o !== s && o.start <= s.start && s.end <= o.end);
        return (
          <li key={s.id} className={nested ? "nested" : ""} style={cssVar(t?.color ?? "#999")}>
            <span className="gl"><Glyph type={s.type} size={20} /></span>
            <div>
              <div className="lbl"><b>{t?.label ?? s.type}</b><span className="mono muted">{s.source === "manual" ? "manuel" : `${Math.round(s.confidence * 100)} %`}</span></div>
              <div className="q" onClick={() => onSelect(s.id)}>{s.quote}</div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
