import { getExactTextPrompt } from './exactTextPrompts';

// Interface pour les segments textuels retournés par le LLM
interface TextSegment {
  text: string;
  comment: string;
  intensity: number;
}

// Interface pour les matches avec positions trouvées
export interface ExactTextMatch {
  start: number;
  end: number;
  text: string;
  comment: string;
  trigger: string;
  intensity: number;
}

/**
 * Trouve toutes les positions d'un segment de texte dans le texte original
 */
function findAllTextPositions(originalText: string, searchText: string): Array<{start: number, end: number}> {
  const positions: Array<{start: number, end: number}> = [];
  let startIndex = 0;
  
  while (true) {
    const foundIndex = originalText.indexOf(searchText, startIndex);
    if (foundIndex === -1) break;
    
    positions.push({
      start: foundIndex,
      end: foundIndex + searchText.length
    });
    
    startIndex = foundIndex + 1;
  }
  
  return positions;
}

/**
 * Trouve la position d'un segment de texte avec recherche flexible
 */
function findTextPosition(originalText: string, searchText: string): Array<{start: number, end: number}> {
  // 1. Recherche exacte d'abord
  let exactPositions = findAllTextPositions(originalText, searchText);
  
  if (exactPositions.length > 0) {
    console.log(`✅ Exact match found for: "${searchText}"`);
    return exactPositions;
  }
  
  // 2. Recherche avec normalisation des espaces
  const normalizedSearch = searchText.replace(/\s+/g, ' ').trim();
  const normalizedOriginal = originalText.replace(/\s+/g, ' ');
  
  exactPositions = findAllTextPositions(normalizedOriginal, normalizedSearch);
  if (exactPositions.length > 0) {
    console.log(`✅ Normalized match found for: "${searchText}"`);
    return exactPositions;
  }
  
  // 3. Recherche avec regex flexible (espaces optionnels)
  const escapedText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const flexiblePattern = escapedText.replace(/\s+/g, '\\s+');
  const regex = new RegExp(flexiblePattern, 'gi');
  
  const matches = [...originalText.matchAll(regex)];
  if (matches.length > 0) {
    console.log(`✅ Flexible regex match found for: "${searchText}"`);
    return matches.map(match => ({
      start: match.index!,
      end: match.index! + match[0].length
    }));
  }
  
  console.warn(`❌ No match found for: "${searchText}"`);
  return [];
}

/**
 * Appelle le LLM pour analyser un trigger et retourner des segments textuels
 */
export async function callLLMForExactText(
  trigger: string, 
  text: string, 
  apiKey: string
): Promise<TextSegment[]> {
  const prompt = getExactTextPrompt(trigger);
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
            content: 'Tu es un expert en analyse de triggers marketing. Tu dois répondre UNIQUEMENT avec du JSON valide. Ne mets JAMAIS de texte avant ou après le JSON. Format: [{"text": "passage exact", "comment": "explication", "intensity": 0.8}]'
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
    let segments: TextSegment[] = [];
    try {
      // Nettoyer le contenu des backticks et markdown
      let cleanContent = content.trim();
      
      // Supprimer les backticks markdown
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Essayer de parser directement
      segments = JSON.parse(cleanContent);
    } catch (parseError) {
      console.warn(`⚠️ JSON parse error for ${trigger}, trying to extract JSON:`, parseError);
      console.warn(`⚠️ Raw content:`, content);
      
      // Essayer d'extraire le JSON de la réponse avec regex plus robuste
      const jsonMatch = content.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        try {
          segments = JSON.parse(jsonMatch[0]);
        } catch (secondError) {
          console.error(`❌ Could not parse extracted JSON for ${trigger}:`, secondError);
          return [];
        }
      } else {
        console.error(`❌ Could not extract JSON from response for ${trigger}`);
        return [];
      }
    }

    console.log(`📊 Raw segments for ${trigger}:`, segments);
    return segments;

  } catch (error) {
    console.error(`❌ Error calling LLM for ${trigger}:`, error);
    throw error;
  }
}

/**
 * Convertit les segments textuels en matches avec positions
 */
export function convertSegmentsToMatches(
  segments: TextSegment[], 
  trigger: string, 
  originalText: string
): ExactTextMatch[] {
  const matches: ExactTextMatch[] = [];

  for (const segment of segments) {
    if (!segment.text || typeof segment.text !== 'string') {
      console.warn(`⚠️ Invalid segment for ${trigger}:`, segment);
      continue;
    }

    // Trouver les positions du segment dans le texte original
    const positions = findTextPosition(originalText, segment.text);
    
    if (positions.length === 0) {
      console.warn(`⚠️ Could not find position for segment: "${segment.text}"`);
      continue;
    }

    // Créer un match pour chaque position trouvée
    for (const position of positions) {
      const match: ExactTextMatch = {
        start: position.start,
        end: position.end,
        text: segment.text,
        comment: segment.comment || `Detected ${trigger}`,
        trigger,
        intensity: Math.max(0, Math.min(1, segment.intensity || 0))
      };

      matches.push(match);
    }
  }

  console.log(`✅ Converted ${segments.length} segments to ${matches.length} matches for ${trigger}`);
  return matches;
}

/**
 * Analyse un texte pour un trigger spécifique avec recherche de texte exact
 */
export async function analyzeTriggerExact(
  text: string, 
  trigger: string, 
  apiKey: string
): Promise<ExactTextMatch[]> {
  try {
    // Appel au LLM pour obtenir les segments textuels
    const segments = await callLLMForExactText(trigger, text, apiKey);
    
    // Convertir les segments en matches avec positions
    const matches = convertSegmentsToMatches(segments, trigger, text);
    
    return matches;
  } catch (error) {
    console.error(`❌ Error analyzing trigger ${trigger}:`, error);
    return [];
  }
}

/**
 * Analyse un texte pour plusieurs triggers avec recherche de texte exact
 */
export async function analyzeTextExact(
  text: string, 
  triggers: string[], 
  apiKey: string
): Promise<ExactTextMatch[]> {
  console.log(`🚀 Starting exact text analysis for ${triggers.length} triggers`);
  console.log(`📝 Text length: ${text.length} characters`);

  const allMatches: ExactTextMatch[] = [];

  // Analyse séquentielle pour chaque trigger
  for (let i = 0; i < triggers.length; i++) {
    const trigger = triggers[i];
    console.log(`🔍 Processing trigger ${i + 1}/${triggers.length}: ${trigger}`);

    try {
      const matches = await analyzeTriggerExact(text, trigger, apiKey);
      allMatches.push(...matches);
      
      console.log(`✅ Completed ${trigger}: ${matches.length} matches found`);
    } catch (error) {
      console.error(`❌ Error analyzing ${trigger}:`, error);
      // Continuer avec les autres triggers même si un échoue
    }
  }

  console.log(`🎯 Total exact matches found: ${allMatches.length}`);
  return allMatches;
}
