import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();
    
    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Clé API requise' },
        { status: 400 }
      );
    }

    // Vérifier le format de la clé
    if (!apiKey.startsWith('sk-')) {
      return NextResponse.json(
        { valid: false, error: 'Format de clé API invalide' },
        { status: 400 }
      );
    }

    // Test simple de la clé API avec une requête minimale
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return NextResponse.json({
          valid: true,
          message: 'Clé API valide'
        });
      } else if (response.status === 401) {
        return NextResponse.json(
          { valid: false, error: 'Clé API invalide ou expirée' },
          { status: 401 }
        );
      } else if (response.status === 429) {
        return NextResponse.json(
          { valid: false, error: 'Limite de taux dépassée' },
          { status: 429 }
        );
      } else {
        return NextResponse.json(
          { valid: false, error: 'Erreur de validation de la clé API' },
          { status: response.status }
        );
      }
    } catch (error) {
      console.error('Erreur lors de la validation de la clé API:', error);
      return NextResponse.json(
        { valid: false, error: 'Erreur de connexion à OpenAI' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Erreur dans validate-key API:', error);
    return NextResponse.json(
      { valid: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
