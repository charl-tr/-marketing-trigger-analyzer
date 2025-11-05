'use client';

import { useState } from 'react';
import NewDebugPanel from '@/components/NewDebugPanel';

const LONG_TEST_TEXT = `🚀 TRANSFORMEZ VOTRE VIE EN 30 JOURS ! 🚀

Cher(e) ami(e),

Imaginez-vous dans 30 jours... Vous vous réveillez chaque matin avec une énergie débordante, une confiance inébranlable, et cette sensation incroyable que tout est possible. Vous regardez dans le miroir et vous voyez enfin la personne que vous avez toujours rêvé d'être.

Mais voici la vérité brutale : pendant que vous lisez ces lignes, des milliers de personnes comme vous ont déjà pris la décision de transformer leur vie. Elles ne perdent pas de temps à hésiter - elles AGISSENT.

ACT NOW ! Cette opportunité exclusive ne sera disponible que pendant les 48 prochaines heures. Seulement 47 places restantes pour rejoindre notre programme révolutionnaire.

Pourquoi cette urgence ? Parce que notre méthode révolutionnaire, testée et approuvée par plus de 15,000 personnes dans 47 pays, ne peut être partagée qu'avec un nombre limité de participants. C'est la seule façon de garantir un accompagnement personnalisé de qualité.

VOICI CE QUE VOUS ALLEZ DÉCOUVRIR :

✅ Le secret que les 1% les plus riches utilisent pour créer leur fortune (et que personne ne vous a jamais révélé)

✅ Comment transformer vos peurs en votre plus grande force en moins de 7 jours

✅ La technique de visualisation qui a permis à nos clients de doubler leurs revenus en 90 jours

✅ Le système de 5 étapes pour éliminer définitivement vos blocages mentaux

✅ Comment créer des habitudes qui vous mènent automatiquement vers le succès

MAIS ATTENTION : Cette méthode ne fonctionne que si vous êtes prêt(e) à vous engager totalement. Pas de demi-mesures, pas d'excuses.

Nos clients témoignent : "J'ai gagné 15,000€ de plus le premier mois grâce à cette méthode" - Marie L.

"Enfin, je comprends pourquoi je n'arrivais pas à réussir avant" - Pierre M.

"Cette méthode a changé ma vie du tout au tout" - Sophie K.

VOUS AVEZ DEUX CHOIX :

1️⃣ Continuer à rêver en regardant les autres réussir
2️⃣ REJOINDRE les 15,000+ personnes qui ont déjà transformé leur vie

Le choix vous appartient. Mais souvenez-vous : chaque minute qui passe est une minute de perdue. Pendant que vous hésitez, d'autres agissent et récoltent les fruits de leur courage.

CLIQUEZ MAINTENANT sur le bouton ci-dessous et commencez votre transformation dès aujourd'hui. Votre future vous remerciera.

⚠️ OFFRE LIMITÉE : Seulement 47 places restantes
⏰ TEMPS LIMITÉ : 48 heures seulement
💰 GARANTIE : Résultats ou remboursement intégral

Ne laissez pas cette opportunité vous échapper. Votre vie ne sera plus jamais la même.

AGISSEZ MAINTENANT !

[BOUTON : COMMENCER MA TRANSFORMATION]

P.S. : Si vous lisez encore ces lignes, c'est que quelque chose en vous sait que c'est le moment. Ne l'ignorez pas.

P.P.S. : Les 47 dernières places partent très vite. Ne soyez pas celui qui regrettera de ne pas avoir agi.

© 2024 - Tous droits réservés - Confidentialité - Mentions légales`;

const TEST_TEXTS = [
  "Act now! Limited time offer. Only 5 spots left.",
  "Join thousands of satisfied customers. Trusted by experts.",
  "Don't miss out on this exclusive opportunity. Protect your future investment.",
  "Imagine waking up tomorrow with complete confidence. Picture this scenario in your mind.",
  "While others hesitate, you'll be taking action. People like you understand the value of seizing opportunities."
];

