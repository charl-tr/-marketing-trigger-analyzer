'use client';

import React from 'react';
import { Brain, Zap, Target } from 'lucide-react';

interface ProgressiveAnalysisIndicatorProps {
  isAnalyzing: boolean;
  currentStep: number;
  totalSteps: number;
  currentTriggers: string[];
}

export default function ProgressiveAnalysisIndicator({ 
  isAnalyzing, 
  currentStep, 
  totalSteps, 
  currentTriggers 
}: ProgressiveAnalysisIndicatorProps) {
  if (!isAnalyzing || currentStep === 0) return null;

  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div 
        className="p-4 rounded-2xl backdrop-blur-md border border-accent-pharaoh/20 shadow-lg"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 8px 32px rgba(0, 87, 167, 0.2)',
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-accent-pharaoh/10 rounded-full flex items-center justify-center">
            <Brain className="w-4 h-4 text-accent-pharaoh animate-pulse" />
          </div>
          <div>
            <h4 className="font-quintessential font-bold text-text-primary text-sm">
              Analyzing Triggers
            </h4>
            <p className="text-xs text-text-secondary font-quintessential">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div
            className="bg-gradient-to-r from-accent-gold to-accent-pharaoh h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Current Triggers */}
        {currentTriggers.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-quintessential font-medium text-text-primary">
              Detected triggers:
            </p>
            <div className="flex flex-wrap gap-1">
              {currentTriggers.slice(0, 3).map((trigger, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-quintessential font-medium text-white rounded-full"
                  style={{ backgroundColor: '#0057A7' }}
                >
                  {trigger}
                </span>
              ))}
              {currentTriggers.length > 3 && (
                <span className="px-2 py-1 text-xs font-quintessential font-medium text-text-muted">
                  +{currentTriggers.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Animated dots */}
        <div className="flex items-center gap-1 mt-2">
          <div className="w-1 h-1 bg-accent-pharaoh rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1 h-1 bg-accent-pharaoh rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1 h-1 bg-accent-pharaoh rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
