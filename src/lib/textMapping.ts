// Système robuste de mapping des positions de texte
export interface TextPosition {
  char: string;
  index: number;
  isWhitespace: boolean;
  isPunctuation: boolean;
  isNewline: boolean;
}

export interface TextMapping {
  originalText: string;
  positions: TextPosition[];
  charMap: Map<number, TextPosition>;
}

/**
 * Crée un mapping robuste du texte avec toutes les positions
 */
export function createTextMapping(text: string): TextMapping {
  const positions: TextPosition[] = [];
  const charMap = new Map<number, TextPosition>();
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const position: TextPosition = {
      char,
      index: i,
      isWhitespace: /\s/.test(char),
      isPunctuation: /[.,;:!?()[\]{}"'`~@#$%^&*+=|\\/<>]/.test(char),
      isNewline: char === '\n' || char === '\r'
    };
    
    positions.push(position);
    charMap.set(i, position);
  }
  
  return {
    originalText: text,
    positions,
    charMap
  };
}

/**
 * Valide et corrige les positions start/end pour s'assurer qu'elles sont dans les limites du texte
 */
export function validatePositions(start: number, end: number, textLength: number): { start: number; end: number; valid: boolean } {
  // S'assurer que les positions sont des nombres valides
  if (typeof start !== 'number' || typeof end !== 'number' || isNaN(start) || isNaN(end)) {
    return { start: 0, end: 0, valid: false };
  }
  
  // Corriger les positions pour qu'elles soient dans les limites
  const correctedStart = Math.max(0, Math.min(start, textLength));
  const correctedEnd = Math.max(correctedStart, Math.min(end, textLength));
  
  // Vérifier que start < end
  if (correctedStart >= correctedEnd) {
    return { start: correctedStart, end: correctedStart + 1, valid: false };
  }
  
  return { start: correctedStart, end: correctedEnd, valid: true };
}

/**
 * Extrait un segment de texte en utilisant les positions validées
 */
export function extractTextSegment(text: string, start: number, end: number): string {
  const validation = validatePositions(start, end, text.length);
  if (!validation.valid) {
    return '';
  }
  
  return text.substring(validation.start, validation.end);
}

/**
 * Trouve les limites de mots pour un segment donné
 */
export function findWordBoundaries(text: string, start: number, end: number): { wordStart: number; wordEnd: number } {
  // Trouver le début du mot
  let wordStart = start;
  while (wordStart > 0 && /\w/.test(text[wordStart - 1])) {
    wordStart--;
  }
  
  // Trouver la fin du mot
  let wordEnd = end;
  while (wordEnd < text.length && /\w/.test(text[wordEnd])) {
    wordEnd++;
  }
  
  return { wordStart, wordEnd };
}

/**
 * Crée un rendu robuste du texte avec highlights
 */
export function createRobustTextRender(
  text: string, 
  highlights: Array<{
    start: number;
    end: number;
    type: string;
    intensity: number;
    reason: string;
  }>
): Array<{
  text: string;
  type: 'normal' | 'highlight';
  highlight?: {
    type: string;
    intensity: number;
    reason: string;
  };
}> {
  const mapping = createTextMapping(text);
  const segments: Array<{
    text: string;
    type: 'normal' | 'highlight';
    highlight?: {
      type: string;
      intensity: number;
      reason: string;
    };
  }> = [];
  
  // Trier les highlights par position de début
  const sortedHighlights = highlights
    .map(h => ({
      ...h,
      start: Math.max(0, Math.min(h.start, text.length)),
      end: Math.max(h.start, Math.min(h.end, text.length))
    }))
    .filter(h => h.start < h.end)
    .sort((a, b) => a.start - b.start);
  
  let currentIndex = 0;
  
  for (const highlight of sortedHighlights) {
    // Ajouter le texte normal avant le highlight
    if (currentIndex < highlight.start) {
      const normalText = text.substring(currentIndex, highlight.start);
      if (normalText) {
        segments.push({
          text: normalText,
          type: 'normal'
        });
      }
    }
    
    // Ajouter le texte highlighté
    const highlightText = text.substring(highlight.start, highlight.end);
    if (highlightText) {
      segments.push({
        text: highlightText,
        type: 'highlight',
        highlight: {
          type: highlight.type,
          intensity: highlight.intensity,
          reason: highlight.reason
        }
      });
    }
    
    currentIndex = highlight.end;
  }
  
  // Ajouter le texte restant
  if (currentIndex < text.length) {
    const remainingText = text.substring(currentIndex);
    if (remainingText) {
      segments.push({
        text: remainingText,
        type: 'normal'
      });
    }
  }
  
  return segments;
}
