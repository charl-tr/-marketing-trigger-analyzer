import { NextRequest, NextResponse } from 'next/server';

interface TriggerAnalysis {
  type: string;
  intensity: number;
  span: { start: number; end: number };
  excerpt: string;
}

interface AnalysisResponse {
  status: string;
  analysis: {
    triggers: TriggerAnalysis[];
    summary: {
      global_score: number;
      dominant_triggers: string[];
      missing_triggers: string[];
    };
  };
}

interface ProcessedResponse {
  highlighted_text: string;
  stats: {
    global_score: number;
    distribution: Array<{ trigger: string; percent: number }>;
    missing: string[];
  };
  raw_triggers: TriggerAnalysis[];
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API: Starting analysis request');
    const { text, options = {} } = await request.json();
    console.log('📝 API: Text length:', text?.length || 0);
    console.log('⚙️ API: Options:', options);

    // Input validation
    if (!text || typeof text !== 'string') {
      console.log('❌ API: Invalid text input');
      return NextResponse.json(
        { status: 'error', message: 'Please provide valid text to analyze.' },
        { status: 400 }
      );
    }

    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      console.log('❌ API: Empty text');
      return NextResponse.json(
        { status: 'error', message: 'Please enter some text to analyze.' },
        { status: 400 }
      );
    }

    if (trimmedText.length > 20000) {
      console.log('❌ API: Text too long:', trimmedText.length);
      return NextResponse.json(
        { status: 'error', message: 'Text must be under 20,000 characters.' },
        { status: 400 }
      );
    }

    console.log('✅ API: Input validation passed');
    console.log('🤖 API: Calling OpenAI...');

    // Call OpenAI API
    const analysisResult = await analyzeWithOpenAI(trimmedText, options);
    console.log('📊 API: OpenAI response received');
    
    // Process and format for frontend
    console.log('🔄 API: Processing results...');
    const processedResult = formatForFrontend(analysisResult, trimmedText);
    console.log('✅ API: Analysis completed successfully');

    return NextResponse.json(processedResult);

  } catch (error) {
    console.error('💥 API: Analysis error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Analysis service unavailable. Please try again later.' },
      { status: 500 }
    );
  }
}

