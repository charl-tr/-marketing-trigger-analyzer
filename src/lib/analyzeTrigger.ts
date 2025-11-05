import { triggers, Trigger } from "./triggers";
import { validatePositions, extractTextSegment } from "./textMapping";

export interface TriggerMatch {
  start: number;
  end: number;
  intensity: number;
  reason: string;
  text?: string;
  error?: string;
}

export interface TriggerResult {
  trigger: string;
  matches: TriggerMatch[];
}

export async function analyzeTrigger(text: string, trigger: Trigger, apiKey: string): Promise<TriggerResult> {
  console.log(`🔍 Analyzing trigger: ${trigger.name}`);
  
  const prompt = `
You are a marketing trigger analyzer. You must respond with valid JSON only.

Text: """${text}"""
Trigger: ${trigger.name}
Description: ${trigger.description}

Task:
- Identify ALL passages in the text that illustrate this specific trigger.
- Return EXACT start and end character positions relative to the input text.
- Use inclusive start index and exclusive end index (JavaScript substring standard).
- For each match, include: { "start": X, "end": Y, "intensity": 0-100, "reason": "..." }
- If the trigger does not appear, return [].
- Never invent passages that don't exist in the input text.
- Be precise: only include passages that genuinely use this specific trigger.
- Count characters carefully: spaces, punctuation, and newlines all count.
- Each match should be a complete phrase or sentence that demonstrates the trigger.

IMPORTANT: 
- Respond with valid JSON array only. No other text.
- Positions must be exact character counts from the beginning of the text.
- Example: For text "Hello world", "Hello" would be start: 0, end: 5

Example format:
[
  { "start": 0, "end": 15, "intensity": 85, "reason": "Creates time pressure" },
  { "start": 50, "end": 70, "intensity": 70, "reason": "Emphasizes urgency" }
]
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ OpenAI API error ${response.status}:`, errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log(`📊 Raw OpenAI response for ${trigger.name}:`, data.choices[0].message.content);
    
    const content = data.choices[0].message.content || "[]";
    let matches;
    
    try {
      // Essayer de parser directement
      matches = JSON.parse(content);
    } catch (parseError) {
      console.warn(`⚠️ JSON parse error for ${trigger.name}, trying to extract JSON:`, parseError);
      // Essayer d'extraire le JSON de la réponse
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        matches = JSON.parse(jsonMatch[0]);
      } else {
        console.error(`❌ No valid JSON found in response for ${trigger.name}`);
        matches = [];
      }
    }
    console.log(`📊 Raw matches for ${trigger.name}:`, matches);

    // ✅ Validation robuste des positions avec le nouveau système
    const validatedMatches: TriggerMatch[] = [];
    
    for (const match of matches) {
      // Vérifier que les indexes sont valides
      if (typeof match.start !== 'number' || typeof match.end !== 'number') {
        console.warn(`⚠️ Invalid indexes for ${trigger.name}:`, match);
        continue;
      }

      // Utiliser le système robuste de validation des positions
      const validation = validatePositions(match.start, match.end, text.length);
      
      if (!validation.valid) {
        console.warn(`⚠️ Invalid range for ${trigger.name}: start=${match.start}, end=${match.end}`);
        continue;
      }

      // Extraire le texte réel avec validation
      const snippet = extractTextSegment(text, validation.start, validation.end);
      
      if (!snippet || snippet.length === 0) {
        console.warn(`⚠️ Empty snippet for ${trigger.name} at ${validation.start}-${validation.end}`);
        continue;
      }

      // Vérifier que l'intensité est valide
      const intensity = Math.max(0, Math.min(100, match.intensity || 0));

      validatedMatches.push({
        start: validation.start,
        end: validation.end,
        intensity,
        reason: match.reason || `Detected ${trigger.name}`,
        text: snippet
      });
    }

    console.log(`✅ Validated ${validatedMatches.length} matches for ${trigger.name}`);
    
    return { 
      trigger: trigger.id, 
      matches: validatedMatches 
    };

  } catch (error) {
    console.error(`❌ Error analyzing ${trigger.name}:`, error);
    return { 
      trigger: trigger.id, 
      matches: [] 
    };
  }
}