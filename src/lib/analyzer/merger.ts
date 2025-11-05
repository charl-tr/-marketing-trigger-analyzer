import { ValidatedMatch } from './analyzer';

// Interface pour les matches fusionnés
export interface MergedMatch {
  start: number;
  end: number;
  text: string;
  triggers: string[];
  comments: string[];
  intensities: number[];
  primaryTrigger: string; // Le trigger avec la plus forte intensité
  averageIntensity: number;
}

/**
 * Fusionne les matches qui se chevauchent
 */
export function mergeOverlaps(matches: ValidatedMatch[]): MergedMatch[] {
  if (matches.length === 0) return [];

  // Trier par position de début
  const sortedMatches = [...matches].sort((a, b) => a.start - b.start);
  const merged: MergedMatch[] = [];

  for (const currentMatch of sortedMatches) {
    // Chercher un match existant qui se chevauche
    const overlappingIndex = merged.findIndex(existing => 
      !(currentMatch.end <= existing.start || currentMatch.start >= existing.end)
    );

    if (overlappingIndex !== -1) {
      // Fusionner avec le match existant
      const existing = merged[overlappingIndex];
      
      // Étendre la plage
      const newStart = Math.min(existing.start, currentMatch.start);
      const newEnd = Math.max(existing.end, currentMatch.end);
      
      // Ajouter le nouveau trigger
      const newTriggers = [...existing.triggers, currentMatch.trigger];
      const newComments = [...existing.comments, currentMatch.comment];
      const newIntensities = [...existing.intensities, currentMatch.intensity];
      
      // Trouver le trigger principal (plus forte intensité)
      const maxIntensityIndex = newIntensities.indexOf(Math.max(...newIntensities));
      const primaryTrigger = newTriggers[maxIntensityIndex];
      
      // Calculer l'intensité moyenne
      const averageIntensity = newIntensities.reduce((sum, intensity) => sum + intensity, 0) / newIntensities.length;

      merged[overlappingIndex] = {
        start: newStart,
        end: newEnd,
        text: '', // Sera rempli plus tard
        triggers: newTriggers,
        comments: newComments,
        intensities: newIntensities,
        primaryTrigger,
        averageIntensity
      };
    } else {
      // Créer un nouveau match
      merged.push({
        start: currentMatch.start,
        end: currentMatch.end,
        text: '', // Sera rempli plus tard
        triggers: [currentMatch.trigger],
        comments: [currentMatch.comment],
        intensities: [currentMatch.intensity],
        primaryTrigger: currentMatch.trigger,
        averageIntensity: currentMatch.intensity
      });
    }
  }

  return merged;
}

/**
 * Remplit le texte des matches fusionnés
 */
export function fillMergedText(mergedMatches: MergedMatch[], originalText: string): MergedMatch[] {
  return mergedMatches.map(match => ({
    ...match,
    text: originalText.substring(match.start, match.end)
  }));
}

/**
 * Optimise les matches en supprimant les doublons et en fusionnant les chevauchements
 */
export function optimizeMatches(matches: ValidatedMatch[], originalText: string): MergedMatch[] {
  console.log(`🔄 Optimizing ${matches.length} matches`);
  
  // Fusionner les chevauchements
  const merged = mergeOverlaps(matches);
  
  // Remplir le texte
  const filled = fillMergedText(merged, originalText);
  
  console.log(`✅ Optimized to ${filled.length} merged matches`);
  
  // Log des chevauchements détectés
  const overlappingCount = matches.length - filled.length;
  if (overlappingCount > 0) {
    console.log(`🔗 Merged ${overlappingCount} overlapping matches`);
  }
  
  return filled;
}

/**
 * Génère un résumé des matches pour le debug
 */
export function generateMatchesSummary(matches: MergedMatch[]): string {
  const triggerCounts: { [key: string]: number } = {};
  
  matches.forEach(match => {
    match.triggers.forEach(trigger => {
      triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
    });
  });

  const summary = Object.entries(triggerCounts)
    .map(([trigger, count]) => `${trigger}: ${count}`)
    .join(', ');

  return `Total: ${matches.length} matches (${summary})`;
}
