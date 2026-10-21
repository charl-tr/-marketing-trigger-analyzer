// Recalage des citations du modèle sur le texte d'origine.
// Le modèle cite ; c'est nous qui calculons les positions — un surlignage ne peut donc jamais être inventé.

/** Variantes typographiques ramenées à une forme unique, sans changer la longueur (positions préservées). */
function foldChar(c: string): string {
  if ("’‘`´".includes(c)) return "'";
  if ("“”«»„".includes(c)) return '"';
  if ("–—‑".includes(c)) return "-";
  if (c === " " || c === " " || c === "\t" || c === "\n" || c === "\r") return " ";
  return c.toLowerCase();
}

/**
 * Texte « plié » + table de correspondance vers les positions d'origine.
 * Les espaces multiples sont réduits à un seul : `map[i]` donne la position d'origine du i-ème caractère plié.
 */
export function fold(text: string): { s: string; map: number[] } {
  let s = "";
  const map: number[] = [];
  let prevSpace = false;
  for (let i = 0; i < text.length; i++) {
    const c = foldChar(text[i]);
    if (c === " ") {
      if (prevSpace) continue;
      prevSpace = true;
    } else prevSpace = false;
    s += c;
    map.push(i);
  }
  return { s, map };
}

export interface Located { start: number; end: number }

/**
 * Trouve `quote` dans `text`. Préférence : la première occurrence à partir de `from` (ordre du document),
 * puis n'importe où. Repli pour les longues citations légèrement altérées : début et fin cherchés séparément.
 */
export function locate(text: string, quote: string, from = 0, folded = fold(text)): Located | null {
  const q = fold(quote.trim()).s.trim();
  if (q.length < 2) return null;
  const { s, map } = folded;
  const fromF = map.findIndex(i => i >= from);
  const toOriginal = (a: number, b: number): Located => ({ start: map[a], end: map[b - 1] + 1 });

  let at = s.indexOf(q, Math.max(0, fromF));
  if (at < 0) at = s.indexOf(q);
  if (at >= 0) return toOriginal(at, at + q.length);

  if (q.length >= 60) {
    const head = q.slice(0, 30), tail = q.slice(-30);
    let h = s.indexOf(head, Math.max(0, fromF));
    if (h < 0) h = s.indexOf(head);
    if (h >= 0) {
      const t = s.indexOf(tail, h + head.length);
      // L'extrait reconstitué ne doit pas différer de plus de 15 % en longueur de la citation.
      if (t >= 0 && Math.abs(t + tail.length - h - q.length) <= q.length * 0.15) return toOriginal(h, t + tail.length);
    }
  }
  return null;
}

/** Recale une liste de citations dans l'ordre ; renvoie null pour celles introuvables. */
export function alignAll(text: string, quotes: string[]): (Located | null)[] {
  const folded = fold(text);
  let cursor = 0;
  return quotes.map(q => {
    const hit = locate(text, q, cursor, folded);
    if (hit) cursor = hit.start;
    return hit;
  });
}
