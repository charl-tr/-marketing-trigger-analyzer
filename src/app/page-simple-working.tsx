'use client';

import React, { useState, useEffect } from 'react';

// Couleurs centralisées pour les triggers
const TRIGGER_COLORS = {
  'urgency': '#FF6B6B',
  'scarcity': '#4ECDC4',
  'social_proof': '#45B7D1',
  'authority': '#96CEB4',
  'fear': '#FF9FF3',
  'exclusivity': '#00D2D3',
  'storytelling': '#FF9F43',
  'contrast': '#C44569',
  'call_to_action': '#2ED573',
  'loss_aversion': '#FF3838'
};

// Fonction pour obtenir le nom d'affichage d'un trigger
const getTriggerDisplayName = (triggerType: string) => {
  return triggerType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function SimpleWorkingPage() {
  const [text, setText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysis, setAnalysis] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setShowResults(false);
    setAnalysis([]);
    setError(null);

    try {
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
        const allTriggers = [];
        
        data.results.forEach((result: any) => {
          result.matches.forEach((match: any) => {
            allTriggers.push({
              type: result.trigger,
              intensity: match.intensity / 100,
              span: { 
                start: match.start, 
                end: match.end 
              },
              excerpt: text.substring(match.start, match.end),
              reasoning: match.reason || `Intensity: ${match.intensity}%`
            });
          });
        });
        
        setAnalysis(allTriggers);
        setShowResults(true);
      } else {
        setError('Erreur d\'analyse. Vérifiez votre clé API et réessayez.');
      }

    } catch (error) {
      console.error('Analysis error:', error);
      setError('Erreur de connexion. Vérifiez votre clé API et réessayez.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Fonction pour rendre le texte avec les highlights
  const renderTextWithHighlights = () => {
    if (!showResults || analysis.length === 0) {
      return text;
    }

    const segments = [];
    let lastIndex = 0;

    // Trier les triggers par position de début
    const sortedTriggers = [...analysis].sort((a, b) => a.span.start - b.span.start);

    sortedTriggers.forEach((trigger) => {
      const { start, end } = trigger.span;
      
      // Ajouter le texte avant le trigger
      if (start > lastIndex) {
        segments.push({
          text: text.substring(lastIndex, start),
          type: 'normal'
        });
      }
      
      // Ajouter le trigger avec son style
      segments.push({
        text: text.substring(start, end),
        type: trigger.type,
        intensity: trigger.intensity,
        reasoning: trigger.reasoning
      });
      
      lastIndex = Math.max(lastIndex, end);
    });

    // Ajouter le texte restant
    if (lastIndex < text.length) {
      segments.push({
        text: text.substring(lastIndex),
        type: 'normal'
      });
    }

    return segments.map((segment, index) => {
      if (segment.type === 'normal') {
        return segment.text;
      }

      const color = TRIGGER_COLORS[segment.type as keyof typeof TRIGGER_COLORS] || '#FF6B6B';
      const opacity = 0.3 + (segment.intensity * 0.7);

      return (
        <span
          key={index}
          style={{
            backgroundColor: color,
            color: '#000',
            padding: '2px 4px',
            borderRadius: '4px',
            fontWeight: 'bold',
            opacity: opacity,
            border: `2px solid ${color}`,
            boxShadow: `0 0 8px ${color}40`,
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          title={`${getTriggerDisplayName(segment.type)} (${Math.round(segment.intensity * 100)}%) - ${segment.reasoning}`}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = `0 0 15px ${color}80`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = `0 0 8px ${color}40`;
          }}
        >
          {segment.text}
        </span>
      );
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        gap: '20px'
      }}>
        {/* Sidebar avec les triggers */}
        <div style={{
          width: '250px',
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '15px',
          padding: '20px',
          height: 'fit-content'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>🎯 Triggers</h3>
          
          {showResults && analysis.length > 0 ? (
            <div>
              {Object.entries(TRIGGER_COLORS).map(([triggerType, color]) => {
                const triggers = analysis.filter(t => t.type === triggerType);
                const totalIntensity = triggers.reduce((sum, t) => sum + t.intensity, 0);
                const percentage = Math.round((totalIntensity / analysis.length) * 100);
                
                return (
                  <div key={triggerType} style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '10px',
                    fontSize: '14px'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: color,
                      borderRadius: '2px',
                      marginRight: '8px'
                    }} />
                    <span style={{ color: '#333' }}>
                      {getTriggerDisplayName(triggerType)} ({triggers.length} • {percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: '#666', fontSize: '14px' }}>
              Analysez du texte pour voir les triggers détectés
            </p>
          )}
        </div>

        {/* Zone principale */}
        <div style={{
          flex: 1,
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '15px',
          padding: '30px'
        }}>
          <h1 style={{ margin: '0 0 30px 0', color: '#333' }}>
            🔍 Marketing Trigger Analyzer
          </h1>

          {/* Zone de texte */}
          <div style={{
            background: '#f8f9fa',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '20px',
            minHeight: '400px',
            border: '2px solid #e9ecef'
          }}>
            {showResults ? (
              <div style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#333',
                whiteSpace: 'pre-wrap'
              }}>
                {renderTextWithHighlights()}
              </div>
            ) : (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Collez votre texte ici pour analyser les triggers marketing..."
                style={{
                  width: '100%',
                  height: '350px',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: '#333',
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            )}
          </div>

          {/* Boutons */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Clé API OpenAI"
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px',
                flex: 1
              }}
            />
            
            {!showResults ? (
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !text.trim() || !apiKey.trim()}
                style={{
                  padding: '12px 24px',
                  background: isAnalyzing ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                  transition: 'background 0.3s'
                }}
              >
                {isAnalyzing ? 'Analyse en cours...' : '🚀 Analyser'}
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowResults(false);
                  setAnalysis([]);
                }}
                style={{
                  padding: '12px 24px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                ✕ Nouvelle analyse
              </button>
            )}
          </div>

          {error && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: '#f8d7da',
              color: '#721c24',
              borderRadius: '5px',
              border: '1px solid #f5c6cb'
            }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

