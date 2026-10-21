// Export : le JSON est le format d'échange (analyse + mesures, schéma versionné) ; le PDF annoté passe
// par l'impression du navigateur, qui garde la typographie et les traits à l'identique.
import type { Analysis } from "@/domain/schema";
import { metrics } from "@/metrics";

export function exportJson(title: string, a: Analysis, minConfidence: number) {
  const payload = { title, minConfidence, analysis: a, metrics: metrics(a, minConfidence) };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement("a"), { href: url, download: `${slug(title)}.glypheur.json` });
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportPdf() {
  window.print();
}

const slug = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "texte";
