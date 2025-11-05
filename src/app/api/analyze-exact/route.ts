import { NextRequest, NextResponse } from 'next/server';
import { analyzeTextExact } from '@/lib/analyzer/exactTextAnalyzer';
import { optimizeMatches } from '@/lib/analyzer/merger';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API: Starting exact text analysis');
    
    const { text, triggers, apiKey } = await request.json();
    
    // Validation des paramètres
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Text is required and must be a non-empty string',
        details: 'Please provide valid text to analyze'
      }, { status: 400 });
    }

    if (!triggers || !Array.isArray(triggers) || triggers.length === 0) {
      return NextResponse.json({ 
        error: 'Triggers are required and must be a non-empty array',
        details: 'Please provide at least one trigger to analyze'
      }, { status: 400 });
    }

    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json({ 
        error: 'API key is required',
        details: 'Please provide a valid OpenAI API key'
      }, { status: 400 });
    }

    console.log(`📝 API: Text length: ${text.length} characters`);
    console.log(`🎯 API: Analyzing triggers:`, triggers);

    // Analyse du texte avec recherche exacte
    const exactMatches = await analyzeTextExact(text, triggers, apiKey);
    
    // Optimisation des matches (fusion des chevauchements)
    const optimizedMatches = optimizeMatches(exactMatches, text);
    
    // Conversion vers le format de réponse
    const responseMatches = optimizedMatches.map(match => ({
      start: match.start,
      end: match.end,
      text: match.text,
      trigger: match.primaryTrigger,
      triggers: match.triggers,
      intensity: match.averageIntensity,
      comment: match.comments.join(' | '), // Fusionner les commentaires
      isOverlapping: match.triggers.length > 1
    }));

    const response = {
      matches: responseMatches,
      total_matches: responseMatches.length,
      triggers_analyzed: triggers,
      text_length: text.length,
      overlapping_matches: responseMatches.filter(m => m.isOverlapping).length,
      exact_matches_found: exactMatches.length,
      method: 'exact_text_search'
    };

    console.log(`✅ API: Exact analysis complete - ${responseMatches.length} matches found`);
    console.log(`🔗 API: ${response.overlapping_matches} overlapping matches merged`);
    console.log(`📊 API: ${exactMatches.length} exact matches before optimization`);

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('💥 API Error:', error);
    
    return NextResponse.json({ 
      error: 'Analysis failed',
      details: error.message || 'Unknown error occurred during analysis'
    }, { status: 500 });
  }
}
