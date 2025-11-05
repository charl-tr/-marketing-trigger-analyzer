'use client';

import React, { useState, useMemo } from 'react';
import { BarChart3, Target, Brain, Zap, TrendingUp, Eye, Filter, Search } from 'lucide-react';

interface TriggerAnalysis {
  type: string;
  intensity: number;
  span: { start: number; end: number };
  excerpt: string;
  color?: string;
}

interface ComprehensiveAnalysisProps {
  text: string;
  triggers: TriggerAnalysis[];
  onSegmentClick: (segment: any) => void;
}

interface TriggerSpectrum {
  type: string;
  detected: boolean;
  count: number;
  avgIntensity: number;
  maxIntensity: number;
  segments: TriggerAnalysis[];
  color: string;
  description: string;
}

// Spectre complet de tous les triggers marketing
const ALL_MARKETING_TRIGGERS = [
  { id: 'urgency', name: 'Urgency', color: '#DFAE6A', description: 'Encourage immediate action by emphasizing genuine time constraints or deadlines.' },
  { id: 'scarcity', name: 'Scarcity', color: '#C6A664', description: 'Create desire by limiting availability of products, services, or opportunities.' },
  { id: 'social_proof', name: 'Social Proof', color: '#0057A7', description: 'Influence behavior by showing that others are doing it or have succeeded.' },
  { id: 'authority', name: 'Authority', color: '#8B4513', description: 'Establish credibility through expertise, credentials, or recognized status.' },
  { id: 'reciprocity', name: 'Reciprocity', color: '#CD853F', description: 'Give something first to create obligation and increase likelihood of compliance.' },
  { id: 'commitment_consistency', name: 'Commitment & Consistency', color: '#A0522D', description: 'Get small commitments that lead to larger ones, leveraging people\'s need to be consistent.' },
  { id: 'liking', name: 'Liking', color: '#FFD700', description: 'People are more likely to agree with those they like or find attractive.' },
  { id: 'loss_aversion', name: 'Loss Aversion', color: '#B22222', description: 'People prefer avoiding losses over acquiring equivalent gains.' },
  { id: 'anchoring', name: 'Anchoring', color: '#4682B4', description: 'The first piece of information offered (the "anchor") affects subsequent judgments.' },
  { id: 'framing', name: 'Framing', color: '#2E8B57', description: 'How information is presented influences choices and judgments.' },
  { id: 'bandwagon', name: 'Bandwagon', color: '#DAA520', description: 'People do things because many other people are doing them.' },
  { id: 'fear', name: 'Fear', color: '#8B0000', description: 'Motivate by highlighting potential negative consequences.' },
  { id: 'greed', name: 'Greed', color: '#FF8C00', description: 'Appeal to the desire for more money, possessions, or advantages.' },
  { id: 'curiosity_gap', name: 'Curiosity Gap', color: '#483D8B', description: 'Create a gap between what people know and what they want to know.' },
  { id: 'exclusivity', name: 'Exclusivity', color: '#B0C4DE', description: 'Make people feel special by offering something only available to a select few.' },
  { id: 'storytelling', name: 'Storytelling', color: '#B8860B', description: 'Engage emotions and make messages memorable through narratives.' },
  { id: 'contrast', name: 'Contrast', color: '#D2B48C', description: 'Highlight differences to make one option seem more appealing.' },
  { id: 'call_to_action', name: 'Call to Action', color: '#FFD700', description: 'Directly instruct the audience to perform a specific action.' },
  { id: 'tribalism', name: 'Tribalism', color: '#8B008B', description: 'Appeal to group identity and belonging.' },
  { id: 'nostalgia', name: 'Nostalgia', color: '#DDA0DD', description: 'Evoke positive memories and emotions from the past.' },
  { id: 'fomo', name: 'FOMO (Fear of Missing Out)', color: '#FF1493', description: 'Create anxiety about missing opportunities.' },
  { id: 'guilt', name: 'Guilt', color: '#DC143C', description: 'Use guilt to motivate action or compliance.' },
  { id: 'pride', name: 'Pride', color: '#FF6347', description: 'Appeal to self-esteem and personal achievement.' },
  { id: 'envy', name: 'Envy', color: '#32CD32', description: 'Create desire by showing what others have.' },
  { id: 'hope', name: 'Hope', color: '#00CED1', description: 'Inspire optimism about future possibilities.' },
  { id: 'relief', name: 'Relief', color: '#20B2AA', description: 'Offer solution to current pain or problem.' }
];

