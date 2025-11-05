'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Bug, Database } from 'lucide-react';

interface ApiDebugInfoProps {
  apiResponse: any;
  isVisible: boolean;
  onToggle: () => void;
}

export default function ApiDebugInfo({ apiResponse, isVisible, onToggle }: ApiDebugInfoProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  if (!isVisible || !apiResponse) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      <div 
        className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-gray-200"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-accent-pharaoh" />
            <h3 className="font-quintessential font-bold text-text-primary">API Debug</h3>
          </div>
          <button
            onClick={onToggle}
            className="text-text-secondary hover:text-accent-pharaoh transition-colors"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Status */}
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="font-quintessential font-bold text-green-800">Status: {apiResponse.status}</span>
            </div>
            <p className="text-sm text-green-700 font-quintessential">
              Global Score: {apiResponse.analysis?.summary?.global_score || 'N/A'}
            </p>
          </div>

          {/* Triggers Count */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span className="font-quintessential font-bold text-blue-800">Triggers Found</span>
            </div>
            <p className="text-sm text-blue-700 font-quintessential">
              {apiResponse.analysis?.triggers?.length || 0} triggers detected
            </p>
          </div>

          {/* Triggers Details */}
          <div>
            <button
              onClick={() => toggleSection('triggers')}
              className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              {expandedSections.has('triggers') ? (
                <ChevronUp className="w-4 h-4 text-accent-pharaoh" />
              ) : (
                <ChevronDown className="w-4 h-4 text-accent-pharaoh" />
              )}
              <span className="font-quintessential font-medium text-text-primary">Trigger Details</span>
            </button>
            
            {expandedSections.has('triggers') && (
              <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                {apiResponse.analysis?.triggers?.map((trigger: any, index: number) => (
                  <div key={index} className="p-2 bg-gray-50 rounded-lg text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-quintessential font-bold text-accent-pharaoh">{trigger.type}</span>
                      <span className="text-text-secondary">({Math.round(trigger.intensity * 100)}%)</span>
                    </div>
                    <p className="text-text-secondary font-quintessential mb-1">"{trigger.excerpt}"</p>
                    <p className="text-text-muted font-quintessential">
                      Position: {trigger.span?.start} - {trigger.span?.end}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Raw Data */}
          <div>
            <button
              onClick={() => toggleSection('raw')}
              className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              {expandedSections.has('raw') ? (
                <ChevronUp className="w-4 h-4 text-accent-pharaoh" />
              ) : (
                <ChevronDown className="w-4 h-4 text-accent-pharaoh" />
              )}
              <span className="font-quintessential font-medium text-text-primary">Raw Response</span>
            </button>
            
            {expandedSections.has('raw') && (
              <div className="mt-2">
                <pre className="bg-gray-800 text-green-400 p-3 rounded-lg text-xs overflow-auto max-h-40 font-mono">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
