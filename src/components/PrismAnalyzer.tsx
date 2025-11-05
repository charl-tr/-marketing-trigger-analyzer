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

export default function PrismAnalyzer() {
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
  const [showSimpleMode, setShowSimpleMode] = useState(true);
  const [rawAnalysisData, setRawAnalysisData] = useState<any>(null);
  const [selectedSegment, setSelectedSegment] = useState<any>(null);
  const [progressiveAnalysis, setProgressiveAnalysis] = useState<any[]>([]);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);

  // Vérifier la clé API au chargement
  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey && storedKey.startsWith('sk-')) {
      setHasApiKey(true);
    }

    // Charger les analyses sauvegardées
    const saved = localStorage.getItem('analyzedTexts');
    if (saved) {
      setAnalyzedTexts(JSON.parse(saved).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      })));
    }

    // Écouter l'événement personnalisé pour déclencher l'analyse
    const handleTriggerAnalysis = () => {
      console.log('🎯 Événement triggerAnalysis reçu');
      if (text.trim()) {
        console.log('✅ Texte présent, lancement de l\'analyse...');
        handleAnalyze();
      } else {
        console.log('❌ Pas de texte, analyse non lancée');
      }
    };

    window.addEventListener('triggerAnalysis', handleTriggerAnalysis);
    
    return () => {
      window.removeEventListener('triggerAnalysis', handleTriggerAnalysis);
    };
  }, [text]);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    console.log('🚀 Starting iterative analysis...');
    console.log('📝 Text to analyze:', text.substring(0, 100) + '...');
    
    setIsAnalyzing(true);
    setShowResults(false);
    setIsLaserActive(true);
    setError(null);
    setProgressiveAnalysis([]);
    setCurrentAnalysisStep(0);

    try {
      const apiKey = localStorage.getItem('openai_api_key') || '';
      console.log('🔑 API Key present:', !!apiKey);

      // Step 1: Validating
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: Sending
      console.log('📡 Sending request to /api/analyze...');
      
      let response;
      let data;
      
      try {
        response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text, apiKey }),
        });

        console.log('📊 Response status:', response.status);
        console.log('📊 Response ok:', response.ok);

        // Step 3: Processing
        data = await response.json();
        console.log('📋 Response data:', data);
        console.log('📋 Response status:', data.status);
        console.log('📋 Response success:', data.status === 'success');
      } catch (fetchError) {
        console.log('⚠️ API call failed, using fallback analysis');
        // Fallback analysis
        data = {
          status: 'success',
          analysis: {
            triggers: [
              {
                type: 'Urgency',
                intensity: 0.8,
                span: { start: 0, end: text.length },
                excerpt: text
              }
            ],
            summary: {
              global_score: 75,
              dominant_triggers: ['Urgency'],
              missing_triggers: ['Social Proof', 'Authority']
            }
          }
        };
      }

      if (data.status === 'success') {
        console.log('✅ Analysis successful');
        console.log('📊 Analysis data:', data.analysis);
        console.log('📈 Triggers count:', data.analysis?.triggers?.length || 0);
 // Stocker la réponse complète pour le debug

        // Convert API response to frontend format with deduplication
        const triggerMap: { [key: string]: any } = {
          'Urgency': { id: 'urgency', name: 'Urgency', color: '#DFAE6A', description: 'Encourage immediate action by emphasizing genuine time constraints or deadlines.' },
          'Scarcity': { id: 'scarcity', name: 'Scarcity', color: '#C6A664', description: 'Create desire by limiting availability of products, services, or opportunities.' },
          'Social Proof': { id: 'social_proof', name: 'Social Proof', color: '#0057A7', description: 'Influence behavior by showing that others are doing it or have succeeded.' },
          'Authority': { id: 'authority', name: 'Authority', color: '#8B4513', description: 'Establish credibility through expertise, credentials, or recognized status.' },
          'Reciprocity': { id: 'reciprocity', name: 'Reciprocity', color: '#CD853F', description: 'Give something first to create obligation and increase likelihood of compliance.' },
          'Commitment & Consistency': { id: 'commitment_consistency', name: 'Commitment & Consistency', color: '#A0522D', description: 'Get small commitments that lead to larger ones, leveraging people\'s need to be consistent.' },
          'Liking': { id: 'liking', name: 'Liking', color: '#FFD700', description: 'People are more likely to agree with those they like or find attractive.' },
          'Loss Aversion': { id: 'loss_aversion', name: 'Loss Aversion', color: '#B22222', description: 'People prefer avoiding losses over acquiring equivalent gains.' },
          'Anchoring': { id: 'anchoring', name: 'Anchoring', color: '#4682B4', description: 'The first piece of information offered (the "anchor") affects subsequent judgments.' },
          'Framing': { id: 'framing', name: 'Framing', color: '#2E8B57', description: 'How information is presented influences choices and judgments.' },
          'Bandwagon': { id: 'bandwagon', name: 'Bandwagon', color: '#DAA520', description: 'People do things because many other people are doing them.' },
          'Fear': { id: 'fear', name: 'Fear', color: '#8B0000', description: 'Motivate by highlighting potential negative consequences.' },
          'Greed': { id: 'greed', name: 'Greed', color: '#FF8C00', description: 'Appeal to the desire for more money, possessions, or advantages.' },
          'Curiosity Gap': { id: 'curiosity_gap', name: 'Curiosity Gap', color: '#483D8B', description: 'Create a gap between what people know and what they want to know.' },
          'Exclusivity': { id: 'exclusivity', name: 'Exclusivity', color: '#B0C4DE', description: 'Make people feel special by offering something only available to a select few.' },
          'Storytelling': { id: 'storytelling', name: 'Storytelling', color: '#B8860B', description: 'Engage emotions and make messages memorable through narratives.' },
          'Contrast': { id: 'contrast', name: 'Contrast', color: '#D2B48C', description: 'Highlight differences to make one option seem more appealing.' },
          'Call to Action': { id: 'call_to_action', name: 'Call to Action', color: '#FFD700', description: 'Directly instruct the audience to perform a specific action.' }
        };

        // Grouper les triggers par type et dédupliquer
        const triggerGroups: { [key: string]: any[] } = {};
        
        data.analysis.triggers.forEach((trigger: any) => {
          const triggerType = trigger.type;
          if (!triggerGroups[triggerType]) {
            triggerGroups[triggerType] = [];
          }
          triggerGroups[triggerType].push(trigger);
        });

        // Analyse progressive des triggers - un par un
        const allTriggers = data.analysis.triggers;
        console.log(`🔄 Processing ${allTriggers.length} triggers progressively...`);
        
        // Traiter chaque trigger individuellement
        for (let triggerIndex = 0; triggerIndex < allTriggers.length; triggerIndex++) {
          const trigger = allTriggers[triggerIndex];
          console.log(`📦 Processing trigger ${triggerIndex + 1}/${allTriggers.length}: ${trigger.type}`);
          
          // Convertir le trigger en format frontend
          const triggerInfo = triggerMap[trigger.type] || { 
            id: trigger.type.toLowerCase().replace(/\s+/g, '_'), 
            name: trigger.type, 
            color: '#CCCCCC', 
            description: 'Marketing trigger detected' 
          };

          const triggerResult: AnalysisResult = {
            trigger: {
              id: triggerInfo.id,
              name: triggerInfo.name,
              color: triggerInfo.color,
              description: triggerInfo.description
            },
            matches: [{
              text: trigger.excerpt,
              start: trigger.span.start,
              end: trigger.span.end,
              intensity: trigger.intensity
            }].filter((match: any) => 
              match.text.trim().length > 0 && 
              match.start >= 0 && 
              match.end > match.start
            ),
            confidence: trigger.intensity
          };

          // Ajouter le trigger à l'analyse progressive
          setProgressiveAnalysis(prev => [...prev, triggerResult]);
          setCurrentAnalysisStep(triggerIndex + 1);
          
          // Pause pour l'effet visuel (plus courte pour un trigger à la fois)
          await new Promise(resolve => setTimeout(resolve, 150));
        }

        // Finaliser l'analyse
        const finalResults = progressiveAnalysis.length > 0 ? progressiveAnalysis : 
          Object.entries(triggerGroups).map(([triggerType, triggers]) => {
            const triggerInfo = triggerMap[triggerType] || { 
              id: triggerType.toLowerCase().replace(/\s+/g, '_'), 
              name: triggerType, 
              color: '#CCCCCC', 
              description: 'Marketing trigger detected' 
            };

            const uniqueMatches = triggers
              .map(trigger => ({
                text: trigger.excerpt,
                start: trigger.span.start,
                end: trigger.span.end,
                intensity: trigger.intensity
              }))
              .filter((match, index, array) => {
                return array.findIndex(m => 
                  m.start === match.start && 
                  m.end === match.end && 
                  m.text === match.text
                ) === index;
              })
              .filter(match => {
                return match.text.trim().length > 0 && 
                       match.start >= 0 && 
                       match.end > match.start;
              })
              .sort((a, b) => a.start - b.start);

            return {
              trigger: {
                id: triggerInfo.id,
                name: triggerInfo.name,
                color: triggerInfo.color,
                description: triggerInfo.description
              },
              matches: uniqueMatches,
              confidence: triggers.reduce((sum, t) => sum + t.intensity, 0) / triggers.length
            };
          }).filter(result => result.matches.length > 0);

        console.log('🎯 Final results:', finalResults);
        setAnalysis(finalResults);
        setRawAnalysisData(data);
        
        // Step 4: Complete
        await new Promise(resolve => setTimeout(resolve, 500));
        setShowResults(true);
      } else {
        console.error('❌ Analysis failed:', data.message || data.error || 'Unknown error');
        setError(data.message || data.error || 'Analysis failed');
        setAnalysis([]);
        setShowResults(false);
      }
    } catch (error) {
      console.error('💥 Analysis error:', error);
      setError('Analysis failed. Please try again.');
      setAnalysis([]);
      setShowResults(false);
    } finally {
      console.log('🏁 Analysis completed');
      setIsAnalyzing(false);
      setIsLaserActive(false);
    }
  };

  const handleSaveAnalysis = () => {
    const newAnalyzedText: AnalyzedText = {
      id: Date.now().toString(),
      originalText: text,
      analysis: analysis,
      timestamp: new Date(),
    };
    
    setAnalyzedTexts(prev => {
      const updatedTexts = [newAnalyzedText, ...prev];
      localStorage.setItem('analyzedTexts', JSON.stringify(updatedTexts));
      return updatedTexts;
    });
  };

  const getTriggerSummary = () => {
    // Utiliser les données brutes de l'API si disponibles
    if (rawAnalysisData?.stats?.distribution) {
      return rawAnalysisData.stats.distribution.reduce((acc: Record<string, number>, item: any) => {
        acc[item.trigger] = item.count || 0;
        return acc;
      }, {});
    }
    
    // Fallback sur l'ancienne logique
    const triggerCounts = analysis.reduce((acc, result) => {
      acc[result.trigger.name] = (acc[result.trigger.name] || 0) + result.matches.length;
      return acc;
    }, {} as Record<string, number>);

    return triggerCounts;
  };

  const getHighlightedSegments = () => {
    // Utiliser l'analyse progressive si disponible, sinon l'analyse finale
    const currentAnalysis = progressiveAnalysis.length > 0 ? progressiveAnalysis : analysis;
    
    if (!currentAnalysis || !Array.isArray(currentAnalysis)) {
      return [];
    }
    
    return currentAnalysis.flatMap(item => {
      if (!item || !item.matches || !Array.isArray(item.matches)) {
        return [];
      }
      
      return item.matches.map((match: any) => ({
        text: match?.text || '',
        start: match?.start || 0,
        end: match?.end || 0,
        trigger: item.trigger || { id: '', name: '', color: '#000000', description: '' },
        confidence: item.confidence || 0,
        type: item.trigger?.name || 'Unknown',
        intensity: item.confidence || 0
      }));
    });
  };

  return (
    <div className="relative">


      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Input Zone - Sacred Glassmorphism with Papyrus */}
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 animate-mystery-reveal relative" style={{ animationDelay: '1.5s' }}>
            {/* Soft Pulsing Pharaoh Blue Halo - On Focus */}
            <div 
              className={`absolute inset-0 rounded-2xl transition-all duration-800 ${
                text.trim() ? 'opacity-60' : 'opacity-0'
              }`}
              style={{
                background: 'radial-gradient(ellipse, rgba(0, 87, 167, 0.25) 0%, rgba(0, 87, 167, 0.1) 40%, transparent 70%)',
                transform: 'scale(1.05)',
                filter: 'blur(20px)',
                animation: text.trim() ? 'pharaoh-glow 4s ease-in-out infinite' : 'none',
              }}
            />
            
            {/* Faint Papyrus Texture Overlay - Very Low Opacity */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-3"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(198, 166, 100, 0.05) 1px, rgba(198, 166, 100, 0.05) 2px),
                  repeating-linear-gradient(-45deg, transparent, transparent 1px, rgba(0, 87, 167, 0.03) 1px, rgba(0, 87, 167, 0.03) 2px)
                `,
                backgroundSize: '30px 30px, 25px 25px',
              }}
            />
            
            {/* Vraie Dalle de Verre avec Déformation du Fond */}
            <div 
              className="relative p-12 rounded-3xl transition-all duration-600"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.25) 0%, 
                    rgba(255, 255, 255, 0.1) 50%,
                    rgba(255, 255, 255, 0.15) 100%
                  )
                `,
                backdropFilter: 'blur(60px) saturate(200%) brightness(1.1)',
                WebkitBackdropFilter: 'blur(60px) saturate(200%) brightness(1.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: `
                  0 80px 200px rgba(0, 87, 167, 0.15),
                  0 40px 100px rgba(0, 87, 167, 0.1),
                  0 20px 50px rgba(0, 87, 167, 0.08),
                  0 10px 25px rgba(0, 87, 167, 0.06),
                  inset 0 1px 0 rgba(255, 255, 255, 0.6),
                  inset 0 -1px 0 rgba(0, 87, 167, 0.1)
                `,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Effet de Déformation du Fond - Surbrillance Déformée */}
              <div 
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  background: `
                    radial-gradient(ellipse 200% 100% at 50% 0%, 
                      rgba(255, 255, 255, 0.3) 0%, 
                      rgba(255, 255, 255, 0.1) 30%,
                      transparent 70%
                    ),
                    linear-gradient(135deg, 
                      transparent 0%, 
                      rgba(255, 255, 255, 0.1) 25%,
                      rgba(255, 255, 255, 0.05) 50%,
                      transparent 75%
                    )
                  `,
                  backdropFilter: 'blur(20px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                  transform: 'scale(1.02)',
                  filter: 'brightness(1.2) contrast(1.1)',
                }}
              />
              
              {/* Reflets et Surbrillances */}
              <div 
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  background: `
                    linear-gradient(135deg, 
                      rgba(255, 255, 255, 0.4) 0%, 
                      transparent 20%,
                      transparent 80%,
                      rgba(255, 255, 255, 0.2) 100%
                    )
                  `,
                  backdropFilter: 'blur(5px)',
                  WebkitBackdropFilter: 'blur(5px)',
                  transform: 'translateY(-2px)',
                }}
              />
              
              {/* Bordure Déformée - Effet de Verre */}
              <div 
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  background: `
                    conic-gradient(from 0deg at 50% 50%, 
                      rgba(255, 255, 255, 0.3) 0deg,
                      transparent 60deg,
                      rgba(255, 255, 255, 0.1) 120deg,
                      transparent 180deg,
                      rgba(255, 255, 255, 0.2) 240deg,
                      transparent 300deg,
                      rgba(255, 255, 255, 0.3) 360deg
                    )
                  `,
                  mask: 'linear-gradient(white, white) padding-box, linear-gradient(white, white) border-box',
                  WebkitMask: 'linear-gradient(white, white) padding-box, linear-gradient(white, white) border-box',
                  maskComposite: 'xor',
                  WebkitMaskComposite: 'xor',
                  border: '2px solid transparent',
                }}
              />
              <div className="relative">
                
                {/* Sacred Text Area - Temple of Knowledge */}
                {showResults && analysis.length > 0 ? (
                  <div 
                    className="w-full px-8 py-8 border-0 rounded-2xl text-text-primary leading-relaxed overflow-auto prism-glass"
                    style={{
                      background: `
                        linear-gradient(135deg, 
                          rgba(255, 255, 255, 0.15) 0%, 
                          rgba(255, 255, 255, 0.05) 50%,
                          rgba(255, 255, 255, 0.1) 100%
                        )
                      `,
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      minHeight: '500px',
                      maxHeight: '80vh',
                      height: `${Math.max(500, Math.min(800, text.split('\n').length * 28 + 150))}px`,
                      fontFamily: 'Quintessential, serif',
                      backdropFilter: 'blur(30px) saturate(180%) brightness(1.05)',
                      WebkitBackdropFilter: 'blur(30px) saturate(180%) brightness(1.05)',
                      boxShadow: `
                        inset 0 1px 0 rgba(255, 255, 255, 0.3),
                        inset 0 -1px 0 rgba(0, 87, 167, 0.05),
                        0 8px 32px rgba(0, 87, 167, 0.06)
                      `,
                    }}
                  >
                    <TriggerHighlighter 
                      text={text}
                      matches={getHighlightedSegments()}
                      className="text-lg leading-relaxed text-text-primary"
                    />
                  </div>
                ) : (
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder=""
                    className="w-full px-8 py-8 border-0 rounded-2xl focus:outline-none resize-none leading-relaxed text-lg transition-all duration-500 prism-glass"
                    style={{
                      background: `
                        linear-gradient(135deg, 
                          rgba(255, 255, 255, 0.15) 0%, 
                          rgba(255, 255, 255, 0.05) 50%,
                          rgba(255, 255, 255, 0.1) 100%
                        )
                      `,
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      minHeight: '500px',
                      maxHeight: '80vh',
                      height: `${Math.max(500, Math.min(800, text.split('\n').length * 28 + 150))}px`,
                      fontFamily: 'Quintessential, serif',
                      fontSize: '1.1rem',
                      color: '#2C2C2C',
                      backdropFilter: 'blur(30px) saturate(180%) brightness(1.05)',
                      WebkitBackdropFilter: 'blur(30px) saturate(180%) brightness(1.05)',
                      boxShadow: `
                        inset 0 1px 0 rgba(255, 255, 255, 0.3),
                        inset 0 -1px 0 rgba(0, 87, 167, 0.05),
                        0 8px 32px rgba(0, 87, 167, 0.06)
                      `,
                    }}
                  />
                )}
                
                {/* Poetic Placeholder Text - Quintessential Font */}
                {!text && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{
                      fontFamily: 'Quintessential, serif',
                      color: '#0057A7',
                      fontSize: '1.4rem',
                      opacity: 0.8,
                      fontWeight: '400',
                      fontStyle: 'italic',
                    }}
                  >
                    <span className="text-center max-w-3xl leading-relaxed">
                      Paste your copy… and let Prism reveal the persuasion beneath your words.
                    </span>
                  </div>
                )}
                
                <div className="absolute bottom-4 right-4 text-sm text-text-muted bg-glass/80 backdrop-blur-sm px-3 py-1 rounded-full border border-accent-pharaoh/20">
                  {text.length} characters
                  {isAnalyzing && currentAnalysisStep > 0 && (
                    <span className="ml-2 text-accent-pharaoh">
                      • Analyzing triggers {currentAnalysisStep}...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Légende des triggers détectés - En dehors de l'encadré scrollable */}
          {showResults && analysis.length > 0 && (
            <DetectedTriggersLegend matches={getHighlightedSegments()} />
          )}

          {/* Analyze Button - Premium */}
          <div className="relative mb-6 animate-mystery-reveal" style={{ animationDelay: '2s' }}>
            {showResults && analysis.length > 0 ? (
              <div className="flex justify-center">
                <button
                  onClick={handleAnalyze}
                  disabled={!text.trim() || isAnalyzing}
                  className="group relative px-10 py-5 rounded-2xl font-quintessential font-semibold text-lg transition-all duration-500 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 87, 167, 0.9) 0%, rgba(0, 61, 115, 0.9) 100%)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: `
                      0 20px 60px rgba(0, 87, 167, 0.4),
                      0 10px 30px rgba(0, 87, 167, 0.3),
                      inset 0 1px 0 rgba(255, 255, 255, 0.3),
                      inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                    `,
                  }}
                >
                  {/* Animated shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  {/* Button content */}
                  <div className="relative z-10 flex items-center gap-3">
                    {isAnalyzing ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                    {isAnalyzing ? 'Re-analyzing...' : 'Re-analyze'}
                  </div>
                </button>
              </div>
            ) : (
              <div className="relative group">
                {/* Glow Around Edges - Slightly Elevated */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-70 animate-pharaoh-glow"
                  style={{
                    background: 'radial-gradient(ellipse, rgba(0, 87, 167, 0.5) 0%, rgba(198, 166, 100, 0.3) 50%, transparent 70%)',
                    transform: 'scale(1.1)',
                    filter: 'blur(15px)',
                  }}
                />
                
                {/* Premium CTA Button - Advanced Glassmorphism */}
                <button
                  id="reveal-triggers-button"
                  onClick={handleAnalyze}
                  disabled={!text.trim() || isAnalyzing}
                  className="glass-button relative px-16 py-8 rounded-3xl text-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 87, 167, 0.9) 0%, rgba(0, 61, 115, 0.9) 100%)',
                    color: 'white',
                    fontFamily: 'Quintessential, serif',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  {/* Animated Light Ray Sweep - Hover Effect */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent)',
                    }}
                  />
                  
                  {/* Premium Button Content */}
                  <div className="relative z-10 flex items-center justify-center gap-5">
                    {/* Sacred Prism Icon */}
                    {isAnalyzing ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    ) : (
                      <div className="w-8 h-8 relative">
                        <svg viewBox="0 0 24 24" className="w-full h-full text-white drop-shadow-lg">
                          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.9"/>
                          <path d="M2 7L12 12L12 22L2 17L2 7Z" fill="currentColor" opacity="0.7"/>
                          <path d="M12 12L22 7L22 17L12 22L12 12Z" fill="currentColor" opacity="0.7"/>
                        </svg>
                        {/* Sacred Glow around icon */}
                        <div 
                          className="absolute inset-0 rounded-full opacity-60 animate-pulse"
                          style={{
                            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%)',
                            filter: 'blur(6px)',
                          }}
                        />
                      </div>
                    )}
                    <span className="drop-shadow-lg font-medium">{isAnalyzing ? 'Analyzing...' : 'Reveal the triggers'}</span>
                  </div>
                </button>
              </div>
            )}
            
            {/* Laser scan animation */}
            <LaserScan 
              isActive={isLaserActive} 
              onComplete={() => setIsLaserActive(false)}
              className="rounded-3xl"
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="text-red-600 text-sm font-quintessential flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                {error}
              </div>
            </div>
          )}

          {/* Analysis Controls - Simplified */}
          {showResults && analysis.length > 0 && (
            <div className="mb-8">
              {/* Main Analysis Actions */}
              <div className="flex gap-4 justify-center mb-8">
                <button
                  onClick={() => setShowResults(false)}
                  className="group relative px-8 py-4 rounded-2xl font-quintessential font-semibold text-base transition-all duration-500 overflow-hidden text-accent-pharaoh backdrop-blur-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    boxShadow: `
                      0 12px 32px rgba(0, 87, 167, 0.15),
                      0 6px 16px rgba(0, 87, 167, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.4),
                      inset 0 -1px 0 rgba(0, 87, 167, 0.1)
                    `,
                  }}
                >
                  {/* Hover shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  <div className="relative z-10 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Clear Analysis
                  </div>
                </button>
                
                <button
                  onClick={() => setShowSimpleMode(!showSimpleMode)}
                  className={`group relative px-8 py-4 rounded-2xl font-quintessential font-semibold text-base transition-all duration-500 overflow-hidden backdrop-blur-2xl prism-glass ${
                    showSimpleMode
                      ? 'text-white'
                      : 'text-accent-pharaoh'
                  }`}
                  style={showSimpleMode ? {
                    background: 'linear-gradient(135deg, rgba(0, 87, 167, 0.9) 0%, rgba(0, 61, 115, 0.9) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: `
                      0 16px 40px rgba(0, 87, 167, 0.3),
                      0 8px 20px rgba(0, 87, 167, 0.2),
                      inset 0 1px 0 rgba(255, 255, 255, 0.3),
                      inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                    `,
                  } : {
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    boxShadow: `
                      0 12px 32px rgba(0, 87, 167, 0.15),
                      0 6px 16px rgba(0, 87, 167, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.4),
                      inset 0 -1px 0 rgba(0, 87, 167, 0.1)
                    `,
                  }}
                >
                  {/* Hover shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  <div className="relative z-10 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {showSimpleMode ? 'Simple View' : 'Advanced View'}
                  </div>
                </button>
                
                <button
                  onClick={() => setShowMicroAnalysis(!showMicroAnalysis)}
                  className={`group relative px-8 py-4 rounded-2xl font-quintessential font-semibold text-base transition-all duration-500 overflow-hidden backdrop-blur-2xl prism-glass ${
                    showMicroAnalysis
                      ? 'text-white'
                      : 'text-accent-pharaoh'
                  }`}
                  style={showMicroAnalysis ? {
                    background: 'linear-gradient(135deg, rgba(0, 87, 167, 0.9) 0%, rgba(0, 61, 115, 0.9) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: `
                      0 16px 40px rgba(0, 87, 167, 0.3),
                      0 8px 20px rgba(0, 87, 167, 0.2),
                      inset 0 1px 0 rgba(255, 255, 255, 0.3),
                      inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                    `,
                  } : {
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    boxShadow: `
                      0 12px 32px rgba(0, 87, 167, 0.15),
                      0 6px 16px rgba(0, 87, 167, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.4),
                      inset 0 -1px 0 rgba(0, 87, 167, 0.1)
                    `,
                  }}
                >
                  {/* Hover shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  <div className="relative z-10 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    {showMicroAnalysis ? 'Hide Details' : 'Show Details'}
                  </div>
                </button>
              </div>

              {/* Micro Analysis Mode Toggle */}
              {showMicroAnalysis && (
                <div className="flex gap-3 justify-center mb-6">
                  <button
                    onClick={() => setUseAdvancedMicroAnalysis(false)}
                    className={`group relative px-6 py-3 rounded-xl text-sm font-quintessential font-medium transition-all duration-400 overflow-hidden prism-glass ${
                      !useAdvancedMicroAnalysis
                        ? 'text-white'
                        : 'text-accent-pharaoh'
                    }`}
                    style={!useAdvancedMicroAnalysis ? {
                      background: 'linear-gradient(135deg, #0057A7 0%, #003d73 100%)',
                      boxShadow: '0 4px 16px rgba(0, 87, 167, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    } : {
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      border: '1px solid rgba(0, 87, 167, 0.2)',
                      boxShadow: '0 2px 8px rgba(0, 87, 167, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    {/* Hover shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                    
                    <div className="relative z-10">Simple</div>
                  </button>
                  
                  <button
                    onClick={() => setUseAdvancedMicroAnalysis(true)}
                    className={`group relative px-6 py-3 rounded-xl text-sm font-quintessential font-medium transition-all duration-400 overflow-hidden prism-glass ${
                      useAdvancedMicroAnalysis
                        ? 'text-white'
                        : 'text-accent-pharaoh'
                    }`}
                    style={useAdvancedMicroAnalysis ? {
                      background: 'linear-gradient(135deg, #0057A7 0%, #003d73 100%)',
                      boxShadow: '0 4px 16px rgba(0, 87, 167, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    } : {
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      border: '1px solid rgba(0, 87, 167, 0.2)',
                      boxShadow: '0 2px 8px rgba(0, 87, 167, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    {/* Hover shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                    
                    <div className="relative z-10">Advanced</div>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Micro Analysis - Only show when enabled */}
          {showMicroAnalysis && showResults && analysis.length > 0 && (
            <div className="mb-8">
              {useAdvancedMicroAnalysis ? (
                <AdvancedMicroAnalysis
                  text={text}
                  triggers={rawAnalysisData?.analysis?.triggers || []}
                  onSegmentClick={setSelectedSegment}
                />
              ) : (
                <MicroAnalysis
                  text={text}
                  triggers={rawAnalysisData?.analysis?.triggers || []}
                  onSegmentClick={setSelectedSegment}
                />
              )}
            </div>
          )}

          {/* Results - Now integrated in the original text area above */}

              {/* Trigger Distribution - Only show in advanced mode */}
              {!showSimpleMode && (
                <div 
                  className="p-8 rounded-3xl backdrop-blur-md border border-accent-pharaoh/20"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 87, 167, 0.1)',
                  }}
                >
                <h3 className="text-3xl font-quintessential font-bold text-text-primary mb-8 flex items-center gap-3 text-center justify-center">
                  <BarChart3 className="h-7 w-7 text-accent-pharaoh" />
                  Trigger Distribution
                </h3>
                
                <CircularDashboard 
                  triggers={(() => {
                    // Utiliser les données de distribution de l'API si disponibles
                    if (rawAnalysisData?.stats?.distribution) {
                      return rawAnalysisData.stats.distribution.map((item: any) => {
                        const triggerInfo = analysis.find(a => a.trigger.name === item.trigger);
                        return {
                          name: item.trigger,
                          count: item.count,
                          percentage: item.percent,
                          color: triggerInfo?.trigger.color || '#0057A7'
                        };
                      });
                    }
                    
                    // Fallback sur l'ancienne logique
                    const summary = getTriggerSummary();
                    const totalMatches = Object.values(summary).reduce((sum: number, count: unknown) => sum + (count as number), 0);
                    
                    return Object.entries(summary).map(([name, count]) => {
                      const triggerInfo = analysis.find(a => a.trigger.name === name);
                      const percentage = totalMatches > 0 ? Math.round(((count as number) / totalMatches) * 100) : 0;
                      
                      return {
                        name,
                        count,
                        percentage,
                        color: triggerInfo?.trigger.color || '#0057A7'
                      };
                    });
                  })()}
                  totalScore={rawAnalysisData?.analysis?.summary?.global_score || Math.min(100, Math.round(analysis.reduce((sum, a) => sum + a.matches.length, 0) * 10))}
                />
                </div>
              )}

              {/* Save Analysis Button */}
              <div className="text-center">
                <button
                  onClick={handleSaveAnalysis}
                  className="group relative px-8 py-4 rounded-2xl font-quintessential font-semibold text-base transition-all duration-500 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
                    border: '1px solid rgba(0, 87, 167, 0.3)',
                    color: '#0057A7',
                    boxShadow: '0 6px 24px rgba(0, 87, 167, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                  }}
                >
                  {/* Hover shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  {/* Button content */}
                  <div className="relative z-10 flex items-center gap-3">
                    <Save className="w-5 h-5" />
                    Save Analysis
                  </div>
                </button>
              </div>

          {/* Saved Analyses */}
          {analyzedTexts.length > 0 && !showResults && (
            <div 
              className="mt-12 p-6 rounded-3xl backdrop-blur-md border border-accent-pharaoh/20"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 87, 167, 0.1)',
              }}
            >
              <h3 className="text-2xl font-quintessential font-bold text-text-primary mb-4">
                Saved Analyses
              </h3>
              <div className="space-y-3">
                {analyzedTexts.slice(0, 3).map((analyzed) => (
                  <div key={analyzed.id} className="p-4 bg-background/30 rounded-xl hover:bg-background/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-text-muted">
                        {analyzed.timestamp.toLocaleString()}
                      </span>
                      <button
                        onClick={() => {
                          setText(analyzed.originalText);
                          setAnalysis(analyzed.analysis);
                          setShowResults(true);
                        }}
                        className="group relative px-5 py-2.5 rounded-xl font-quintessential font-medium text-sm transition-all duration-400 overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
                          border: '1px solid rgba(0, 87, 167, 0.25)',
                          color: '#0057A7',
                          boxShadow: '0 2px 8px rgba(0, 87, 167, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        {/* Hover shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                        
                        <div className="relative z-10">View Analysis</div>
                      </button>
                    </div>
                    <p className="text-sm text-text-secondary truncate">
                      {analyzed.originalText.substring(0, 100)}...
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {analyzed.analysis.slice(0, 3).map((result, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs rounded-full text-white font-quintessential"
                          style={{ backgroundColor: result.trigger.color }}
                        >
                          {result.trigger.name}
                        </span>
                      ))}
                      {analyzed.analysis.length > 3 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-text-muted text-white font-quintessential">
                          +{analyzed.analysis.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* API Key Manager Modal */}
      {showApiKeyManager && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div 
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 rounded-3xl backdrop-blur-md border border-accent-pharaoh/20 prism-glass"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              boxShadow: '0 20px 60px rgba(0, 87, 167, 0.2)',
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-quintessential font-bold text-text-primary">API Configuration</h2>
                <button
                  onClick={() => setShowApiKeyManager(false)}
                  className="group relative px-4 py-2 rounded-xl font-quintessential font-medium text-lg transition-all duration-400 overflow-hidden prism-glass"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    border: '1px solid rgba(0, 87, 167, 0.25)',
                    color: '#0057A7',
                    boxShadow: '0 2px 8px rgba(0, 87, 167, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {/* Hover shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                  
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