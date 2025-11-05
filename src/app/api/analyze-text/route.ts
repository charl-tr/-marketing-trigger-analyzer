import { NextRequest, NextResponse } from 'next/server';
import { triggers } from '@/lib/triggers';
import { analyzeTrigger, TriggerResult } from '@/lib/analyzeTrigger';

export interface AnalysisResponse {
  text: string;
  results: TriggerResult[];
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API: Starting text analysis with new architecture');
    const { text, apiKey } = await request.json();
    console.log('📝 API: Text length:', text?.length, 'characters');

    // Input validation
    if (!text || typeof text !== 'string') {
      console.log('❌ API: Invalid text input');
      return NextResponse.json(
        { status: 'error', message: 'Please provide valid text.' },
        { status: 400 }
      );
    }

    if (!apiKey) {
      console.log('❌ API: No API key provided');
      return NextResponse.json(
        { status: 'error', message: 'API key required.' },
        { status: 400 }
      );
    }

    console.log('✅ API: Input validation passed');
    
    // 🚀 ANALYSE SÉQUENTIELLE pour permettre le chargement progressif
    console.log('🚀 API: Starting sequential trigger analysis...');
    
    const triggerResults = [];
    
    for (let i = 0; i < triggers.length; i++) {
      const trigger = triggers[i];
      console.log(`🔍 Processing trigger ${i + 1}/${triggers.length}: ${trigger.name}`);
      
      try {
        const result = await analyzeTrigger(text, trigger, apiKey);
        triggerResults.push(result);
        
        console.log(`✅ Completed ${trigger.name}: ${result.matches.length} matches found`);
      } catch (error) {
        console.error(`❌ Error analyzing ${trigger.name}:`, error);
        triggerResults.push({
          trigger: trigger.id,
          matches: []
        });
      }
    }

    // Construire la réponse
    const analysisResponse: AnalysisResponse = {
      text,
      results: triggerResults
    };

    console.log('🎯 API: Analysis completed successfully');
    
    // Log des résultats pour debug
    triggerResults.forEach(result => {
      console.log(`📈 ${result.trigger}: ${result.matches.length} matches found`);
    });

    return NextResponse.json({
      status: 'success',
      ...analysisResponse
    });

  } catch (error) {
    console.error('💥 API: Text analysis error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Text analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}
