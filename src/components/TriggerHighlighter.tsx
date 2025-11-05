'use client';

import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface TriggerMatch {
  text: string;
  start: number;
  end: number;
  trigger: {
    id: string;
    name: string;
    color: string;
    description: string;
  };
  confidence: number;
}

interface TriggerHighlighterProps {
  text: string;
  matches: TriggerMatch[];
  className?: string;
}

export default function TriggerHighlighter({ text, matches, className = '' }: TriggerHighlighterProps) {
  const [hoveredTrigger, setHoveredTrigger] = useState<TriggerMatch | null>(null);

  // Vérifications de sécurité
  if (!text || typeof text !== 'string') {
    return <div className={className}>No text to display</div>;
  }

  if (!matches || !Array.isArray(matches)) {
    return <div className={className}>{text}</div>;
  }

  // Trier les matches par position de début
  const sortedMatches = [...matches].sort((a, b) => (a.start || 0) - (b.start || 0));

  // Créer les segments de texte avec surlignements
  const createHighlightedText = () => {
    // Si pas de matches, retourner le texte normal
    if (sortedMatches.length === 0) {
      return [{
        text: text,
        isHighlight: false
      }];
    }

    // Approche simplifiée : utiliser directement les excerpts et les trouver dans le texte
    let highlightedText = text;
    const processedMatches: Array<{
      text: string;
      isHighlight: boolean;
      trigger?: TriggerMatch;
    }> = [];

    // Trier les matches par position décroissante pour éviter les conflits
    const sortedByPosition = [...sortedMatches].sort((a, b) => b.start - a.start);

    sortedByPosition.forEach(match => {
      if (match && match.text && match.text.trim().length > 0 && match.type) {
        // Chercher l'excerpt dans le texte
        const excerptIndex = highlightedText.indexOf(match.text);
        if (excerptIndex !== -1) {
          // Remplacer l'excerpt par un marqueur temporaire unique
          const safeType = (match.type || 'Unknown').replace(/\s+/g, '_');
          const safeIntensity = match.intensity || 0;
          const marker = `__TRIGGER_${safeType}_${safeIntensity}_${excerptIndex}__`;
          highlightedText = highlightedText.replace(match.text, marker);
          
          processedMatches.push({
            text: match.text,
            isHighlight: true,
            trigger: match
          });
        }
      }
    });

    // Diviser le texte en segments en utilisant les marqueurs
    const segments: Array<{
      text: string;
      isHighlight: boolean;
      trigger?: TriggerMatch;
    }> = [];

    const parts = highlightedText.split(/(__TRIGGER_[^_]+(?:_[^_]+)*__)/);
    
    parts.forEach(part => {
      if (part.startsWith('__TRIGGER_')) {
        // C'est un marqueur, trouver le match correspondant
        const match = processedMatches.find(m => 
          part.includes(m.trigger?.type?.replace(/\s+/g, '_') || '') && 
          part.includes(m.trigger?.intensity?.toString() || '')
        );
        if (match) {
          segments.push({
            text: match.text,
            isHighlight: true,
            trigger: match.trigger
          });
        }
      } else if (part.trim().length > 0) {
        // C'est du texte normal
        segments.push({
          text: part,
          isHighlight: false
        });
      }
    });

    return segments;
  };

  const segments = createHighlightedText();

  return (
    <div className={`relative ${className}`}>
      {/* Texte avec surlignements */}
      <div className="text-lg leading-relaxed text-text-primary font-quintessential whitespace-pre-wrap">
        {segments.map((segment, index) => {
          if (segment.isHighlight && segment.trigger) {
            return (
              <span
                key={index}
                className="relative cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
                style={{
                  backgroundColor: `${segment.trigger.trigger.color}30`,
                  borderBottom: `2px solid ${segment.trigger.trigger.color}`,
                  padding: '2px 4px',
                  borderRadius: '4px',
                  margin: '0 1px'
                }}
                onMouseEnter={() => setHoveredTrigger(segment.trigger!)}
                onMouseLeave={() => setHoveredTrigger(null)}
                title={`${segment.trigger.trigger.name} (${Math.round(segment.trigger.confidence * 100)}%)`}
              >
                {segment.text}
              </span>
            );
          }
          return <span key={index}>{segment.text}</span>;
        })}
      </div>

      {/* Tooltip pour le trigger survolé - Position fixe pour éviter le masquage */}
      {hoveredTrigger && (
        <div 
          className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-sm"
          style={{
            top: '20px',
            right: '20px',
            pointerEvents: 'none',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: hoveredTrigger.trigger.color }}
            />
            <span className="font-quintessential font-bold text-text-primary">
              {hoveredTrigger.trigger.name}
            </span>
            <span className="text-sm text-text-secondary">
              ({Math.round(hoveredTrigger.confidence * 100)}%)
            </span>
          </div>
          <p className="text-sm text-text-secondary font-quintessential">
            {hoveredTrigger.trigger.description}
          </p>
        </div>
      )}

    </div>
  );
}
