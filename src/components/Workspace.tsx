"use client";
// L'atelier : un document, deux lentilles, trois vues (écrire, lire, tablette). Tout l'état vit ici ;
// les composants enfants sont des vues pures de l'analyse.
import { useCallback, useEffect, useMemo, useState } from "react";
import { LENSES, type Lens } from "@/domain/lenses";
import type { Analysis, Doc, Span } from "@/domain/schema";
import { buildAnalysis, emptyAnalysis } from "@/engine/build";
import { EXAMPLE_ANNOTATION, EXAMPLE_TEXT, EXAMPLE_TITLE } from "@/examples/lettre";
import { exportJson, exportPdf } from "@/lib/export";
import { loadDoc, newDoc, saveDoc } from "@/lib/storage";
import { Codex, type CodexTab, Legend } from "./Codex";
import { Seal } from "./Glyph";
import { Frieze, Tablet } from "./Overview";
import { Reader } from "./Reader";

type View = "compose" | "read" | "tablet";
const MAX_CHARS = 60_000;

export function Workspace() {
  const [doc, setDoc] = useState<Doc | null>(null);
  const [draft, setDraft] = useState("");
  const [lensId, setLensId] = useState<Lens["id"]>("structure");
  const [view, setView] = useState<View>("compose");
  const [minConfidence, setMinConfidence] = useState(0.5);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusType, setFocusType] = useState<string | null>(null);
  const [tab, setTab] = useState<CodexTab>("passage");
  const [codexOpen, setCodexOpen] = useState(false);
  const [busy, setBusy] = useState<number | null>(null); // horodatage du début d'analyse
  const [error, setError] = useState<string | null>(null);
  const [reveal, setReveal] = useState(false);
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Hydratation : le document local, sinon une page blanche.
  useEffect(() => {
    const saved = loadDoc();
    const d = saved ?? newDoc();
    setDoc(d);
    setDraft(d.text);
    if (d.text && Object.keys(d.analyses).length) setView("read");
  }, []);
  useEffect(() => { if (doc) saveDoc(doc); }, [doc]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2200); return () => clearTimeout(t); }, [toast]);

  const lens = LENSES[lensId];
  const analysis: Analysis | null = doc?.analyses[lensId] ?? null;
  const spans = useMemo(() => analysis?.spans.filter(s => s.confidence >= minConfidence) ?? [], [analysis, minConfidence]);
  const selected = useMemo(() => spans.find(s => s.id === selectedId) ?? null, [spans, selectedId]);
  const relatedIds = useMemo(() => {
    const ids = new Set<string>();
    if (!analysis || !selectedId) return ids;
    for (const r of analysis.relations) { if (r.from === selectedId) ids.add(r.to); if (r.to === selectedId) ids.add(r.from); }
    return ids;
  }, [analysis, selectedId]);

  const patch = useCallback((f: (d: Doc) => Doc) => setDoc(d => (d ? { ...f(d), updatedAt: new Date().toISOString() } : d)), []);
  const setAnalysis = useCallback((a: Analysis) => patch(d => ({ ...d, analyses: { ...d.analyses, [a.lens]: a } })), [patch]);

  const showReveal = () => { setReveal(true); setTimeout(() => setReveal(false), 1800); };

  /** Valide le brouillon comme texte du document ; les annotations d'un autre texte sont effacées. */
  const commitDraft = (): string | null => {
    if (!doc) return null;
    const text = draft.trim() ? draft : "";
    if (text === doc.text) return text;
    if (Object.keys(doc.analyses).length && !confirm("Le texte a changé : les annotations actuelles seront effacées.")) return null;
    patch(d => ({ ...d, text, analyses: {} }));
    return text;
  };

  const analyze = async () => {
    const text = commitDraft();
    if (text == null || !text.trim()) return;
    setError(null);
    setBusy(Date.now());
    setSelectedId(null);
    try {
      const res = await fetch("/api/analyze", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text, lens: lensId }) });
      const body = await res.json().catch(() => ({ error: `Erreur ${res.status}.` }));
      if (!res.ok) throw new Error(body.error ?? `Erreur ${res.status}.`);
      setAnalysis(body as Analysis);
      setView("read");
      setTab("passage");
      showReveal();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  };

  const read = () => { const text = commitDraft(); if (text != null && text.trim()) { setView("read"); setError(null); } };

  const loadExample = () => {
    if (doc?.text && !confirm("Remplacer le texte en cours par l'exemple ?")) return;
    const d = newDoc(EXAMPLE_TITLE, EXAMPLE_TEXT);
    d.analyses.structure = buildAnalysis(EXAMPLE_TEXT, "structure", EXAMPLE_ANNOTATION, "exemple annoté");
    setDoc(d); setDraft(d.text); setLensId("structure"); setSelectedId(null); setFocusType(null);
    setView("read"); setTab("passage"); setError(null); showReveal();
  };

  const fresh = () => {
    if (doc?.text && !confirm("Commencer un nouveau texte ? Le texte en cours sera remplacé.")) return;
    const d = newDoc(); setDoc(d); setDraft(""); setSelectedId(null); setView("compose"); setError(null);
  };

  const select = useCallback((id: string | null) => {
    setSelectedId(id);
    if (id) { setTab("passage"); setCodexOpen(true); }
  }, []);
  const show = useCallback((id: string) => {
    select(id); setView("read");
    requestAnimationFrame(() => document.querySelector(`[data-id="${CSS.escape(id)}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" }));
  }, [select]);

  const create = useCallback((start: number, end: number, type: string) => {
    if (!doc) return;
    const base = doc.analyses[lensId] ?? emptyAnalysis(doc.text, lensId);
    const s: Span = { id: `m${Date.now().toString(36)}`, lens: lensId, type, start, end, quote: doc.text.slice(start, end), confidence: 1, note: "", source: "manual" };
    setAnalysis({ ...base, spans: [...base.spans, s].sort((a, b) => a.start - b.start || b.end - a.end) });
    select(s.id);
  }, [doc, lensId, setAnalysis, select]);

  const retype = (id: string, type: string) => analysis && setAnalysis({ ...analysis, spans: analysis.spans.map(s => (s.id === id ? { ...s, type } : s)) });
  const remove = (id: string) => {
    if (!analysis) return;
    setAnalysis({
      ...analysis,
      spans: analysis.spans.filter(s => s.id !== id),
      relations: analysis.relations.filter(r => r.from !== id && r.to !== id),
      patterns: analysis.patterns.map(p => ({ ...p, spanIds: p.spanIds.filter(x => x !== id) })).filter(p => p.spanIds.length),
    });
    setSelectedId(null);
    setToast("Passage retiré");
  };

  // Clavier : Échap désélectionne (⌘↵ révèle, géré par le composer).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSelectedId(null); setMenu(false); setFocusType(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!doc) return <div className="top" />;

  const hasText = doc.text.trim().length > 0;
  const menuItems: [string, string, () => void, boolean?][] = [
    ["Nouveau texte", "Page blanche", fresh],
    ["Modifier le texte", "Retour à l'écriture", () => { setDraft(doc.text); setView("compose"); }, !hasText || view === "compose"],
    ["Charger l'exemple", "Une lettre de vente annotée", loadExample],
    ["Exporter en JSON", "Analyse et mesures, schéma glypheur.analysis/1", () => analysis && exportJson(doc.title, analysis, minConfidence), !analysis],
    ["Imprimer ou PDF annoté", "Texte surligné et légende", () => { setView("read"); setTimeout(exportPdf, 50); }, !analysis],
  ];

  return (
    <>
      <header className="top">
        <span className="brand" aria-label="Glypheur"><Seal size={28} /><b>Glypheur</b></span>
        <input className="title" value={doc.title} aria-label="Titre du texte" onChange={e => patch(d => ({ ...d, title: e.target.value }))} />
        <div className="tools">
          <div className="seg" role="group" aria-label="Lentille">
            {Object.values(LENSES).map(l => (
              <button key={l.id} aria-pressed={lensId === l.id} title={l.description}
                onClick={() => { setLensId(l.id); setSelectedId(null); setFocusType(null); }}>{l.label}</button>
            ))}
          </div>
          <div className="menu">
            <button className="btn icon" aria-label="Plus d'actions" aria-expanded={menu} onClick={() => setMenu(m => !m)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>
            </button>
            {menu && (
              <div className="menu-list" role="menu" onClick={() => setMenu(false)}>
                {menuItems.map(([label, sub, fn, disabled]) => (
                  <button key={label} role="menuitem" disabled={disabled} style={disabled ? { opacity: .4 } : undefined} onClick={fn}>
                    {label}<small>{sub}</small>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="work" onClick={() => menu && setMenu(false)}>
        {view === "read" ? <Frieze length={doc.text.length || 1} spans={spans} types={lens.types} selectedId={selectedId} onSelect={show} /> : <div />}

        <article className="sheet">
          <div className="print-only"><h1>{doc.title}</h1><p className="lede">Lentille {lens.label} · confiance ≥ {Math.round(minConfidence * 100)} %</p></div>

          {busy != null ? (
            <Loading since={busy} lens={lens} />
          ) : view === "compose" ? (
            <div className="composer">
              <h1>Révéler la structure d’un texte</h1>
              <p className="lede">Collez une lettre de vente, une page, un email. Glypheur surligne ses métastructures&nbsp;: Big Idea, hook, douleur, mécanisme, preuve, offre, appel à l’action.</p>
              <textarea value={draft} autoFocus placeholder="Votre texte…" aria-label="Texte à analyser"
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); analyze(); } }} />
              <div className="composer-foot">
                <span className={`count mono ${draft.length > MAX_CHARS ? "" : "muted"}`} style={draft.length > MAX_CHARS ? { color: "var(--danger)" } : undefined}>
                  {draft.length.toLocaleString("fr-FR")} car.
                </span>
                {!draft.trim() && <button className="btn ghost" onClick={loadExample}>Charger l’exemple</button>}
                {draft.trim() && <button className="btn" onClick={read}>Annoter à la main</button>}
                <button className="btn primary" disabled={!draft.trim() || draft.length > MAX_CHARS} onClick={analyze}>
                  Révéler la structure <span className="mono" style={{ opacity: .6 }}>⌘↵</span>
                </button>
              </div>
              {error && <p className="error" role="alert">{error}</p>}
            </div>
          ) : (
            <>
              <div className="readbar no-print">
                <div className="seg" role="group" aria-label="Vue">
                  <button aria-pressed={view === "read"} onClick={() => setView("read")}>Lecture</button>
                  <button aria-pressed={view === "tablet"} onClick={() => setView("tablet")}>Tablette</button>
                </div>
                <label className="slider">
                  <span className="hide-sm">Confiance</span>
                  <input type="range" min={0} max={0.95} step={0.05} value={minConfidence} onChange={e => setMinConfidence(Number(e.target.value))} aria-label="Seuil de confiance" />
                  <output>≥ {Math.round(minConfidence * 100)} %</output>
                </label>
              </div>
              {!analysis && (
                <div className="notice no-print">
                  <span>Pas encore de lecture <i>{lens.label}</i> pour ce texte. Sélectionnez un passage pour l’annoter, ou&nbsp;</span>
                  <button className="btn primary" onClick={analyze}>révélez-la</button>
                </div>
              )}
              {error && <p className="error" role="alert">{error}</p>}
              {view === "read"
                ? <Reader text={doc.text} spans={spans} types={lens.types} selectedId={selectedId} relatedIds={relatedIds} focusType={focusType} reveal={reveal} onSelect={select} onCreate={create} />
                : <Tablet spans={spans} types={lens.types} onSelect={show} />}
              <div className="print-only print-legend"><h1>Légende</h1><Legend types={lens.types} counts={{}} focusType={null} onFocusType={() => {}} /></div>
            </>
          )}
        </article>

        <Codex analysis={analysis} lens={lens} minConfidence={minConfidence} selected={selected} tab={tab} open={codexOpen} focusType={focusType}
          onTab={setTab} onOpen={setCodexOpen} onSelect={id => id && show(id)} onRetype={retype} onDelete={remove} onFocusType={setFocusType} />
      </main>
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}

function Loading({ since, lens }: { since: number; lens: Lens }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 500); return () => clearInterval(t); }, []);
  return (
    <div className="loading" role="status" aria-live="polite">
      <span className="seal"><Seal size={54} /></span>
      <div>
        <p style={{ margin: 0 }}>Lecture à travers la lentille <i>{lens.label}</i>…</p>
        <p className="mono muted" style={{ margin: "6px 0 0" }}>{Math.floor((now - since) / 1000)} s</p>
      </div>
    </div>
  );
}