async function analyzeWithOpenAI(text: string, options: any): Promise<AnalysisResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  console.log('🔑 OpenAI: API key present:', !!apiKey);
  
  if (!apiKey) {
    console.log('❌ OpenAI: No API key configured');
    throw new Error('OpenAI API key not configured');
  }

  // Diviser le texte en segments pour analyse précise
  const segments = splitTextIntoSegments(text);
  console.log('📝 Text segmented into:', segments.length, 'parts');
  
  // Analyser chaque segment individuellement
  const segmentAnalyses = await Promise.all(
    segments.map(async (segment, index) => {
      const segmentPrompt = `Analyze this specific text segment for psychological persuasion triggers. Be extremely precise and detect ALL triggers present in this exact segment.

SEGMENT ${index + 1}/${segments.length}:
"${segment.text}"

Return a JSON array of triggers found in this segment:
[
  {
    "type": "TriggerName",
    "intensity": 0.8,
    "span": { "start": ${segment.start}, "end": ${segment.end} },
    "excerpt": "exact text from segment",
    "reasoning": "why this is a trigger"
  }
]

Look for these trigger types with surgical precision:
- Urgency: time pressure, deadlines, "now", "immediately", "hurry"
- Scarcity: limited quantity, "only", "few left", "exclusive", "rare"
- Social Proof: testimonials, "thousands", "everyone", "people like you", "others"
- Authority: expertise, credentials, "expert", "proven", "research", "studies"
- Reciprocity: free value, gifts, "bonus", "complimentary", "help you"
- Fear: fear of missing out, consequences, "don't miss out", "danger", "risk"
- Greed: money, success, "more", "increase", "wealth", "profit"
- Curiosity Gap: "wonder", "discover", "secret", "reveal", "mystery"
- Exclusivity: "VIP", "members only", "elite", "private", "select"
- Storytelling: narratives, "imagine", "picture this", personal stories, "once"
- Contrast: "before vs after", "instead of", "unlike", "versus", "but"
- Call to Action: "click", "do", "take action", "start now", "begin"
- Loss Aversion: fear of losing something, "don't lose", "protect", "avoid"
- Commitment: "promise", "commit", "dedication", "pledge"
- Liking: similarity, compliments, "like you", "same as", "relatable"

Analyze ONLY this segment. Be extremely thorough and detect even subtle triggers.`;

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
                content: 'You are an expert in psychological persuasion analysis. Always return valid JSON arrays. Be extremely precise and thorough.'
              },
              {
                role: 'user',
                content: segmentPrompt
              }
            ],
            temperature: 0.2,
            max_tokens: 1000
          })
        });

        if (!response.ok) {
          console.log(`❌ Segment ${index + 1} analysis failed:`, response.status);
          return [];
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        try {
          const triggers = JSON.parse(content);
          console.log(`✅ Segment ${index + 1} analyzed:`, triggers.length, 'triggers found');
          return Array.isArray(triggers) ? triggers : [];
        } catch (parseError) {
          console.log(`❌ Segment ${index + 1} JSON parse error:`, parseError);
          return [];
        }
      } catch (error) {
        console.log(`❌ Segment ${index + 1} error:`, error);
        return [];
      }
    })
  );

  // Combiner tous les résultats
  const allTriggers = segmentAnalyses.flat();
  console.log('🎯 Total triggers found:', allTriggers.length);

  // Analyser le message macro
  const macroAnalysis = await analyzeMacroMessage(text, apiKey);
  
  return {
    status: 'success',
    analysis: {
      triggers: allTriggers,
      summary: {
        global_score: macroAnalysis.global_score,
        dominant_triggers: macroAnalysis.dominant_triggers,
        missing_triggers: macroAnalysis.missing_triggers,
        macro_message: macroAnalysis.macro_message
      }
    }
  };

}

function formatForFrontend(analysis: AnalysisResponse, originalText: string): ProcessedResponse {
  const { triggers, summary } = analysis.analysis;
  
  // Create highlighted text with HTML spans
  const highlightedText = createHighlightedText(originalText, triggers);
  
  // Calculate distribution percentages
  const distribution = calculateDistribution(triggers);
  
  return {
    status: 'success',
    analysis: {
      triggers,
      summary
    },
    highlighted_text: highlightedText,
    stats: {
      global_score: summary.global_score,
      distribution,
      missing: summary.missing_triggers
    },
    raw_triggers: triggers
  };
}

function createHighlightedText(text: string, triggers: TriggerAnalysis[]): string {
  // Sort triggers by start position
  const sortedTriggers = [...triggers].sort((a, b) => a.span.start - b.span.start);
  
  let result = '';
  let lastIndex = 0;
  
  for (const trigger of sortedTriggers) {
    // Add text before trigger
    result += escapeHtml(text.slice(lastIndex, trigger.span.start));
    
    // Add highlighted trigger text
    const triggerText = escapeHtml(text.slice(trigger.span.start, trigger.span.end));
    const className = `trigger-${trigger.type.toLowerCase().replace(/\s+/g, '-')}`;
    result += `<span class="${className}" data-trigger="${trigger.type}" data-intensity="${trigger.intensity}">${triggerText}</span>`;
    
    lastIndex = trigger.span.end;
  }
  
  // Add remaining text
  result += escapeHtml(text.slice(lastIndex));
  
  return result;
}

