# Glypheur

Le surligneur des métastructures. Glypheur lit un texte persuasif et rend visible son architecture :
Big Idea, hook, douleur, mécanisme, preuve, offre, appel à l'action, transitions. Il mesure aussi
la couverture, l'équilibre et l'ordre des blocs.

Ce dépôt est né du prototype « Prism / Marketing Trigger Analyzer ». La branche `v1-fondations`
le reconstruit à partir de la feuille de route du document Glypheur.

## Lancer

```bash
npm install
cp .env.example .env.local   # puis renseigner ANTHROPIC_API_KEY
npm run dev
```

Sans clé, l'application fonctionne avec l'exemple annoté et le surlignage manuel. Seule l'analyse
automatique est indisponible.

## Architecture

| Dossier | Rôle |
|---|---|
| `src/domain/` | **Source de vérité.** Ontologie (types, échelles, couleurs, traits, relations, motifs), lentilles, schémas zod. Tout le reste lit ces définitions. |
| `src/engine/` | Analyse : prompt construit depuis l'ontologie, appel Claude en sortie structurée, recalage des citations sur le texte (`align.ts`), construction de l'analyse (`build.ts`, pur). |
| `src/metrics/` | Mesures pures : couverture, équilibre macro/micro/liants, séquence comparée à l'ordre canonique, boucles. |
| `src/lib/` | Emboîtement des passages pour l'affichage, persistance locale, export. |
| `src/components/` | Atelier, lecteur, Codex, frise, tablette, glyphes. |
| `src/examples/` | Textes de référence annotés (démonstration et tests de bout en bout). |

Principes :

- **Le modèle cite, le serveur positionne.** Claude renvoie des extraits exacts, et `align.ts` les recale
  sur le texte (guillemets, tirets et espaces normalisés). Une citation introuvable est écartée et comptée.
- **Une lentille = une entrée de `LENSES`.** Ajouter Blair Warren ou Schwartz ne demande ni nouvelle
  route ni nouvel écran.
- **Un format d'échange versionné** (`glypheur.analysis/1`) : le même JSON sort de l'API, de l'export
  et, plus tard, de l'API publique.
- **La persistance passe par `lib/storage.ts`** (localStorage en v1). Brancher des comptes (Supabase)
  ne touche que ce fichier.

## Feuille de route

- [x] **v1** : surlignage assisté (IA + manuel), légende, mesures, vue tablette, export JSON et PDF.
- [ ] **v2** : suggestions automatiques avec curseurs de confiance par type, et validation ou rejet en un geste.
- [ ] **v3** : Dojo (exercices de reconnaissance sur la bibliothèque d'exemples).
- [ ] **v4** : API publique et plugin (Google Docs / navigateur).
- [ ] **v5** : comptes, partage, analytics d'équipe.

## Vérifier

```bash
npm test          # vitest : alignement, emboîtement, mesures, exemple de bout en bout
npm run typecheck
npm run lint
npm run build
```
