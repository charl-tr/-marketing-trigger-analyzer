'use client';
import React from 'react';

// Interface pour les highlights parfaits
interface PerfectHighlight {
  type: string;
  intensity: number;
  span: { start: number; end: number };
  excerpt: string;
  reasoning: string;
  triggers: string[];
  verified?: boolean;
}

interface PerfectTextRendererProps {
  text: string;
  highlights: PerfectHighlight[];
}

// Couleurs distinctes pour chaque trigger
const PERFECT_TRIGGER_COLORS = {
  'urgency': '#FF6B6B', 
  'scarcity': '#4ECDC4', 
  'social_proof': '#45B7D1',
  'authority': '#96CEB4',
  'fear': '#FF9FF3',
  'exclusivity': '#00D2D3',
  'storytelling': '#FF9F43',
  'contrast': '#C44569',
  'call_to_action': '#2ED573',
  'loss_aversion': '#FF3838',
  'commitment': '#9B59B6',
  'greed': '#F39C12',
  'reciprocity': '#E67E22',
  'liking': '#8E44AD'
};

// Fonction pour obtenir le nom d'affichage d'un trigger
const getTriggerDisplayName = (triggerType: string) => {
  return triggerType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Fonction pour obtenir la couleur d'un trigger
const getTriggerColor = (triggerType: string) => {
  return PERFECT_TRIGGER_COLORS[triggerType as keyof typeof PERFECT_TRIGGER_COLORS] || '#CCCCCC';
};

const PerfectTextRenderer: React.FC<PerfectTextRendererProps> = ({ text, highlights }) => {
  // Vérification de l'intégrité du texte
  React.useEffect(() => {
    console.log('🔍 [PERFECT RENDERER] Text integrity check:');
    console.log(`📝 [PERFECT RENDERER] Original text length: ${text.length}`);
    console.log(`📝 [PERFECT RENDERER] Text preview: "${text.substring(0, 100)}..."`);
    
    // Vérifier chaque highlight
    highlights.forEach((highlight, index) => {
      const extractedText = text.substring(highlight.span.start, highlight.span.end);
      const matches = extractedText === highlight.excerpt;
      
      console.log(`🎯 [PERFECT RENDERER] Highlight ${index + 1}:`);
      console.log(`   Position: [${highlight.span.start}-${highlight.span.end}]`);
      console.log(`   Expected: "${highlight.excerpt}"`);
      console.log(`   Extracted: "${extractedText}"`);
      console.log(`   Matches: ${matches}`);
      console.log(`   Verified: ${highlight.verified}`);
      
      if (!matches) {
        console.error(`❌ [PERFECT RENDERER] MISMATCH in highlight ${index + 1}!`);
      }
    });
  }, [text, highlights]);

  // Filtrer et trier les highlights par position de début
  console.log('🔍 [PERFECT RENDERER] Raw highlights received:', highlights);
  const validHighlights = highlights.filter(h => h && h.span && typeof h.span.start === 'number' && typeof h.span.end === 'number');
  console.log('✅ [PERFECT RENDERER] Valid highlights:', validHighlights.length, 'out of', highlights.length);
  const sortedHighlights = [...validHighlights].sort((a, b) => a.span.start - b.span.start);

  // Créer les segments de texte avec highlights
  const renderTextWithHighlights = () => {
    const segments: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedHighlights.forEach((highlight, index) => {
      // Ajouter le texte avant le highlight
      if (highlight.span.start > lastIndex) {
        segments.push(
          <span key={`text-${index}`}>
            {text.substring(lastIndex, highlight.span.start)}
          </span>
        );
      }

      // Ajouter le highlight
      const highlightColor = getTriggerColor(highlight.type);
      const opacity = highlight.verified ? 1 : 0.7; // Opacité réduite si non vérifié
      
      segments.push(
        <span
          key={`highlight-${index}`}
          style={{
            backgroundColor: highlightColor,
            opacity: opacity,
            padding: '2px 4px',
            borderRadius: '3px',
            border: highlight.verified ? '1px solid transparent' : '1px dashed rgba(255,0,0,0.5)',
            cursor: 'pointer',
            position: 'relative'
          }}
          title={`${getTriggerDisplayName(highlight.type)}: ${highlight.reasoning}${!highlight.verified ? ' (Non vérifié)' : ''}`}
        >
          {text.substring(highlight.span.start, highlight.span.end)}
        </span>
      );

      lastIndex = highlight.span.end;
    });

    // Ajouter le texte restant
    if (lastIndex < text.length) {
      segments.push(
        <span key="text-end">
          {text.substring(lastIndex)}
        </span>
      );
    }

    return segments;
  };

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      lineHeight: '1.6',
      fontSize: '16px',
      color: '#333',
      backgroundColor: '#fafafa',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #e0e0e0'
    }}>
      {/* En-tête avec statistiques */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '10px', 
        backgroundColor: '#f0f0f0', 
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>🎯 Analyse Parfaite</strong> - {highlights.length} highlights trouvés
        {highlights.filter(h => h.verified).length !== highlights.length && (
          <span style={{ color: '#ff6b6b', marginLeft: '10px' }}>
            ⚠️ {highlights.length - highlights.filter(h => h.verified).length} non vérifiés
          </span>
        )}
      </div>

      {/* Texte avec highlights */}
      <div style={{ 
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}>
        {renderTextWithHighlights()}
      </div>

      {/* Légende des couleurs */}
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '5px',
        border: '1px solid #dee2e6'
      }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>
          🎨 Légende des Triggers
        </h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '8px',
          fontSize: '12px'
        }}>
          {Array.from(new Set(highlights.map(h => h.type))).map(triggerType => (
            <div key={triggerType} style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: getTriggerColor(triggerType),
                  borderRadius: '2px',
                  marginRight: '8px',
                  border: '1px solid #ccc'
                }}
              />
              <span>{getTriggerDisplayName(triggerType)}</span>
              <span style={{ marginLeft: '5px', color: '#666' }}>
                ({highlights.filter(h => h.type === triggerType).length})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Informations de debug */}
      <div style={{ 
        marginTop: '15px', 
        padding: '10px', 
        backgroundColor: '#fff3cd', 
        borderRadius: '5px',
        fontSize: '12px',
        color: '#856404'
      }}>
        <strong>🔍 Debug Info:</strong> Vérifiez la console pour les détails de vérification d'intégrité.
      </div>
    </div>
  );
};

export default PerfectTextRenderer;
