'use client';

import React, { useState } from 'react';

interface HighlightedSegment {
  text: string;
  start: number;
  end: number;
  trigger: {
    id: string;
    name: string;
    color: string;
    description: string;
  };
  confidence?: number;
  explanation?: string;
}

interface PremiumHighlighterProps {
  text: string;
  segments: HighlightedSegment[];
  className?: string;
}

export default function PremiumHighlighter({ text, segments, className = '' }: PremiumHighlighterProps) {
  const [hoveredSegment, setHoveredSegment] = useState<HighlightedSegment | null>(null);

  const getHighlightedText = () => {
    if (!segments || segments.length === 0) {
      return [{ type: 'text', content: text, key: 'text' }];
    }

    // Sort segments by start position
    const sortedSegments = [...segments].sort((a, b) => a.start - b.start);
    
    const result: Array<{ type: string; content: string; key: string; segment?: HighlightedSegment }> = [];
    let lastIndex = 0;

    sortedSegments.forEach((segment, index) => {
      // Add text before segment
      if (segment.start > lastIndex) {
        result.push({
          type: 'text',
          content: text.slice(lastIndex, segment.start),
          key: `text-${index}-before`
        });
      }

      // Add highlighted segment
      result.push({
        type: 'highlight',
        content: segment.text,
        key: `highlight-${index}`,
        segment
      });

      lastIndex = segment.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      result.push({
        type: 'text',
        content: text.slice(lastIndex),
        key: 'text-end'
      });
    }

    return result;
  };

  const highlightedContent = getHighlightedText();

  return (
    <div className={`relative ${className}`}>
      {highlightedContent.map((item) => {
        if (item.type === 'text') {
          return (
            <span key={item.key} className="text-inherit">
              {item.content}
            </span>
          );
        }

        if (item.type === 'highlight' && item.segment) {
          const { segment } = item;
          const intensity = segment.confidence || 0.5;
          const opacity = Math.max(0.2, intensity * 0.8);
          
          return (
            <span
              key={item.key}
              className="relative cursor-pointer transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: `${segment.trigger.color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
                padding: '2px 4px',
                borderRadius: '4px',
                border: `1px solid ${segment.trigger.color}40`,
                boxShadow: `0 2px 8px ${segment.trigger.color}20`,
              }}
              onMouseEnter={() => setHoveredSegment(segment)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              {item.content}
              
              {/* Hover tooltip */}
              {hoveredSegment && hoveredSegment === segment && (
                <div
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 rounded-xl backdrop-blur-md border border-accent-pharaoh/20 z-50"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 8px 32px rgba(0, 87, 167, 0.2)',
                    minWidth: '200px',
                  }}
                >
                  <div className="text-sm">
                    <div className="font-quintessential font-bold text-accent-pharaoh mb-1">
                      {segment.trigger.name}
                    </div>
                    <div className="text-text-secondary text-xs mb-2">
                      {segment.trigger.description}
                    </div>
                    {segment.confidence && (
                      <div className="text-xs text-text-muted">
                        Confidence: {Math.round(segment.confidence * 100)}%
                      </div>
                    )}
                    {segment.explanation && (
                      <div className="text-xs text-text-secondary mt-1 italic">
                        "{segment.explanation}"
                      </div>
                    )}
                  </div>
                  
                  {/* Arrow */}
                  <div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
                    style={{
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '6px solid rgba(255, 255, 255, 0.9)',
                    }}
                  />
                </div>
              )}
            </span>
          );
        }

        return null;
      })}
    </div>
  );
}
