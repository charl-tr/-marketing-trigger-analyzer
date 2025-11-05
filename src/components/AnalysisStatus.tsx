'use client';

import React from 'react';
import { Brain, AlertCircle } from 'lucide-react';

interface AnalysisStatusProps {
  isAnalyzing: boolean;
  hasApiKey: boolean;
  analysisMode: 'llm' | 'fallback';
}

export default function AnalysisStatus({ isAnalyzing, hasApiKey, analysisMode }: AnalysisStatusProps) {
  if (isAnalyzing) {
    return (
      <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-sm font-medium">
          {analysisMode === 'llm' ? 'Analyse intelligente en cours...' : 'Analyse basique en cours...'}
        </span>
      </div>
    );
  }

  if (analysisMode === 'llm') {
    return (
      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
        <Brain className="h-4 w-4" />
        <span className="text-sm font-medium">Analyse intelligente activée</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg">
      <AlertCircle className="h-4 w-4" />
      <div className="text-sm">
        <span className="font-medium">Mode basique</span>
        <p className="text-xs text-amber-700">
          Ajoutez une clé API OpenAI pour une analyse intelligente
        </p>
      </div>
    </div>
  );
}
