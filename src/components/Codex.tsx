"use client";
// Le Codex : le panneau qui explique ce qu'on voit. Passage (le surlignage choisi), Légende (la grammaire),
// Mesures (l'invisible matérialisé). Sur mobile, c'est une feuille qui remonte du bas.
import { useMemo } from "react";
import type { Lens, LensType } from "@/domain/lenses";
import { CANONICAL_SEQUENCE, COLORS, NODES, type NodeType, PATTERNS, RELATIONS, SCALE_LABEL, type Scale } from "@/domain/ontology";
import type { Analysis, Span } from "@/domain/schema";
import { metrics } from "@/metrics";
import { Glyph } from "./Glyph";

export type CodexTab = "passage" | "legende" | "mesures";

interface Props {
  analysis: Analysis | null;
  lens: Lens;
  minConfidence: number;
  selected: Span | null;
  tab: CodexTab;
  open: boolean;
  focusType: string | null;
  onTab: (t: CodexTab) => void;
  onOpen: (open: boolean) => void;
  onSelect: (id: string | null) => void;
  onRetype: (id: string, type: string) => void;
  onDelete: (id: string) => void;
  onFocusType: (type: string | null) => void;
}

const pct = (x: number) => `${Math.round(x * 100)} %`;
const width = (x: number) => `${(Math.max(0, Math.min(1, x)) * 100).toFixed(1)}%`;
const cssVar = (c: string) => ({ "--c": c }) as React.CSSProperties;

export function Codex(p: Props) {
  const types = p.lens.types;
  const typeOf = (id: string) => types.find(t => t.id === id);
  const visible = useMemo(() => p.analysis?.spans.filter(s => s.confidence >= p.minConfidence) ?? [], [p.analysis, p.minConfidence]);
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const s of visible) c[s.type] = (c[s.type] ?? 0) + 1;
    return c;
  }, [visible]);

  const tabs: [CodexTab, string][] = [["passage", "Passage"], ["legende", "Légende"], ["mesures", "Mesures"]];
  return (
    <aside className={`codex${p.open ? " open" : ""}`} aria-label="Codex">
      <button className="sheet-handle" aria-label={p.open ? "Replier le Codex" : "Déplier le Codex"} onClick={() => p.onOpen(!p.open)} />
      <div className="codex-tabs" role="tablist">
        {tabs.map(([id, label]) => (
          <button key={id} role="tab" aria-selected={p.tab === id} onClick={() => { p.onTab(id); p.onOpen(true); }}>{label}</button>
        ))}
      </div>
      <div className="codex-body">
        {p.tab === "passage" && <Passage {...p} typeOf={typeOf} />}
        {p.tab === "legende" && (
          <>
            <p className="muted">{p.lens.description}</p>
            <Legend types={types} counts={counts} focusType={p.focusType} onFocusType={p.onFocusType} />
            <p className="hint">Sélectionnez un passage du texte pour l’annoter vous-même&nbsp;: une palette apparaît, touches 1 à {Math.min(9, types.length)}.</p>
          </>
        )}
        {p.tab === "mesures" && (p.analysis ? <Measures analysis={p.analysis} lens={p.lens} minConfidence={p.minConfidence} typeOf={typeOf} /> : <p className="empty">Rien à mesurer pour l’instant.</p>)}
      </div>
    </aside>
  );
}

