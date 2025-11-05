import { getWorkingPrompt } from './workingPrompts';

// Interface pour les segments textuels du LLM
interface LLMSegment {
  text: string;
  comment: string;
}

// Interface pour les matches avec intégrité parfaite
export interface PerfectMatch {
  start: number;
  end: number;
  text: string;
  comment: string;
  trigger: string;
  intensity?: number; // Score d'intensité de 0 à 100
  verified: boolean; // Vérification que le texte correspond exactement
}

// Mode debug pour vérification stricte
const DEBUG_MODE = true;

/**
 * Appelle le LLM avec les prompts optimisés
 */
export async function callLLMPerfect(
  trigger: string, 
  text: string, 
  apiKey: string
): Promise<LLMSegment[]> {
  const prompt = getWorkingPrompt(trigger);
  const fullPrompt = `${prompt}\n${text}`;

  if (DEBUG_MODE) {
    console.log(`🔍 [DEBUG] Analyzing trigger: ${trigger}`);
    console.log(`📝 [DEBUG] Text length: ${text.length} characters`);
  }

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
            content: 'Tu es un expert en marketing. Tu réponds UNIQUEMENT avec du JSON valide. Format: [{"text": "passage exact", "comment": "explication"}]'
          },
          {
            role: 'user',
            content: fullPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
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

    if (DEBUG_MODE) {
      console.log(`📊 [DEBUG] Raw OpenAI response for ${trigger}:`, content);
    }

    // Parser le JSON avec gestion robuste
    let segments: LLMSegment[] = [];
    try {
      let cleanContent = content.trim();
      
      // Supprimer les backticks markdown
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      segments = JSON.parse(cleanContent);
    } catch (parseError) {
      console.warn(`⚠️ [DEBUG] JSON parse error for ${trigger}, trying to extract JSON:`, parseError);
      
      // Essayer d'extraire le JSON avec regex
      const jsonMatch = content.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        try {
          segments = JSON.parse(jsonMatch[0]);
        } catch (secondError) {
          console.error(`❌ [DEBUG] Could not parse extracted JSON for ${trigger}:`, secondError);
          return [];
        }
      } else {
        console.error(`❌ [DEBUG] Could not extract JSON from response for ${trigger}`);
        return [];
      }
    }

    if (DEBUG_MODE) {
      console.log(`📊 [DEBUG] Parsed segments for ${trigger}:`, segments);
    }

    return segments;

  } catch (error) {
    console.error(`❌ [DEBUG] Error calling LLM for ${trigger}:`, error);
    throw error;
  }
}

/**
 * Trouve les positions exactes d'un segment dans le texte original
 * avec vérification stricte de l'intégrité
 */
function findExactPositions(
  originalText: string, 
  segmentText: string, 
  trigger: string
): Array<{start: number, end: number, verified: boolean}> {
  const positions: Array<{start: number, end: number, verified: boolean}> = [];
  let searchIndex = 0;

  while (true) {
    const foundIndex = originalText.indexOf(segmentText, searchIndex);
    if (foundIndex === -1) break;

    // Vérification stricte : le texte extrait doit correspondre exactement
    const extractedText = originalText.substring(foundIndex, foundIndex + segmentText.length);
    const verified = extractedText === segmentText;

    if (DEBUG_MODE) {
      console.log(`🔍 [DEBUG] Position check for "${segmentText}":`);
      console.log(`   Start: ${foundIndex}, End: ${foundIndex + segmentText.length}`);
      console.log(`   Extracted: "${extractedText}"`);
      console.log(`   Expected: "${segmentText}"`);
      console.log(`   Verified: ${verified}`);
    }

    positions.push({
      start: foundIndex,
      end: foundIndex + segmentText.length,
      verified
    });

    searchIndex = foundIndex + 1;
  }

  return positions;
}

/**
 * Convertit les segments LLM en matches parfaits avec vérification
 */
