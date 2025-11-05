import { getWorkingPrompt } from './workingPrompts';

interface WorkingSegment {
  text: string;
  comment: string;
}

export interface WorkingMatch {
  start: number;
  end: number;
  text: string;
  comment: string;
  trigger: string;
}

export async function callLLMWorking(
  trigger: string, 
  text: string, 
  apiKey: string
): Promise<WorkingSegment[]> {
  const prompt = getWorkingPrompt(trigger);
  const fullPrompt = `${prompt}\n${text}`;

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

    console.log(`📊 Raw OpenAI response for ${trigger}:`, content);

    // Parser le JSON
    let segments: WorkingSegment[] = [];
    try {
      let cleanContent = content.trim();
      
      // Supprimer les backticks
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      segments = JSON.parse(cleanContent);
    } catch (parseError) {
      console.warn(`⚠️ JSON parse error for ${trigger}, trying to extract JSON:`, parseError);
      
      // Essayer d'extraire le JSON
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

export function convertToWorkingMatches(
  segments: WorkingSegment[], 
  trigger: string, 
  originalText: string
): WorkingMatch[] {
  const matches: WorkingMatch[] = [];

  for (const segment of segments) {
    if (!segment.text || typeof segment.text !== 'string') {
      console.warn(`⚠️ Invalid segment for ${trigger}:`, segment);
      continue;
    }

    // Trouver les positions du segment
    let startIndex = 0;
    while (true) {
      const foundIndex = originalText.indexOf(segment.text, startIndex);
      if (foundIndex === -1) break;
      
      matches.push({
        start: foundIndex,
        end: foundIndex + segment.text.length,
        text: segment.text,
        comment: segment.comment || `Detected ${trigger}`,
        trigger
      });
      
      startIndex = foundIndex + 1;
    }
  }

  console.log(`✅ Converted ${segments.length} segments to ${matches.length} matches for ${trigger}`);
  return matches;
}

export async function analyzeTriggerWorking(
  text: string, 
  trigger: string, 
  apiKey: string
): Promise<WorkingMatch[]> {
  try {
    const segments = await callLLMWorking(trigger, text, apiKey);
    const matches = convertToWorkingMatches(segments, trigger, text);
    return matches;
  } catch (error) {
    console.error(`❌ Error analyzing trigger ${trigger}:`, error);
    return [];
  }
}

export async function analyzeTextWorking(
  text: string, 
  triggers: string[], 
  apiKey: string
): Promise<WorkingMatch[]> {
  console.log(`🚀 Starting working text analysis for ${triggers.length} triggers`);
  console.log(`📝 Text length: ${text.length} characters`);

  const allMatches: WorkingMatch[] = [];

  for (let i = 0; i < triggers.length; i++) {
    const trigger = triggers[i];
    console.log(`🔍 Processing trigger ${i + 1}/${triggers.length}: ${trigger}`);

    try {
      const matches = await analyzeTriggerWorking(text, trigger, apiKey);
      allMatches.push(...matches);
      
      console.log(`✅ Completed ${trigger}: ${matches.length} matches found`);
    } catch (error) {
      console.error(`❌ Error analyzing ${trigger}:`, error);
    }
  }

  console.log(`🎯 Total working matches found: ${allMatches.length}`);
  return allMatches;
}
