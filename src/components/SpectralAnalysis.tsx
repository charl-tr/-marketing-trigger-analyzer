'use client';

import React, { useState, useMemo } from 'react';
import { BarChart3, Target, Brain, Zap, TrendingUp, Eye, Filter, Search, Activity } from 'lucide-react';

interface TriggerAnalysis {
  type: string;
  intensity: number;
  span: { start: number; end: number };
  excerpt: string;
  color?: string;
}

interface SpectralAnalysisProps {
  text: string;
  triggers: TriggerAnalysis[];
  onSegmentClick: (segment: any) => void;
}

interface SpectralData {
  position: number;
  intensity: number;
  triggers: TriggerAnalysis[];
  dominantTrigger: string | null;
  color: string;
}

export default function SpectralAnalysis({ text, triggers, onSegmentClick }: SpectralAnalysisProps) {
  const [resolution, setResolution] = useState<number>(50); // Nombre de points d'analyse
  const [windowSize, setWindowSize] = useState<number>(100); // Taille de la fenêtre d'analyse
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);

  // Créer l'analyse spectrale
  const spectralData = useMemo((): SpectralData[] => {
    const data: SpectralData[] = [];
    const step = Math.max(1, Math.floor(text.length / resolution));
    
    for (let i = 0; i < text.length; i += step) {
      const windowStart = Math.max(0, i - windowSize / 2);
      const windowEnd = Math.min(text.length, i + windowSize / 2);
      
      // Trouver tous les triggers dans cette fenêtre
      const windowTriggers = triggers.filter(trigger => 
        trigger.span.start < windowEnd && trigger.span.end > windowStart
      );
      
      // Calculer l'intensité moyenne dans cette fenêtre
      const avgIntensity = windowTriggers.length > 0 
        ? windowTriggers.reduce((sum, t) => sum + t.intensity, 0) / windowTriggers.length
        : 0;
      
      // Trouver le trigger dominant
      const dominantTrigger = windowTriggers.length > 0
        ? windowTriggers.reduce((max, t) => t.intensity > max.intensity ? t : max)
        : null;
      
      data.push({
        position: i,
        intensity: avgIntensity,
        triggers: windowTriggers,
        dominantTrigger: dominantTrigger?.type || null,
        color: dominantTrigger?.color || '#CCCCCC'
      });
    }
    
    return data;
  }, [text, triggers, resolution, windowSize]);

  // Statistiques spectrales
  const spectralStats = useMemo(() => {
    const intensities = spectralData.map(d => d.intensity);
    const maxIntensity = Math.max(...intensities);
    const avgIntensity = intensities.reduce((sum, i) => sum + i, 0) / intensities.length;
    const peaks = spectralData.filter((d, i) => 
      i > 0 && i < spectralData.length - 1 && 
      d.intensity > spectralData[i-1].intensity && 
      d.intensity > spectralData[i+1].intensity &&
      d.intensity > avgIntensity * 1.5
    );
    
    return {
      maxIntensity,
      avgIntensity,
      peaks: peaks.length,
      coverage: (spectralData.filter(d => d.intensity > 0).length / spectralData.length) * 100
    };
  }, [spectralData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-8 h-8 text-purple-600" />
          <h3 className="text-3xl font-quintessential font-bold text-text-primary">Spectral Analysis</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{Math.round(spectralStats.maxIntensity * 100)}%</div>
            <div className="text-sm text-text-secondary font-quintessential">Peak Intensity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">{spectralStats.peaks}</div>
            <div className="text-sm text-text-secondary font-quintessential">Intensity Peaks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{Math.round(spectralStats.coverage)}%</div>
            <div className="text-sm text-text-secondary font-quintessential">Text Coverage</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{resolution}</div>
            <div className="text-sm text-text-secondary font-quintessential">Analysis Points</div>
          </div>
        </div>
      </div>

      {/* Contrôles */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 items-center">
          <div>
            <label className="block text-sm font-quintessential font-medium text-text-primary mb-1">
              Resolution: {resolution} points
            </label>
            <input
              type="range"
              min="20"
              max="200"
              value={resolution}
              onChange={(e) => setResolution(parseInt(e.target.value))}
              className="w-32"
            />
          </div>
          <div>
            <label className="block text-sm font-quintessential font-medium text-text-primary mb-1">
              Window: {windowSize} chars
            </label>
            <input
              type="range"
              min="50"
              max="500"
              value={windowSize}
              onChange={(e) => setWindowSize(parseInt(e.target.value))}
              className="w-32"
            />
          </div>
        </div>
      </div>

      {/* Graphique spectral */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h4 className="text-lg font-quintessential font-bold text-text-primary mb-4">
          Persuasion Intensity Spectrum
        </h4>
        
        <div className="relative h-64 bg-gray-50 rounded-lg p-4">
          <svg width="100%" height="100%" className="absolute inset-0">
            {/* Grille de fond */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Ligne d'intensité */}
            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              points={spectralData.map((d, i) => 
                `${(i / (spectralData.length - 1)) * 100}%,${100 - (d.intensity * 100)}%`
              ).join(' ')}
            />
            
            {/* Zones de haute intensité */}
            {spectralData.map((d, i) => {
              if (d.intensity > spectralStats.avgIntensity * 1.5) {
                return (
                  <rect
                    key={i}
                    x={`${(i / (spectralData.length - 1)) * 100}%`}
                    y={`${100 - (d.intensity * 100)}%`}
                    width="2"
                    height={`${d.intensity * 100}%`}
                    fill={d.color}
                    opacity="0.7"
                    className="cursor-pointer hover:opacity-100"
                    onClick={() => setSelectedPosition(d.position)}
                  />
                );
              }
              return null;
            })}
            
            {/* Points de données */}
            {spectralData.map((d, i) => (
              <circle
                key={i}
                cx={`${(i / (spectralData.length - 1)) * 100}%`}
                cy={`${100 - (d.intensity * 100)}%`}
                r="3"
                fill={d.color}
                className="cursor-pointer hover:r-5 transition-all"
                onClick={() => setSelectedPosition(d.position)}
              />
            ))}
          </svg>
          
          {/* Axes */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
            <span>0%</span>
          </div>
        </div>
      </div>

      {/* Détails de position sélectionnée */}
      {selectedPosition !== null && (
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <h4 className="text-lg font-quintessential font-bold text-text-primary mb-4">
            Position Analysis: {selectedPosition}
          </h4>
          
          {(() => {
            const selectedData = spectralData.find(d => d.position === selectedPosition);
            if (!selectedData) return null;
            
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-text-secondary">Intensity</div>
                    <div className="text-xl font-bold text-blue-600">
                      {Math.round(selectedData.intensity * 100)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary">Triggers</div>
                    <div className="text-xl font-bold text-purple-600">
                      {selectedData.triggers.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary">Dominant</div>
                    <div className="text-xl font-bold text-green-600">
                      {selectedData.dominantTrigger || 'None'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary">Window</div>
                    <div className="text-xl font-bold text-orange-600">
                      {Math.max(0, selectedPosition - windowSize/2)} - {Math.min(text.length, selectedPosition + windowSize/2)}
                    </div>
                  </div>
                </div>
                
                {selectedData.triggers.length > 0 && (
                  <div>
                    <div className="text-sm font-quintessential font-bold text-text-primary mb-2">
                      Active Triggers:
                    </div>
                    <div className="space-y-2">
                      {selectedData.triggers.map((trigger, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-white rounded border cursor-pointer hover:bg-gray-50"
                          onClick={() => onSegmentClick(trigger)}
                        >
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: trigger.color || '#CCCCCC' }}
                            />
                            <span className="font-quintessential font-bold">{trigger.type}</span>
                          </div>
                          <div className="text-sm text-text-secondary">
                            {Math.round(trigger.intensity * 100)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <div className="text-sm font-quintessential font-bold text-text-primary mb-2">
                    Text Context:
                  </div>
                  <div className="p-3 bg-white rounded border text-sm font-mono">
                    {text.slice(
                      Math.max(0, selectedPosition - 50), 
                      Math.min(text.length, selectedPosition + 50)
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Recommandations spectrales */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
        <h4 className="text-lg font-quintessential font-bold text-text-primary mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          Spectral Optimization
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-quintessential font-bold text-indigo-800 mb-2">Intensity Distribution</h5>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>• {spectralStats.peaks} intensity peaks detected</li>
              <li>• {Math.round(spectralStats.coverage)}% of text has trigger activity</li>
              <li>• Peak intensity: {Math.round(spectralStats.maxIntensity * 100)}%</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-quintessential font-bold text-purple-800 mb-2">Optimization Tips</h5>
            <ul className="text-sm text-purple-700 space-y-1">
              {spectralStats.coverage < 70 && (
                <li>• Increase trigger density in low-intensity areas</li>
              )}
              {spectralStats.peaks < 3 && (
                <li>• Add more intensity peaks for better engagement</li>
              )}
              <li>• Balance intensity distribution across the text</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
