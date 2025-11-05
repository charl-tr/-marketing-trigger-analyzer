import { getTriggerPrompt } from './prompts';

// Interface pour les résultats bruts du LLM
interface RawLLMMatch {
  start: number;
  end: number;
  text: string;
  comment: string;
  intensity: number;
}

// Interface pour les résultats validés
export interface ValidatedMatch {
  start: number;
  end: number;
  text: string;
  comment: string;
  trigger: string;
  intensity: number;
}

/**
 * Appelle le LLM pour analyser un trigger spécifique
 */
export async function callLLMForTrigger(
  trigger: string, 
  text: string, 
  apiKey: string
): Promise<RawLLMMatch[]> {
  const prompt = getTriggerPrompt(trigger);
  const fullPrompt = `${prompt}\n${text}\n---`;

  console.log(`🔍 Analyzing trigger: ${trigger}`);
  console.log(`📝 Text length: ${text.length} characters`);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en analyse de triggers marketing. Tu réponds UNIQUEMENT avec du JSON valide.'
          },
          {
            role: 'user',
            content: fullPrompt
          }
        ],
        temperature: 0.1,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    console.log(`📊 Raw OpenAI response for ${trigger}:`, content);

    // Parser le JSON de la réponse
    let matches: RawLLMMatch[] = [];
    try {
      // Essayer de parser directement
      matches = JSON.parse(content);
    } catch (parseError) {
      console.warn(`⚠️ JSON parse error for ${trigger}, trying to extract JSON:`, parseError);
      // Essayer d'extraire le JSON de la réponse
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        matches = JSON.parse(jsonMatch[0]);
      } else {
        console.error(`❌ Could not extract JSON from response for ${trigger}`);
        return [];
      }
    }

    console.log(`📊 Raw matches for ${trigger}:`, matches);
    return matches;

  } catch (error) {
    console.error(`❌ Error calling LLM for ${trigger}:`, error);
    throw error;
  }
}

/**
 * Trouve les limites de mots les plus proches
 */
function snapToWordBoundaries(text: string, start: number, end: number): { start: number, end: number } {
  // Caractères qui délimitent les mots
  const wordBoundaries = /[\s\n\r\t.,!?;:()[\]{}"'`~@#$%^&*+=|\\/<>]/;
  
  // Ajuster le début vers la gauche jusqu'à trouver une limite de mot
  let newStart = start;
  while (newStart > 0 && !wordBoundaries.test(text[newStart - 1])) {
    newStart--;
  }
  
  // Ajuster la fin vers la droite jusqu'à trouver une limite de mot
  let newEnd = end;
  while (newEnd < text.length && !wordBoundaries.test(text[newEnd])) {
    newEnd++;
  }
  
  return { start: newStart, end: newEnd };
}

/**
 * Valide et corrige les positions des matches
 */
export function validateMatches(
  matches: RawLLMMatch[], 
  trigger: string, 
  text: string
): ValidatedMatch[] {
  const validatedMatches: ValidatedMatch[] = [];

  for (const match of matches) {
    // Validation des types
    if (typeof match.start !== 'number' || typeof match.end !== 'number') {
      console.warn(`⚠️ Invalid positions for ${trigger}:`, match);
      continue;
    }

    // Correction des positions
    let start = Math.max(0, match.start);
    let end = Math.min(text.length, match.end);

    // Vérifier que start < end
    if (start >= end) {
      console.warn(`⚠️ Invalid range for ${trigger}: start=${start}, end=${end}`);
      continue;
    }

    // Extraire le texte original (avant correction)
    const originalText = text.substring(start, end);
    if (!originalText || originalText.length === 0) {
      console.warn(`⚠️ Empty text for ${trigger} at positions ${start}-${end}`);
      continue;
    }

    // Vérifier si le texte est un fragment de mot (commence ou finit au milieu d'un mot)
    const wordBoundaries = /[\s\n\r\t.,!?;:()[\]{}"'`~@#$%^&*+=|\\/<>]/;
    const startsInWord = start > 0 && !wordBoundaries.test(text[start - 1]);
    const endsInWord = end < text.length && !wordBoundaries.test(text[end]);
    
    if (startsInWord || endsInWord) {
      console.log(`🔧 Snapping to word boundaries for ${trigger}: "${originalText}" (${start}-${end})`);
      
      // Ajuster aux limites de mots
      const snapped = snapToWordBoundaries(text, start, end);
      start = snapped.start;
      end = snapped.end;
      
      console.log(`🔧 Snapped to: "${text.substring(start, end)}" (${start}-${end})`);
    }

    // Extraire le texte final
    const finalText = text.substring(start, end);
    if (!finalText || finalText.length === 0) {
      console.warn(`⚠️ Empty text after snapping for ${trigger}`);
      continue;
    }

    // Validation de l'intensité
    const intensity = Math.max(0, Math.min(1, match.intensity || 0));

    // Créer le match validé
    const validatedMatch: ValidatedMatch = {
      start,
      end,
      text: finalText,
      comment: match.comment || `Detected ${trigger}`,
      trigger,
      intensity
    };

    validatedMatches.push(validatedMatch);
  }

  console.log(`✅ Validated ${validatedMatches.length} matches for ${trigger}`);
  return validatedMatches;
}

/**
 * Analyse un texte pour un trigger spécifique
 */
export async function analyzeTrigger(
  text: string, 
  trigger: string, 
  apiKey: string
): Promise<ValidatedMatch[]> {
  try {
    // Appel au LLM
    const rawMatches = await callLLMForTrigger(trigger, text, apiKey);
    
    // Validation et correction
    const validatedMatches = validateMatches(rawMatches, trigger, text);
    
    return validatedMatches;
  } catch (error) {
    console.error(`❌ Error analyzing trigger ${trigger}:`, error);
    return [];
  }
}

/**
 * Analyse un texte pour plusieurs triggers
 */
export async function analyzeText(
  text: string, 
  triggers: string[], 
  apiKey: string
): Promise<ValidatedMatch[]> {
  console.log(`🚀 Starting analysis for ${triggers.length} triggers`);
  console.log(`📝 Text length: ${text.length} characters`);

  const allMatches: ValidatedMatch[] = [];

  // Analyse séquentielle pour chaque trigger
  for (let i = 0; i < triggers.length; i++) {
    const trigger = triggers[i];
    console.log(`🔍 Processing trigger ${i + 1}/${triggers.length}: ${trigger}`);

    try {
      const matches = await analyzeTrigger(text, trigger, apiKey);
      allMatches.push(...matches);
      
      console.log(`✅ Completed ${trigger}: ${matches.length} matches found`);
    } catch (error) {
      console.error(`❌ Error analyzing ${trigger}:`, error);
      // Continuer avec les autres triggers même si un échoue
    }
  }

  console.log(`🎯 Total triggers found: ${allMatches.length}`);
  return allMatches;
}
