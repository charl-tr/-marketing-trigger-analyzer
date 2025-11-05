import React from 'react';
import { createRobustTextRender } from '../lib/textMapping';

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

interface RobustTextRendererProps {
  text: string;
  highlights: Array<{
    start: number;
    end: number;
    type: string;
    intensity: number;
    reason: string;
  }>;
  isAnalyzingProgressively?: boolean;
}

export default function RobustTextRenderer({ 
  text, 
  highlights, 
  isAnalyzingProgressively = false 
}: RobustTextRendererProps) {
  
  // Créer le rendu robuste du texte
  const segments = createRobustTextRender(text, highlights);
  
  console.log('🎨 RobustTextRenderer - Text length:', text.length);
  console.log('🎨 RobustTextRenderer - Highlights count:', highlights.length);
  console.log('🎨 RobustTextRenderer - Segments count:', segments.length);
  
  return (
    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
      {segments.map((segment, index) => {
        if (segment.type === 'highlight' && segment.highlight) {
          const trigger = segment.highlight;
          const color = TRIGGER_COLORS[trigger.type as keyof typeof TRIGGER_COLORS] || '#E0E0E0';
          
          return (
            <span
              key={`highlight-${index}`}
              style={{
                backgroundColor: color,
                color: '#FFFFFF',
                padding: '4px 8px',
                borderRadius: '8px',
                fontWeight: 'bold',
                display: 'inline-block',
                margin: '0 2px',
                cursor: 'help',
                transition: 'all 0.3s ease',
                position: 'relative',
                animation: isAnalyzingProgressively ? 'highlightAppear 0.5s ease-out' : 'none',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                fontSize: 'inherit',
                lineHeight: 'inherit'
              }}
              title={`${getTriggerDisplayName(trigger.type).toUpperCase()} • Intensité: ${Math.round(trigger.intensity * 100)}% • ${trigger.reason}`}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                e.currentTarget.style.zIndex = '10';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
                e.currentTarget.style.zIndex = '1';
              }}
            >
              {segment.text}
            </span>
          );
        }
        
        // Texte normal
        return (
          <span key={`normal-${index}`}>
            {segment.text}
          </span>
        );
      })}
    </div>
  );
}
