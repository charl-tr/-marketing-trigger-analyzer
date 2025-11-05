'use client';
import React, { useState } from 'react';

// Interface pour les highlights simples
interface SimpleHighlight {
  type: string;
  intensity: number;
  span: { start: number; end: number };
  excerpt: string;
  reasoning: string;
  triggers: string[];
  verified?: boolean;
}

interface OriginalTextRendererProps {
  text: string;
  highlights: SimpleHighlight[];
}

// Couleurs distinctes pour chaque trigger
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
  'loss_aversion': '#FF3838',
  'commitment': '#9B59B6',
  'greed': '#F39C12',
  'reciprocity': '#E67E22',
  'liking': '#8E44AD'
};

// Fonction pour obtenir le nom d'affichage d'un trigger
const getTriggerDisplayName = (triggerType: string | undefined) => {
  if (!triggerType || typeof triggerType !== 'string') {
    return 'Unknown Trigger';
  }
  return triggerType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Fonction pour obtenir la couleur d'un trigger
const getTriggerColor = (triggerType: string) => {
  return TRIGGER_COLORS[triggerType as keyof typeof TRIGGER_COLORS] || '#CCCCCC';
};

const OriginalTextRenderer: React.FC<OriginalTextRendererProps> = ({ text, highlights }) => {
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);

  // Obtenir tous les triggers uniques (avec vérification de sécurité)
  const allTriggers = Array.from(new Set(highlights.filter(h => h && h.type).map(h => h.type)));

  // Toggle d'un trigger
  const toggleTrigger = (triggerType: string) => {
    setSelectedTriggers(prev => 
      prev.includes(triggerType) 
        ? prev.filter(t => t !== triggerType)
        : [...prev, triggerType]
    );
  };

  // Filtrer les highlights selon les triggers sélectionnés (avec vérification de sécurité)
  const filteredHighlights = selectedTriggers.length === 0 
    ? highlights.filter(h => h && h.type && h.span)
    : highlights.filter(h => h && h.type && h.span && selectedTriggers.includes(h.type));

  // Trier les highlights par position (avec vérification de sécurité)
  const sortedHighlights = [...filteredHighlights].sort((a, b) => {
    if (!a.span || !b.span) return 0;
    return a.span.start - b.span.start;
  });

  // Créer les segments de texte avec highlights
  const renderTextWithHighlights = () => {
    const segments: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedHighlights.forEach((highlight, index) => {
      // Vérification de sécurité
      if (!highlight || !highlight.span || typeof highlight.span.start !== 'number' || typeof highlight.span.end !== 'number') {
        console.warn('Invalid highlight:', highlight);
        return;
      }

      // Ajouter le texte avant le highlight
      if (highlight.span.start > lastIndex) {
        segments.push(
          <span key={`text-${index}`}>
            {text.substring(lastIndex, highlight.span.start)}
          </span>
        );
      }

      // Ajouter le highlight avec superposition possible
      const highlightColor = getTriggerColor(highlight.type || 'unknown');
      
      segments.push(
        <span
          key={`highlight-${index}`}
          style={{
            backgroundColor: highlightColor,
            padding: '2px 4px',
            borderRadius: '3px',
            cursor: 'pointer',
            position: 'relative',
            opacity: 0.8
          }}
          title={`${getTriggerDisplayName(highlight.type)}: ${highlight.reasoning || 'No reasoning'}`}
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
      display: 'flex',
      gap: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      lineHeight: '1.6',
      fontSize: '16px',
      color: '#333'
    }}>
      {/* Sidebar avec légende - Style original */}
      <div style={{ 
        width: '200px',
        backgroundColor: 'transparent',
        padding: '10px',
        height: 'fit-content'
      }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold', color: '#666' }}>
          🎨 Triggers ({highlights.length})
        </h4>
        
        <div style={{ marginBottom: '10px' }}>
          <button
            onClick={() => setSelectedTriggers([])}
            style={{
              padding: '6px 10px',
              backgroundColor: selectedTriggers.length === 0 ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
              width: '100%'
            }}
          >
            {selectedTriggers.length === 0 ? 'Tous sélectionnés' : 'Voir tous'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {allTriggers.map(triggerType => {
            const triggerHighlights = highlights.filter(h => h.type === triggerType);
            const isSelected = selectedTriggers.includes(triggerType);
            const color = getTriggerColor(triggerType);
            
            return (
              <div
                key={triggerType}
                onClick={() => toggleTrigger(triggerType)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px',
                  backgroundColor: isSelected ? color : 'white',
                  color: isSelected ? 'white' : '#333',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  border: `1px solid ${color}`,
                  transition: 'all 0.2s ease',
                  fontSize: '11px'
                }}
              >
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: isSelected ? 'white' : color,
                    borderRadius: '2px',
                    marginRight: '6px',
                    border: isSelected ? `1px solid ${color}` : 'none'
                  }}
                />
                <span style={{ fontWeight: 'bold' }}>
                  {getTriggerDisplayName(triggerType)}
                </span>
                <span style={{ 
                  marginLeft: 'auto', 
                  fontSize: '10px',
                  opacity: 0.8
                }}>
                  {triggerHighlights.length}
                </span>
              </div>
            );
          })}
        </div>

        {/* Statistiques minimales */}
        <div style={{ 
          marginTop: '10px', 
          padding: '8px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '4px',
          fontSize: '10px',
          color: '#666'
        }}>
          <div><strong>Filtrés:</strong> {filteredHighlights.length}</div>
          <div><strong>Sélectionnés:</strong> {selectedTriggers.length}</div>
        </div>
      </div>

      {/* Zone de texte principal - Style textarea original */}
      <div style={{ 
        flex: 1,
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        minHeight: '400px'
      }}>
        {/* Texte avec highlights - Style textarea original */}
        <div style={{ 
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          lineHeight: 'inherit',
          color: 'inherit',
          backgroundColor: 'transparent',
          border: 'none',
          outline: 'none',
          width: '100%',
          minHeight: '300px'
        }}>
          {renderTextWithHighlights()}
        </div>
      </div>
    </div>
  );
};

export default OriginalTextRenderer;
