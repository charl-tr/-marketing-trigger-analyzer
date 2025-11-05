import React from 'react';
import { Loader2, Brain, Zap, CheckCircle } from 'lucide-react';

interface AnalysisProgressProps {
  isAnalyzing: boolean;
  step?: 'validating' | 'sending' | 'processing' | 'complete';
}

export default function AnalysisProgress({ isAnalyzing, step = 'validating' }: AnalysisProgressProps) {
  if (!isAnalyzing) return null;

  const getStepInfo = () => {
    switch (step) {
      case 'validating':
        return {
          icon: <CheckCircle className="w-6 h-6 text-green-500" />,
          text: 'Validating input...',
          description: 'Checking text format and length'
        };
      case 'sending':
        return {
          icon: <Zap className="w-6 h-6 text-blue-500 animate-pulse" />,
          text: 'Sending to AI...',
          description: 'Analyzing with OpenAI GPT-4o-mini'
        };
      case 'processing':
        return {
          icon: <Brain className="w-6 h-6 text-purple-500 animate-pulse" />,
          text: 'Processing results...',
          description: 'Identifying persuasion triggers'
        };
      case 'complete':
        return {
          icon: <CheckCircle className="w-6 h-6 text-green-500" />,
          text: 'Analysis complete!',
          description: 'Results ready to display'
        };
      default:
        return {
          icon: <Loader2 className="w-6 h-6 text-accent-pharaoh animate-spin" />,
          text: 'Analyzing...',
          description: 'Please wait while we analyze your text'
        };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div 
        className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-accent-gold/20 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,245,240,0.95) 100%)',
          boxShadow: '0 20px 60px rgba(0, 87, 167, 0.2)',
        }}
      >
        <div className="text-center">
          {/* Icon */}
          <div className="mb-6">
            {stepInfo.icon}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-quintessential font-bold text-text-primary mb-2">
            {stepInfo.text}
          </h3>

          {/* Description */}
          <p className="text-sm text-text-secondary font-quintessential mb-6">
            {stepInfo.description}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-accent-pharaoh to-accent-gold h-2 rounded-full transition-all duration-1000"
              style={{
                width: step === 'validating' ? '25%' : 
                       step === 'sending' ? '50%' : 
                       step === 'processing' ? '75%' : '100%'
              }}
            />
          </div>

          {/* Debug Info */}
          <div className="text-xs text-text-muted font-quintessential">
            <div>Step: {step}</div>
            <div>Status: {isAnalyzing ? 'Processing' : 'Complete'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
