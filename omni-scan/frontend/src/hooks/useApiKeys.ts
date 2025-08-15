import { useState, useEffect, useCallback } from 'react'

export type AIProvider = 'openai' | 'anthropic' | 'mistral'

export interface ApiKeyConfig {
  provider: AIProvider
  apiKey: string
  isValid: boolean
}

// Hook pour gérer les clés API
export function useApiKeys() {
  const [provider, setProvider] = useState<AIProvider>('openai')
  const [apiKeys, setApiKeys] = useState<Record<AIProvider, string>>({
    openai: '',
    anthropic: '',
    mistral: ''
  })
  const [hasValidKey, setHasValidKey] = useState(false)

  // Charger les clés depuis localStorage au montage
  useEffect(() => {
    const savedProvider = (localStorage.getItem('ai_provider') as AIProvider) || 'openai'
    setProvider(savedProvider)

    const keys: Record<AIProvider, string> = {
      openai: localStorage.getItem('openai_api_key') || '',
      anthropic: localStorage.getItem('anthropic_api_key') || '',
      mistral: localStorage.getItem('mistral_api_key') || ''
    }
    
    setApiKeys(keys)
    setHasValidKey(!!keys[savedProvider])
  }, [])

  // Sauvegarder une clé API
  const saveApiKey = useCallback((provider: AIProvider, apiKey: string) => {
    if (apiKey) {
      localStorage.setItem(`${provider}_api_key`, apiKey)
    } else {
      localStorage.removeItem(`${provider}_api_key`)
    }
    
    setApiKeys(prev => ({ ...prev, [provider]: apiKey }))
    
    if (provider === provider) {
      setHasValidKey(!!apiKey)
    }
  }, [provider])

  // Changer de provider
  const changeProvider = useCallback((newProvider: AIProvider) => {
    localStorage.setItem('ai_provider', newProvider)
    setProvider(newProvider)
    setHasValidKey(!!apiKeys[newProvider])
  }, [apiKeys])

  // Effacer toutes les clés
  const clearAllKeys = useCallback(() => {
    const providers: AIProvider[] = ['openai', 'anthropic', 'mistral']
    providers.forEach(p => {
      localStorage.removeItem(`${p}_api_key`)
    })
    
    setApiKeys({
      openai: '',
      anthropic: '',
      mistral: ''
    })
    setHasValidKey(false)
  }, [])

  // Vérifier si une clé est valide (basique)
  const validateApiKey = (provider: AIProvider, apiKey: string): boolean => {
    if (!apiKey) return false
    
    switch (provider) {
      case 'openai':
        return apiKey.startsWith('sk-') && apiKey.length > 20
      case 'anthropic':
        return apiKey.startsWith('sk-ant-') && apiKey.length > 20
      case 'mistral':
        return apiKey.length > 20
      default:
        return false
    }
  }

  return {
    provider,
    apiKeys,
    hasValidKey,
    currentApiKey: apiKeys[provider],
    
    saveApiKey,
    changeProvider,
    clearAllKeys,
    validateApiKey,
    
    // Helper pour obtenir la config actuelle
    getCurrentConfig: (): ApiKeyConfig => ({
      provider,
      apiKey: apiKeys[provider],
      isValid: validateApiKey(provider, apiKeys[provider])
    })
  }
}