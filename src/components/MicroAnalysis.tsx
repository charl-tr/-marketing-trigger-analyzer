'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Target, Zap, Brain, Eye } from 'lucide-react';

interface MicroAnalysisProps {
  text: string;
  triggers: any[];
  onSegmentClick: (segment: any) => void;
}

export default function MicroAnalysis({ text, triggers, onSegmentClick }: MicroAnalysisProps) {
  const [expandedSegments, setExpandedSegments] = useState<Set<number>>(new Set());
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);

  const toggleSegment = (index: number) => {
    const newExpanded = new Set(expandedSegments);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSegments(newExpanded);
  };

  const selectSegment = (index: number, segment: any) => {
    setSelectedSegment(index);
    onSegmentClick(segment);
  };

  // Créer des segments de texte avec les triggers
  const createTextSegments = () => {
    const segments: any[] = [];
    let lastIndex = 0;

    // Trier les triggers par position
    const sortedTriggers = [...triggers].sort((a, b) => a.span.start - b.span.start);

    sortedTriggers.forEach((trigger, index) => {
      // Ajouter le texte avant le trigger
      if (trigger.span.start > lastIndex) {
        segments.push({
          type: 'text',
          content: text.slice(lastIndex, trigger.span.start),
          start: lastIndex,
          end: trigger.span.start,
          index: segments.length
        });
      }

      // Ajouter le trigger
      segments.push({
        type: 'trigger',
        content: trigger.excerpt,
        start: trigger.span.start,
        end: trigger.span.end,
        trigger: trigger,
        index: segments.length
      });

      lastIndex = trigger.span.end;
    });

    // Ajouter le texte restant
    if (lastIndex < text.length) {
      segments.push({
        type: 'text',
        content: text.slice(lastIndex),
        start: lastIndex,
        end: text.length,
        index: segments.length
      });
    }

    return segments;
  };

  const segments = createTextSegments();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-6 h-6 text-accent-pharaoh" />
        <h3 className="text-2xl font-quintessential font-bold text-text-primary">Micro Analysis</h3>
        <div className="ml-auto text-sm text-text-secondary font-quintessential">
          {segments.length} segments • {triggers.length} triggers
        </div>
      </div>

      <div className="space-y-2">
        {segments.map((segment, index) => (
          <div key={index} className="relative">
            {segment.type === 'trigger' ? (
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedSegment === index
                    ? 'border-accent-pharaoh bg-accent-pharaoh/5'
                    : 'border-accent-gold/30 hover:border-accent-gold/60'
                }`}
                onClick={() => selectSegment(index, segment)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSegment(index);
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {expandedSegments.has(index) ? 
                        <ChevronDown className="w-4 h-4" /> : 
                        <ChevronRight className="w-4 h-4" />
                      }
                    </button>
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-quintessential font-bold text-white"
                      style={{ backgroundColor: segment.trigger.color || '#CCCCCC' }}
                    >
                      {segment.trigger.type}
                    </span>
                    <span className="text-sm text-text-secondary">
                      Intensity: {Math.round(segment.trigger.intensity * 100)}%
                    </span>
                  </div>
                  <div className="text-xs text-text-muted font-mono">
                    {segment.start} → {segment.end}
                  </div>
                </div>

                <div className="mb-2">
                  <div className="text-lg font-quintessential leading-relaxed">
                    "{segment.content}"
                  </div>
                </div>

                {expandedSegments.has(index) && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-quintessential font-bold text-text-primary">Position</div>
                        <div className="font-mono text-text-secondary">
                          Start: {segment.start} | End: {segment.end}
                        </div>
                      </div>
                      <div>
                        <div className="font-quintessential font-bold text-text-primary">Length</div>
                        <div className="font-mono text-text-secondary">
                          {segment.content.length} characters
                        </div>
                      </div>
                      <div>
                        <div className="font-quintessential font-bold text-text-primary">Confidence</div>
                        <div className="font-mono text-text-secondary">
                          {segment.trigger.intensity.toFixed(3)}
                        </div>
                      </div>
                      <div>
                        <div className="font-quintessential font-bold text-text-primary">Type</div>
                        <div className="font-mono text-text-secondary">
                          {segment.trigger.type}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="font-quintessential font-bold text-text-primary mb-2">Context</div>
                      <div className="text-sm text-text-secondary bg-white p-3 rounded border">
                        <span className="text-gray-400">
                          {text.slice(Math.max(0, segment.start - 50), segment.start)}
                        </span>
                        <span className="bg-yellow-200 px-1">
                          {segment.content}
                        </span>
                        <span className="text-gray-400">
                          {text.slice(segment.end, Math.min(text.length, segment.end + 50))}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-text-secondary font-quintessential leading-relaxed p-2">
                {segment.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 p-6 bg-gradient-to-r from-accent-pharaoh/5 to-accent-gold/5 rounded-xl border border-accent-gold/20">
        <h4 className="text-lg font-quintessential font-bold text-text-primary mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Analysis Summary
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-quintessential font-bold text-text-primary">Total Segments</div>
            <div className="text-2xl font-bold text-accent-pharaoh">{segments.length}</div>
          </div>
          <div>
            <div className="font-quintessential font-bold text-text-primary">Trigger Segments</div>
            <div className="text-2xl font-bold text-accent-gold">{triggers.length}</div>
          </div>
          <div>
            <div className="font-quintessential font-bold text-text-primary">Text Segments</div>
            <div className="text-2xl font-bold text-text-secondary">{segments.length - triggers.length}</div>
          </div>
          <div>
            <div className="font-quintessential font-bold text-text-primary">Coverage</div>
            <div className="text-2xl font-bold text-green-600">
              {text.length > 0 ? Math.round((triggers.reduce((sum, t) => sum + (t.span.end - t.span.start), 0) / text.length) * 100) : 0}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
