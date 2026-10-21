// Premier texte « canonique » de la bibliothèque d'exemples (feuille de route, v4) : une lettre de vente
// originale, annotée à la main. Sert aussi de démonstration sans clé API et de jeu d'essai de bout en bout.
import type { ModelOutput } from "@/domain/schema";

export const EXAMPLE_TITLE = "Lettre de vente — L'Atelier de Structure";

export const EXAMPLE_TEXT = `Vous écrivez bien. Et pourtant, vos pages ne vendent pas.

Imaginez la scène : vous publiez une page sur laquelle vous avez passé trois semaines. Le trafic arrive. Les lecteurs défilent. Et le compteur de ventes reste figé à zéro, nuit après nuit.

Ce n'est pas votre style qui est en cause. C'est l'ordre dans lequel vous racontez les choses.

La plupart des copywriters empilent des arguments comme on remplit une valise la veille du départ : tout y est, mais rien n'est à sa place. Le lecteur sent le désordre, même sans pouvoir le nommer. Alors il décroche, poliment, et ne revient jamais.

Et c'est précisément là que tout bascule.

Un texte qui vend suit une architecture invisible : il capte, il nomme la douleur, il explique pourquoi la solution fonctionne, il le prouve, puis il propose. Inversez deux de ces blocs, et la tension retombe. Remettez-les dans l'ordre, et la même page se met à convertir.

C'est exactement ce qu'ont fait les 40 participants de notre dernière promotion : en réordonnant leurs pages existantes, sans réécrire une seule phrase, 37 d'entre eux ont vu leur taux de conversion progresser dès la première semaine. Claire, consultante à Lyon, est passée de 0,8 % à 2,9 %.

Je vous propose de faire la même chose avec vos propres textes. L'Atelier de Structure, ce sont quatre séances en petit groupe, la grille complète des métastructures, et la relecture de vos deux pages les plus importantes. Le tout pour 490 €, remboursés intégralement si vous ne voyez aucune différence après la deuxième séance.

Dans un mois, vous relirez vos anciennes pages et vous verrez immédiatement ce qui clochait.

Les places sont limitées à douze par session. Réservez la vôtre ci-dessous avant vendredi minuit.`;

export const EXAMPLE_ANNOTATION: ModelOutput = {
  summary: {
    big_idea: "Ce n'est pas le style qui fait vendre une page, c'est l'ordre dans lequel les blocs sont racontés.",
    verdict: "La structure est presque canonique : la douleur est concrète et la preuve chiffrée arrive juste après le mécanisme. Le principal manque : l'offre ne traite aucune objection autre que le risque, et la projection finale reste courte.",
  },
  spans: [
    { id: "s1", type: "hook", quote: "Vous écrivez bien. Et pourtant, vos pages ne vendent pas.", confidence: 0.95, note: "Contradiction frontale qui ouvre une tension immédiate : un compliment puis son démenti." },
    { id: "s2", type: "pain", quote: "Imaginez la scène : vous publiez une page sur laquelle vous avez passé trois semaines. Le trafic arrive. Les lecteurs défilent. Et le compteur de ventes reste figé à zéro, nuit après nuit.", confidence: 0.92, note: "Douleur rendue visible par une scène concrète : effort, trafic, et pourtant zéro vente." },
    { id: "s3", type: "hook", quote: "Imaginez la scène :", confidence: 0.7, note: "Ouverture sensorielle qui fait entrer le lecteur dans la scène plutôt que de la lui raconter." },
    { id: "s4", type: "big_idea", quote: "Ce n'est pas votre style qui est en cause. C'est l'ordre dans lequel vous racontez les choses.", confidence: 0.96, note: "L'idée centrale, contre-intuitive et formulée en une phrase : tout le texte la sert." },
    { id: "s5", type: "pain", quote: "La plupart des copywriters empilent des arguments comme on remplit une valise la veille du départ : tout y est, mais rien n'est à sa place. Le lecteur sent le désordre, même sans pouvoir le nommer. Alors il décroche, poliment, et ne revient jamais.", confidence: 0.85, note: "La douleur est approfondie par une image (la valise) puis par sa conséquence : le lecteur qui décroche." },
    { id: "s6", type: "transition", quote: "Et c'est précisément là que tout bascule.", confidence: 0.93, note: "Pont court qui relance la curiosité et annonce le mécanisme." },
    { id: "s7", type: "mechanism", quote: "Un texte qui vend suit une architecture invisible : il capte, il nomme la douleur, il explique pourquoi la solution fonctionne, il le prouve, puis il propose. Inversez deux de ces blocs, et la tension retombe. Remettez-les dans l'ordre, et la même page se met à convertir.", confidence: 0.94, note: "Le « comment ça marche » est nommé (une architecture en cinq temps) et rendu testable (inverser, remettre dans l'ordre)." },
    { id: "s8", type: "proof", quote: "C'est exactement ce qu'ont fait les 40 participants de notre dernière promotion : en réordonnant leurs pages existantes, sans réécrire une seule phrase, 37 d'entre eux ont vu leur taux de conversion progresser dès la première semaine.", confidence: 0.9, note: "Preuve chiffrée qui valide directement le mécanisme : même texte, ordre différent, résultat mesuré." },
    { id: "s9", type: "proof", quote: "Claire, consultante à Lyon, est passée de 0,8 % à 2,9 %.", confidence: 0.88, note: "Témoignage incarné et précis qui rend la preuve statistique concrète." },
    { id: "s10", type: "offer", quote: "L'Atelier de Structure, ce sont quatre séances en petit groupe, la grille complète des métastructures, et la relecture de vos deux pages les plus importantes. Le tout pour 490 €, remboursés intégralement si vous ne voyez aucune différence après la deuxième séance.", confidence: 0.95, note: "Contenu précis, prix et garantie : on sait exactement ce qu'on reçoit et ce qu'on risque." },
    { id: "s11", type: "transition", quote: "Je vous propose de faire la même chose avec vos propres textes.", confidence: 0.72, note: "Bascule de la preuve vers l'offre, formulée comme une invitation à reproduire le résultat." },
    { id: "s12", type: "big_idea", quote: "Dans un mois, vous relirez vos anciennes pages et vous verrez immédiatement ce qui clochait.", confidence: 0.55, note: "Projection qui reformule la Big Idea du point de vue du lecteur transformé." },
    { id: "s13", type: "cta", quote: "Les places sont limitées à douze par session. Réservez la vôtre ci-dessous avant vendredi minuit.", confidence: 0.96, note: "Un seul geste, une échéance, une limite réelle : l'élan accumulé se convertit en action." },
  ],
  relations: [
    { from: "s1", to: "s4", kind: "prepares" },
    { from: "s2", to: "s4", kind: "triggers" },
    { from: "s4", to: "s2", kind: "answers" },
    { from: "s7", to: "s4", kind: "supports" },
    { from: "s8", to: "s7", kind: "validates" },
    { from: "s9", to: "s8", kind: "supports" },
    { from: "s10", to: "s5", kind: "answers" },
    { from: "s6", to: "s7", kind: "prepares" },
    { from: "s13", to: "s10", kind: "triggers" },
  ],
  patterns: [
    { kind: "open_loop", span_ids: ["s1", "s4"], status: "closed", note: "La contradiction d'ouverture est résolue par la Big Idea deux paragraphes plus loin." },
    { kind: "cliffhanger", span_ids: ["s6"], status: "na", note: "Phrase isolée qui coupe juste avant l'explication." },
    { kind: "future_pace", span_ids: ["s12"], status: "na", note: "Le lecteur est projeté un mois plus tard, transformation acquise." },
  ],
};
