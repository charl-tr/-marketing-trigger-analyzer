'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { triggers } from '@/lib/triggers';

// Types
interface Highlight {
  type: string;
  span: {
    start: number;
    end: number;
  };
  excerpt: string;
  comment?: string;
  intensity?: number;
}

interface TriggerStats {
  [key: string]: number;
}

// Constants
const TRIGGER_COLORS = {
  mystery: '#8B5CF6',
  curiosity: '#A855F7',
  exclusivity: '#06B6D4',
  storytelling: '#F59E0B',
  urgency: '#EF4444',
  scarcity: '#F97316',
  social_proof: '#10B981',
  reciprocity: '#3B82F6',
  commitment: '#8B5CF6',
  liking: '#EC4899',
  authority: '#6366F1',
  loss_aversion: '#F59E0B',
  contrast: '#84CC16',
  call_to_action: '#EF4444'
};

// Helper Functions
const getTriggerDisplayName = (triggerType: string): string => {
  if (!triggerType || typeof triggerType !== 'string') {
    return 'UNKNOWN TRIGGER';
  }
  return triggerType.replace('_', ' ').toUpperCase();
};

const getSelectedTriggers = (): string[] => {
  try {
    const savedTriggers = localStorage.getItem('selectedTriggers');
    if (savedTriggers) {
      const parsedTriggers = JSON.parse(savedTriggers);
      const triggersArray = Array.isArray(parsedTriggers) ? parsedTriggers : parsedTriggers.triggers || [];
      const enabledTriggers = triggersArray.filter((trigger: { enabled: boolean }) => trigger.enabled);
      return enabledTriggers.map((trigger: { id: string }) => trigger.id);
    }
  } catch (error) {
    console.warn('Failed to load triggers from admin:', error);
  }
  
  // Fallback: utiliser tous les triggers par défaut
  return Object.keys(TRIGGER_COLORS);
};

