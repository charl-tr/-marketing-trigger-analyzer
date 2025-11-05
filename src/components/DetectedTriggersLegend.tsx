'use client';

import React from 'react';
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

interface DetectedTriggersLegendProps {
  matches: TriggerMatch[];
}

export default function DetectedTriggersLegend({ matches }: DetectedTriggersLegendProps) {
  if (matches.length === 0) return null;

  return (
    <div 
      className="mt-6 p-6 rounded-2xl backdrop-blur-md border border-accent-pharaoh/30 relative overflow-hidden prism-glass"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(0, 87, 167, 0.05))',
        boxShadow: '0 20px 60px rgba(0, 87, 167, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      }}
    >
      {/* Subtle background glow */}
      <div 
        className="absolute inset-0 opacity-20 animate-subtle-pulse"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 87, 167, 0.1) 0%, transparent 70%)',
        }}
      />
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-accent-pharaoh/10 rounded-full flex items-center justify-center">
          <Info className="w-4 h-4 text-accent-pharaoh" />
        </div>
        <h3 className="font-quintessential font-bold text-text-primary text-lg">
          Triggers détectés ({matches.length})
        </h3>
      </div>
      
      <div className="flex flex-wrap gap-3 relative z-10">
        {Array.from(new Set(matches.map(m => m.trigger.name))).map(triggerName => {
          const trigger = matches.find(m => m.trigger.name === triggerName)?.trigger;
          if (!trigger) return null;
          
          const count = matches.filter(m => m.trigger.name === triggerName).length;
          const avgConfidence = matches
            .filter(m => m.trigger.name === triggerName)
            .reduce((sum, m) => sum + m.confidence, 0) / count;

          return (
            <div
              key={triggerName}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-quintessential transition-all duration-300 hover:scale-105 relative group prism-glass"
              style={{
                backgroundColor: `${trigger.color}15`,
                border: `1px solid ${trigger.color}30`,
                boxShadow: `0 8px 25px ${trigger.color}15, inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
              }}
            >
              {/* Subtle glow effect */}
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle, ${trigger.color}20 0%, transparent 70%)`,
                  filter: 'blur(4px)',
                }}
              />
              
              <div 
                className="w-3 h-3 rounded-full relative z-10"
                style={{ 
                  backgroundColor: trigger.color,
                  boxShadow: `0 0 8px ${trigger.color}40`
                }}
              />
              <span className="font-medium text-text-primary relative z-10">{triggerName}</span>
              <span 
                className="text-xs text-text-secondary px-2 py-1 rounded-full relative z-10"
                style={{
                  backgroundColor: 'rgba(0, 87, 167, 0.1)',
                  border: '1px solid rgba(0, 87, 167, 0.2)'
                }}
              >
                {count}× ({Math.round(avgConfidence * 100)}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