function calculateDistribution(triggers: TriggerAnalysis[]): Array<{ trigger: string; percent: number; count: number; avgIntensity: number }> {
  // Grouper les triggers par type
  const triggerGroups: { [key: string]: { count: number; totalIntensity: number; triggers: TriggerAnalysis[] } } = {};
  
  triggers.forEach(trigger => {
    if (!triggerGroups[trigger.type]) {
      triggerGroups[trigger.type] = { count: 0, totalIntensity: 0, triggers: [] };
    }
    triggerGroups[trigger.type].count++;
    triggerGroups[trigger.type].totalIntensity += trigger.intensity;
    triggerGroups[trigger.type].triggers.push(trigger);
  });
  
  const totalTriggers = triggers.length;
  
  if (totalTriggers === 0) {
    return [];
  }
  
  const distribution = Object.entries(triggerGroups).map(([type, data]) => ({
    trigger: type,
    percent: Math.round((data.count / totalTriggers) * 100),
    count: data.count,
    avgIntensity: Math.round((data.totalIntensity / data.count) * 100) / 100
  }));
  
  return distribution.sort((a, b) => b.percent - a.percent);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function splitTextIntoSegments(text: string): Array<{ text: string; start: number; end: number }> {
  // Diviser le texte en segments intelligents
  const segments = [];
  
  // Diviser par phrases (point, exclamation, interrogation)
  const sentences = text.split(/(?<=[.!?])\s+/);
  let currentIndex = 0;
  
  for (const sentence of sentences) {
    if (sentence.trim()) {
      const start = text.indexOf(sentence, currentIndex);
      const end = start + sentence.length;
      segments.push({
        text: sentence.trim(),
        start: start,
        end: end
      });
      currentIndex = end;
    }
  }
  
  // Si pas de phrases, diviser par paragraphes
  if (segments.length === 0) {
    const paragraphs = text.split(/\n\s*\n/);
    let currentIndex = 0;
    
    for (const paragraph of paragraphs) {
      if (paragraph.trim()) {
        const start = text.indexOf(paragraph, currentIndex);
        const end = start + paragraph.length;
        segments.push({
          text: paragraph.trim(),
          start: start,
          end: end
        });
        currentIndex = end;
      }
    }
  }
  
  // Si toujours rien, diviser en chunks de 200 caractères
  if (segments.length === 0) {
    const chunkSize = 200;
    for (let i = 0; i < text.length; i += chunkSize) {
      const chunk = text.slice(i, i + chunkSize);
      segments.push({
        text: chunk,
        start: i,
        end: i + chunk.length
      });
    }
  }
  
  return segments;
}

async function analyzeMacroMessage(text: string, apiKey: string): Promise<{
  global_score: number;
  dominant_triggers: string[];
  missing_triggers: string[];
  macro_message: string;
}> {
  const macroPrompt = `Analyze the overall macro message and persuasion strategy of this text. Provide a comprehensive analysis.

TEXT:
"${text}"

Return a JSON response:
{
  "global_score": 75,
  "dominant_triggers": ["Fear", "Authority", "Storytelling"],
  "missing_triggers": ["Urgency", "Scarcity"],
  "macro_message": "This text uses fear-based messaging combined with authority to persuade readers to take action against perceived threats."
}

Consider:
- What is the main persuasive strategy?
- Which triggers are most dominant throughout?
- What triggers are missing that could strengthen the message?
- What is the overall psychological approach?`;

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
            content: 'You are an expert in macro-level persuasion analysis. Always return valid JSON.'
          },
          {
            role: 'user',
            content: macroPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`Macro analysis failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch (parseError) {
      // Fallback
      return {
        global_score: 50,
        dominant_triggers: [],
        missing_triggers: ['Urgency', 'Scarcity', 'Social Proof'],
        macro_message: 'Analysis unavailable'
      };
    }
  } catch (error) {
    console.log('❌ Macro analysis error:', error);
    return {
      global_score: 50,
      dominant_triggers: [],
      missing_triggers: ['Urgency', 'Scarcity', 'Social Proof'],
      macro_message: 'Analysis unavailable'
    };
  }
}