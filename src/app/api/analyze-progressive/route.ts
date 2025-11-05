import { NextRequest, NextResponse } from 'next/server';
import { triggers } from '@/lib/triggers';
import { analyzeTrigger } from '@/lib/analyzeTrigger';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API: Starting progressive text analysis');
    const { text, apiKey, selectedTriggers } = await request.json();
    
    if (!text || !apiKey) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Text and API key are required' 
      }, { status: 400 });
    }

    console.log(`📝 API: Text length: ${text.length} characters`);
    
    // Utiliser les triggers sélectionnés ou tous les triggers par défaut
    const triggersToAnalyze = selectedTriggers && selectedTriggers.length > 0 
      ? selectedTriggers 
      : triggers;
    
    console.log(`🎯 API: Using ${triggersToAnalyze.length} triggers:`, triggersToAnalyze.map(t => t.name || t.id));

    // Créer un stream pour les Server-Sent Events
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (data: any) => {
          const event = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(event));
        };

        try {
          // Envoyer l'événement de début
          sendEvent({
            type: 'start',
            totalTriggers: triggersToAnalyze.length,
            text: text,
            selectedTriggers: triggersToAnalyze.map(t => t.name || t.id)
          });

          const allResults = [];
          
          // Analyser chaque trigger séquentiellement
          for (let i = 0; i < triggersToAnalyze.length; i++) {
            const trigger = triggersToAnalyze[i];
            
            // Envoyer l'événement de progression
            sendEvent({
              type: 'progress',
              currentTrigger: trigger.name || trigger.id,
              currentIndex: i,
              totalTriggers: triggersToAnalyze.length,
              progress: Math.round((i / triggersToAnalyze.length) * 100)
            });

            try {
              const result = await analyzeTrigger(text, trigger, apiKey);
              allResults.push(result);
              
              // Envoyer l'événement de résultat pour ce trigger
              sendEvent({
                type: 'triggerComplete',
                trigger: trigger.name || trigger.id,
                matches: result.matches,
                triggerIndex: i
              });
              
            } catch (error) {
              console.error(`❌ Error analyzing ${trigger.name || trigger.id}:`, error);
              allResults.push({
                trigger: trigger.id,
                matches: []
              });
              
              sendEvent({
                type: 'triggerError',
                trigger: trigger.name || trigger.id,
                error: error.message,
                triggerIndex: i
              });
            }
          }

          // Envoyer l'événement de fin
          sendEvent({
            type: 'complete',
            results: allResults,
            totalMatches: allResults.reduce((sum, result) => sum + result.matches.length, 0)
          });

        } catch (error) {
          console.error('💥 Progressive analysis error:', error);
          sendEvent({
            type: 'error',
            message: error.message
          });
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('💥 API Error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