// Main Component
export default function Home() {
  // State
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<Highlight[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [tooltip, setTooltip] = useState<{ visible: boolean; text: string; x: number; y: number }>({
    visible: false,
    text: '',
    x: 0,
    y: 0
  });
  const [scrollY, setScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [activeTriggers, setActiveTriggers] = useState<Set<string>>(new Set());
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  // Refs
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const resultDivRef = React.useRef<HTMLDivElement>(null);

  // Effects
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsConnected(true);
    }
  }, []);

  // Sauvegarder le texte dans localStorage
  useEffect(() => {
    if (text.trim()) {
      localStorage.setItem('prism_text_input', text);
    }
  }, [text]);

  // Charger le texte sauvegardé au montage
  useEffect(() => {
    const savedText = localStorage.getItem('prism_text_input');
    if (savedText) {
      setText(savedText);
    }
  }, []);

  // Ref pour éviter les boucles infinies
  const lastAnalysisRef = useRef<string>('');

  // Fonctions pour le tooltip personnalisé
  const showTooltip = useCallback((text: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      text,
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltip(prev => ({ ...prev, visible: false }));
  }, []);

  // Fonction pour gérer les tooltips des highlights de texte
  const handleHighlightMouseOver = useCallback((tooltipContent: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      text: tooltipContent,
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  }, []);

  const handleHighlightMouseOut = useCallback(() => {
    hideTooltip();
  }, [hideTooltip]);
  
  useEffect(() => {
    if (analysis.length > 0) {
      const analysisString = JSON.stringify(analysis.map(h => h.type).sort());
      
      // Vérifier si l'analyse a vraiment changé
      if (analysisString !== lastAnalysisRef.current) {
        const allTriggerTypes = new Set(analysis.map(h => h.type).filter(Boolean));
        setActiveTriggers(allTriggerTypes);
        lastAnalysisRef.current = analysisString;
      }
    }
  }, [analysis]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1200);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Gestion du scroll pour la navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Apparition progressive de la navbar
      setShowNavbar(currentScrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Helper Functions
  const addDebugLog = (message: string) => {
    setDebugLogs(prev => [...prev, `${new Date().toLocaleTimeString()} ${message}`]);
  };

  const getTriggerStats = useCallback((): TriggerStats => {
    const stats: TriggerStats = {};
    analysis.forEach(highlight => {
      if (highlight.type) {
        stats[highlight.type] = (stats[highlight.type] || 0) + 1;
      }
    });
    return stats;
  }, [analysis]);

  const getSelectedTriggers = useCallback(() => {
    try {
      // Essayer d'abord le nouveau format (selectedTriggers)
      let saved = localStorage.getItem('selectedTriggers');
      
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.triggers) {
          const enabledTriggers = parsed.triggers.filter((trigger: any) => trigger.enabled).map((trigger: any) => trigger.id);
          return enabledTriggers;
        }
      }
      
      // Fallback vers l'ancien format (selected_triggers)
      saved = localStorage.getItem('selected_triggers');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      const enabledTriggers = parsed.filter((trigger: any) => trigger.enabled).map((trigger: any) => trigger.id);
      return enabledTriggers;
    } catch (error) {
      return [];
    }
  }, []);

  const getNotFoundTriggers = useCallback(() => {
    const selectedTriggers = getSelectedTriggers();
    const foundTriggers = new Set(analysis.map(h => h.type));
    const notFoundTriggers = selectedTriggers.filter((trigger: string) => !foundTriggers.has(trigger));
    
    return notFoundTriggers;
  }, [getSelectedTriggers, analysis]);

  const toggleTrigger = useCallback((triggerType: string) => {
    const newActiveTriggers = new Set(activeTriggers);
    if (newActiveTriggers.has(triggerType)) {
      newActiveTriggers.delete(triggerType);
    } else {
      newActiveTriggers.add(triggerType);
    }
    setActiveTriggers(newActiveTriggers);
  }, [activeTriggers]);

  // Render Functions
  const renderHighlightsOverlay = () => {
    if (!showResults || analysis.length === 0) return null;
    
    const textToRender = (window as unknown as { textUsedForAnalysis: string }).textUsedForAnalysis || text;
    
    // Filtrer les highlights selon les triggers actifs
    const filteredHighlights = analysis.filter(highlight => 
      activeTriggers.size === 0 || activeTriggers.has(highlight.type)
    );
    
    // Créer des segments continus avec leurs triggers
    const segments: Array<{
      start: number;
      end: number;
      triggers: Set<string>;
    }> = [];
    
    // Appliquer les triggers selon l'API avec vérification stricte
    filteredHighlights.forEach((highlight) => {
      if (highlight.span && highlight.span.start !== undefined && highlight.span.end !== undefined) {
        const extractedText = textToRender.substring(highlight.span.start, highlight.span.end);
        if (extractedText === highlight.excerpt) {
          segments.push({
            start: highlight.span.start,
            end: highlight.span.end,
            triggers: new Set([highlight.type])
          });
        }
      }
    });
    
    // Fusionner les segments qui se chevauchent
    const mergedSegments: Array<{
      start: number;
      end: number;
      triggers: Set<string>;
    }> = [];
    
    // Trier par position de début
    segments.sort((a, b) => a.start - b.start);
    
    for (const segment of segments) {
      const lastSegment = mergedSegments[mergedSegments.length - 1];
      
      if (lastSegment && segment.start <= lastSegment.end) {
        // Chevauchement - fusionner
        lastSegment.end = Math.max(lastSegment.end, segment.end);
        segment.triggers.forEach(trigger => lastSegment.triggers.add(trigger));
      } else {
        // Pas de chevauchement - ajouter comme nouveau segment
        mergedSegments.push({
          start: segment.start,
          end: segment.end,
          triggers: new Set(segment.triggers)
        });
      }
    }
    
    // Rendu par segments continus - BLOCS DE SURLIGNAGE
    const result: React.ReactElement[] = [];
    let currentPos = 0;
    
    for (const segment of mergedSegments) {
      // Ajouter le texte avant le segment
      if (currentPos < segment.start) {
        result.push(
          <span key={`text-${currentPos}`}>
            {textToRender.substring(currentPos, segment.start)}
          </span>
        );
      }
      
              // Ajouter le segment surligné EN BLOC CONTINU avec tooltip
              const segmentText = textToRender.substring(segment.start, segment.end);
              const colors = Array.from(segment.triggers).map(trigger => 
                TRIGGER_COLORS[trigger as keyof typeof TRIGGER_COLORS] || '#CCCCCC'
              );
              
              // Récupérer les détails des triggers pour le tooltip
              const triggerDetails = Array.from(segment.triggers).map(triggerType => {
                const highlight = filteredHighlights.find(h => h.type === triggerType);
                return {
                  type: triggerType,
                  comment: highlight?.comment || 'Trigger détecté',
                  intensity: highlight?.intensity || 50
                };
              });
              
              // Créer le contenu du tooltip
              const tooltipContent = triggerDetails.map(detail => 
                `${detail.type}: ${detail.comment} (${detail.intensity}%)`
              ).join('\n');
              
              // Calculer l'intensité moyenne pour l'opacité
              const avgIntensity = triggerDetails.reduce((sum, detail) => sum + detail.intensity, 0) / triggerDetails.length;
              const opacity = 0.4 + (avgIntensity / 100) * 0.4; // Entre 0.4 et 0.8 pour un effet plus visible
              
              if (segment.triggers.size === 1) {
                result.push(
                  <span
                    key={`highlight-${segment.start}`}
                    style={{ 
                      background: `linear-gradient(120deg, ${colors[0]}60 0%, ${colors[0]}80 50%, ${colors[0]}60 100%)`,
                      opacity: opacity,
                      borderRadius: '0',
                      padding: '1px 2px',
                      margin: '0',
                      display: 'inline',
                      cursor: 'help',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      textDecoration: 'none',
                      fontWeight: '500',
                      boxShadow: `inset 0 -2px 0 ${colors[0]}50`,
                      borderBottom: `2px solid ${colors[0]}70`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.8';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = `inset 0 -3px 0 ${colors[0]}70`;
                      handleHighlightMouseOver(tooltipContent, e);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = opacity.toString();
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = `inset 0 -2px 0 ${colors[0]}30`;
                      handleHighlightMouseOut();
                    }}
                  >
                    {segmentText}
                  </span>
                );
              } else {
                result.push(
                  <span
                    key={`highlight-${segment.start}`}
                    style={{
                      background: `linear-gradient(120deg, ${colors.map(c => `${c}60`).join(', ')})`,
                      opacity: opacity,
                      borderRadius: '0',
                      padding: '1px 2px',
                      margin: '0',
                      display: 'inline',
                      cursor: 'help',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      textDecoration: 'none',
                      fontWeight: '500',
                      boxShadow: `inset 0 -2px 0 ${colors[0]}50`,
                      borderBottom: `2px solid ${colors[0]}70`,
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 3s ease-in-out infinite'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.8';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = `inset 0 -3px 0 ${colors[0]}70`;
                      handleHighlightMouseOver(tooltipContent, e);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = opacity.toString();
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = `inset 0 -2px 0 ${colors[0]}30`;
                      handleHighlightMouseOut();
                    }}
                  >
                    {segmentText}
                  </span>
                );
              }
      
      currentPos = segment.end;
    }
    
    // Ajouter le texte restant
    if (currentPos < textToRender.length) {
      result.push(
        <span key={`text-${currentPos}`}>
          {textToRender.substring(currentPos)}
        </span>
      );
    }
    
    return result;
  };

  // Event Handlers
  const handleAnalyze = async () => {
    if (!text.trim()) return;

    addDebugLog('🚀 Starting analysis...');
    setIsAnalyzing(true);
    setError(null);

    try {
      const textToAnalyze = textAreaRef.current?.value || text;
      const selectedTriggers = getSelectedTriggers();
      
      addDebugLog(`🔑 API Key: ${apiKey ? apiKey.substring(0, 10) + '...' : 'NOT SET'}`);
      addDebugLog(`📋 Sending ${selectedTriggers.length} triggers to API: ${selectedTriggers.join(', ')}`);
      addDebugLog(`📝 Text preview: "${textToAnalyze.substring(0, 100)}..."`);
      addDebugLog(`🔍 Available triggers in localStorage: ${localStorage.getItem('selectedTriggers') ? 'YES' : 'NO'}`);

      const response = await fetch('/api/analyze-perfect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToAnalyze,
          triggers: selectedTriggers,
          apiKey: apiKey
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      addDebugLog(`🎉 Analysis complete! ${data.total_matches} total matches found`);
      addDebugLog(`📊 Method: ${data.method}`);

      // Store the text used for analysis globally
      (window as unknown as { textUsedForAnalysis: string }).textUsedForAnalysis = textToAnalyze;

      addDebugLog(`📊 Raw API data: ${JSON.stringify(data.matches.slice(0, 2), null, 2)}`);

      // Convert API response to frontend format
      const validMatches = data.matches.filter((match: { type: string; span: { start: number; end: number }; excerpt: string }) => 
        match && match.type && match.span && 
        typeof match.span.start === 'number' && 
        typeof match.span.end === 'number' && 
        match.excerpt
      );

      const convertedMatches = validMatches.map((match: { 
        type: string; 
        span: { start: number; end: number }; 
        excerpt: string;
        comment?: string;
        intensity?: number;
      }) => ({
        type: match.type,
        span: {
          start: match.span.start,
          end: match.span.end
        },
        excerpt: match.excerpt,
        comment: match.comment || 'Trigger détecté',
        intensity: match.intensity || 50
      }));

      addDebugLog(`✅ Valid matches: ${validMatches.length}/${data.matches.length}`);
      addDebugLog(`🎨 First match preview: ${convertedMatches[0] ? convertedMatches[0].excerpt : 'No matches'}`);

      setAnalysis(convertedMatches);
      setShowResults(true);
      
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      addDebugLog(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewAnalysis = () => {
    setShowResults(false);
    setAnalysis([]);
    setText('');
    setActiveTriggers(new Set());
    addDebugLog('🔄 New analysis started');
  };

  const handleCancelAnalysis = () => {
    setIsCancelling(true);
    setIsAnalyzing(false);
    setError('Analysis cancelled by user');
    addDebugLog('❌ Analysis cancelled by user');
    setTimeout(() => {
      setIsCancelling(false);
      setError(null);
    }, 2000);
  };

  // Fonctions mémorisées pour éviter les re-renders
  const handleMouseOver = useCallback((e: React.MouseEvent<HTMLElement>, type: string) => {
    const target = e.currentTarget;
    switch (type) {
      case 'admin':
        target.style.background = 'rgba(255, 255, 255, 0.3)';
        target.style.transform = 'translateY(-2px)';
        target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
        break;
      case 'logo':
        target.style.transform = 'scale(1.15)';
        target.style.filter = 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.4))';
        break;
      case 'api':
        // Vérifier l'état directement depuis le DOM ou utiliser une approche différente
        const isConnectedElement = document.querySelector('[data-api-connected]');
        const isConnectedValue = isConnectedElement?.getAttribute('data-api-connected') === 'true';
        target.style.background = isConnectedValue 
          ? 'rgba(34, 197, 94, 0.3)' 
          : 'rgba(239, 68, 68, 0.3)';
        target.style.transform = 'translateY(-2px)';
        target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
        break;
      case 'main-logo':
        target.style.transform = 'scale(1.05)';
        target.style.filter = 'drop-shadow(0 16px 32px rgba(0, 0, 0, 0.5))';
        break;
      case 'cta':
        target.style.transform = 'translateY(-3px)';
        target.style.boxShadow = '0 12px 35px rgba(6, 61, 97, 0.4)';
        target.style.background = 'linear-gradient(135deg, #0E1A2A 0%, #063D61 100%)';
        break;
      case 'trigger':
        const triggerType = target.dataset.triggerType;
        const isActive = target.dataset.isActive === 'true';
        target.style.transform = isActive ? 'translateY(-2px) scale(1.01)' : 'translateY(-1px) scale(1.005)';
        target.style.boxShadow = isActive
          ? `0 6px 20px ${TRIGGER_COLORS[triggerType as keyof typeof TRIGGER_COLORS] || '#CCCCCC'}25, inset 0 1px 0 rgba(255,255,255,0.5)`
          : '0 4px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)';
        
        // Afficher le tooltip personnalisé
        if (triggerType) {
          const trigger = triggers.find((t) => t.id === triggerType);
          if (trigger) {
            showTooltip(trigger.description, e);
          }
        }
        break;
      case 'filter':
        target.style.background = 'linear-gradient(135deg, rgba(6, 61, 97, 0.12) 0%, rgba(6, 61, 97, 0.06) 100%)';
        target.style.transform = 'translateY(-1px)';
        target.style.boxShadow = '0 4px 12px rgba(6, 61, 97, 0.15)';
        break;
    }
  }, []);

  const handleMouseOut = useCallback((e: React.MouseEvent<HTMLElement>, type: string) => {
    const target = e.currentTarget;
    switch (type) {
      case 'admin':
        target.style.background = 'rgba(255, 255, 255, 0.2)';
        target.style.transform = 'none';
        target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        break;
      case 'logo':
        target.style.transform = 'scale(1)';
        target.style.filter = 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.25))';
        break;
      case 'api':
        const isConnectedElement = document.querySelector('[data-api-connected]');
        const isConnectedValue = isConnectedElement?.getAttribute('data-api-connected') === 'true';
        target.style.background = isConnectedValue 
          ? 'rgba(34, 197, 94, 0.2)' 
          : 'rgba(239, 68, 68, 0.2)';
        target.style.transform = 'none';
        target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        break;
      case 'main-logo':
        target.style.transform = 'scale(1)';
        target.style.filter = 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.4))';
        break;
      case 'cta':
        target.style.transform = 'translateY(0)';
        target.style.boxShadow = '0 8px 25px rgba(6, 61, 97, 0.3)';
        target.style.background = 'linear-gradient(135deg, #063D61 0%, #0E1A2A 100%)';
        break;
      case 'trigger':
        const triggerType = target.dataset.triggerType;
        const isActive = target.dataset.isActive === 'true';
        target.style.transform = isActive ? 'translateY(-1px)' : 'none';
        target.style.boxShadow = isActive
          ? `0 4px 16px ${TRIGGER_COLORS[triggerType as keyof typeof TRIGGER_COLORS] || '#CCCCCC'}20, inset 0 1px 0 rgba(255,255,255,0.4)`
          : '0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)';
        
        // Masquer le tooltip personnalisé
        hideTooltip();
        break;
      case 'filter':
        target.style.background = 'linear-gradient(135deg, rgba(6, 61, 97, 0.08) 0%, rgba(6, 61, 97, 0.04) 100%)';
        target.style.transform = 'translateY(0)';
        target.style.boxShadow = 'none';
        break;
    }
  }, []);

  // Fonctions mémorisées pour les boutons
  const handleScrollToText = useCallback(() => {
    const textArea = document.querySelector('textarea');
    if (textArea) {
      const rect = textArea.getBoundingClientRect();
      const scrollTop = window.pageYOffset + rect.top - 200;
      window.scrollTo({ top: scrollTop, behavior: 'smooth' });
      setTimeout(() => {
        textArea.focus();
      }, 500);
    }
  }, []);

  const handleApiKeySubmitAndClose = useCallback(() => {
    handleApiKeySubmit();
    setShowApiKeyModal(false);
  }, []);

  const handleApiKeyRemoveAndClose = useCallback(() => {
    handleApiKeyRemove();
    setShowApiKeyModal(false);
  }, []);

  const handleResetTriggers = useCallback(() => {
    setActiveTriggers(new Set());
  }, []);

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey);
      setIsConnected(true);
      addDebugLog('🔑 API Key saved successfully');
    }
  };

  const handleApiKeyRemove = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setIsConnected(false);
    addDebugLog('🔑 API Key removed');
  };

  const clearSavedText = () => {
    localStorage.removeItem('prism_text_input');
    setText('');
    setAnalysis([]);
    setShowResults(false);
    setError(null);
    addDebugLog('📝 Saved text cleared');
  };

  // Render
  return (
    <>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      
    <div style={{
        minHeight: '100vh', 
        fontFamily: 'Quintessential, serif',
        padding: '20px',
        background: '#E8DCC6',
            backgroundImage: `
              url('/papyrus-texture.png'),
              linear-gradient(135deg, 
                rgba(0, 0, 0, 0.25) 0%, 
                rgba(0, 0, 0, 0.15) 25%,
                rgba(0, 0, 0, 0.08) 50%,
                rgba(0, 0, 0, 0.15) 75%,
                rgba(0, 0, 0, 0.25) 100%
              )
            `,
            backgroundSize: '400px 400px, 100% 100%',
      backgroundRepeat: 'repeat, no-repeat'
    }}>
      
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px',
        position: 'relative'
      }}>
        {/* Ultra Clean Navigation Bar */}
      <div style={{
        position: 'fixed',
          top: `${20 - (50 - Math.min(scrollY, 50)) * 0.3}px`,
          left: '50%',
          transform: `translateX(-50%) translateY(${scrollY > 50 ? 0 : -10}px)`,
        zIndex: 1000,
          width: '90%',
          maxWidth: '1200px',
          padding: '0 20px',
          transition: 'all 0.5s ease-out',
          opacity: scrollY > 50 ? Math.min(1, (scrollY - 50) / 40) : 0
        }}>
          <div style={{
        display: 'flex',
        alignItems: 'center',
            justifyContent: 'space-between',
            background: `rgba(255, 255, 255, ${scrollY > 50 ? Math.min(0.35, (scrollY - 50) / 200) : 0})`,
            backdropFilter: `blur(${scrollY > 50 ? Math.min(20, (scrollY - 50) / 2) : 0}px) saturate(180%)`,
            borderRadius: '25px',
            padding: '12px 24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.1),
              0 4px 16px rgba(0, 0, 0, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.3),
              inset 0 -1px 0 rgba(0, 0, 0, 0.1)
            `,
            transition: 'all 0.3s ease'
          }}>
            
            {/* Left Side - Admin Button */}
            <Link 
              href="/admin"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '20px',
                padding: '12px 24px',
              color: '#063D61',
                textDecoration: 'none',
              fontSize: '16px',
                fontWeight: '600',
              fontFamily: 'Quintessential, serif',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer'
            }}
            onMouseOver={(e) => handleMouseOver(e, 'admin')}
            onMouseOut={(e) => handleMouseOut(e, 'admin')}
            >
              <span style={{ fontSize: '20px' }}>☥</span>
              CONTROL PANEL
            </Link>

            {/* Center - Logo */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: scrollY > 100 ? Math.min(1, (scrollY - 100) / 50) : 0,
              transition: 'opacity 0.4s ease-out'
            }}>
          <img 
            src="/logo-prism.png" 
            alt="Prism Logo" 
            style={{
                  width: '70px',
                  height: '70px',
                  transition: 'all 0.3s ease',
                  filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.25))'
                }}
                onMouseOver={(e) => handleMouseOver(e, 'logo')}
                onMouseOut={(e) => handleMouseOut(e, 'logo')}
              />
            </div>

            {/* Right Side - API Status */}
          <button 
            onClick={() => setShowApiKeyModal(true)}
            data-api-connected={isConnected}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
                background: isConnected 
                  ? 'rgba(34, 197, 94, 0.2)' 
                  : 'rgba(239, 68, 68, 0.2)',
                border: isConnected 
                  ? '1px solid rgba(34, 197, 94, 0.3)' 
                  : '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '20px',
                padding: '12px 24px',
                color: isConnected ? '#059669' : '#DC2626',
                fontSize: '16px',
                fontWeight: '600',
                fontFamily: 'Quintessential, serif',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)'
            }}
            onMouseOver={(e) => handleMouseOver(e, 'api')}
            onMouseOut={(e) => handleMouseOut(e, 'api')}
            >
              <span style={{ fontSize: '20px', marginRight: '8px' }}>𓂀</span>
              {isConnected ? 'CHAMBER UNLOCKED' : 'CHAMBER LOCKED'}
          </button>
        </div>
      </div>

        <div style={{ marginTop: '80px' }}>
          {/* Logo Principal */}
      <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '40px'
        }}>
          <img 
            src="/logo-prism.png" 
            alt="Prism Logo" 
            style={{
              width: `${Math.max(0, 250 - scrollY * 1.2)}px`,
              height: `${Math.max(0, 250 - scrollY * 1.2)}px`,
              opacity: scrollY > 120 ? 0 : Math.max(0, 1 - scrollY / 150),
              transition: 'opacity 0.3s ease',
              filter: 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.4))',
              transform: `scale(${Math.max(0, 1 - scrollY / 300)})`
            }}
            onMouseOver={(e) => handleMouseOver(e, 'main-logo')}
            onMouseOut={(e) => handleMouseOut(e, 'main-logo')}
          />
          </div>
          
          <h1 style={{
            fontSize: '3.5rem',
            color: '#063D61',
            margin: '0 0 40px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            fontWeight: 'bold',
            letterSpacing: '2px'
          }}>
            Prism
          </h1>
          
          <h2 style={{
            fontSize: '1.8rem',
            color: '#063D61',
            margin: '0 0 60px 0',
            fontWeight: '300',
            fontStyle: 'italic',
            textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
          }}>
            Unveil the persuasion beneath words
          </h2>
          
          <button
            onClick={handleScrollToText}
            style={{
              background: 'linear-gradient(135deg, #063D61 0%, #0E1A2A 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              padding: '15px 40px',
              fontSize: '1.1rem',
              fontWeight: '600',
              fontFamily: 'Quintessential, serif',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(6, 61, 97, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '80px'
            }}
            onMouseOver={(e) => handleMouseOver(e, 'cta')}
            onMouseOut={(e) => handleMouseOut(e, 'cta')}
          >
            Enter the Chamber
          </button>
        </div>
        </div>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: '#F4E4BC',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            border: '1px solid rgba(198, 166, 100, 0.3)',
            boxShadow: '0 8px 32px rgba(198, 166, 100, 0.2)',
            fontFamily: 'Quintessential, serif',
            position: 'relative',
            zIndex: 10001
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                margin: '0',
                fontSize: '20px',
                color: '#063D61',
                fontFamily: 'Quintessential, serif',
                fontWeight: 'bold'
              }}>
                API Configuration
              </h2>
              <button
                onClick={() => setShowApiKeyModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#063D61',
                  fontSize: '20px',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>

            {!isConnected ? (
              <div>
                <p style={{
                  color: '#555',
                  marginBottom: '20px',
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}>
                  Enter your OpenAI API key to unlock the analysis features.
                </p>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    color: '#063D61',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}>
                    API Key
                  </label>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-proj-..."
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(198, 166, 100, 0.4)',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      outline: 'none',
                      background: 'white',
                      color: '#063D61',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <button
                  onClick={handleApiKeySubmitAndClose}
                  disabled={!apiKey.trim()}
                  style={{
                    width: '100%',
                    background: apiKey.trim() 
                      ? 'linear-gradient(135deg, #063D61 0%, #0E1A2A 100%)'
                      : 'rgba(200, 200, 200, 0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px 20px',
                    fontSize: '16px',
                    cursor: apiKey.trim() ? 'pointer' : 'not-allowed',
                    fontFamily: 'Quintessential, serif',
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                    boxShadow: apiKey.trim() ? '0 4px 12px rgba(6, 61, 97, 0.3)' : 'none',
                    transition: 'all 0.3s ease',
                    letterSpacing: '0.5px'
                  }}
                >
                  UNLOCK CHAMBER
                </button>
              </div>
            ) : (
              <div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '20px',
                  border: '1px solid rgba(198, 166, 100, 0.2)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '16px', marginRight: '8px', color: '#059669' }}>✓</span>
                    <h3 style={{
                      margin: '0',
                      color: '#059669',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}>
                      Connected
                    </h3>
                  </div>
                  <p style={{
                    margin: '0',
                    color: '#555',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}>
                    API Key: {apiKey.substring(0, 12)}...
                  </p>
                  
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    color: '#063D61',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}>
                    Change API Key
                  </label>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-proj-..."
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(198, 166, 100, 0.4)',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      outline: 'none',
                      background: 'white',
                      color: '#063D61',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div style={{
                  display: 'flex',
                  gap: '8px'
                }}>
                  <button
                    onClick={handleApiKeySubmitAndClose}
                    disabled={!apiKey.trim()}
                    style={{
                      flex: 1,
                      background: apiKey.trim() 
                        ? 'linear-gradient(135deg, #063D61 0%, #0E1A2A 100%)'
                        : 'rgba(200, 200, 200, 0.5)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      fontSize: '15px',
                      cursor: apiKey.trim() ? 'pointer' : 'not-allowed',
                      fontFamily: 'Quintessential, serif',
                      fontWeight: 'bold',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                      boxShadow: apiKey.trim() ? '0 4px 12px rgba(6, 61, 97, 0.3)' : 'none',
                      transition: 'all 0.3s ease',
                      letterSpacing: '0.5px'
                    }}
                  >
                    UPDATE KEY
                  </button>
                  
                  <button
                    onClick={handleApiKeyRemoveAndClose}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, rgba(198, 166, 100, 0.2) 0%, rgba(198, 166, 100, 0.1) 100%)',
                      color: '#DC2626',
                      border: '2px solid rgba(220, 38, 38, 0.3)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      fontSize: '15px',
                      cursor: 'pointer',
                      fontFamily: 'Quintessential, serif',
                      fontWeight: 'bold',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
                      transition: 'all 0.3s ease',
                      letterSpacing: '0.5px'
                    }}
                  >
                    SEAL CHAMBER
                  </button>
                </div>
      </div>
            )}
          </div>
        </div>
      )}

      {/* Légende mobile - EN BAS sur petits écrans */}
      {showResults && analysis.length > 0 && isMobile && (
      <div style={{ 
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          right: '20px',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '15px',
          padding: '15px',
          border: '2px solid rgba(6, 61, 97, 0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          <h3 style={{ 
            margin: '0 0 10px 0', 
            fontSize: '14px', 
            color: '#063D61',
            textAlign: 'center'
          }}>
            🎯 Triggers Found
          </h3>
          
        <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center'
          }}>
            {Object.entries(getTriggerStats()).map(([triggerType, count]) => (
              <div
                key={triggerType}
                onClick={() => toggleTrigger(triggerType)}
            style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: activeTriggers.has(triggerType) 
                    ? 'rgba(6, 61, 97, 0.1)' 
                    : 'transparent',
                  border: `1px solid ${activeTriggers.has(triggerType) 
                    ? TRIGGER_COLORS[triggerType as keyof typeof TRIGGER_COLORS] || '#CCCCCC'
                    : 'rgba(6, 61, 97, 0.2)'}`,
                  transition: 'all 0.2s ease',
                  fontSize: '12px'
                }}
              >
                <div
            style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: TRIGGER_COLORS[triggerType as keyof typeof TRIGGER_COLORS] || '#CCCCCC',
                    marginRight: '6px',
                    opacity: activeTriggers.has(triggerType) ? 1 : 0.5
                  }}
                />
                <span style={{
                  color: activeTriggers.has(triggerType) ? '#063D61' : '#666',
                  fontWeight: activeTriggers.has(triggerType) ? 'bold' : 'normal'
                }}>
                  {getTriggerDisplayName(triggerType)} ({count})
                </span>
              </div>
            ))}
          </div>
          
          {/* Triggers sélectionnés mais non trouvés */}
          {(() => {
            const notFoundTriggers = getNotFoundTriggers();
            const selectedTriggers = getSelectedTriggers();
            const foundTriggers = new Set(analysis.map(h => h.type));
            
            // TEST TEMPORAIRE : Forcer l'affichage pour debug
            return notFoundTriggers.length > 0 || (selectedTriggers.length > foundTriggers.size);
          })() && (
            <div style={{
              marginTop: '15px',
              padding: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              borderRadius: '8px',
              border: '1px dashed rgba(0, 0, 0, 0.2)'
            }}>
              <h4 style={{
                margin: '0 0 8px 0',
                fontSize: '12px',
                color: '#999',
                textAlign: 'center',
                fontWeight: 'normal'
              }}>
                🔍 Triggers sélectionnés mais non trouvés
              </h4>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                justifyContent: 'center'
              }}>
                {(() => {
                  const selectedTriggers = getSelectedTriggers();
                  const foundTriggers = new Set(analysis.map(h => h.type));
                  return selectedTriggers.filter((trigger: string) => !foundTriggers.has(trigger));
                })().map((triggerType: string) => (
                  <div
                    key={triggerType}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      opacity: 0.6
                    }}
                  >
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: TRIGGER_COLORS[triggerType as keyof typeof TRIGGER_COLORS] || '#CCCCCC',
                        marginRight: '4px',
                        opacity: 0.5
                      }}
                    />
                    <span style={{
                      color: '#999',
                      fontSize: '11px',
                      fontWeight: 'normal'
                    }}>
                      {getTriggerDisplayName(triggerType)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div style={{
            marginTop: '10px',
            textAlign: 'center'
          }}>
          <button
              onClick={handleNewAnalysis}
            style={{
                background: 'linear-gradient(135deg, #063D61 0%, #0E1A2A 100%)',
              color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '11px',
              fontFamily: 'Quintessential, serif',
              cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(6, 61, 97, 0.3)'
              }}
            >
              🔄 New Analysis
            </button>
          </div>
        </div>
      )}

      {/* Panneau gauche - SACRED REVELATIONS */}
      {showResults && analysis.length > 0 && !isMobile && (
        <div style={{
          position: 'fixed',
          left: '30px',
          top: '220px',
          minWidth: '280px',
          maxWidth: '300px',
          maxHeight: 'calc(100vh - 160px)',
          background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.15) 0%, rgba(156, 163, 175, 0.08) 50%, rgba(156, 163, 175, 0.12) 100%)',
          borderRadius: '24px',
          padding: '28px',
          border: '2px solid rgba(6, 61, 97, 0.2)',
          boxShadow: '0 20px 60px rgba(6, 61, 97, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          zIndex: 1000,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header avec icône et titre */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            position: 'relative',
            zIndex: 2
          }}>
            {/* Icône égyptienne stylisée */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 50%, #8B6914 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
              border: '2px solid rgba(255, 255, 255, 0.6)'
            }}>
              <span style={{
                fontSize: '18px',
                color: 'white',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
              }}>
                ☥
              </span>
            </div>
            
            {/* Titre ultra clean */}
            <h3 style={{ 
              margin: 0, 
              fontSize: '20px', 
              color: '#063D61',
              fontFamily: 'Quintessential, serif',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.05)'
            }}>
              SACRED REVELATIONS
            </h3>
          </div>
          
          {/* Liste des triggers ultra clean */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            position: 'relative',
            zIndex: 2,
            flex: 1,
            overflowY: 'auto',
            paddingRight: '4px',
            marginBottom: '20px'
          }}>
            {Object.entries(getTriggerStats()).map(([triggerType, count]) => (
                <div
                key={triggerType}
                onClick={() => toggleTrigger(triggerType)}
                data-trigger-type={triggerType}
                data-is-active={activeTriggers.has(triggerType)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  background: activeTriggers.has(triggerType) 
                    ? `linear-gradient(135deg, ${TRIGGER_COLORS[triggerType as keyof typeof TRIGGER_COLORS] || '#CCCCCC'}15 0%, ${TRIGGER_COLORS[triggerType as keyof typeof TRIGGER_COLORS] || '#CCCCCC'}08 100%)`
                    : 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(248,250,252,0.4) 100%)',
                  border: `1px solid ${activeTriggers.has(triggerType) 
                    ? `${TRIGGER_COLORS[triggerType as keyof typeof TRIGGER_COLORS] || '#CCCCCC'}40`
                    : 'rgba(6, 61, 97, 0.08)'}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: activeTriggers.has(triggerType)
                    ? `0 4px 16px ${TRIGGER_COLORS[triggerType as keyof typeof TRIGGER_COLORS] || '#CCCCCC'}20, inset 0 1px 0 rgba(255,255,255,0.4)`
                    : '0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)',
                  transform: activeTriggers.has(triggerType) ? 'translateY(-1px)' : 'none',
                  backdropFilter: 'blur(8px)'
                }}
                onMouseOver={(e) => handleMouseOver(e, 'trigger')}
                onMouseOut={(e) => handleMouseOut(e, 'trigger')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Indicateur de couleur ultra clean */}
                  <div style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${TRIGGER_COLORS[triggerType as keyof typeof TRIGGER_COLORS] || '#CCCCCC'} 0%, ${TRIGGER_COLORS[triggerType as keyof typeof TRIGGER_COLORS] || '#CCCCCC'}80 100%)`,
                    border: '2px solid rgba(255,255,255,0.8)',
                    boxShadow: `0 0 0 1px ${TRIGGER_COLORS[triggerType as keyof typeof TRIGGER_COLORS] || '#CCCCCC'}30, 0 2px 4px rgba(0,0,0,0.1)`,
                    opacity: activeTriggers.has(triggerType) ? 1 : 0.6
                  }} />
                  
                  {/* Nom du trigger ultra clean */}
                  <span style={{
                    fontSize: '15px',
                    fontWeight: activeTriggers.has(triggerType) ? '600' : '500',
                    color: activeTriggers.has(triggerType) ? '#063D61' : '#5D6D7E',
                    fontFamily: 'Quintessential, serif',
                    letterSpacing: '0.3px',
                    lineHeight: '1.2'
                  }}>
                    {getTriggerDisplayName(triggerType)}
                  </span>
                </div>
                
                {/* Compteur ultra clean */}
                <div style={{
                  background: activeTriggers.has(triggerType)
                    ? `linear-gradient(135deg, ${TRIGGER_COLORS[triggerType as keyof typeof TRIGGER_COLORS] || '#CCCCCC'} 0%, ${TRIGGER_COLORS[triggerType as keyof typeof TRIGGER_COLORS] || '#CCCCCC'}80 100%)`
                    : 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '6px 10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  fontFamily: 'Quintessential, serif',
                  minWidth: '28px',
                  textAlign: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  opacity: activeTriggers.has(triggerType) ? 1 : 0.7
                }}>
                  {count}
                </div>
              </div>
            ))}
          </div>
          
          {/* Boutons Select All / Clear All - Fixés en bas */}
          <div style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            marginTop: 'auto'
          }}>
            <button
              onClick={() => {
                const allTriggerTypes = new Set(Object.keys(getTriggerStats()));
                setActiveTriggers(allTriggerTypes);
              }}
              style={{
                background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.2) 0%, rgba(156, 163, 175, 0.1) 100%)',
                color: '#063D61',
                border: '1px solid rgba(6, 61, 97, 0.2)',
                borderRadius: '12px',
                padding: '10px 16px',
                fontSize: '12px',
                fontFamily: 'Quintessential, serif',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                backdropFilter: 'blur(8px)',
                flex: 1
              }}
              onMouseOver={(e) => handleMouseOver(e, 'filter')}
              onMouseOut={(e) => handleMouseOut(e, 'filter')}
            >
              ☥ Select All
            </button>
            
            <button
              onClick={handleResetTriggers}
              style={{
                background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.2) 0%, rgba(156, 163, 175, 0.1) 100%)',
                color: '#063D61',
                border: '1px solid rgba(6, 61, 97, 0.2)',
                borderRadius: '12px',
                padding: '10px 16px',
                fontSize: '12px',
                fontFamily: 'Quintessential, serif',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                backdropFilter: 'blur(8px)',
                flex: 1
              }}
              onMouseOver={(e) => handleMouseOver(e, 'filter')}
              onMouseOut={(e) => handleMouseOut(e, 'filter')}
            >
              ⊗ Clear All
            </button>
          </div>
        </div>
      )}

      {/* Panneau droite - DORMANT RITES */}
      {showResults && analysis.length > 0 && !isMobile && getNotFoundTriggers().length > 0 && (
        <div style={{
          position: 'fixed',
          right: '30px',
          top: '220px',
          minWidth: '280px',
          maxWidth: '300px',
          maxHeight: 'calc(100vh - 160px)',
          background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.12) 0%, rgba(156, 163, 175, 0.06) 50%, rgba(156, 163, 175, 0.08) 100%)',
          borderRadius: '24px',
          padding: '28px',
          border: '2px solid rgba(6, 61, 97, 0.15)',
          boxShadow: '0 20px 60px rgba(6, 61, 97, 0.08), 0 8px 24px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(20px)',
          zIndex: 1000,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header avec icône et titre */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            position: 'relative',
            zIndex: 2
          }}>
            {/* Icône dormante */}
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.5) 0%, rgba(107, 114, 128, 0.4) 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              border: '2px solid rgba(156, 163, 175, 0.6)',
              boxShadow: '0 4px 12px rgba(156, 163, 175, 0.4)'
            }}>
              <span style={{
                fontSize: '18px',
                color: '#4B5563',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}>🔒</span>
            </div>
            
            {/* Titre */}
            <h3 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#1F2937',
              margin: 0,
              textAlign: 'center',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              fontFamily: 'Quintessential, serif'
            }}>
              DORMANT RITES
            </h3>
          </div>

          {/* Compteur */}
          <div style={{
            textAlign: 'center',
            marginBottom: '20px',
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '12px',
            border: '1px solid rgba(6, 61, 97, 0.15)'
          }}>
            <span style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#1F2937',
              letterSpacing: '0.5px'
            }}>
              {getNotFoundTriggers().length} DORMANT
            </span>
          </div>

          {/* Liste des triggers dormants - Scrollable */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            flex: 1,
            overflowY: 'auto',
            paddingRight: '4px',
            marginBottom: '20px'
          }}>
            {getNotFoundTriggers().map((triggerType: string) => (
              <div
                key={triggerType}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
                  border: '1px solid rgba(156, 163, 175, 0.4)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  opacity: 1
                }}
                onMouseOver={(e) => handleMouseOver(e, 'trigger')}
                onMouseOut={(e) => handleMouseOut(e, 'trigger')}
                data-trigger-type={triggerType}
                data-is-active={false}
              >
                {/* Indicateur de couleur */}
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: TRIGGER_COLORS[triggerType as keyof typeof TRIGGER_COLORS] || '#CCCCCC',
                  marginRight: '12px',
                  opacity: 1,
                  border: '2px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }} />
                
                {/* Nom du trigger */}
                <span style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#1F2937',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  flex: 1,
                  fontFamily: 'Quintessential, serif'
                }}>
                  {getTriggerDisplayName(triggerType)}
                </span>
                
                {/* Icône dormante */}
                <div style={{
                  width: '20px',
                  height: '20px',
                  background: 'rgba(156, 163, 175, 0.5)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(156, 163, 175, 0.6)'
                }}>
                  <span style={{
                    fontSize: '10px',
                    color: '#4B5563'
                  }}>🔒</span>
                </div>
              </div>
            ))}
          </div>

          {/* Message d'encouragement - Fixé en bas */}
          {getNotFoundTriggers().length > 0 && (
            <div style={{
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '12px',
              border: '1px solid rgba(6, 61, 97, 0.1)',
              textAlign: 'center',
              marginTop: 'auto'
            }}>
              <p style={{
                fontSize: '11px',
                color: '#1F2937',
                margin: 0,
                fontStyle: 'italic',
                lineHeight: '1.4'
              }}>
                Ces rites attendent d'être éveillés dans votre texte...
              </p>
            </div>
          )}
        </div>
      )}

      {/* Contenu principal - CENTRÉ ET LIMITÉ EN LARGEUR */}
      <div style={{ 
        position: 'relative',
        maxWidth: '900px',
        margin: '0 auto',
        transition: 'margin-left 0.3s ease',
        padding: '0 20px',
        marginTop: '120px'
      }}>
        
        {/* Bouton Purge - Positionné en haut à droite */}
        {text.trim() && (
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '80px',
            zIndex: 10
          }}>
            <button
              onClick={clearSavedText}
              style={{
                background: 'linear-gradient(135deg, rgba(6, 61, 97, 0.1) 0%, rgba(6, 61, 97, 0.2) 100%)',
                border: '2px solid rgba(6, 61, 97, 0.4)',
                color: '#063D61',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '8px 15px',
                borderRadius: '18px',
                transition: 'all 0.3s ease',
                fontFamily: 'Quintessential, serif',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <span style={{ fontSize: '20px' }}>⨂</span>
              PURGE
            </button>
          </div>
        )}
        
        {/* Zone de texte principale */}
          <div style={{
            background: `
              linear-gradient(135deg, 
              rgba(255, 255, 255, 0.25) 0%, 
              rgba(255, 255, 255, 0.1) 50%,
                rgba(255, 255, 255, 0.25) 100%
              )
            `,
            backdropFilter: 'blur(20px) saturate(110%) brightness(110%)',
            WebkitBackdropFilter: 'blur(20px) saturate(110%) brightness(110%)',
            borderRadius: '32px',
            padding: '40px',
            border: `
              1px solid rgba(255, 255, 255, 0.5),
              inset 0 0 0 1px rgba(255, 255, 255, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.8),
              inset 0 -1px 0 rgba(0, 0, 0, 0.05)
            `,
            boxShadow: `
              0 25px 80px rgba(0, 0, 0, 0.15),
              0 15px 50px rgba(0, 0, 0, 0.1),
              0 8px 25px rgba(0, 0, 0, 0.08),
              0 4px 12px rgba(0, 0, 0, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.6),
              inset 0 -1px 0 rgba(0, 0, 0, 0.1),
              inset 0 0 0 1px rgba(255, 255, 255, 0.2)
            `,
            position: 'relative',
            overflow: 'hidden',
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}>
          
          
          {/* Overlay de chargement */}
          {isAnalyzing && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(198, 166, 100, 0.95)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              borderRadius: '20px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.2)'
            }}>
              {/* Animation de chargement */}
              <div style={{
                width: '80px',
                height: '80px',
                border: '4px solid rgba(255, 255, 255, 0.3)',
                borderTop: '4px solid #063D61',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '30px'
              }} />
              
              {/* Texte de chargement */}
              <div style={{
                textAlign: 'center',
                color: '#063D61',
                fontFamily: 'Quintessential, serif'
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  marginBottom: '10px',
                  letterSpacing: '1px'
                }}>
                  🔍 ANALYZING SACRED TEXTS
                </div>
                <div style={{
                  fontSize: '16px',
                  opacity: 0.8,
                  fontStyle: 'italic'
                }}>
                  Deciphering the ancient wisdom of persuasion...
                </div>
              </div>
              
              {/* Bouton d'annulation */}
              <button
                onClick={handleCancelAnalysis}
                disabled={isCancelling}
                style={{
                  marginTop: '30px',
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '20px',
                  padding: '12px 24px',
                  color: '#DC2626',
                  fontSize: '14px',
                  fontWeight: '600',
                  fontFamily: 'Quintessential, serif',
                  cursor: isCancelling ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: isCancelling ? 0.6 : 1
                }}
                onMouseOver={(e) => {
                  if (!isCancelling) {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isCancelling) {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                {isCancelling ? '⏳ CANCELLING...' : '⛔ CANCEL ANALYSIS'}
              </button>
            </div>
          )}

          {/* Container pour texte avec surlignages intégrés */}
          <div style={{ position: 'relative', width: '100%' }}>
            
            {!showResults ? (
              /* Mode édition - Textarea normal */
              <div style={{ position: 'relative' }}>
            <textarea
                  ref={textAreaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
              placeholder="Paste your words… and watch Prism refract them into the triggers of persuasion."
              style={{
                width: '100%',
                minHeight: '60vh',
                maxHeight: '70vh',
                background: 'transparent',
                borderRadius: '20px',
                padding: '40px 40px 40px 40px',
                fontSize: '18px',
                color: '#2C2C2C',
                fontFamily: 'Quintessential, serif',
                resize: 'vertical',
                outline: 'none',
                lineHeight: '1.6',
                border: '2px solid rgba(198, 166, 100, 0.3)',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                boxSizing: 'border-box'
              }}
                />
                
      </div>
            ) : (
              /* Mode résultats - Texte avec surlignages intégrés */
              <div
                ref={resultDivRef}
              style={{
                width: '100%',
                  minHeight: '60vh',
                  maxHeight: '70vh',
                  background: 'transparent',
                  borderRadius: '20px',
                  padding: '40px 40px 40px 40px',
                  fontSize: '18px',
                  color: '#2C2C2C',
                fontFamily: 'Quintessential, serif',
                  lineHeight: '1.6',
                  border: '2px solid rgba(198, 166, 100, 0.3)',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  cursor: 'default',
                  boxSizing: 'border-box'
                }}
              >
                {renderHighlightsOverlay()}
        </div>
            )}
          </div>
        </div>

        {/* Bouton d'analyse */}
        <div style={{
              textAlign: 'center',
          marginTop: '60px',
          marginBottom: '100px'
        }}>
          {!isAnalyzing && (
            <button
              onClick={handleAnalyze}
              disabled={!isConnected || !text.trim() || isAnalyzing}
              style={{
                background: isConnected && text.trim() && !isAnalyzing 
                  ? 'linear-gradient(135deg, #063D61 0%, #0E1A2A 100%)'
                  : 'linear-gradient(135deg, #8B9DC3 0%, #A8B5C7 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '15px',
                padding: '15px 30px',
                fontSize: '18px',
                fontFamily: 'Quintessential, serif',
                cursor: isConnected && text.trim() && !isAnalyzing ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(6, 61, 97, 0.3)',
                transform: isConnected && text.trim() && !isAnalyzing ? 'translateY(-2px)' : 'none'
              }}
            >
              ✨ BEGIN THE REVELATION
            </button>
          )}
        </div>

        {/* Messages d'erreur */}
        {error && (
        <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '2px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            padding: '15px',
            marginTop: '20px',
                    color: '#DC2626',
            textAlign: 'center'
          }}>
            ❌ {error}
      </div>
            )}

        {/* Debug Logs */}
        {debugLogs.length > 0 && (
        <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            borderRadius: '10px',
            padding: '20px',
            marginTop: '20px',
            color: 'white',
            fontFamily: 'monospace',
            fontSize: '12px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            <h4 style={{ color: '#4ECDC4', marginBottom: '10px' }}>Debug Logs:</h4>
            {debugLogs.map((log, index) => (
              <div key={index} style={{
                marginBottom: '5px',
                padding: '5px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '3px'
              }}>
                {log}
          </div>
            ))}
        </div>
      )}
      </div>
      
      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #063D61 0%, #0E1A2A 100%)',
        color: 'white',
        padding: '60px 40px 40px 40px',
        marginTop: '80px',
        textAlign: 'center',
        fontFamily: 'Quintessential, serif'
        }}>
          <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          
          {/* Section 1 */}
          <div>
            <h3 style={{
              fontSize: '1.2rem',
              marginBottom: '20px',
              color: '#C6A664',
              fontWeight: 'bold'
            }}>
              About Prism
            </h3>
            <p style={{
              fontSize: '0.9rem',
              lineHeight: '1.6',
              opacity: 0.9
            }}>
              Advanced AI-powered marketing trigger analysis tool. 
              Unveil the hidden persuasion techniques in any text 
              with precision and clarity.
            </p>
          </div>
          
          {/* Section 2 */}
          <div>
            <h3 style={{
              fontSize: '1.2rem',
                marginBottom: '20px',
              color: '#C6A664',
              fontWeight: 'bold'
            }}>
              Features
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              fontSize: '0.9rem',
              lineHeight: '1.8'
            }}>
              <li>✨ 14 Marketing Triggers</li>
              <li>🎯 Precision Analysis</li>
              <li>📊 Intensity Scoring</li>
              <li>🔍 Real-time Detection</li>
            </ul>
          </div>
          
          {/* Section 3 */}
          <div>
            <h3 style={{
              fontSize: '1.2rem',
              marginBottom: '20px',
              color: '#C6A664',
              fontWeight: 'bold'
            }}>
              Contact
            </h3>
            <p style={{
              fontSize: '0.9rem',
              lineHeight: '1.6',
              opacity: 0.9
            }}>
              For inquiries and support:<br/>
              <span style={{ color: '#C6A664' }}>contact@prism-analyzer.com</span><br/>
              <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Available 24/7</span>
            </p>
            </div>
            
          {/* Section 4 */}
          <div>
            <h3 style={{
              fontSize: '1.2rem',
              marginBottom: '20px',
              color: '#C6A664',
              fontWeight: 'bold'
            }}>
              Technology
            </h3>
            <p style={{
              fontSize: '0.9rem',
              lineHeight: '1.6',
              opacity: 0.9
            }}>
              Powered by OpenAI GPT-4<br/>
              Built with Next.js & React<br/>
              <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                Version 2.1.0
              </span>
            </p>
              </div>
          </div>
        
        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(198, 166, 100, 0.3)',
          paddingTop: '30px',
          fontSize: '0.8rem',
          opacity: 0.7
        }}>
          <p style={{ margin: 0 }}>
            © 2024 Prism Analyzer. All rights reserved. | 
            <span style={{ color: '#C6A664' }}> Privacy Policy</span> | 
            <span style={{ color: '#C6A664' }}> Terms of Service</span>
          </p>
        </div>
      </footer>

      {/* Tooltip personnalisé */}
      {tooltip.visible && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translateX(-50%) translateY(-100%)',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(15px)',
            color: '#063D61',
            padding: '16px 20px',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: '500',
            fontFamily: 'Quintessential, serif',
            lineHeight: '1.5',
            maxWidth: '320px',
            boxShadow: '0 12px 40px rgba(6, 61, 97, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            border: '2px solid rgba(6, 61, 97, 0.15)',
            zIndex: 10000,
            pointerEvents: 'none',
            opacity: tooltip.visible ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out',
            textAlign: 'left',
            whiteSpace: 'pre-line'
          }}
        >
          {tooltip.text.split('\n').map((line, index) => {
            const [triggerType, ...rest] = line.split(':');
            const content = rest.join(':');
            
            return (
              <div key={index} style={{
                marginBottom: index < tooltip.text.split('\n').length - 1 ? '8px' : '0',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <span style={{
                  fontWeight: 'bold',
                  color: '#C6A664',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  minWidth: '80px',
                  flexShrink: 0
                }}>
                  {triggerType}:
                </span>
                <span style={{
                  fontSize: '13px',
                  color: '#063D61',
                  lineHeight: '1.4'
                }}>
                  {content}
                </span>
              </div>
            );
          })}
          
          {/* Flèche vers le bas */}
          <div style={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid rgba(255, 255, 255, 0.98)'
          }} />
        </div>
      )}
      
    </div>
    </>
  );
}