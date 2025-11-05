'use client';

import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, Target, Zap, Brain, Eye, Layers, GitMerge } from 'lucide-react';

interface TriggerAnalysis {
  type: string;
  intensity: number;
  span: { start: number; end: number };
  excerpt: string;
  color?: string;
}

interface AdvancedMicroAnalysisProps {
  text: string;
  triggers: TriggerAnalysis[];
  onSegmentClick: (segment: any) => void;
}

interface TextSegment {
  type: 'text' | 'trigger';
  content: string;
  start: number;
  end: number;
  triggers: TriggerAnalysis[];
  index: number;
}

export default function AdvancedMicroAnalysis({ text, triggers, onSegmentClick }: AdvancedMicroAnalysisProps) {
  const [expandedSegments, setExpandedSegments] = useState<Set<number>>(new Set());
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'overlapping' | 'sequential' | 'layered'>('overlapping');

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

  // Créer des segments avec support des chevauchements
  const createAdvancedSegments = (): TextSegment[] => {
    const segments: TextSegment[] = [];
    
    // Créer une timeline de tous les événements (début/fin de triggers)
    const events: Array<{ position: number; type: 'start' | 'end'; trigger: TriggerAnalysis }> = [];
    
    triggers.forEach(trigger => {
      events.push({ position: trigger.span.start, type: 'start', trigger });
      events.push({ position: trigger.span.end, type: 'end', trigger });
    });
    
    // Trier par position
    events.sort((a, b) => a.position - b.position);
    
    let lastPosition = 0;
    let activeTriggers: TriggerAnalysis[] = [];
    
    events.forEach((event, index) => {
      // Ajouter le texte avant l'événement s'il y en a
      if (event.position > lastPosition) {
        if (activeTriggers.length > 0) {
          // Segment avec triggers actifs
          segments.push({
            type: 'trigger',
            content: text.slice(lastPosition, event.position),
            start: lastPosition,
            end: event.position,
            triggers: [...activeTriggers],
            index: segments.length
          });
        } else {
          // Segment de texte normal
          segments.push({
            type: 'text',
            content: text.slice(lastPosition, event.position),
            start: lastPosition,
            end: event.position,
            triggers: [],
            index: segments.length
          });
        }
      }
      
      // Mettre à jour les triggers actifs
      if (event.type === 'start') {
        activeTriggers.push(event.trigger);
      } else {
        activeTriggers = activeTriggers.filter(t => t !== event.trigger);
      }
      
      lastPosition = event.position;
    });
    
    // Ajouter le texte restant
    if (lastPosition < text.length) {
      if (activeTriggers.length > 0) {
        segments.push({
          type: 'trigger',
          content: text.slice(lastPosition),
          start: lastPosition,
          end: text.length,
          triggers: [...activeTriggers],
          index: segments.length
        });
      } else {
        segments.push({
          type: 'text',
          content: text.slice(lastPosition),
          start: lastPosition,
          end: text.length,
          triggers: [],
          index: segments.length
        });
      }
    }
    
    return segments;
  };

  const segments = useMemo(() => createAdvancedSegments(), [text, triggers]);

  // Calculer les statistiques avancées
  const stats = useMemo(() => {
    const triggerCounts: { [key: string]: number } = {};
    const triggerIntensities: { [key: string]: number[] } = {};
    const overlappingSegments = segments.filter(s => s.triggers.length > 1).length;
    const totalOverlaps = segments.reduce((sum, s) => sum + Math.max(0, s.triggers.length - 1), 0);
    
    triggers.forEach(trigger => {
      triggerCounts[trigger.type] = (triggerCounts[trigger.type] || 0) + 1;
      if (!triggerIntensities[trigger.type]) {
        triggerIntensities[trigger.type] = [];
      }
      triggerIntensities[trigger.type].push(trigger.intensity);
    });

    return {
      totalSegments: segments.length,
      triggerSegments: segments.filter(s => s.triggers.length > 0).length,
      textSegments: segments.filter(s => s.triggers.length === 0).length,
      overlappingSegments,
      totalOverlaps,
      triggerCounts,
      avgIntensities: Object.entries(triggerIntensities).map(([type, intensities]) => ({
        type,
        avg: intensities.reduce((sum, i) => sum + i, 0) / intensities.length,
        max: Math.max(...intensities),
        min: Math.min(...intensities)
      }))
    };
  }, [segments, triggers]);

  const renderSegment = (segment: TextSegment, index: number) => {
    if (segment.type === 'trigger') {
      return (
        <div 
          key={index} 
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
              
              {/* Afficher tous les triggers du segment */}
              <div className="flex flex-wrap gap-2">
                {segment.triggers.map((trigger, triggerIndex) => (
                  <span 
                    key={triggerIndex}
                    className="px-3 py-1 rounded-full text-sm font-quintessential font-bold text-white flex items-center gap-2"
                    style={{ backgroundColor: trigger.color || '#CCCCCC' }}
                  >
                    {trigger.type}
                    <span className="text-xs opacity-75">
                      {Math.round(trigger.intensity * 100)}%
                    </span>
                  </span>
                ))}
              </div>
              
              {segment.triggers.length > 1 && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">
                  {segment.triggers.length} triggers
                </span>
              )}
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
                  <div className="font-quintessential font-bold text-text-primary">Triggers</div>
                  <div className="font-mono text-text-secondary">
                    {segment.triggers.length} active
                  </div>
                </div>
                <div>
                  <div className="font-quintessential font-bold text-text-primary">Avg Intensity</div>
                  <div className="font-mono text-text-secondary">
                    {Math.round((segment.triggers.reduce((sum, t) => sum + t.intensity, 0) / segment.triggers.length) * 100)}%
                  </div>
                </div>
              </div>

              {/* Détails de chaque trigger */}
              <div>
                <div className="font-quintessential font-bold text-text-primary mb-2">Trigger Details</div>
                <div className="space-y-2">
                  {segment.triggers.map((trigger, triggerIndex) => (
                    <div key={triggerIndex} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: trigger.color || '#CCCCCC' }}
                        />
                        <span className="font-quintessential font-bold">{trigger.type}</span>
                      </div>
                      <div className="text-sm text-text-secondary">
                        {Math.round(trigger.intensity * 100)}% intensity
                      </div>
                    </div>
                  ))}
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
      );
    } else {
      return (
        <div key={index} className="text-text-secondary font-quintessential leading-relaxed p-2">
          {segment.content}
        </div>
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Layers className="w-6 h-6 text-accent-pharaoh" />
        <h3 className="text-2xl font-quintessential font-bold text-text-primary">Advanced Micro Analysis</h3>
        <div className="ml-auto text-sm text-text-secondary font-quintessential">
          {segments.length} segments • {triggers.length} triggers • {stats.overlappingSegments} overlaps
        </div>
      </div>

      {/* Mode de visualisation */}
      <div className="flex gap-2 mb-4">
        {[
          { id: 'overlapping', label: 'Overlapping', icon: GitMerge },
          { id: 'sequential', label: 'Sequential', icon: Target },
          { id: 'layered', label: 'Layered', icon: Layers }
        ].map(mode => (
          <button
            key={mode.id}
            onClick={() => setViewMode(mode.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-quintessential font-medium transition-all ${
              viewMode === mode.id
                ? 'bg-accent-pharaoh text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <mode.icon className="w-4 h-4" />
            {mode.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {segments.map((segment, index) => renderSegment(segment, index))}
      </div>

      {/* Statistiques avancées */}
      <div className="mt-8 p-6 bg-gradient-to-r from-accent-pharaoh/5 to-accent-gold/5 rounded-xl border border-accent-gold/20">
        <h4 className="text-lg font-quintessential font-bold text-text-primary mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Advanced Statistics
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
          <div>
            <div className="font-quintessential font-bold text-text-primary">Total Segments</div>
            <div className="text-2xl font-bold text-accent-pharaoh">{stats.totalSegments}</div>
          </div>
          <div>
            <div className="font-quintessential font-bold text-text-primary">Trigger Segments</div>
            <div className="text-2xl font-bold text-accent-gold">{stats.triggerSegments}</div>
          </div>
          <div>
            <div className="font-quintessential font-bold text-text-primary">Overlapping</div>
            <div className="text-2xl font-bold text-purple-600">{stats.overlappingSegments}</div>
          </div>
          <div>
            <div className="font-quintessential font-bold text-text-primary">Total Overlaps</div>
            <div className="text-2xl font-bold text-green-600">{stats.totalOverlaps}</div>
          </div>
        </div>

        {/* Détails par type de trigger */}
        <div>
          <div className="font-quintessential font-bold text-text-primary mb-3">Trigger Breakdown</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stats.avgIntensities.map((trigger, index) => (
              <div key={index} className="p-3 bg-white rounded border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-quintessential font-bold">{trigger.type}</span>
                  <span className="text-sm text-text-secondary">
                    {stats.triggerCounts[trigger.type]} occurrences
                  </span>
                </div>
                <div className="text-xs text-text-muted">
                  Avg: {Math.round(trigger.avg * 100)}% | 
                  Max: {Math.round(trigger.max * 100)}% | 
                  Min: {Math.round(trigger.min * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