export default function ComprehensiveAnalysis({ text, triggers, onSegmentClick }: ComprehensiveAnalysisProps) {
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'intensity' | 'count' | 'alphabetical'>('intensity');
  const [showOnlyDetected, setShowOnlyDetected] = useState(false);

  // Analyser le spectre complet
  const triggerSpectrum = useMemo((): TriggerSpectrum[] => {
    return ALL_MARKETING_TRIGGERS.map(triggerDef => {
      const detectedTriggers = triggers.filter(t => 
        t.type.toLowerCase().replace(/\s+/g, '_') === triggerDef.id ||
        t.type === triggerDef.name
      );

      return {
        type: triggerDef.name,
        detected: detectedTriggers.length > 0,
        count: detectedTriggers.length,
        avgIntensity: detectedTriggers.length > 0 
          ? detectedTriggers.reduce((sum, t) => sum + t.intensity, 0) / detectedTriggers.length 
          : 0,
        maxIntensity: detectedTriggers.length > 0 
          ? Math.max(...detectedTriggers.map(t => t.intensity)) 
          : 0,
        segments: detectedTriggers,
        color: triggerDef.color,
        description: triggerDef.description
      };
    });
  }, [triggers]);

  // Filtrer et trier les triggers
  const filteredTriggers = useMemo(() => {
    let filtered = showOnlyDetected ? triggerSpectrum.filter(t => t.detected) : triggerSpectrum;
    
    switch (sortBy) {
      case 'intensity':
        return filtered.sort((a, b) => b.avgIntensity - a.avgIntensity);
      case 'count':
        return filtered.sort((a, b) => b.count - a.count);
      case 'alphabetical':
        return filtered.sort((a, b) => a.type.localeCompare(b.type));
      default:
        return filtered;
    }
  }, [triggerSpectrum, showOnlyDetected, sortBy]);

  // Statistiques globales
  const globalStats = useMemo(() => {
    const detected = triggerSpectrum.filter(t => t.detected);
    const totalIntensity = detected.reduce((sum, t) => sum + t.avgIntensity, 0);
    const coverage = (detected.length / triggerSpectrum.length) * 100;
    
    return {
      totalTriggers: triggerSpectrum.length,
      detectedTriggers: detected.length,
      coverage: Math.round(coverage),
      avgIntensity: detected.length > 0 ? totalIntensity / detected.length : 0,
      strongestTrigger: detected.length > 0 ? detected.reduce((max, t) => t.avgIntensity > max.avgIntensity ? t : max) : null,
      weakestTrigger: detected.length > 0 ? detected.reduce((min, t) => t.avgIntensity < min.avgIntensity ? t : min) : null
    };
  }, [triggerSpectrum]);

  return (
    <div className="space-y-6">
      {/* Header avec statistiques globales */}
      <div className="bg-gradient-to-r from-accent-pharaoh/10 to-accent-gold/10 rounded-2xl p-6 border border-accent-gold/20">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-accent-pharaoh" />
          <h3 className="text-3xl font-quintessential font-bold text-text-primary">Comprehensive Marketing Analysis</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-pharaoh">{globalStats.detectedTriggers}</div>
            <div className="text-sm text-text-secondary font-quintessential">Triggers Detected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-gold">{globalStats.coverage}%</div>
            <div className="text-sm text-text-secondary font-quintessential">Spectrum Coverage</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(globalStats.avgIntensity * 100)}%
            </div>
            <div className="text-sm text-text-secondary font-quintessential">Avg Intensity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{globalStats.totalTriggers}</div>
            <div className="text-sm text-text-secondary font-quintessential">Total Triggers</div>
          </div>
        </div>
      </div>

      {/* Contrôles de filtrage et tri */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setShowOnlyDetected(!showOnlyDetected)}
            className={`px-4 py-2 rounded-lg font-quintessential font-medium transition-all ${
              showOnlyDetected
                ? 'bg-accent-pharaoh text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            {showOnlyDetected ? 'Show All' : 'Detected Only'}
          </button>
        </div>

        <div className="flex gap-2">
          {[
            { id: 'intensity', label: 'By Intensity', icon: TrendingUp },
            { id: 'count', label: 'By Count', icon: BarChart3 },
            { id: 'alphabetical', label: 'A-Z', icon: Search }
          ].map(sort => (
            <button
              key={sort.id}
              onClick={() => setSortBy(sort.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-quintessential font-medium transition-all ${
                sortBy === sort.id
                  ? 'bg-accent-pharaoh text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <sort.icon className="w-4 h-4" />
              {sort.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grille des triggers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTriggers.map((trigger, index) => (
          <div
            key={trigger.type}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              selectedTrigger === trigger.type
                ? 'border-accent-pharaoh bg-accent-pharaoh/5'
                : trigger.detected
                ? 'border-accent-gold/50 bg-accent-gold/5 hover:border-accent-gold'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
            onClick={() => setSelectedTrigger(selectedTrigger === trigger.type ? null : trigger.type)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: trigger.color }}
                />
                <span className="font-quintessential font-bold text-text-primary">
                  {trigger.type}
                </span>
              </div>
              <div className="text-right">
                {trigger.detected ? (
                  <div className="text-sm text-green-600 font-bold">
                    {trigger.count} occurrence{trigger.count > 1 ? 's' : ''}
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">Not detected</div>
                )}
              </div>
            </div>

            {trigger.detected && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Avg Intensity:</span>
                  <span className="font-bold text-accent-pharaoh">
                    {Math.round(trigger.avgIntensity * 100)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Max Intensity:</span>
                  <span className="font-bold text-accent-gold">
                    {Math.round(trigger.maxIntensity * 100)}%
                  </span>
                </div>
                
                {/* Barre de progression de l'intensité */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${trigger.avgIntensity * 100}%`,
                      backgroundColor: trigger.color
                    }}
                  />
                </div>
              </div>
            )}

            <div className="mt-3 text-xs text-text-muted font-quintessential">
              {trigger.description}
            </div>

            {/* Détails des segments si sélectionné */}
            {selectedTrigger === trigger.type && trigger.detected && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <div className="text-sm font-quintessential font-bold text-text-primary mb-2">
                  Detected Segments:
                </div>
                {trigger.segments.map((segment, segIndex) => (
                  <div
                    key={segIndex}
                    className="p-2 bg-white rounded border text-xs cursor-pointer hover:bg-gray-50"
                    onClick={() => onSegmentClick(segment)}
                  >
                    <div className="font-mono text-text-secondary mb-1">
                      {segment.span.start} → {segment.span.end}
                    </div>
                    <div className="text-text-primary">"{segment.excerpt}"</div>
                    <div className="text-accent-pharaoh font-bold">
                      Intensity: {Math.round(segment.intensity * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recommandations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
        <h4 className="text-xl font-quintessential font-bold text-text-primary mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          Optimization Recommendations
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-quintessential font-bold text-green-800 mb-2">Strengths</h5>
            <ul className="text-sm text-green-700 space-y-1">
              {globalStats.strongestTrigger && (
                <li>• Strong use of {globalStats.strongestTrigger.type} ({Math.round(globalStats.strongestTrigger.avgIntensity * 100)}% intensity)</li>
              )}
              <li>• {globalStats.detectedTriggers} different triggers detected</li>
              <li>• {globalStats.coverage}% spectrum coverage</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-quintessential font-bold text-orange-800 mb-2">Opportunities</h5>
            <ul className="text-sm text-orange-700 space-y-1">
              {triggerSpectrum.filter(t => !t.detected).slice(0, 3).map(trigger => (
                <li key={trigger.type}>• Consider adding {trigger.type}</li>
              ))}
              {globalStats.coverage < 50 && (
                <li>• Expand trigger diversity (currently {globalStats.coverage}%)</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
