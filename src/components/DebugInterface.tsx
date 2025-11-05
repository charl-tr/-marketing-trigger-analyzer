import React, { useState } from 'react';

interface DebugInterfaceProps {
  text: string;
  highlights: Array<{
    start: number;
    end: number;
    type: string;
    intensity: number;
    reason: string;
  }>;
  apiLogs: any[];
  debugLogs: string[];
  isVisible: boolean;
  onClose: () => void;
}

// Couleurs distinctes pour chaque trigger
const TRIGGER_COLORS = {
  'urgency': '#FF6B6B', 
  'scarcity': '#4ECDC4', 
  'social_proof': '#45B7D1',
  'authority': '#96CEB4',
  'fear': '#FF9FF3',
  'exclusivity': '#00D2D3',
  'storytelling': '#FF9F43',
  'contrast': '#C44569',
  'call_to_action': '#2ED573',
  'loss_aversion': '#FF3838'
};

export default function DebugInterface({ 
  text, 
  highlights, 
  apiLogs, 
  debugLogs, 
  isVisible, 
  onClose 
}: DebugInterfaceProps) {
  const [activeTab, setActiveTab] = useState<'words' | 'api' | 'ui'>('words');
  const [showWordIndexes, setShowWordIndexes] = useState(true);

  if (!isVisible) return null;

  // Créer l'indexation des mots
  const words = text.split(/(\s+)/);
  const wordIndexes: Array<{ word: string; start: number; end: number; index: number }> = [];
  
  let currentIndex = 0;
  words.forEach((word, wordIndex) => {
    const start = currentIndex;
    const end = currentIndex + word.length;
    wordIndexes.push({ word, start, end, index: wordIndex });
    currentIndex = end;
  });

  // Fonction pour obtenir la couleur d'un trigger
  const getTriggerColor = (triggerType: string) => {
    return TRIGGER_COLORS[triggerType as keyof typeof TRIGGER_COLORS] || '#E0E0E0';
  };

  // Fonction pour obtenir le nom d'affichage d'un trigger
  const getTriggerDisplayName = (triggerType: string) => {
    return triggerType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      background: 'rgba(0, 0, 0, 0.95)',
      backdropFilter: 'blur(20px)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'monospace'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ color: '#fff', margin: 0, fontSize: '20px' }}>
          🔍 Debug Interface - Text Analysis
        </h2>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '0',
            width: '32px',
            height: '32px'
          }}
        >
          ×
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        background: 'rgba(0, 0, 0, 0.6)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <button
          onClick={() => setActiveTab('words')}
          style={{
            background: activeTab === 'words' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
            border: 'none',
            color: '#fff',
            padding: '12px 20px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          📝 Word Indexing ({wordIndexes.length} words)
        </button>
        <button
          onClick={() => setActiveTab('api')}
          style={{
            background: activeTab === 'api' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
            border: 'none',
            color: '#fff',
            padding: '12px 20px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔌 API Output ({apiLogs.length} events)
        </button>
        <button
          onClick={() => setActiveTab('ui')}
          style={{
            background: activeTab === 'ui' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
            border: 'none',
            color: '#fff',
            padding: '12px 20px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🖥️ UI Logs ({debugLogs.length} logs)
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
        {activeTab === 'words' && (
          <div>
            {/* Controls */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <label style={{ color: '#fff', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={showWordIndexes}
                  onChange={(e) => setShowWordIndexes(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Show word indexes
              </label>
              <div style={{ color: '#888', fontSize: '12px' }}>
                Text length: {text.length} characters | {wordIndexes.length} words | {highlights.length} highlights
              </div>
            </div>

            {/* Text with word indexing */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '14px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}>
              {wordIndexes.map((wordData, index) => {
                const isHighlighted = highlights.some(h => 
                  wordData.start >= h.start && wordData.end <= h.end
                );
                const highlight = highlights.find(h => 
                  wordData.start >= h.start && wordData.end <= h.end
                );
                
                return (
                  <span
                    key={index}
                    style={{
                      backgroundColor: isHighlighted ? getTriggerColor(highlight?.type || '') : 'transparent',
                      color: isHighlighted ? '#fff' : '#fff',
                      padding: isHighlighted ? '2px 4px' : '0',
                      borderRadius: isHighlighted ? '4px' : '0',
                      margin: '0 1px',
                      position: 'relative'
                    }}
                    title={isHighlighted ? 
                      `${getTriggerDisplayName(highlight?.type || '')} • ${highlight?.start}-${highlight?.end} • ${highlight?.reason}` : 
                      `Word ${index} • ${wordData.start}-${wordData.end}`
                    }
                  >
                    {wordData.word}
                    {showWordIndexes && (
                      <span style={{
                        fontSize: '10px',
                        color: '#888',
                        marginLeft: '2px'
                      }}>
                        [{wordData.start}-{wordData.end}]
                      </span>
                    )}
                  </span>
                );
              })}
            </div>

            {/* Highlights breakdown */}
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ color: '#fff', marginBottom: '10px' }}>Highlights Breakdown:</h3>
              {highlights.map((highlight, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '10px',
                  marginBottom: '8px',
                  borderRadius: '4px',
                  border: `2px solid ${getTriggerColor(highlight.type)}`,
                  fontSize: '12px'
                }}>
                  <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}>
                    {getTriggerDisplayName(highlight.type)} • Intensity: {Math.round(highlight.intensity * 100)}%
                  </div>
                  <div style={{ color: '#ccc', marginBottom: '4px' }}>
                    Position: {highlight.start}-{highlight.end} ({highlight.end - highlight.start} chars)
                  </div>
                  <div style={{ color: '#888', marginBottom: '4px' }}>
                    Text: "{text.substring(highlight.start, highlight.end)}"
                  </div>
                  <div style={{ color: '#888' }}>
                    Reason: {highlight.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div>
            <h3 style={{ color: '#fff', marginBottom: '20px' }}>API Stream Events:</h3>
            {apiLogs.length === 0 ? (
              <div style={{ color: '#888', fontStyle: 'italic' }}>
                No API events yet. Start an analysis to see API stream.
              </div>
            ) : (
              apiLogs.map((log, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '15px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '12px'
                }}>
                  <div style={{ color: '#4ECDC4', fontWeight: 'bold', marginBottom: '8px' }}>
                    Event {index + 1}: {log.type}
                    {log.currentTrigger && ` - ${log.currentTrigger}`}
                    {log.trigger && ` - ${log.trigger}`}
                  </div>
                  <pre style={{ 
                    color: '#fff', 
                    margin: 0, 
                    whiteSpace: 'pre-wrap',
                    fontSize: '11px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    padding: '10px',
                    borderRadius: '4px'
                  }}>
                    {JSON.stringify(log, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'ui' && (
          <div>
            <h3 style={{ color: '#fff', marginBottom: '20px' }}>UI Debug Logs:</h3>
            {debugLogs.length === 0 ? (
              <div style={{ color: '#888', fontStyle: 'italic' }}>
                No UI logs yet.
              </div>
            ) : (
              debugLogs.map((log, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '8px',
                  marginBottom: '4px',
                  borderRadius: '4px',
                  borderLeft: '3px solid #4ECDC4',
                  fontSize: '12px',
                  color: '#fff'
                }}>
                  {log}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
