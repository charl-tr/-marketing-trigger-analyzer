'use client';

import React, { useState, useRef } from 'react';
import { getTriggerColor } from '@/lib/theme';

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
  confidence: number;
}

interface TextHighlighterProps {
  text: string;
  segments: HighlightedSegment[];
  className?: string;
}

export default function TextHighlighter({ text, segments, className = '' }: TextHighlighterProps) {
  const [hoveredSegment, setHoveredSegment] = useState<HighlightedSegment | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const textRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const getHighlightedText = (): Array<{
    type: 'text' | 'highlight';
    content: string;
    key: string;
    segment?: HighlightedSegment;
  }> => {
    if (segments.length === 0) return [{
      type: 'text',
      content: text,
      key: 'text-only'
    }];

    // Trier les segments par position
    const sortedSegments = [...segments].sort((a, b) => a.start - b.start);
    
    let result: Array<{
      type: 'text' | 'highlight';
      content: string;
      key: string;
      segment?: HighlightedSegment;
    }> = [];
    let lastIndex = 0;

    sortedSegments.forEach((segment, index) => {
      // Ajouter le texte avant le segment
      if (segment.start > lastIndex) {
        result.push({
          type: 'text',
          content: text.slice(lastIndex, segment.start),
          key: `text-${index}`
        });
      }

      // Ajouter le segment surligné
      result.push({
        type: 'highlight',
        content: segment.text,
        segment,
        key: `highlight-${index}`
      });

      lastIndex = segment.end;
    });

    // Ajouter le texte restant
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
    <div className="relative">
      <div
        ref={textRef}
        className={`text-text-primary leading-relaxed ${className}`}
        onMouseMove={handleMouseMove}
      >
        {highlightedContent.map((item) => {
          if (item.type === 'text') {
            return <span key={item.key}>{item.content}</span>;
          }

          if (!item.segment) {
            return <span key={item.key}>{item.content}</span>;
          }

          return (
            <span
              key={item.key}
              className="relative cursor-pointer transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: `${item.segment.trigger.color}20`,
                borderLeft: `3px solid ${item.segment.trigger.color}`,
                padding: '2px 6px',
                margin: '0 2px',
                borderRadius: '4px',
                position: 'relative',
              }}
              onMouseEnter={() => setHoveredSegment(item.segment!)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              {item.content}
              
              {/* Badge flottant */}
              <div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20"
                style={{
                  display: hoveredSegment?.trigger.id === item.segment.trigger.id ? 'block' : 'none',
                }}
              >
                <div
                  className="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg animate-fade-in"
                  style={{ backgroundColor: item.segment.trigger.color }}
                >
                  {item.segment.trigger.name}
                </div>
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent mx-auto" 
                     style={{ borderTopColor: item.segment.trigger.color }}></div>
              </div>
            </span>
          );
        })}
      </div>

      {/* Effet loupe glassmorphism */}
      {hoveredSegment && (
        <div
          className="fixed pointer-events-none z-50 animate-fade-in"
          style={{
            left: mousePosition.x + 20,
            top: mousePosition.y - 20,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div
            className="px-4 py-3 rounded-2xl shadow-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              maxWidth: '300px',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: hoveredSegment.trigger.color }}
              ></div>
              <span className="font-semibold text-text-primary">
                {hoveredSegment.trigger.name}
              </span>
              <span className="text-xs text-text-muted">
                {Math.round(hoveredSegment.confidence * 100)}%
              </span>
            </div>
            <p className="text-sm text-text-secondary">
              {hoveredSegment.trigger.description}
            </p>
            <div className="mt-2 text-xs text-text-muted">
              "{hoveredSegment.text}"
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
