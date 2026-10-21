import { describe, expect, it } from "vitest";
import { alignAll, locate } from "./align";

const text = "Imaginez le bruit sec d’un dossier qu’on referme.  Signé.\nEt c’est là que tout bascule.";

describe("locate", () => {
  it("trouve une citation exacte", () => {
    const at = locate(text, "Signé.")!;
    expect(text.slice(at.start, at.end)).toBe("Signé.");
  });

  it("tolère apostrophes droites, espaces et retours à la ligne", () => {
    const at = locate(text, "d'un dossier qu'on referme. Signé. Et c'est là")!;
    expect(text.slice(at.start, at.end)).toBe("d’un dossier qu’on referme.  Signé.\nEt c’est là");
  });

  it("ignore la casse", () => {
    expect(locate(text, "IMAGINEZ le bruit")).not.toBeNull();
  });

  it("refuse ce qui n'est pas dans le texte", () => {
    expect(locate(text, "Une phrase inventée par le modèle.")).toBeNull();
  });

  it("recale une longue citation légèrement altérée par son début et sa fin", () => {
    const long = "Le premier jour, vous posez les fondations du système complet. Le second, vous testez chaque hypothèse avec de vrais clients.";
    const altered = "Le premier jour, vous posez les fondations du système. Le second, vous testez chaque hypothèse avec de vrais clients.";
    const at = locate(long, altered)!;
    expect(at).not.toBeNull();
    expect(at.start).toBe(0);
    expect(at.end).toBe(long.length);
  });
});

describe("alignAll", () => {
  it("respecte l'ordre du document quand une phrase revient", () => {
    const t = "Agissez maintenant. Puis réfléchissez. Agissez maintenant.";
    const [a, b] = alignAll(t, ["Puis réfléchissez.", "Agissez maintenant."]);
    expect(a!.start).toBe(20);
    expect(b!.start).toBe(39);
  });
});