export function convertToPerfectMatches(
  segments: LLMSegment[], 
  trigger: string, 
  originalText: string
): PerfectMatch[] {
  const matches: PerfectMatch[] = [];

  for (const segment of segments) {
    if (DEBUG_MODE) {
      console.log(`🔍 [DEBUG] Processing segment for ${trigger}:`, segment);
    }
    
    if (!segment.text || typeof segment.text !== 'string') {
      if (DEBUG_MODE) {
        console.warn(`⚠️ [DEBUG] Invalid segment for ${trigger}:`, segment);
      }
      continue;
    }

    // Trouver toutes les positions exactes
    const positions = findExactPositions(originalText, segment.text, trigger);
    
    if (positions.length === 0) {
      if (DEBUG_MODE) {
        console.warn(`⚠️ [DEBUG] Could not find position for segment: "${segment.text}"`);
      }
      continue;
    }

    // Créer un match pour chaque position trouvée
    for (const position of positions) {
      const match: PerfectMatch = {
        start: position.start,
        end: position.end,
        text: segment.text,
        comment: segment.comment || `Detected ${trigger}`,
        trigger,
        intensity: segment.intensity || 50, // Utiliser l'intensité du LLM ou 50% par défaut
        verified: position.verified
      };

      matches.push(match);
    }
  }

  if (DEBUG_MODE) {
    console.log(`✅ [DEBUG] Converted ${segments.length} segments to ${matches.length} matches for ${trigger}`);
  }

  return matches;
}

/**
 * Déduplication stricte pour éviter les doublons visuels
 */
export function deduplicateMatches(matches: PerfectMatch[]): PerfectMatch[] {
  const uniqueMatches: PerfectMatch[] = [];
  const seen = new Set<string>();

  for (const match of matches) {
    // Clé unique basée sur position + trigger
    const key = `${match.start}-${match.end}-${match.trigger}`;
    
    if (!seen.has(key)) {
      seen.add(key);
      uniqueMatches.push(match);
      
      if (DEBUG_MODE) {
        console.log(`✅ [DEBUG] Added unique match: ${key} - "${match.text}"`);
      }
    } else {
      if (DEBUG_MODE) {
        console.log(`🔄 [DEBUG] Skipped duplicate match: ${key} - "${match.text}"`);
      }
    }
  }

  if (DEBUG_MODE) {
    console.log(`🎯 [DEBUG] Deduplication: ${matches.length} → ${uniqueMatches.length} unique matches`);
  }

  return uniqueMatches;
}

/**
 * Analyse un trigger avec intégrité parfaite
 */
export async function analyzeTriggerPerfect(
  text: string, 
  trigger: string, 
  apiKey: string
): Promise<PerfectMatch[]> {
  try {
    // Appel au LLM
    const segments = await callLLMPerfect(trigger, text, apiKey);
    
    // Conversion en matches avec vérification
    const matches = convertToPerfectMatches(segments, trigger, text);
    
    // Déduplication stricte
    const uniqueMatches = deduplicateMatches(matches);
    
    return uniqueMatches;
  } catch (error) {
    console.error(`❌ [DEBUG] Error analyzing trigger ${trigger}:`, error);
    return [];
  }
}

/**
 * Analyse complète avec intégrité parfaite
 */
export async function analyzeTextPerfect(
  text: string, 
  triggers: string[], 
  apiKey: string
): Promise<PerfectMatch[]> {
  if (DEBUG_MODE) {
    console.log(`🚀 [DEBUG] Starting perfect text analysis for ${triggers.length} triggers`);
    console.log(`📝 [DEBUG] Text length: ${text.length} characters`);
    console.log(`📝 [DEBUG] Original text preview: "${text.substring(0, 100)}..."`);
  }

  const allMatches: PerfectMatch[] = [];

  // Analyse séquentielle pour chaque trigger
  for (let i = 0; i < triggers.length; i++) {
    const trigger = triggers[i];
    
    if (DEBUG_MODE) {
      console.log(`🔍 [DEBUG] Processing trigger ${i + 1}/${triggers.length}: ${trigger}`);
    }

    try {
      const matches = await analyzeTriggerPerfect(text, trigger, apiKey);
      allMatches.push(...matches);
      
      if (DEBUG_MODE) {
        console.log(`✅ [DEBUG] Completed ${trigger}: ${matches.length} matches found`);
      }
    } catch (error) {
      console.error(`❌ [DEBUG] Error analyzing ${trigger}:`, error);
    }
  }

  // Déduplication finale globale
  const finalMatches = deduplicateMatches(allMatches);

  if (DEBUG_MODE) {
    console.log(`🎯 [DEBUG] Total perfect matches found: ${finalMatches.length}`);
    console.log(`📊 [DEBUG] Final matches summary:`);
    finalMatches.forEach((match, index) => {
      console.log(`   ${index + 1}. [${match.start}-${match.end}] "${match.text}" (${match.trigger}) - Verified: ${match.verified}`);
    });
  }

  return finalMatches;
}