function Passage({ analysis, lens, selected, onSelect, onRetype, onDelete, typeOf }: Props & { typeOf: (id: string) => LensType | undefined }) {
  if (!analysis) return <p className="empty">Collez un texte puis révélez sa structure, ou chargez l’exemple.</p>;
  if (!selected) {
    return (
      <div className="verdict">
        {analysis.summary.bigIdea && (<><h3 className="mono">Big Idea</h3><p className="quote" style={cssVar(COLORS.turquoise)}>{analysis.summary.bigIdea}</p></>)}
        {analysis.summary.verdict && (<><h3 className="mono">Diagnostic</h3><p>{analysis.summary.verdict}</p></>)}
        <p className="hint">Touchez un passage surligné pour lire ce qu’il fait dans le texte, et pourquoi.</p>
      </div>
    );
  }
  const t = typeOf(selected.type);
  const node = lens.id === "structure" ? NODES[selected.type as NodeType] : null;
  const spanById = new Map(analysis.spans.map(s => [s.id, s]));
  const out = analysis.relations.filter(r => r.from === selected.id);
  const inc = analysis.relations.filter(r => r.to === selected.id);
  const pats = analysis.patterns.filter(x => x.spanIds.includes(selected.id));
  const ref = (id: string) => {
    const s = spanById.get(id); const st = s && typeOf(s.type);
    return s && (
      <button onClick={() => onSelect(id)}>
        <span className="chip" style={cssVar(st?.color ?? "#999")}><Glyph type={s.type} size={12} />{st?.label}</span>
        <span className="muted">{short(s.quote)}</span>
      </button>
    );
  };
  return (
    <div style={cssVar(t?.color ?? "#999")}>
      <span className="mono muted">{node ? SCALE_LABEL[node.scale] : lens.label}</span>
      <h2><span style={{ color: t?.color }}><Glyph type={selected.type} size={22} /></span>{t?.label ?? selected.type}</h2>
      <blockquote className="quote">{selected.quote}</blockquote>
      {selected.note && <p>{selected.note}</p>}
      <dl className="kv">
        <dt>Confiance</dt><dd>{selected.source === "manual" ? "annotation manuelle" : pct(selected.confidence)}</dd>
      </dl>
      {node ? (
        <div className="rune">
          <p><b>Définition.</b> {node.definition}</p>
          <p><b>Principe.</b> {node.principle}</p>
          <p style={{ margin: 0 }}><b>Contrôle.</b> {node.check}</p>
        </div>
      ) : t?.definition && <div className="rune"><p style={{ margin: 0 }}>{t.definition}</p></div>}
      {(out.length > 0 || inc.length > 0) && (
        <>
          <h3 className="mono">Relations</h3>
          <ul className="links">
            {out.map((r, i) => <li key={`o${i}`}><span className="mono muted">{RELATIONS[r.kind].label} →</span>{ref(r.to)}</li>)}
            {inc.map((r, i) => <li key={`i${i}`}><span className="mono muted">← {RELATIONS[r.kind].label}</span>{ref(r.from)}</li>)}
          </ul>
        </>
      )}
      {pats.length > 0 && (
        <>
          <h3 className="mono">Motifs</h3>
          {pats.map((x, i) => (
            <p key={i}><b>{PATTERNS[x.kind].label}</b>{x.status !== "na" && <span className="muted"> · {x.status === "open" ? "jamais refermée" : "refermée"}</span>}<br />
              <span className="muted">{x.note}</span></p>
          ))}
        </>
      )}
      <div className="row-actions">
        <label className="sr" htmlFor="retype">Changer le type</label>
        <select id="retype" className="type-select" value={selected.type} onChange={e => onRetype(selected.id, e.target.value)}>
          {lens.types.map(x => <option key={x.id} value={x.id}>{x.label}</option>)}
        </select>
        <button className="btn ghost" onClick={() => onDelete(selected.id)}>Retirer</button>
      </div>
    </div>
  );
}

