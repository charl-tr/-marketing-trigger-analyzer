import React, { useState, useEffect } from 'react';
import { Key, CheckCircle, XCircle, Settings } from 'lucide-react';

interface ApiKeyStatusProps {
  onApiKeyChange?: (hasKey: boolean) => void;
}

export default function ApiKeyStatus({ onApiKeyChange }: ApiKeyStatusProps) {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Vérifier si une clé API est stockée
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey && storedKey.startsWith('sk-')) {
      setHasApiKey(true);
      setApiKey(storedKey);
      checkConnection();
    }
  }, []);

  const checkConnection = async () => {
    if (!hasApiKey) return;
    
    setIsChecking(true);
    setError('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: 'test connection',
          apiKey: apiKey 
        }),
      });

      if (response.ok) {
        setIsConnected(true);
        onApiKeyChange?.(true);
      } else {
        setIsConnected(false);
        setError('Invalid API key');
        onApiKeyChange?.(false);
      }
    } catch (err) {
      setIsConnected(false);
      setError('Connection failed');
      onApiKeyChange?.(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      setError('Please enter a valid API key');
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      setError('API key must start with "sk-"');
      return;
    }

    localStorage.setItem('openai_api_key', apiKey);
    setHasApiKey(true);
    setShowKeyInput(false);
    setError('');
    checkConnection();
  };

  const handleRemoveKey = () => {
    localStorage.removeItem('openai_api_key');
    setHasApiKey(false);
    setApiKey('');
    setIsConnected(false);
    setError('');
    onApiKeyChange?.(false);
  };

  const getStatusIcon = () => {
    if (isChecking) {
      return <div className="w-4 h-4 border-2 border-accent-pharaoh border-t-transparent rounded-full animate-spin" />;
    }
    
    if (isConnected) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    
    if (hasApiKey) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    
    return <Key className="w-4 h-4 text-gray-400" />;
  };

  const getStatusText = () => {
    if (isChecking) return 'Checking...';
    if (isConnected) return 'Connected';
    if (hasApiKey) return 'Invalid Key';
    return 'No API Key';
  };

  const getStatusColor = () => {
    if (isChecking) return 'text-accent-pharaoh';
    if (isConnected) return 'text-green-500';
    if (hasApiKey) return 'text-red-500';
    return 'text-gray-400';
  };

  return (
    <div className="flex items-center gap-3">
      {/* Status Display */}
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className={`text-sm font-quintessential ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {!hasApiKey ? (
          <button
            onClick={() => setShowKeyInput(true)}
            className="glass-button flex items-center gap-2 px-4 py-2 bg-accent-pharaoh text-white rounded-xl text-sm font-quintessential font-bold"
          >
            <Key className="w-4 h-4" />
            Add API Key
          </button>
        ) : (
          <button
            onClick={() => setShowKeyInput(true)}
            className="glass-button flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-accent-pharaoh rounded-xl text-sm font-quintessential font-medium border border-accent-pharaoh/30"
          >
            <Settings className="w-4 h-4" />
            Change Key
          </button>
        )}

        {hasApiKey && (
          <button
            onClick={handleRemoveKey}
            className="glass-button px-4 py-2 bg-red-500/20 backdrop-blur-sm text-red-600 rounded-xl text-sm font-quintessential font-medium border border-red-500/30"
          >
            Remove
          </button>
        )}
      </div>

      {/* Key Input Modal - Premium Design */}
      {showKeyInput && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-accent-gold/20 shadow-2xl prism-glass"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,245,240,0.95) 100%)',
              boxShadow: '0 20px 60px rgba(0, 87, 167, 0.2)',
            }}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-accent-pharaoh/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-accent-pharaoh" />
              </div>
              <h3 className="text-2xl font-quintessential font-bold text-text-primary mb-2">
                OpenAI API Key
              </h3>
              <p className="text-sm text-text-secondary font-quintessential">
                Enter your API key to unlock advanced analysis
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Input Field */}
              <div>
                <label className="block text-sm font-quintessential font-medium text-text-primary mb-3">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-4 py-3 bg-white/50 border-2 border-accent-gold/30 rounded-xl focus:ring-2 focus:ring-accent-pharaoh/50 focus:border-accent-pharaoh font-quintessential text-text-primary placeholder-text-muted transition-all duration-300"
                    style={{
                      background: 'rgba(255, 255, 255, 0.7)',
                    }}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Key className="w-5 h-5 text-accent-pharaoh/60" />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <div className="text-red-600 text-sm font-quintessential flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    {error}
                  </div>
                </div>
              )}

              {/* Info Box */}
              <div className="p-4 bg-accent-pharaoh/5 border border-accent-pharaoh/20 rounded-xl">
                <div className="text-xs text-accent-pharaoh font-quintessential">
                  <strong>Where to find your API key:</strong><br />
                  1. Go to <a href="https://platform.openai.com/api-keys" target="_blank" className="underline hover:no-underline">platform.openai.com/api-keys</a><br />
                  2. Create a new secret key<br />
                  3. Copy and paste it here
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSaveKey}
                  className="glass-button flex-1 px-6 py-3 bg-accent-pharaoh text-white rounded-xl font-quintessential font-bold"
                >
                  Save & Connect
                </button>
                <button
                  onClick={() => {
                    setShowKeyInput(false);
                    setError('');
                  }}
                  className="glass-button flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-quintessential font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
