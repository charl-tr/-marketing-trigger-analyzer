'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Settings, Key, Eye, BarChart3, Target, XCircle, Cog, Wrench, Save } from 'lucide-react';
import LaserScan from './LaserScan';
import PremiumAmbiance from './PremiumAmbiance';
import CircularDashboard from './CircularDashboard';
import { AnalysisService, type TriggerAnalysis } from '@/lib/analysisService';
import ApiKeyStatus from './ApiKeyStatus';
import MicroAnalysis from './MicroAnalysis';
import AdvancedMicroAnalysis from './AdvancedMicroAnalysis';
import TriggerHighlighter from './TriggerHighlighter';
import NavigationButton from './NavigationButton';
import DetectedTriggersLegend from './DetectedTriggersLegend';

interface AnalysisResult {
  trigger: {
    id: string;
    name: string;
    color: string;
    description: string;
  };
  matches: {
    text: string;
    start: number;
    end: number;
  }[];
  confidence: number;
}

interface AnalyzedText {
  id: string;
  originalText: string;
  analysis: AnalysisResult[];
  timestamp: Date;
}

export default function SimplePrismAnalyzer() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult[]>([]);
  const [analyzedTexts, setAnalyzedTexts] = useState<AnalyzedText[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<'llm' | 'fallback'>('fallback');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showApiKeyManager, setShowApiKeyManager] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isLaserActive, setIsLaserActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMicroAnalysis, setShowMicroAnalysis] = useState(false);
  const [useAdvancedMicroAnalysis, setUseAdvancedMicroAnalysis] = useState(true);
  const [showSimpleMode, setShowSimpleMode] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [rawAnalysisData, setRawAnalysisData] = useState<any>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check for API key on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey && storedKey.startsWith('sk-')) {
      setHasApiKey(true);
    }
  }, []);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setShowResults(false);
    setIsLaserActive(true);

    try {
      const apiKey = localStorage.getItem('openai_api_key');
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, apiKey }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Convert API response to frontend format
        const triggerMap: { [key: string]: any } = {
          'Urgency': { id: 'urgency', name: 'Urgency', color: '#DFAE6A', description: 'Encourage immediate action by emphasizing genuine time constraints or deadlines.' },
          'Scarcity': { id: 'scarcity', name: 'Scarcity', color: '#C6A664', description: 'Create desire by limiting availability of products, services, or opportunities.' },
          'Social Proof': { id: 'social-proof', name: 'Social Proof', color: '#0057A7', description: 'Use testimonials, reviews, and social validation to build trust.' },
          'Authority': { id: 'authority', name: 'Authority', color: '#8B4513', description: 'Leverage expertise, credentials, and recognized authorities.' },
          'Reciprocity': { id: 'reciprocity', name: 'Reciprocity', color: '#228B22', description: 'Give something valuable first to create obligation to reciprocate.' },
          'Commitment & Consistency': { id: 'commitment', name: 'Commitment & Consistency', color: '#FF6347', description: 'Get small commitments that lead to larger ones.' },
          'Liking': { id: 'liking', name: 'Liking', color: '#FF69B4', description: 'Build rapport and make people like you before asking.' },
          'Loss Aversion': { id: 'loss-aversion', name: 'Loss Aversion', color: '#DC143C', description: 'Emphasize what they will lose if they don\'t act.' },
          'Anchoring': { id: 'anchoring', name: 'Anchoring', color: '#4169E1', description: 'Set a reference point to influence perception of value.' },
          'Framing': { id: 'framing', name: 'Framing', color: '#32CD32', description: 'Present information in a way that influences decision-making.' },
          'Bandwagon': { id: 'bandwagon', name: 'Bandwagon', color: '#FF8C00', description: 'Create fear of missing out by showing others are doing it.' },
          'Fear': { id: 'fear', name: 'Fear', color: '#8B0000', description: 'Use fear of consequences to motivate action.' },
          'Greed': { id: 'greed', name: 'Greed', color: '#FFD700', description: 'Appeal to desire for gain and profit.' },
          'Curiosity Gap': { id: 'curiosity-gap', name: 'Curiosity Gap', color: '#9370DB', description: 'Create curiosity by promising to reveal something valuable.' },
          'Exclusivity': { id: 'exclusivity', name: 'Exclusivity', color: '#C0C0C0', description: 'Make something seem exclusive or limited to special people.' },
          'Storytelling': { id: 'storytelling', name: 'Storytelling', color: '#FF1493', description: 'Use compelling narratives to engage and persuade.' },
          'Contrast': { id: 'contrast', name: 'Contrast', color: '#00CED1', description: 'Show dramatic differences to make choices clearer.' },
          'Call to Action': { id: 'call-to-action', name: 'Call to Action', color: '#FF4500', description: 'Clear, compelling instructions on what to do next.' }
        };

        const convertedAnalysis: AnalysisResult[] = data.analysis.triggers.map((trigger: any) => ({
          trigger: triggerMap[trigger.type] || {
            id: trigger.type.toLowerCase().replace(/\s+/g, '-'),
            name: trigger.type,
            color: '#0057A7',
            description: 'Marketing trigger detected'
          },
          matches: [{
            text: trigger.excerpt,
            start: trigger.span.start,
            end: trigger.span.end
          }],
          confidence: trigger.intensity
        }));

        setAnalysis(convertedAnalysis);
        setRawAnalysisData(data.analysis);
        setShowResults(true);
        setAnalysisMode('llm');
      } else {
        throw new Error(data.message || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error instanceof Error ? error.message : 'Analysis failed');
      setAnalysisMode('fallback');
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setIsLaserActive(false), 1000);
    }
  };

  const getHighlightedSegments = () => {
    if (!rawAnalysisData?.triggers) return [];
    
    return rawAnalysisData.triggers.map((trigger: any) => ({
      text: trigger.excerpt,
      start: trigger.span.start,
      end: trigger.span.end,
      trigger: {
        id: trigger.type.toLowerCase().replace(/\s+/g, '-'),
        name: trigger.type,
        color: '#0057A7',
        description: 'Marketing trigger detected'
      },
      confidence: trigger.intensity
    }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Premium Background Ambiance */}
      <div className="absolute inset-0 pointer-events-none">
        <PremiumAmbiance />
        
        {/* Mystical Overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(0, 87, 167, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(198, 166, 100, 0.1) 0%, transparent 50%),
              linear-gradient(45deg, transparent 48%, rgba(198, 166, 100, 0.05) 49%, rgba(198, 166, 100, 0.05) 51%, transparent 52%)
            `,
            backgroundSize: '400px 400px, 300px 300px, 200px 200px',
          }}
        />
      </div>

      {/* Premium Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center px-8 py-4 rounded-2xl backdrop-blur-xl border border-white/30 bg-white/10 shadow-2xl">
            {/* Left side - Trigger Library */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.location.href = '/admin'}
                className="group flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-blue-700 transition-all duration-300 hover:scale-105 bg-blue-50/50 border border-blue-200/50 backdrop-blur-sm shadow-lg hover:shadow-xl"
              >
                <Cog className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span>Trigger Library</span>
              </button>
            </div>

            {/* Right side - API Status & Configuration */}
            <div className="flex items-center gap-4">
              {/* API Status with Premium Design */}
              <div className={`flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-sm border ${
                hasApiKey 
                  ? 'bg-green-50/50 border-green-200/50 text-green-700' 
                  : 'bg-red-50/50 border-red-200/50 text-red-700'
              }`}>
                <div className={`w-3 h-3 rounded-full ${hasApiKey ? 'bg-green-400' : 'bg-red-400'} animate-pulse shadow-lg`} />
                <span className="text-sm font-medium">
                  {hasApiKey ? 'API Connected' : 'No API Key'}
                </span>
              </div>

              <button
                onClick={() => setShowApiKeyManager(!showApiKeyManager)}
                className="group flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 bg-gradient-to-r from-amber-600 to-yellow-600 border border-amber-500/50 backdrop-blur-sm shadow-lg hover:shadow-xl"
              >
                <Key className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>{hasApiKey ? 'Configure API' : 'Add API Key'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 pt-24">
        {/* Hero Section - Premium Design */}
        <div className="text-center mb-16 relative">
          {/* Premium Glassmorphism Background */}
          <div className="absolute inset-0 rounded-3xl backdrop-blur-3xl border border-white/40 bg-white/20 shadow-2xl">
            {/* Mystical Aura Effect */}
            <div className="absolute inset-0 opacity-40 animate-pulse rounded-3xl bg-gradient-radial from-blue-200/30 via-amber-200/20 to-transparent" />
            
            {/* Sacred Geometry Overlay */}
            <div 
              className="absolute inset-0 opacity-15 rounded-3xl"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 25% 25%, rgba(198, 166, 100, 0.3) 3px, transparent 3px),
                  radial-gradient(circle at 75% 75%, rgba(0, 87, 167, 0.3) 3px, transparent 3px),
                  linear-gradient(45deg, transparent 48%, rgba(198, 166, 100, 0.15) 49%, rgba(198, 166, 100, 0.15) 51%, transparent 52%)
                `,
                backgroundSize: '150px 150px, 120px 120px, 100px 100px',
              }}
            />
          </div>
          
          {/* Logo and Title Section */}
          <div className="relative z-10 py-20">
            {/* Centered Logo with Premium Effects */}
            <div className="flex justify-center items-center mb-12">
              <div className="relative group">
                {/* Animated Golden Halo */}
                <div className="absolute inset-0 rounded-full opacity-70 animate-pulse bg-gradient-radial from-yellow-300/80 via-yellow-200/40 to-transparent scale-150 blur-3xl" />
                
                {/* Logo Image with Premium Effects */}
                <img 
                  src="/logo-prism.png" 
                  alt="Prism Logo" 
                  className="w-40 h-40 relative z-10 drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Floating Light Particles */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-6 left-6 w-3 h-3 bg-yellow-300 rounded-full animate-pulse opacity-70"></div>
                  <div className="absolute top-12 right-8 w-2 h-2 bg-blue-300 rounded-full animate-pulse opacity-50" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute bottom-8 left-10 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse opacity-60" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute bottom-12 right-6 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse opacity-40" style={{ animationDelay: '1.5s' }}></div>
                </div>
              </div>
            </div>
            
            {/* Premium Title Section */}
            <div className="mb-8">
              <h1 className="text-7xl md:text-8xl font-bold mb-6 animate-bounce bg-gradient-to-r from-blue-700 via-amber-600 to-blue-700 bg-clip-text text-transparent">
                Prism
              </h1>
              
              <h2 className="text-4xl md:text-5xl font-medium text-blue-700 mb-8 animate-pulse">
                See the persuasion beneath words
              </h2>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed opacity-90">
                Unlock the hidden architecture of persuasion in any text with our advanced AI-powered analysis
              </p>
            </div>
          </div>
        </div>

        {/* Premium Input Section */}
        <div className="mb-16 relative">
          {/* Premium Glassmorphism Container */}
          <div className="relative p-12 rounded-3xl backdrop-blur-3xl border border-white/40 bg-white/30 shadow-2xl">
            <div className="relative">
              {/* Sacred Text Area */}
              {showResults && analysis.length > 0 ? (
                <div className="w-full px-8 py-8 border-0 rounded-2xl text-gray-800 leading-relaxed overflow-auto backdrop-blur-xl border border-white/30 bg-white/20 shadow-xl">
                  <TriggerHighlighter 
                    text={text}
                    matches={getHighlightedSegments()}
                    className="text-lg leading-relaxed text-gray-800"
                  />
                </div>
              ) : (
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder=""
                  className="w-full px-8 py-8 border-0 rounded-2xl focus:outline-none resize-none leading-relaxed text-lg transition-all duration-500 backdrop-blur-xl border border-white/30 bg-white/20 shadow-xl text-gray-800"
                  style={{
                    minHeight: '500px',
                    maxHeight: '80vh',
                    height: `${Math.max(500, Math.min(800, text.split('\n').length * 28 + 150))}px`,
                    fontSize: '1.1rem',
                  }}
                />
              )}
              
              {/* Poetic Placeholder */}
              {!text && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-8 py-8">
                  <div className="text-center">
                    <p className="text-2xl text-blue-700 mb-4 opacity-80">
                      Paste your copy... and let Prism reveal the persuasion beneath your words.
                    </p>
                    <div className="flex justify-center space-x-2">
                      <div className="w-2 h-2 bg-blue-700 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-blue-700 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Premium CTA Button */}
        <div className="flex justify-center mb-16">
          <div className="relative group">
            {/* Glow Around Edges */}
            <div className="absolute inset-0 rounded-3xl opacity-80 animate-pulse bg-gradient-radial from-blue-400/60 via-amber-400/40 to-transparent scale-110 blur-xl" />
            
            {/* Premium CTA Button */}
            <button
              onClick={handleAnalyze}
              disabled={!text.trim() || isAnalyzing}
              className="relative px-20 py-6 rounded-3xl text-2xl font-medium transition-all duration-600 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group backdrop-blur-xl bg-gradient-to-r from-blue-700 to-blue-800 text-white border border-blue-600/50 shadow-2xl hover:shadow-3xl"
            >
              {/* Animated Light Ray Sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500" />
              
              {/* Button Content */}
              <div className="relative z-10 flex items-center gap-4">
                {isAnalyzing ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                ) : (
                  <Sparkles className="w-6 h-6" />
                )}
                {isAnalyzing ? 'Analyzing...' : 'Reveal the Triggers'}
              </div>
            </button>
          </div>
        </div>

        {/* Laser Scan Effect */}
        {isLaserActive && (
          <LaserScan />
        )}

        {/* Analysis Results */}
        {showResults && analysis.length > 0 && (
          <div className="space-y-8">
            {/* Dashboard */}
            <div className="flex justify-center">
              <CircularDashboard 
                triggers={rawAnalysisData?.stats?.distribution?.map((item: any) => ({
                  name: item.trigger,
                  count: item.count,
                  percentage: item.percent,
                  color: '#0057A7'
                })) || []}
                totalScore={rawAnalysisData?.stats?.global_score || 0}
              />
            </div>

            {/* Detected Triggers Legend */}
            <DetectedTriggersLegend matches={getHighlightedSegments()} />

            {/* Micro Analysis */}
            {showMicroAnalysis && (
              <div className="mt-8">
                {useAdvancedMicroAnalysis ? (
                  <AdvancedMicroAnalysis 
                    text={text}
                    analysis={rawAnalysisData}
                  />
                ) : (
                  <MicroAnalysis 
                    text={text}
                    analysis={rawAnalysisData}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-8 p-6 bg-red-100 border border-red-300 rounded-xl text-red-700 font-medium">
            {error}
          </div>
        )}
      </div>

      {/* API Key Manager Modal */}
      {showApiKeyManager && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 rounded-3xl backdrop-blur-xl border border-white/30 bg-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800">API Configuration</h2>
              <button
                onClick={() => setShowApiKeyManager(false)}
                className="group relative px-4 py-2 rounded-xl font-medium text-lg transition-all duration-400 overflow-hidden backdrop-blur-sm bg-white/25 border border-blue-200/50 text-blue-700 shadow-lg"
              >
                <div className="relative z-10">×</div>
              </button>
            </div>
            <ApiKeyStatus onApiKeyChange={setHasApiKey} />
          </div>
        </div>
      )}
    </div>
  );
}
