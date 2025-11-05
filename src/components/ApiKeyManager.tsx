'use client';

import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Check, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ApiKeyManagerProps {
  onApiKeyChange: (hasApiKey: boolean) => void;
}

export default function ApiKeyManager({ onApiKeyChange }: ApiKeyManagerProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Charger la clé API depuis localStorage au montage
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsConnected(true);
      onApiKeyChange(true);
    }
  }, [onApiKeyChange]);

  const validateApiKey = async (key: string) => {
    if (!key.trim()) {
      setIsValid(false);
      setError('Veuillez entrer une clé API');
      return false;
    }

    if (!key.startsWith('sk-')) {
      setIsValid(false);
      setError('La clé API doit commencer par "sk-"');
      return false;
    }

    setIsValidating(true);
    setError('');

    try {
      // Test simple de la clé API
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: key }),
      });

      const data = await response.json();
      
      if (data.valid) {
        setIsValid(true);
        setIsConnected(true);
        localStorage.setItem('openai_api_key', key);
        onApiKeyChange(true);
        return true;
      } else {
        setIsValid(false);
        setError(data.error || 'Clé API invalide');
        return false;
      }
    } catch (error) {
      setIsValid(false);
      setError('Erreur lors de la validation de la clé API');
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSaveKey = async () => {
    const success = await validateApiKey(apiKey);
    if (success) {
      setError('');
    }
  };

  const handleRemoveKey = () => {
    setApiKey('');
    setIsValid(null);
    setIsConnected(false);
    setError('');
    localStorage.removeItem('openai_api_key');
    onApiKeyChange(false);
  };

  const handleKeyChange = (value: string) => {
    setApiKey(value);
    setIsValid(null);
    setError('');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuration de l'API
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statut de connexion */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="font-medium">
              {isConnected ? 'Connecté à OpenAI' : 'Non connecté'}
            </span>
          </div>
          {isConnected && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveKey}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-2" />
              Déconnecter
            </Button>
          )}
        </div>

        {/* Configuration de la clé API */}
        {!isConnected && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="api-key" className="text-sm font-medium text-gray-700">
                Clé API OpenAI
              </Label>
              <p className="text-xs text-gray-500 mb-2">
                Obtenez votre clé sur{' '}
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  platform.openai.com
                </a>
              </p>
              <div className="relative">
                <Input
                  id="api-key"
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => handleKeyChange(e.target.value)}
                  placeholder="sk-..."
                  className={`pr-20 ${
                    isValid === true ? 'border-green-500' : 
                    isValid === false ? 'border-red-500' : ''
                  }`}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  {isValid === true && <Check className="h-4 w-4 text-green-500" />}
                  {isValid === false && <X className="h-4 w-4 text-red-500" />}
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              onClick={handleSaveKey}
              disabled={!apiKey.trim() || isValidating}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isValidating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Validation...
                </>
              ) : (
                <>
                  <Key className="h-4 w-4 mr-2" />
                  Valider la clé API
                </>
              )}
            </Button>
          </div>
        )}

        {/* Informations sur l'analyse */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Modes d'analyse disponibles :</h4>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span><strong>Mode intelligent :</strong> Analyse sémantique avancée avec GPT-4o-mini</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span><strong>Mode basique :</strong> Analyse par mots-clés (gratuit)</span>
            </div>
          </div>
        </div>

        {/* Coûts */}
        {isConnected && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">💡 Coûts estimés :</h4>
            <p className="text-sm text-yellow-800">
              L'analyse intelligente coûte environ <strong>0.01€ par analyse</strong>.
              Vous pouvez surveiller vos dépenses sur votre{' '}
              <a 
                href="https://platform.openai.com/usage" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                tableau de bord OpenAI
              </a>.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
