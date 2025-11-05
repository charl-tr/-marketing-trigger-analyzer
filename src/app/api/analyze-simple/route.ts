import { NextRequest, NextResponse } from 'next/server';
import { analyzeTextSimple } from '@/lib/analyzer/simpleAnalyzer';
import { SimpleMatch } from '@/lib/analyzer/simpleAnalyzer';
import { getTriggerById, Trigger } from '@/lib/triggers';

export const runtime = 'edge';

// Interface pour la réponse de l'API
interface SimpleAnalysisResponse {
  matches: SimpleMatch[];
  total_matches: number;
  triggers_analyzed: string[];
  text_length: number;
  method: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API: Starting simple text analysis');
    
    const { text, triggers: triggerIds, apiKey } = await request.json();

    if (!text || typeof text !== 'string' || !triggerIds || !Array.isArray(triggerIds) || !apiKey) {
      console.error('API: Invalid input', { text: !!text, triggers: !!triggerIds, apiKey: !!apiKey });
      return NextResponse.json({ error: 'Invalid input: text, triggers, and apiKey are required.' }, { status: 400 });
    }

    console.log(`📝 API: Text length: ${text.length} | Triggers: ${triggerIds.join(', ')}`);

    // Vérifier que les triggers existent
    const triggersToAnalyze: Trigger[] = triggerIds.map(id => getTriggerById(id)).filter(Boolean) as Trigger[];

    if (triggersToAnalyze.length === 0) {
      console.warn('API: No valid triggers selected for analysis');
      return NextResponse.json({
        matches: [],
        total_matches: 0,
        triggers_analyzed: [],
        text_length: text.length,
        method: "simple_text_search"
      } as SimpleAnalysisResponse);
    }

    // Analyser le texte avec la logique simple
    const allMatches: SimpleMatch[] = await analyzeTextSimple(text, triggerIds, apiKey);
    
    console.log(`✅ API: Simple analysis complete - ${allMatches.length} matches found`);

    const response: SimpleAnalysisResponse = {
      matches: allMatches,
      total_matches: allMatches.length,
      triggers_analyzed: triggersToAnalyze.map(t => t.id),
      text_length: text.length,
      method: "simple_text_search"
    };

    console.log(`🎉 API: Analysis completed successfully`, { totalMatches: response.total_matches, method: response.method });
    return NextResponse.json(response);

  } catch (error: any) {
    console.error('API: Analysis failed', { error: error.message, stack: error.stack });
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
