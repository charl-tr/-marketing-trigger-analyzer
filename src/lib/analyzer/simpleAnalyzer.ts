import { getSimpleTriggerPrompt } from './simplePrompts';

// Interface pour les segments textuels retournés par le LLM
interface SimpleSegment {
  text: string;
  comment: string;
}

// Interface pour les matches avec positions trouvées
export interface SimpleMatch {
  start: number;
  end: number;
  text: string;
  comment: string;
  trigger: string;
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
 * Appelle le LLM avec le prompt simple et efficace
 */
export async function callLLMForSimpleText(
  trigger: string, 
  text: string, 
  apiKey: string
): Promise<SimpleSegment[]> {
  const prompt = getSimpleTriggerPrompt(trigger);
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
            content: 'Tu es un expert en marketing. Tu réponds UNIQUEMENT avec du JSON valide. Format: [{"text": "passage exact", "comment": "explication"}]'
          },
          {
            role: 'user',
            content: fullPrompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1500
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
    let segments: SimpleSegment[] = [];
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
export function convertSegmentsToSimpleMatches(
  segments: SimpleSegment[], 
  trigger: string, 
  originalText: string
): SimpleMatch[] {
  const matches: SimpleMatch[] = [];

  for (const segment of segments) {
    if (!segment.text || typeof segment.text !== 'string') {
      console.warn(`⚠️ Invalid segment for ${trigger}:`, segment);
      continue;
    }

    // Trouver les positions du segment dans le texte original
    const positions = findAllTextPositions(originalText, segment.text);
    
    if (positions.length === 0) {
      console.warn(`⚠️ Could not find position for segment: "${segment.text}"`);
      continue;
    }

    // Créer un match pour chaque position trouvée
    for (const position of positions) {
      const match: SimpleMatch = {
        start: position.start,
        end: position.end,
        text: segment.text,
        comment: segment.comment || `Detected ${trigger}`,
        trigger
      };

      matches.push(match);
    }
  }

  console.log(`✅ Converted ${segments.length} segments to ${matches.length} matches for ${trigger}`);
  return matches;
}

/**
 * Analyse un texte pour un trigger spécifique avec la logique simple
 */
export async function analyzeTriggerSimple(
  text: string, 
  trigger: string, 
  apiKey: string
): Promise<SimpleMatch[]> {
  try {
    // Appel au LLM pour obtenir les segments textuels
    const segments = await callLLMForSimpleText(trigger, text, apiKey);
    
    // Convertir les segments en matches avec positions
    const matches = convertSegmentsToSimpleMatches(segments, trigger, text);
    
    return matches;
  } catch (error) {
    console.error(`❌ Error analyzing trigger ${trigger}:`, error);
    return [];
  }
}

/**
 * Analyse un texte pour plusieurs triggers avec la logique simple
 */
export async function analyzeTextSimple(
  text: string, 
  triggers: string[], 
  apiKey: string
): Promise<SimpleMatch[]> {
  console.log(`🚀 Starting simple text analysis for ${triggers.length} triggers`);
  console.log(`📝 Text length: ${text.length} characters`);

  const allMatches: SimpleMatch[] = [];

  // Analyse séquentielle pour chaque trigger
  for (let i = 0; i < triggers.length; i++) {
    const trigger = triggers[i];
    console.log(`🔍 Processing trigger ${i + 1}/${triggers.length}: ${trigger}`);

    try {
      const matches = await analyzeTriggerSimple(text, trigger, apiKey);
      allMatches.push(...matches);
      
      console.log(`✅ Completed ${trigger}: ${matches.length} matches found`);
    } catch (error) {
      console.error(`❌ Error analyzing ${trigger}:`, error);
      // Continuer avec les autres triggers même si un échoue
    }
  }

  console.log(`🎯 Total simple matches found: ${allMatches.length}`);
  return allMatches;
}
