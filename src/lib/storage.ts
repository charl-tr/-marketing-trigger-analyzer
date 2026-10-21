// Persistance locale du document en cours (v1). L'interface ne connaît que load/save :
// brancher Supabase plus tard (comptes, partage, analytics d'équipe en v5) ne touchera qu'à ce fichier.
import { Doc } from "@/domain/schema";

const KEY = "glypheur:doc";

export function loadDoc(): Doc | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = Doc.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveDoc(doc: Doc) {
  try { localStorage.setItem(KEY, JSON.stringify(doc)); } catch { /* stockage indisponible : l'app fonctionne sans */ }
}

export function newDoc(title = "Sans titre", text = ""): Doc {
  return { id: crypto.randomUUID(), title, text, analyses: {}, updatedAt: new Date().toISOString() };
}
