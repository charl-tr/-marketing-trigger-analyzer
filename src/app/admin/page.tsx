'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Types
interface Trigger {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  color: string;
}

// Constants - Default triggers (all disabled by default)
const DEFAULT_TRIGGERS: Trigger[] = [
  {
    id: 'mystery',
    name: 'MYSTERY',
    description: 'Crée de la curiosité et du mystère autour du produit ou service',
    enabled: false,
    color: '#8B5CF6'
  },
  {
    id: 'curiosity',
    name: 'CURIOSITY',
    description: 'Suscite l\'intérêt et pousse à en savoir plus',
    enabled: false,
    color: '#A855F7'
  },
  {
    id: 'exclusivity',
    name: 'EXCLUSIVITY',
    description: 'Crée un sentiment d\'exclusivité et de privilège',
    enabled: false,
    color: '#06B6D4'
  },
  {
    id: 'storytelling',
    name: 'STORYTELLING',
    description: 'Utilise la narration pour engager émotionnellement',
    enabled: false,
    color: '#F59E0B'
  },
  {
    id: 'urgency',
    name: 'URGENCY',
    description: 'Crée un sentiment d\'urgence pour inciter à l\'action',
    enabled: false,
    color: '#EF4444'
  },
  {
    id: 'scarcity',
    name: 'SCARCITY',
    description: 'Met en avant la rareté ou la limitation',
    enabled: false,
    color: '#F97316'
  },
  {
    id: 'social_proof',
    name: 'SOCIAL PROOF',
    description: 'Utilise les témoignages et la validation sociale',
    enabled: false,
    color: '#10B981'
  },
  {
    id: 'reciprocity',
    name: 'RECIPROCITY',
    description: 'Crée un sentiment de dette ou d\'obligation',
    enabled: false,
    color: '#3B82F6'
  },
  {
    id: 'commitment',
    name: 'COMMITMENT',
    description: 'Encourage l\'engagement et la cohérence',
    enabled: false,
    color: '#8B5CF6'
  },
  {
    id: 'liking',
    name: 'LIKING',
    description: 'Crée de la sympathie et de l\'affinité',
    enabled: false,
    color: '#EC4899'
  },
  {
    id: 'authority',
    name: 'AUTHORITY',
    description: 'Établit la crédibilité et l\'expertise',
    enabled: false,
    color: '#6366F1'
  },
  {
    id: 'loss_aversion',
    name: 'LOSS AVERSION',
    description: 'Met l\'accent sur ce qui pourrait être perdu',
    enabled: false,
    color: '#F59E0B'
  },
  {
    id: 'contrast',
    name: 'CONTRAST',
    description: 'Utilise les comparaisons pour mettre en valeur',
    enabled: false,
    color: '#84CC16'
  },
  {
    id: 'call_to_action',
    name: 'CALL TO ACTION',
    description: 'Incite directement à l\'action',
    enabled: false,
    color: '#EF4444'
  }
];

