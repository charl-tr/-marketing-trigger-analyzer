import { PerfectMatch } from './perfectAnalyzer';

// Interface pour les matches fusionnés
export interface MergedMatch {
  start: number;
  end: number;
  text: string;
  triggers: string[];
  comments: string[];
  verified: boolean;
}

/**
 * Fusionne les matches qui se chevauchent ou sont identiques
 */
export function mergeOverlappingMatches(matches: PerfectMatch[]): MergedMatch[] {
  if (matches.length === 0) return [];

  // Trier par position de début
  const sortedMatches = [...matches].sort((a, b) => a.start - b.start);
  const merged: MergedMatch[] = [];

  for (const match of sortedMatches) {
    // Chercher un match existant qui se chevauche
    const overlappingIndex = merged.findIndex(existing => 
      !(match.end <= existing.start || match.start >= existing.end)
    );

    if (overlappingIndex !== -1) {
      // Fusionner avec le match existant
      const existing = merged[overlappingIndex];
      
      // Étendre la portée si nécessaire
      const newStart = Math.min(existing.start, match.start);
      const newEnd = Math.max(existing.end, match.end);
      
      // Ajouter le trigger s'il n'existe pas déjà
      const newTriggers = Array.from(new Set([...existing.triggers, match.trigger]));
      
      // Ajouter le commentaire s'il n'existe pas déjà
      const newComments = Array.from(new Set([...existing.comments, match.comment]));
      
      merged[overlappingIndex] = {
        start: newStart,
        end: newEnd,
        text: match.text, // Garder le texte du match actuel
        triggers: newTriggers,
        comments: newComments,
        verified: existing.verified && match.verified
      };
    } else {
      // Créer un nouveau match fusionné
      merged.push({
        start: match.start,
        end: match.end,
        text: match.text,
        triggers: [match.trigger],
        comments: [match.comment],
        verified: match.verified
      });
    }
  }

  return merged;
}

/**
 * Convertit les matches fusionnés en format frontend
 */
export function convertMergedMatchesToHighlights(mergedMatches: MergedMatch[]): any[] {
  return mergedMatches.map(merged => ({
    type: merged.triggers.join('+'), // Combiner les triggers
    intensity: 0.8,
    span: { start: merged.start, end: merged.end },
    excerpt: merged.text,
    reasoning: merged.comments.join(' | '), // Combiner les commentaires
    triggers: merged.triggers,
    verified: merged.verified
  }));
}
