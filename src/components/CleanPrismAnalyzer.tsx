'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Cog, Key } from 'lucide-react';
import ApiKeyStatus from './ApiKeyStatus';

export default function CleanPrismAnalyzer() {
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
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #F8F5F0 0%, #FAFAF7 50%, #F8F5F0 100%)',
        fontFamily: 'Quintessential, serif'
      }}
    >
      {/* Navigation Bar */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 p-6"
        style={{ backdropFilter: 'blur(20px)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div 
            className="flex justify-between items-center px-8 py-4 rounded-2xl border"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 12px 40px rgba(0, 87, 167, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.3)',
            }}
          >
            {/* Left side - Trigger Library */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.location.href = '/admin'}
                className="group flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  background: 'rgba(0, 87, 167, 0.12)',
                  border: '1px solid rgba(0, 87, 167, 0.25)',
                  color: '#0057A7',
                  boxShadow: '0 6px 20px rgba(0, 87, 167, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                }}
              >
                <Cog className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span>Trigger Library</span>
              </button>
            </div>

            {/* Right side - API Status & Configuration */}
            <div className="flex items-center gap-4">
              {/* API Status */}
              <div 
                className="flex items-center gap-3 px-4 py-2 rounded-full"
                style={{
                  background: hasApiKey 
                    ? 'rgba(34, 197, 94, 0.15)'
                    : 'rgba(239, 68, 68, 0.15)',
                  border: hasApiKey 
                    ? '1px solid rgba(34, 197, 94, 0.4)'
                    : '1px solid rgba(239, 68, 68, 0.4)',
                }}
              >
                <div 
                  className={`w-3 h-3 rounded-full animate-pulse shadow-lg ${
                    hasApiKey ? 'bg-green-400' : 'bg-red-400'
                  }`} 
                />
                <span 
                  className="text-sm font-medium"
                  style={{ color: hasApiKey ? '#059669' : '#DC2626' }}
                >
                  {hasApiKey ? 'API Connected' : 'No API Key'}
                </span>
              </div>

              <button
                onClick={() => setShowApiKeyManager(!showApiKeyManager)}
                className="group flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(198, 166, 100, 0.9) 0%, rgba(198, 166, 100, 0.7) 100%)',
                  border: '1px solid rgba(198, 166, 100, 0.4)',
                  boxShadow: '0 6px 20px rgba(198, 166, 100, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                }}
              >
                <Key className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>{hasApiKey ? 'Configure API' : 'Add API Key'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          {/* Background */}
          <div 
            className="absolute inset-0 rounded-3xl border"
            style={{
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
          >
            {/* Aura Effect */}
            <div 
              className="absolute inset-0 opacity-40 rounded-3xl animate-pulse"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0, 87, 167, 0.25) 0%, rgba(198, 166, 100, 0.2) 40%, transparent 80%)',
                transform: 'scale(1.1)',
              }}
            />
          </div>
          
          {/* Logo and Title Section */}
          <div className="relative z-10 py-20">
            {/* Logo */}
            <div className="flex justify-center items-center mb-12">
              <div className="relative group">
                {/* Golden Halo */}
                <div 
                  className="absolute inset-0 rounded-full opacity-70 animate-pulse"
                  style={{
                    background: 'radial-gradient(circle, rgba(198, 166, 100, 0.9) 0%, rgba(198, 166, 100, 0.5) 50%, rgba(198, 166, 100, 0.2) 100%)',
                    transform: 'scale(3)',
                    filter: 'blur(50px)',
                  }}
                />
                
                {/* Logo Image */}
                <img 
                  src="/logo-prism.png" 
                  alt="Prism Logo" 
                  className="w-40 h-40 relative z-10 drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                  style={{
                    filter: 'drop-shadow(0 0 40px rgba(198, 166, 100, 0.8)) drop-shadow(0 0 80px rgba(0, 87, 167, 0.4))',
                  }}
                />
                
                {/* Floating Particles */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-6 left-6 w-3 h-3 bg-yellow-300 rounded-full animate-pulse opacity-70"></div>
                  <div className="absolute top-12 right-8 w-2 h-2 bg-blue-300 rounded-full animate-pulse opacity-50" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute bottom-8 left-10 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse opacity-60" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute bottom-12 right-6 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse opacity-40" style={{ animationDelay: '1.5s' }}></div>
                </div>
              </div>
            </div>
            
            {/* Title Section */}
            <div className="mb-8">
              <h1 
                className="text-7xl md:text-8xl font-bold mb-6 animate-bounce"
                style={{
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
                className="text-4xl md:text-5xl font-medium mb-8 animate-pulse"
                style={{ 
                  color: '#0057A7',
                  textShadow: '0 4px 8px rgba(198, 166, 100, 0.5)',
                }}
              >
                See the persuasion beneath words
              </h2>
              
              <p 
                className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed opacity-90"
                style={{ color: '#5D6D7E' }}
              >
                Unlock the hidden architecture of persuasion in any text with our advanced AI-powered analysis
              </p>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-16 relative">
          {/* Container */}
          <div 
            className="relative p-12 rounded-3xl transition-all duration-600"
            style={{
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
            <div className="relative">
              {/* Text Area */}
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder=""
                className="w-full px-8 py-8 border-0 rounded-2xl focus:outline-none resize-none leading-relaxed text-lg transition-all duration-500"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  minHeight: '500px',
                  maxHeight: '80vh',
                  height: `${Math.max(500, Math.min(800, text.split('\n').length * 28 + 150))}px`,
                  fontSize: '1.1rem',
                  color: '#2C2C2C',
                  backdropFilter: 'blur(30px) saturate(180%) brightness(1.05)',
                  boxShadow: `
                    inset 0 2px 0 rgba(255, 255, 255, 0.4),
                    inset 0 -1px 0 rgba(0, 87, 167, 0.08),
                    0 12px 40px rgba(0, 87, 167, 0.1)
                  `,
                }}
              />
              
              {/* Placeholder */}
              {!text && (
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none px-8 py-8"
                >
                  <div className="text-center">
                    <p 
                      className="text-2xl mb-4 opacity-80"
                      style={{ 
                        color: '#0057A7',
                        textShadow: '0 2px 4px rgba(198, 166, 100, 0.3)' 
                      }}
                    >
                      Paste your copy... and let Prism reveal the persuasion beneath your words.
                    </p>
                    <div className="flex justify-center space-x-2">
                      <div 
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: '#0057A7' }}
                      ></div>
                      <div 
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ 
                          backgroundColor: '#C6A664',
                          animationDelay: '0.2s' 
                        }}
                      ></div>
                      <div 
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ 
                          backgroundColor: '#0057A7',
                          animationDelay: '0.4s' 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mb-16">
          <div className="relative group">
            {/* Glow */}
            <div 
              className="absolute inset-0 rounded-3xl opacity-80 animate-pulse"
              style={{
                background: 'radial-gradient(ellipse, rgba(0, 87, 167, 0.6) 0%, rgba(198, 166, 100, 0.4) 50%, transparent 70%)',
                transform: 'scale(1.1)',
                filter: 'blur(20px)',
              }}
            />
            
            {/* Button */}
            <button
              onClick={handleAnalyze}
              disabled={!text.trim() || isAnalyzing}
              className="relative px-20 py-6 rounded-3xl text-2xl font-medium transition-all duration-600 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              style={{
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
              }}
            >
              {/* Light Ray Sweep */}
              <div 
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1500"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
                }}
              />
              
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

        {/* Error Display */}
        {error && (
          <div 
            className="mt-8 p-6 border rounded-xl"
            style={{
              backgroundColor: '#FEF2F2',
              borderColor: '#FECACA',
              color: '#DC2626',
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* API Key Manager Modal */}
      {showApiKeyManager && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        >
          <div 
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 rounded-3xl border"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 20px 60px rgba(0, 87, 167, 0.3)',
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 
                className="text-3xl font-bold"
                style={{ color: '#2C3E50' }}
              >
                API Configuration
              </h2>
              <button
                onClick={() => setShowApiKeyManager(false)}
                className="group relative px-4 py-2 rounded-xl font-medium text-lg transition-all duration-400 overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  border: '1px solid rgba(0, 87, 167, 0.3)',
                  color: '#0057A7',
                  boxShadow: '0 4px 12px rgba(0, 87, 167, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                }}
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
