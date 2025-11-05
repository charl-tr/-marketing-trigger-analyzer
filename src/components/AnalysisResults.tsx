import React from 'react';
import { AnalysisResult, TriggerAnalysis } from '@/lib/analysisService';

interface AnalysisResultsProps {
  result: AnalysisResult;
  originalText: string;
}

export default function AnalysisResults({ result, originalText }: AnalysisResultsProps) {
  const { highlighted_text, stats, raw_triggers } = result;

  return (
    <div className="space-y-8">
      {/* Global Score */}
      <div className="text-center">
        <div className="text-4xl font-quintessential font-bold text-accent-pharaoh mb-2">
          {stats.global_score}
        </div>
        <div className="text-lg text-text-secondary font-quintessential">
          Persuasion Score
        </div>
      </div>

      {/* Highlighted Text */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-accent-gold/20">
        <h3 className="text-xl font-quintessential font-bold text-text-primary mb-4">
          Analyzed Text
        </h3>
        <div 
          className="text-lg leading-relaxed text-text-primary font-quintessential"
          dangerouslySetInnerHTML={{ __html: highlighted_text }}
        />
      </div>

      {/* Trigger Distribution */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-accent-gold/20">
        <h3 className="text-xl font-quintessential font-bold text-text-primary mb-6">
          Trigger Distribution
        </h3>
        <div className="space-y-4">
          {stats.distribution.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getTriggerColor(item.trigger) }}
                />
                <span className="font-quintessential text-text-primary">
                  {item.trigger}
                </span>
              </div>
              <span className="font-quintessential font-bold text-accent-pharaoh">
                {item.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Missing Triggers */}
      {stats.missing.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-accent-gold/20">
          <h3 className="text-xl font-quintessential font-bold text-text-primary mb-4">
            Missing Opportunities
          </h3>
          <div className="flex flex-wrap gap-2">
            {stats.missing.map((trigger, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-400/20 text-gray-500 rounded-full text-sm font-quintessential"
              >
                {trigger}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Triggers */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-accent-gold/20">
        <h3 className="text-xl font-quintessential font-bold text-text-primary mb-6">
          Detailed Analysis
        </h3>
        <div className="space-y-4">
          {raw_triggers.map((trigger, index) => (
            <div key={index} className="p-4 bg-white/5 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-quintessential font-bold text-text-primary">
                  {trigger.type}
                </h4>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getTriggerColor(trigger.type) }}
                  />
                  <span className="text-sm font-quintessential text-accent-pharaoh">
                    {Math.round(trigger.intensity * 100)}% intensity
                  </span>
                </div>
              </div>
              <p className="text-sm text-text-secondary font-quintessential">
                "{trigger.excerpt}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getTriggerColor(triggerType: string): string {
  const colorMap: Record<string, string> = {
    'Urgency': '#FF6B6B',
    'Scarcity': '#4ECDC4',
    'Social Proof': '#45B7D1',
    'Authority': '#96CEB4',
    'Reciprocity': '#FFEAA7',
    'Commitment & Consistency': '#DDA0DD',
    'Liking': '#98D8C8',
    'Loss Aversion': '#F7DC6F',
    'Anchoring': '#BB8FCE',
    'Framing': '#85C1E9',
    'Bandwagon': '#F8C471',
    'Fear': '#F1948A',
    'Greed': '#82E0AA',
    'Curiosity Gap': '#F9E79F',
    'Exclusivity': '#D5DBDB',
    'Storytelling': '#AED6F1',
    'Contrast': '#A9DFBF',
    'Call to Action': '#FADBD8'
  };

  return colorMap[triggerType] || '#95A5A6';
}
