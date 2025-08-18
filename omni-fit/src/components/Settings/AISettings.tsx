import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Key, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { aiService } from '@/services/ai';
import { logger } from '@/utils/logger';

interface AIProvider {
  id: string;
  name: string;
  description: string;
  keyRequired: boolean;
  keyName?: string;
  setupUrl?: string;
  free?: boolean;
}

const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'Accès à plusieurs modèles IA, options gratuites disponibles',
    keyRequired: false,
    free: true,
    setupUrl: 'https://openrouter.ai/keys'
  },
  {
    id: 'openai',
    name: 'OpenAI (GPT-4)',
    description: 'Les modèles GPT-4 et GPT-4o-mini',
    keyRequired: true,
    keyName: 'VITE_OPENAI_API_KEY',
    setupUrl: 'https://platform.openai.com/api-keys'
  },
  {
    id: 'groq',
    name: 'Groq',
    description: 'LLMs ultra-rapides avec Llama 3.2',
    keyRequired: true,
    keyName: 'VITE_AI_API_KEY',
    setupUrl: 'https://console.groq.com/keys'
  },
  {
    id: 'ollama',
    name: 'Ollama (Local)',
    description: 'Modèles IA locaux, 100% privé',
    keyRequired: false,
    free: true,
    setupUrl: 'https://ollama.ai'
  }
];

export function AISettings() {
  const [selectedProvider, setSelectedProvider] = useState('openrouter');
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    // Charger les clés API depuis localStorage
    const savedKeys: Record<string, string> = {};
    AI_PROVIDERS.forEach(provider => {
      if (provider.keyName) {
        const key = localStorage.getItem(provider.keyName) || '';
        if (key) savedKeys[provider.id] = key;
      }
    });
    setApiKeys(savedKeys);

    // Charger le provider sélectionné
    const savedProvider = localStorage.getItem('omnifit_ai_provider') || 'openrouter';
    setSelectedProvider(savedProvider);
    aiService.setProvider(savedProvider);
  }, []);

  const handleProviderChange = (providerId: string) => {
    setSelectedProvider(providerId);
    aiService.setProvider(providerId);
    localStorage.setItem('omnifit_ai_provider', providerId);
    setTestResult(null);
  };

  const handleKeyChange = (providerId: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [providerId]: value }));
  };

  const saveApiKey = (providerId: string) => {
    const provider = AI_PROVIDERS.find(p => p.id === providerId);
    if (provider?.keyName) {
      const key = apiKeys[providerId] || '';
      if (key) {
        localStorage.setItem(provider.keyName, key);
        // Recharger la page pour prendre en compte la nouvelle clé
        window.location.reload();
      } else {
        localStorage.removeItem(provider.keyName);
      }
    }
  };

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const result = await aiService.chat([
        { role: 'user', content: 'Test de connexion. Réponds simplement "OK".' }
      ], { maxTokens: 10 });

      setTestResult({
        success: true,
        message: `✅ Connexion réussie avec ${result.provider} (${result.latency}ms)`
      });
    } catch (error) {
      logger.error('Test connexion AI échoué:', error);
      setTestResult({
        success: false,
        message: `❌ Erreur: ${error instanceof Error ? error.message : 'Connexion impossible'}`
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Brain className="w-5 h-5 text-purple-600" />
          Configuration Coach IA
        </h3>

        {/* Sélection du provider */}
        <div className="space-y-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Fournisseur IA
          </label>
          
          <div className="grid gap-3">
            {AI_PROVIDERS.map(provider => (
              <motion.label
                key={provider.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`
                  relative flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${selectedProvider === provider.id 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                <input
                  type="radio"
                  name="ai-provider"
                  value={provider.id}
                  checked={selectedProvider === provider.id}
                  onChange={() => handleProviderChange(provider.id)}
                  className="sr-only"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {provider.name}
                    </span>
                    {provider.free && (
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                        Options gratuites
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {provider.description}
                  </p>
                  
                  {provider.keyRequired && selectedProvider === provider.id && (
                    <div className="mt-4 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Clé API
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="password"
                            value={apiKeys[provider.id] || ''}
                            onChange={(e) => handleKeyChange(provider.id, e.target.value)}
                            placeholder="sk-..."
                            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => saveApiKey(provider.id)}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Sauvegarder
                          </button>
                        </div>
                      </div>
                      
                      {provider.setupUrl && (
                        <a
                          href={provider.setupUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          Obtenir une clé API
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
                
                {selectedProvider === provider.id && (
                  <Check className="w-5 h-5 text-purple-600 ml-2 flex-shrink-0" />
                )}
              </motion.label>
            ))}
          </div>
        </div>

        {/* Test de connexion */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <button
            onClick={testConnection}
            disabled={testing}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {testing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Test en cours...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                Tester la connexion
              </>
            )}
          </button>

          {testResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
                testResult.success 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
              }`}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{testResult.message}</p>
            </motion.div>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            💡 <strong>Astuce</strong> : OpenRouter et Ollama proposent des options gratuites. 
            Ollama fonctionne 100% en local pour une confidentialité maximale.
          </p>
        </div>
      </div>
    </div>
  );
}