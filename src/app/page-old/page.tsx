'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function OldPage() {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showApiKeyManager, setShowApiKeyManager] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        console.log('Analysis successful:', data);
        alert('Analyse réussie ! Vérifiez la console pour voir les résultats.');
      } else {
        throw new Error(data.message || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error instanceof Error ? error.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F8F5F0 0%, #FAFAF7 50%, #F8F5F0 100%)',
        fontFamily: 'Quintessential, serif',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Navigation Bar */}
      <div 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: '24px',
          backdropFilter: 'blur(20px)'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 32px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 12px 40px rgba(0, 87, 167, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.3)',
            }}
          >
            {/* Left side - Back to Main */}
            <Link 
              href="/"
              style={{
                display: 'inline-block',
                background: 'rgba(0, 87, 167, 0.12)',
                border: '1px solid rgba(0, 87, 167, 0.25)',
                color: '#0057A7',
                textDecoration: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 6px 20px rgba(0, 87, 167, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              }}
            >
              ← Back to Main
            </Link>

            {/* Right side - API Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: hasApiKey 
                    ? 'rgba(34, 197, 94, 0.15)'
                    : 'rgba(239, 68, 68, 0.15)',
                  border: hasApiKey 
                    ? '1px solid rgba(34, 197, 94, 0.4)'
                    : '1px solid rgba(239, 68, 68, 0.4)',
                }}
              >
                <div 
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: hasApiKey ? '#10B981' : '#EF4444',
                    animation: 'pulse 2s infinite',
                  }}
                />
                <span 
                  style={{ 
                    fontSize: '14px',
                    fontWeight: '500',
                    color: hasApiKey ? '#059669' : '#DC2626'
                  }}
                >
                  {hasApiKey ? 'API Connected' : 'No API Key'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1280px', margin: '0 auto', padding: '96px 24px 32px' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '64px', position: 'relative' }}>
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: `
                0 50px 120px rgba(0, 87, 167, 0.2),
                0 25px 60px rgba(0, 87, 167, 0.15),
                inset 0 2px 0 rgba(255, 255, 255, 0.5),
                inset 0 -2px 0 rgba(0, 87, 167, 0.15)
              `,
              transform: 'scale(1.02)',
            }}
          />
          
          <div style={{ position: 'relative', zIndex: 10, padding: '80px 0' }}>
            <h1 
              style={{
                fontSize: '4rem',
                fontWeight: 'bold',
                marginBottom: '24px',
                background: 'linear-gradient(135deg, #0057A7 0%, #C6A664 50%, #0057A7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 8px 16px rgba(0, 87, 167, 0.5), 0 4px 8px rgba(198, 166, 100, 0.4)',
              }}
            >
              Prism
            </h1>
            
            <h2 
              style={{ 
                fontSize: '2.5rem',
                fontWeight: '500',
                marginBottom: '32px',
                color: '#0057A7',
                textShadow: '0 4px 8px rgba(198, 166, 100, 0.5)',
              }}
            >
              See the persuasion beneath words
            </h2>
            
            <p 
              style={{ 
                fontSize: '1.25rem',
                maxWidth: '1024px',
                margin: '0 auto',
                lineHeight: '1.6',
                opacity: 0.9,
                color: '#5D6D7E'
              }}
            >
              Unlock the hidden architecture of persuasion in any text with our advanced AI-powered analysis
            </p>
          </div>
        </div>

        {/* Input Section */}
        <div style={{ marginBottom: '64px', position: 'relative' }}>
          <div 
            style={{
              position: 'relative',
              padding: '48px',
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(60px) saturate(200%) brightness(1.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: `
                0 100px 250px rgba(0, 87, 167, 0.2),
                0 50px 125px rgba(0, 87, 167, 0.15),
                0 25px 62px rgba(0, 87, 167, 0.1),
                inset 0 2px 0 rgba(255, 255, 255, 0.7),
                inset 0 -2px 0 rgba(0, 87, 167, 0.15)
              `,
            }}
          >
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your copy... and let Prism reveal the persuasion beneath your words."
              style={{
                width: '100%',
                padding: '32px',
                border: 'none',
                borderRadius: '16px',
                outline: 'none',
                resize: 'none',
                lineHeight: '1.6',
                fontSize: '1.1rem',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                minHeight: '500px',
                maxHeight: '80vh',
                color: '#2C2C2C',
                backdropFilter: 'blur(30px) saturate(180%) brightness(1.05)',
                boxShadow: `
                  inset 0 2px 0 rgba(255, 255, 255, 0.4),
                  inset 0 -1px 0 rgba(0, 87, 167, 0.08),
                  0 12px 40px rgba(0, 87, 167, 0.1)
                `,
              }}
            />
          </div>
        </div>

        {/* CTA Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '64px' }}>
          <button
            onClick={handleAnalyze}
            disabled={!text.trim() || isAnalyzing}
            style={{
              padding: '24px 80px',
              borderRadius: '24px',
              fontSize: '1.5rem',
              fontWeight: '500',
              transition: 'all 0.6s ease',
              transform: 'none',
              background: 'linear-gradient(135deg, rgba(0, 87, 167, 0.95) 0%, rgba(0, 61, 115, 0.95) 100%)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: `
                0 40px 100px rgba(0, 87, 167, 0.5),
                0 20px 50px rgba(0, 87, 167, 0.4),
                0 10px 25px rgba(0, 87, 167, 0.3),
                inset 0 2px 0 rgba(255, 255, 255, 0.5),
                inset 0 -2px 0 rgba(0, 0, 0, 0.2),
                0 0 0 1px rgba(255, 255, 255, 0.2)
              `,
              cursor: (!text.trim() || isAnalyzing) ? 'not-allowed' : 'pointer',
              opacity: (!text.trim() || isAnalyzing) ? 0.5 : 1,
            }}
            onMouseOver={(e) => {
              if (!(!text.trim() || isAnalyzing)) {
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'none';
            }}
          >
            {isAnalyzing ? 'Analyzing...' : 'Reveal the Triggers'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div 
            style={{
              marginTop: '32px',
              padding: '24px',
              border: '1px solid #FECACA',
              borderRadius: '12px',
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
            }}
          >
            {error}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