export default function TestNewPage() {
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [debugData, setDebugData] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [customText, setCustomText] = useState('');

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey);
      setIsConnected(true);
    }
  };

  const analyzeText = async (text: string) => {
    if (!isConnected) return;
    
    setIsAnalyzing(true);
    setResults(null);
    setDebugData(null);
    
    try {
      console.log('🔍 Analyzing text with new architecture:', text.substring(0, 50) + '...');
      
      const response = await fetch('/api/analyze-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text,
          apiKey 
        }),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setResults(data);
        setDebugData(data);
        console.log('✅ Analysis completed:', data);
      } else {
        console.error('❌ Analysis failed:', data.message);
      }
      
    } catch (error) {
      console.error('❌ Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeTestText = (text: string) => {
    setCustomText(text);
    analyzeText(text);
  };

  const analyzeCustomText = () => {
    if (customText.trim()) {
      analyzeText(customText);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{
          textAlign: 'center',
          color: '#063D61',
          fontFamily: 'Quintessential, serif',
          fontSize: '32px',
          marginBottom: '30px'
        }}>
          🚀 Test Nouvelle Architecture
        </h1>

        {/* API Key Section */}
        {!isConnected && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#063D61', marginBottom: '15px' }}>Clé API OpenAI</h3>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Entrez votre clé API OpenAI"
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                width: '300px',
                marginRight: '10px'
              }}
            />
            <button
              onClick={handleApiKeySubmit}
              style={{
                padding: '10px 20px',
                background: '#063D61',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Connecter
            </button>
          </div>
        )}

        {isConnected && (
          <>
            {/* Test Texts */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '30px'
            }}>
              <h3 style={{ color: '#063D61', marginBottom: '15px' }}>Textes de Test</h3>
              
              {/* Bouton Texte Long */}
              <div style={{ marginBottom: '20px' }}>
                <button
                  onClick={() => analyzeTestText(LONG_TEST_TEXT)}
                  disabled={isAnalyzing}
                  style={{
                    padding: '20px',
                    background: isAnalyzing ? '#f5f5f5' : '#ff6b6b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    width: '100%',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                  onMouseEnter={(e) => {
                    if (!isAnalyzing) {
                      e.currentTarget.style.background = '#ff5252';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isAnalyzing) {
                      e.currentTarget.style.background = '#ff6b6b';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  📄 Tester avec le Texte Long ({LONG_TEST_TEXT.length} caractères)
                </button>
              </div>

              {/* Textes Courts */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                {TEST_TEXTS.map((text, index) => (
                  <button
                    key={index}
                    onClick={() => analyzeTestText(text)}
                    disabled={isAnalyzing}
                    style={{
                      padding: '15px',
                      background: isAnalyzing ? '#f5f5f5' : '#f8f9fa',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isAnalyzing) {
                        e.currentTarget.style.background = '#e3f2fd';
                        e.currentTarget.style.borderColor = '#2196f3';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isAnalyzing) {
                        e.currentTarget.style.background = '#f8f9fa';
                        e.currentTarget.style.borderColor = '#ddd';
                      }
                    }}
                  >
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                      Test {index + 1}
                    </div>
                    <div style={{ fontSize: '14px', color: '#333' }}>
                      "{text.substring(0, 80)}..."
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Text */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '30px'
            }}>
              <h3 style={{ color: '#063D61', marginBottom: '15px' }}>Texte Personnalisé</h3>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Tapez votre propre texte pour tester la nouvelle architecture..."
                style={{
                  width: '100%',
                  height: '120px',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  marginBottom: '15px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
              <button
                onClick={analyzeCustomText}
                disabled={isAnalyzing || !customText.trim()}
                style={{
                  padding: '12px 24px',
                  background: isAnalyzing || !customText.trim() ? '#ccc' : '#063D61',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isAnalyzing || !customText.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                {isAnalyzing ? 'Analyse en cours...' : 'Analyser le texte personnalisé'}
              </button>
            </div>

            {/* Results */}
            {results && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '15px',
                padding: '20px',
                marginBottom: '30px'
              }}>
                <h3 style={{ color: '#063D61', marginBottom: '20px' }}>Résultats de l'Analyse</h3>
                
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#333', marginBottom: '10px' }}>Texte analysé :</h4>
                  <p style={{ 
                    background: '#f8f9fa', 
                    padding: '15px', 
                    borderRadius: '8px', 
                    fontStyle: 'italic',
                    color: '#666'
                  }}>
                    "{results.text}"
                  </p>
                </div>

                <div style={{ display: 'grid', gap: '15px' }}>
                  {results.results.map((result: any, index: number) => (
                    <div key={index} style={{
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '15px',
                      background: result.matches.length > 0 ? '#f0f8f0' : '#fff0f0'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h4 style={{ margin: 0, color: '#063D61', textTransform: 'capitalize' }}>
                          {result.trigger.replace('_', ' ')}
                        </h4>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          background: result.matches.length > 0 ? '#4CAF50' : '#f44336',
                          color: 'white',
                          fontSize: '12px'
                        }}>
                          {result.matches.length} matches
                        </span>
                      </div>
                      
                      {result.matches.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {result.matches.map((match: any, matchIndex: number) => (
                            <div key={matchIndex} style={{
                              background: '#e8f5e8',
                              padding: '10px',
                              borderRadius: '6px',
                              border: '1px solid #c8e6c9'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                <span style={{ fontSize: '12px', color: '#666' }}>Intensité</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <div style={{ width: '100px', background: '#ddd', borderRadius: '10px', height: '6px' }}>
                                    <div 
                                      style={{ 
                                        width: `${match.intensity}%`, 
                                        background: '#4CAF50', 
                                        height: '6px', 
                                        borderRadius: '10px' 
                                      }}
                                    ></div>
                                  </div>
                                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2e7d32' }}>
                                    {match.intensity}%
                                  </span>
                                </div>
                              </div>
                              <p style={{ margin: 0, fontSize: '14px', color: '#333', fontStyle: 'italic' }}>
                                "{match.text}"
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ color: '#f44336', fontSize: '14px', fontStyle: 'italic' }}>
                          Aucun passage détecté pour ce trigger
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Debug Toggle */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '15px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <button
                onClick={() => setShowDebug(!showDebug)}
                style={{
                  padding: '12px 24px',
                  background: showDebug ? '#ff6b6b' : '#4ecdc4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                {showDebug ? 'Masquer Debug Panel' : 'Afficher Debug Panel'}
              </button>
            </div>
          </>
        )}

        {/* Debug Panel */}
        <NewDebugPanel 
          data={debugData} 
          isVisible={showDebug} 
          onToggle={() => setShowDebug(!showDebug)} 
        />
      </div>
    </div>
  );
}