export function Legend({ types, counts, focusType, onFocusType }: {
  types: LensType[]; counts: Record<string, number>; focusType: string | null; onFocusType: (t: string | null) => void;
}) {
  return (
    <ul className="legend">
      {types.map(t => (
        <li key={t.id}>
          <button aria-pressed={focusType === t.id} onClick={() => onFocusType(focusType === t.id ? null : t.id)}>
            <span className={`g swatch s-${t.stroke}`} style={cssVar(t.color)} />
            <span className="name"><span style={{ color: t.color }}><Glyph type={t.id} size={16} /></span>{t.label}</span>
            <span className="mono muted">{counts[t.id] ?? 0}</span>
            <span className="def">{t.definition}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function Measures({ analysis, lens, minConfidence, typeOf }: {
  analysis: Analysis; lens: Lens; minConfidence: number; typeOf: (id: string) => LensType | undefined;
}) {
  const m = useMemo(() => metrics(analysis, minConfidence), [analysis, minConfidence]);
  const byType = Object.entries(m.coverage.byType).sort((a, b) => b[1] - a[1]);
  const maxShare = byType[0]?.[1] || 1;
  const structure = lens.id === "structure";
  const scales: [Scale, string][] = [["macro", COLORS.turquoise], ["micro", COLORS.forest], ["liant", COLORS.gold]];
  return (
    <div>
      <h3 className="mono">Couverture</h3>
      <p><span className="score">{pct(m.coverage.total)}</span> <span className="muted">du texte annoté</span></p>
      {byType.map(([type, v]) => {
        const t = typeOf(type);
        return (
          <div className="meter" key={type} style={cssVar(t?.color ?? "#999")}>
            <span>{t?.label ?? type}</span><span className="track"><i style={{ width: width(v / maxShare) }} /></span><span className="val">{pct(v)}</span>
          </div>
        );
      })}

      {structure && (
        <>
          <h3 className="mono">Équilibre</h3>
          <div className="bar" aria-hidden>{scales.map(([s, c]) => <span key={s} style={{ width: width(m.balance.shares[s]), background: c }} />)}</div>
          <p className="muted" style={{ fontSize: 14 }}>{scales.map(([s]) => `${SCALE_LABEL[s]} ${pct(m.balance.shares[s])}`).join(" · ")}</p>

          <h3 className="mono">Séquence</h3>
          <p><span className="score">{pct(m.sequence.score)}</span> <span className="muted">conforme à l’ordre canonique</span></p>
          <div className="seq">
            {m.sequence.observed.map((t, i) => (
              <span key={t} style={{ display: "contents" }}>
                {i > 0 && <span className="arrow">→</span>}
                <span className="chip" style={cssVar(typeOf(t)?.color ?? "#999")}><Glyph type={t} size={12} />{NODES[t].label}</span>
              </span>
            ))}
            {m.sequence.missing.map(t => <span key={t} className="chip missing">{NODES[t].label}</span>)}
          </div>
          {m.sequence.inversions.length > 0 && (
            <p className="muted" style={{ fontSize: 14, marginTop: 10 }}>
              Inversions&nbsp;: {m.sequence.inversions.map(([a, b]) => `${NODES[a].label} arrive après ${NODES[b].label}`).join(" ; ")}.
            </p>
          )}
          <p className="muted" style={{ fontSize: 13.5 }}>Ordre de référence&nbsp;: {CANONICAL_SEQUENCE.map(t => NODES[t].label).join(" → ")}.</p>

          <h3 className="mono">Signaux</h3>
          {m.balance.flags.length
            ? <ul className="flags">{m.balance.flags.map(f => <li key={f.id}>{f.label}</li>)}</ul>
            : <ul className="flags ok"><li>Aucun déséquilibre majeur détecté.</li></ul>}
        </>
      )}

      {(m.loops.open + m.loops.closed > 0) && (
        <>
          <h3 className="mono">Boucles</h3>
          <p>{m.loops.closed} refermée{m.loops.closed > 1 ? "s" : ""} · {m.loops.open} laissée{m.loops.open > 1 ? "s" : ""} ouverte{m.loops.open > 1 ? "s" : ""}</p>
        </>
      )}

      <p className="hint">
        {analysis.meta.model === "manuel" ? "Annotation manuelle." : `Analyse ${analysis.meta.model}, ${new Date(analysis.meta.createdAt).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}.`}
        {analysis.meta.unmatched > 0 && ` ${analysis.meta.unmatched} citation(s) du modèle introuvable(s) dans le texte, écartée(s).`}
      </p>
    </div>
  );
}

const short = (s: string, n = 64) => (s.length > n ? `${s.slice(0, n).trimEnd()}…` : s);
