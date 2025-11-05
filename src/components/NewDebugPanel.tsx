'use client';

import { useState } from 'react';

interface NewDebugPanelProps {
  data: any;
  isVisible: boolean;
  onToggle: () => void;
}

export default function NewDebugPanel({ data, isVisible, onToggle }: NewDebugPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'results' | 'raw'>('overview');

  if (!isVisible) return null;

  const renderOverview = () => {
    const totalMatches = data?.results?.reduce((sum: number, result: any) => sum + result.matches.length, 0) || 0;
    const triggersWithMatches = data?.results?.filter((result: any) => result.matches.length > 0).length || 0;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-semibold text-blue-800">Total Triggers</h4>
            <p className="text-2xl font-bold text-blue-600">{data?.results?.length || 0}</p>
            <p className="text-sm text-blue-600">analyzed</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="font-semibold text-green-800">Triggers Found</h4>
            <p className="text-2xl font-bold text-green-600">{triggersWithMatches}</p>
            <p className="text-sm text-green-600">with matches</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <h4 className="font-semibold text-purple-800">Total Matches</h4>
            <p className="text-2xl font-bold text-purple-600">{totalMatches}</p>
            <p className="text-sm text-purple-600">passages found</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <h4 className="font-semibold text-orange-800">Text Length</h4>
            <p className="text-2xl font-bold text-orange-600">{data?.text?.length || 0}</p>
            <p className="text-sm text-orange-600">characters</p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Text Preview</h4>
          <p className="text-sm text-gray-600 italic">"{data?.text?.substring(0, 100)}..."</p>
        </div>
      </div>
    );
  };

  const renderResults = () => (
    <div>
      <h4 className="font-semibold mb-3">Trigger Analysis Results</h4>
      <div className="space-y-4">
        {data?.results?.map((result: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h5 className="font-semibold text-lg capitalize">{result.trigger}</h5>
              <span className={`px-2 py-1 rounded text-sm ${
                result.matches.length > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {result.matches.length} matches
              </span>
            </div>
            
            {result.matches.length > 0 ? (
              <div className="space-y-2">
                {result.matches.map((match: any, matchIndex: number) => (
                  <div key={matchIndex} className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium">Intensity: {match.intensity}%</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${match.intensity}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 italic">"{match.text}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No matches found for this trigger</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'results':
        return renderResults();
      case 'raw':
        return (
          <div>
            <h4 className="font-semibold mb-3">Raw API Response</h4>
            <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-96">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h3 className="font-semibold text-gray-800">🔍 New Architecture Debug</h3>
        <button
          onClick={onToggle}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'results', label: 'Results', icon: '🎯' },
          { id: 'raw', label: 'Raw', icon: '📄' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-100 text-blue-800 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 max-h-64 overflow-auto">
        {renderTabContent()}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 rounded-b-lg text-xs text-gray-500">
        New Architecture - Parallel Trigger Analysis
      </div>
    </div>
  );
}

