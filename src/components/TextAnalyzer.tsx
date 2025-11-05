'use client';

import React, { useState, useRef } from 'react';
import { Upload, Sparkles, Settings, Key } from 'lucide-react';
import Link from 'next/link';
import { marketingTriggers } from '@/lib/triggers';
import AnalysisStatus from './AnalysisStatus';
import ApiKeyManager from './ApiKeyManager';

interface AnalysisResult {
  trigger: {
    id: string;
    name: string;
    description: string;
    color: string;
  };
  matches: {
    text: string;
    start: number;
    end: number;
  }[];
}

interface AnalyzedText {
  id: string;
  originalText: string;
  analysis: AnalysisResult[];
  timestamp: Date;
}

export default function TextAnalyzer() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult[]>([]);
  const [analyzedTexts, setAnalyzedTexts] = useState<AnalyzedText[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<'llm' | 'fallback'>('fallback');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showApiKeyManager, setShowApiKeyManager] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Vérifier la clé API au chargement
  React.useEffect(() => {
    const apiKey = localStorage.getItem('openai_api_key');
    setHasApiKey(!!apiKey);
  }, []);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      // Récupérer la clé API depuis localStorage
      const apiKey = localStorage.getItem('openai_api_key') || '';
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, apiKey }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Détecter le mode d'analyse
        setAnalysisMode(data.analysisMode || 'fallback');
        setHasApiKey(data.hasApiKey || false);
        
        // Convertir les résultats de l'API vers le format attendu par l'interface
        const convertedResults = data.results
          .filter((result: any) => result.trigger)
          .reduce((acc: any, result: any) => {
            const existingTrigger = acc.find((r: any) => r.trigger.id === result.trigger);
            if (existingTrigger) {
              existingTrigger.matches.push({
                text: result.highlighted_text || result.segment,
                start: text.indexOf(result.segment),
                end: text.indexOf(result.segment) + result.segment.length
              });
            } else {
              const triggerInfo = data.statistics.find((stat: any) => stat.id === result.trigger);
              if (triggerInfo) {
                acc.push({
                  trigger: {
                    id: triggerInfo.id,
                    name: triggerInfo.name,
                    color: triggerInfo.color,
                    description: result.explanation
                  },
                  matches: [{
                    text: result.highlighted_text || result.segment,
                    start: text.indexOf(result.segment),
                    end: text.indexOf(result.segment) + result.segment.length
                  }]
                });
              }
            }
            return acc;
          }, []);
        
        setAnalysis(convertedResults);
      } else {
        console.error('Erreur API:', data.error);
        setAnalysis([]);
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      setAnalysis([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveAnalysis = () => {
    if (!text.trim() || analysis.length === 0) return;
    
    const newAnalyzedText: AnalyzedText = {
      id: Date.now().toString(),
      originalText: text,
      analysis,
      timestamp: new Date()
    };
    
    setAnalyzedTexts(prev => [newAnalyzedText, ...prev]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setText(content);
    };
    reader.readAsText(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(content);
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const getHighlightedText = () => {
    if (analysis.length === 0) return text;
    
    const sortedMatches = analysis
      .flatMap(result => result.matches.map(match => ({ ...match, trigger: result.trigger })))
      .sort((a, b) => a.start - b.start);
    
    let highlightedText = '';
    let lastIndex = 0;
    
    sortedMatches.forEach((match, index) => {
      // Add text before the match
      highlightedText += text.slice(lastIndex, match.start);
      
      // Add the highlighted match
      highlightedText += `<span class="highlighted-text" style="background-color: ${match.trigger.color}20; border-left: 3px solid ${match.trigger.color}; padding: 2px 4px; margin: 0 1px; border-radius: 3px;" data-trigger="${match.trigger.id}" title="${match.trigger.name}: ${match.trigger.description}">${match.text}</span>`;
      
      lastIndex = match.end;
    });
    
    // Add remaining text
    highlightedText += text.slice(lastIndex);
    
    return highlightedText;
  };

  const getTriggerSummary = () => {
    const triggerCounts = analysis.reduce((acc, result) => {
      acc[result.trigger.name] = (acc[result.trigger.name] || 0) + result.matches.length;
      return acc;
    }, {} as Record<string, number>);
    
    return triggerCounts;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="relative">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
            🧠 Marketing Trigger Analyzer
          </h1>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
        </div>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Découvrez les <span className="font-semibold text-purple-600">techniques psychologiques</span> cachées dans vos textes marketing
        </p>
        <div className="flex justify-center items-center space-x-6">
          <div className="flex space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Analyse en temps réel
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              15+ déclencheurs détectés
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Interface intuitive
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowApiKeyManager(!showApiKeyManager)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors text-sm font-medium"
            >
              <Key className="h-4 w-4" />
              {hasApiKey ? 'Configurer API' : 'Ajouter clé API'}
            </button>
            <Link 
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
            >
              <Settings className="h-4 w-4" />
              Administration
            </Link>
          </div>
        </div>
      </div>

      {/* API Key Manager Modal */}
      {showApiKeyManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Configuration de l'API</h2>
                <button
                  onClick={() => setShowApiKeyManager(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <ApiKeyManager onApiKeyChange={setHasApiKey} />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl border-2 border-dashed border-purple-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div
              className="text-center space-y-6"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="relative">
                <Upload className="mx-auto h-16 w-16 text-purple-400" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✨</span>
                </div>
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-800 mb-2">
                  📁 Glissez votre fichier ici
                </p>
                <p className="text-gray-600 mb-4">
                  Ou collez directement votre texte en dessous
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                  💡 <strong>Astuce :</strong> L'analyse fonctionne avec tous types de contenus marketing
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
              >
                📂 Choisir un fichier
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-lg font-semibold text-gray-800 flex items-center">
              ✍️ Ou collez votre texte ici :
            </label>
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Collez votre copy marketing, email de vente, post LinkedIn, ou tout autre contenu que vous voulez analyser... 

Exemple : 'Cette méthode a déjà transformé la vie de plus de 500 hommes. Et aujourd'hui, c'est peut-être à votre tour. Cliquez sur le bouton sous cette vidéo, et laissez-moi vous montrer comment ça marche.'"
                className="w-full h-64 p-6 border-2 border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 resize-none shadow-inner bg-gradient-to-br from-white to-purple-50 text-gray-700 placeholder-gray-500 leading-relaxed"
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-2 py-1 rounded-full shadow-sm">
                {text.length} caractères
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <AnalysisStatus 
              isAnalyzing={isAnalyzing}
              hasApiKey={hasApiKey}
              analysisMode={analysisMode}
            />
            
            <div className="flex gap-3">
              <button
                onClick={handleAnalyze}
                disabled={!text.trim() || isAnalyzing}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-2xl hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-xl font-bold text-lg"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    🔍 Analyse en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-6 w-6" />
                    🚀 Analyser le texte
                  </>
                )}
              </button>
              {analysis.length > 0 && (
                <button
                  onClick={handleSaveAnalysis}
                  className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                >
                  💾 Sauvegarder
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {analysis.length > 0 && (
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl border-2 border-blue-200 p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">🎯</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Résultats de l'analyse</h3>
              </div>
              
              {/* Trigger Summary */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  🔍 Déclencheurs détectés :
                </h4>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(getTriggerSummary()).map(([trigger, count]) => (
                    <span
                      key={trigger}
                      className="px-4 py-2 text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      style={{
                        backgroundColor: marketingTriggers.find(t => t.name === trigger)?.color + '20',
                        color: marketingTriggers.find(t => t.name === trigger)?.color,
                        border: `2px solid ${marketingTriggers.find(t => t.name === trigger)?.color}40`
                      }}
                    >
                      {trigger} <span className="bg-white bg-opacity-50 px-2 py-1 rounded-full ml-2">{count}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Highlighted Text */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Highlighted Text:</h4>
                <div 
                  className="p-4 bg-gray-50 rounded-lg text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: getHighlightedText() }}
                />
              </div>

              {/* Detailed Analysis */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Detailed Analysis:</h4>
                <div className="space-y-2">
                  {analysis.map((result, index) => (
                    <div key={index} className="p-3 rounded-lg border-l-4" style={{ borderLeftColor: result.trigger.color }}>
                      <div className="flex items-center gap-2 mb-1">
                        <span 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: result.trigger.color }}
                        />
                        <span className="font-medium">{result.trigger.name}</span>
                        <span className="text-sm text-gray-500">({result.matches.length} matches)</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{result.trigger.description}</p>
                      <div className="text-xs text-gray-500">
                        Matches: {result.matches.map(m => `"${m.text}"`).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Saved Analyses */}
          {analyzedTexts.length > 0 && (
            <div className="bg-white rounded-lg border p-4">
              <h3 className="text-lg font-semibold mb-3">Saved Analyses</h3>
              <div className="space-y-2">
                {analyzedTexts.map((analyzed) => (
                  <div key={analyzed.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {analyzed.timestamp.toLocaleString()}
                      </span>
                      <button
                        onClick={() => {
                          setText(analyzed.originalText);
                          setAnalysis(analyzed.analysis);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Load
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {analyzed.originalText.substring(0, 100)}...
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {analyzed.analysis.map((result, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs rounded"
                          style={{
                            backgroundColor: result.trigger.color + '20',
                            color: result.trigger.color
                          }}
                        >
                          {result.trigger.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