export default function AdminPage() {
  const [triggers, setTriggers] = useState<Trigger[]>(DEFAULT_TRIGGERS);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved triggers on mount
  useEffect(() => {
    const savedTriggers = localStorage.getItem('selectedTriggers');
    if (savedTriggers) {
      try {
        const parsed = JSON.parse(savedTriggers);
        if (Array.isArray(parsed)) {
          // Old format - convert to new format
          const enabledIds = parsed;
          setTriggers(prev => prev.map(trigger => ({
            ...trigger,
            enabled: enabledIds.includes(trigger.id)
          })));
        } else if (parsed.triggers) {
          // New format
          setTriggers(parsed.triggers);
        }
      } catch (error) {
        console.warn('Failed to load saved triggers:', error);
        // Keep default triggers (all disabled)
        setTriggers(DEFAULT_TRIGGERS);
      }
    } else {
      // No saved triggers, use defaults (all disabled)
      setTriggers(DEFAULT_TRIGGERS);
    }
    setIsLoaded(true);
  }, []);

  // Save triggers when they change (only after initial load)
  useEffect(() => {
    if (isLoaded && triggers.length > 0) {
      localStorage.setItem('selectedTriggers', JSON.stringify({ triggers }));
      setHasChanges(true);
    }
  }, [triggers, isLoaded]);

  const toggleTrigger = (id: string) => {
    setTriggers(prev => prev.map(trigger => 
      trigger.id === id ? { ...trigger, enabled: !trigger.enabled } : trigger
    ));
  };

  const toggleAll = (enabled: boolean) => {
    setTriggers(prev => prev.map(trigger => ({ ...trigger, enabled })));
  };

  const resetToDefaults = () => {
    setTriggers(DEFAULT_TRIGGERS);
  };

  const enabledCount = triggers.filter(t => t.enabled).length;
  const totalCount = triggers.length;

  return (
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
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      
      {/* Navigation */}
      <div style={{
        position: 'absolute',
        top: '50px',
        left: '60px',
        zIndex: 10
      }}>
        <Link 
          href="/"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #063D61 0%, #0E1A2A 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '16px',
            fontFamily: 'Quintessential, serif',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            boxShadow: '0 6px 20px rgba(6, 61, 97, 0.3)',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            letterSpacing: '0.5px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(6, 61, 97, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(6, 61, 97, 0.3)';
          }}
        >
          ← RETURN TO CHAMBER
        </Link>
      </div>

      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        background: 'linear-gradient(135deg, rgba(198, 166, 100, 0.1) 0%, rgba(198, 166, 100, 0.05) 100%)',
        borderRadius: '20px',
        padding: '30px',
        border: '2px solid rgba(198, 166, 100, 0.3)',
        boxShadow: '0 8px 32px rgba(198, 166, 100, 0.2)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '15px'
        }}>
          <span style={{ fontSize: '32px', marginRight: '15px' }}>☥</span>
          <h1 style={{
            fontSize: '2.8rem',
            color: '#063D61',
            margin: '0',
            fontFamily: 'Quintessential, serif',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            letterSpacing: '1px'
          }}>
            SACRED RITES
          </h1>
        </div>
        <p style={{
          fontSize: '1.2rem',
          color: '#5D6D7E',
          margin: '0 0 15px 0',
          fontStyle: 'italic',
          fontFamily: 'Quintessential, serif'
        }}>
          Configure the Ancient Wisdom of Persuasion
        </p>
        
        {/* Active Triggers Counter */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
          borderRadius: '20px',
          padding: '24px 36px',
          border: '4px solid #063D61',
          boxShadow: '0 16px 40px rgba(6, 61, 97, 0.4), inset 0 3px 6px rgba(255,255,255,0.4), 0 0 0 2px rgba(255,255,255,0.3)',
          display: 'inline-block',
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(8px)',
          marginTop: '25px',
          transform: 'scale(1.05)'
        }}>
          <div style={{
            fontSize: '1.8rem',
            color: '#063D61',
            fontFamily: 'Quintessential, serif',
            fontWeight: 'bold',
            textShadow: '4px 4px 8px rgba(0,0,0,0.4), 0 0 15px rgba(6, 61, 97, 0.6)',
            letterSpacing: '1.5px',
            position: 'relative',
            zIndex: 2,
            fontStyle: 'normal'
          }}>
            {enabledCount} / {totalCount}
          </div>
          <div style={{
            fontSize: '0.95rem',
            color: '#063D61',
            fontFamily: 'Quintessential, serif',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '2.5px',
            marginTop: '8px',
            position: 'relative',
            zIndex: 2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            fontStyle: 'normal'
          }}>
            RITES ACTIVATED
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        position: 'absolute',
        top: '50px',
        right: '60px',
        zIndex: 10
      }}>
        <div style={{
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => toggleAll(true)}
            style={{
              background: 'linear-gradient(135deg, #063D61 0%, #0E1A2A 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '15px',
              fontFamily: 'Quintessential, serif',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              boxShadow: '0 4px 12px rgba(6, 61, 97, 0.3)',
              letterSpacing: '0.5px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(6, 61, 97, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(6, 61, 97, 0.3)';
            }}
          >
            ✨ AWAKEN ALL
          </button>
          <button
            onClick={() => toggleAll(false)}
            style={{
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '15px',
              fontFamily: 'Quintessential, serif',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
              letterSpacing: '0.5px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
            }}
          >
            🔒 SEAL ALL
          </button>
        </div>
      </div>

      {/* Stats */}

      {/* Triggers Grid */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(198, 166, 100, 0.15) 0%, rgba(198, 166, 100, 0.08) 100%)',
        borderRadius: '20px',
        padding: '30px',
        border: '2px solid rgba(198, 166, 100, 0.3)',
        boxShadow: '0 8px 32px rgba(198, 166, 100, 0.2)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          {triggers.map((trigger) => (
            <div
              key={trigger.id}
              onClick={() => toggleTrigger(trigger.id)}
              style={{
                background: trigger.enabled 
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(248, 250, 252, 0.5) 100%)',
                backdropFilter: 'blur(12px)',
                border: trigger.enabled 
                  ? `3px solid ${trigger.color}`
                  : '2px solid rgba(107, 114, 128, 0.2)',
                borderRadius: '24px',
                padding: '28px',
                cursor: 'pointer',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: trigger.enabled ? 'translateY(-6px) scale(1.03)' : 'none',
                boxShadow: trigger.enabled 
                  ? `0 25px 50px ${trigger.color}30, 0 0 0 2px ${trigger.color}40, inset 0 1px 0 rgba(255,255,255,0.2)`
                  : '0 8px 25px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.3)',
                position: 'relative',
                overflow: 'hidden',
                opacity: trigger.enabled ? 1 : 0.7
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = trigger.enabled 
                  ? 'translateY(-6px) scale(1.03)' 
                  : 'translateY(-2px) scale(1.01)';
                e.currentTarget.style.boxShadow = trigger.enabled 
                  ? '0 25px 50px rgba(6, 61, 97, 0.2), 0 0 0 1px rgba(6, 61, 97, 0.15)'
                  : '0 15px 35px rgba(0,0,0,0.12)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = trigger.enabled ? 'translateY(-4px) scale(1.02)' : 'none';
                e.currentTarget.style.boxShadow = trigger.enabled 
                  ? '0 20px 40px rgba(6, 61, 97, 0.15), 0 0 0 1px rgba(6, 61, 97, 0.1)'
                  : '0 8px 25px rgba(0,0,0,0.08)';
              }}
            >
              {/* Magical status indicator */}
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: trigger.enabled ? '40px' : '32px',
                height: trigger.enabled ? '40px' : '32px',
                borderRadius: '50%',
                background: trigger.enabled 
                  ? 'linear-gradient(135deg, #063D61 0%, #0E1A2A 50%, #1A365D 100%)'
                  : 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: trigger.enabled ? '20px' : '16px',
                color: trigger.enabled ? '#D4AF37' : '#FFFFFF',
                boxShadow: trigger.enabled 
                  ? '0 8px 20px rgba(6, 61, 97, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)'
                  : '0 4px 12px rgba(107, 114, 128, 0.3)',
                border: trigger.enabled 
                  ? '3px solid rgba(212, 175, 55, 0.4)'
                  : '2px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.4s ease',
                transform: trigger.enabled ? 'scale(1.1)' : 'scale(1)',
                textShadow: trigger.enabled ? '0 0 8px rgba(212, 175, 55, 0.8)' : 'none'
              }}>
                {trigger.enabled ? '☥' : '🔒'}
              </div>

              {/* Color indicator */}
              <div style={{
                width: '6px',
                height: '80px',
                background: `linear-gradient(180deg, ${trigger.color} 0%, ${trigger.color}80 50%, ${trigger.color}40 100%)`,
                borderRadius: '3px',
                position: 'absolute',
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                opacity: trigger.enabled ? 1 : 0.4,
                boxShadow: `0 0 15px ${trigger.color}60, inset 0 0 5px rgba(255,255,255,0.2)`,
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }} />

              {/* Color badge */}
              <div style={{
                position: 'absolute',
                top: '18px',
                left: '18px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${trigger.color} 0%, ${trigger.color}80 100%)`,
                border: '2px solid rgba(255, 255, 255, 0.4)',
                boxShadow: `0 4px 12px ${trigger.color}50, inset 0 1px 2px rgba(255,255,255,0.3)`,
                opacity: trigger.enabled ? 1 : 0.3
              }} />

              <div style={{
                marginLeft: '50px',
                marginBottom: '24px',
                marginTop: '8px'
              }}>
                <h4 style={{
                  margin: '0 0 8px 0',
                  fontSize: '18px',
                  color: trigger.enabled ? '#063D61' : '#6B7280',
                  fontWeight: trigger.enabled ? 'bold' : '600',
                  fontFamily: 'Quintessential, serif',
                  textShadow: trigger.enabled ? '1px 1px 2px rgba(0,0,0,0.1)' : 'none',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  lineHeight: '1.2'
                }}>
                  {trigger.name}
                </h4>
                
                <p style={{
                  margin: '0',
                  fontSize: '13px',
                  color: trigger.enabled ? '#374151' : '#9CA3AF',
                  lineHeight: '1.5',
                  fontFamily: 'Quintessential, serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  opacity: trigger.enabled ? 1 : 0.8
                }}>
                  {trigger.description}
                </p>
              </div>

              {/* Magical border effect */}
              {trigger.enabled && (
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  bottom: '0',
                  borderRadius: '24px',
                  background: `linear-gradient(45deg, transparent, ${trigger.color}20, ${trigger.color}15, transparent)`,
                  pointerEvents: 'none'
                }} />
              )}

              {/* Egyptian hieroglyphic pattern */}
              {trigger.enabled && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  right: '10px',
                  bottom: '10px',
                  borderRadius: '20px',
                  background: `radial-gradient(circle at 20% 20%, ${trigger.color}15 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${trigger.color}10 0%, transparent 50%)`,
                  pointerEvents: 'none'
                }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}