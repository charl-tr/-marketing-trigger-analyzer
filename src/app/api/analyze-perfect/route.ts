import { NextRequest, NextResponse } from 'next/server';
import { analyzeTextPerfect } from '@/lib/analyzer/perfectAnalyzer';
import { mergeOverlappingMatches, convertMergedMatchesToHighlights } from '@/lib/analyzer/matchMerger';
import { PerfectMatch } from '@/lib/analyzer/perfectAnalyzer';
import { getTriggerById, Trigger } from '@/lib/triggers';

export const runtime = 'edge';

// Interface pour la réponse parfaite
interface PerfectAnalysisResponse {
  matches: PerfectMatch[];
  total_matches: number;
  triggers_analyzed: string[];
  text_length: number;
  method: string;
  verified_matches: number;
  duplicate_matches_removed: number;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [PERFECT] Starting perfect text analysis');
    
    const { text, triggers: triggerIds, apiKey } = await request.json();

    if (!text || typeof text !== 'string' || !triggerIds || !Array.isArray(triggerIds) || !apiKey) {
      console.error('[PERFECT] Invalid input', { text: !!text, triggers: !!triggerIds, apiKey: !!apiKey });
      return NextResponse.json({ error: 'Invalid input: text, triggers, and apiKey are required.' }, { status: 400 });
    }

    console.log(`📝 [PERFECT] Text length: ${text.length} | Triggers: ${triggerIds.join(', ')}`);
    console.log(`🔑 [PERFECT] API Key: ${apiKey ? apiKey.substring(0, 10) + '...' : 'NOT SET'}`);

    // Vérifier que les triggers existent
    const triggersToAnalyze: Trigger[] = triggerIds.map(id => getTriggerById(id)).filter(Boolean) as Trigger[];

    if (triggersToAnalyze.length === 0) {
      console.warn('[PERFECT] No valid triggers selected for analysis');
      return NextResponse.json({
        matches: [],
        total_matches: 0,
        triggers_analyzed: [],
        text_length: text.length,
        method: "perfect_text_search",
        verified_matches: 0,
        duplicate_matches_removed: 0
      } as PerfectAnalysisResponse);
    }

    // Analyser avec intégrité parfaite
    const allMatches: PerfectMatch[] = await analyzeTextPerfect(text, triggerIds, apiKey);
    
    // Convertir directement en format frontend SANS merge
    const frontendMatches = allMatches.map(match => ({
      type: match.trigger,
      intensity: match.intensity || 50, // Utiliser l'intensité du LLM ou 50% par défaut
      span: { start: match.start, end: match.end },
      excerpt: match.text,
      comment: match.comment || 'Trigger détecté',
      reasoning: match.comment || 'No reasoning',
      triggers: [match.trigger],
      verified: match.verified || false,
      isOverlapping: false
    }));
    
    // Compter les matches vérifiés
    const verifiedMatches = allMatches.filter(m => m.verified).length;
    
    console.log(`✅ [PERFECT] Perfect analysis complete - ${allMatches.length} raw matches found`);
    console.log(`🔍 [PERFECT] Individual analysis (no merge) - ${allMatches.length} segments`);
    console.log(`🔍 [PERFECT] Verified matches: ${verifiedMatches}/${allMatches.length}`);

    const response = {
      matches: frontendMatches,
      total_matches: allMatches.length,
      triggers_analyzed: triggersToAnalyze.map(t => t.id),
      text_length: text.length,
      method: "perfect_text_search_individual",
      verified_matches: verifiedMatches,
      duplicate_matches_removed: 0
    };

    console.log(`🎉 [PERFECT] Analysis completed successfully`, { 
      totalMatches: response.total_matches, 
      verifiedMatches: response.verified_matches,
      method: response.method 
    });

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('[PERFECT] Analysis failed', { error: error.message, stack: error.stack });
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
