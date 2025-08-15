import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { Key, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { useApiKeys, type AIProvider } from '@/hooks/useApiKeys'
import { cn } from '@/lib/utils'

interface ApiKeyManagerProps {
  className?: string
  compact?: boolean
}

export function ApiKeyManager({ className, compact = false }: ApiKeyManagerProps) {
  const {
    provider,
    apiKeys,
    hasValidKey,
    saveApiKey,
    changeProvider,
    validateApiKey
  } = useApiKeys()

  const [showKeys, setShowKeys] = useState<Record<AIProvider, boolean>>({
    openai: false,
    anthropic: false,
    mistral: false
  })

  const [tempKeys, setTempKeys] = useState(apiKeys)
  const [isEditing, setIsEditing] = useState(false)

  const providers: { value: AIProvider; label: string; placeholder: string }[] = [
    { value: 'openai', label: 'OpenAI', placeholder: 'sk-...' },
    { value: 'anthropic', label: 'Anthropic', placeholder: 'sk-ant-...' },
    { value: 'mistral', label: 'Mistral', placeholder: 'Votre clé API Mistral' }
  ]

  const handleSave = () => {
    Object.entries(tempKeys).forEach(([p, key]) => {
      saveApiKey(p as AIProvider, key)
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempKeys(apiKeys)
    setIsEditing(false)
  }

  const toggleShowKey = (provider: AIProvider) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }))
  }

  if (compact && hasValidKey) {
    return (
      <div className={cn("flex items-center gap-2 text-sm", className)}>
        <CheckCircle className="w-4 h-4 text-green-500" />
        <span className="text-gray-600">
          Clé API {provider.charAt(0).toUpperCase() + provider.slice(1)} configurée
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className="ml-2"
        >
          Modifier
        </Button>
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          Configuration des clés API
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasValidKey && !isEditing && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  Clé API requise pour l'analyse IA
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Configurez au moins une clé API pour activer l'analyse intelligente de vos documents.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Sélection du provider */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Provider IA actif
            </label>
            <div className="grid grid-cols-3 gap-2">
              {providers.map(p => (
                <button
                  key={p.value}
                  onClick={() => changeProvider(p.value)}
                  className={cn(
                    "p-2 rounded-lg border text-sm font-medium transition-colors",
                    provider === p.value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 hover:border-gray-400 text-gray-700"
                  )}
                >
                  {p.label}
                  {apiKeys[p.value] && validateApiKey(p.value, apiKeys[p.value]) && (
                    <CheckCircle className="w-3 h-3 text-green-500 inline-block ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Configuration des clés */}
          {(isEditing || !hasValidKey) && (
            <div className="space-y-3">
              {providers.map(p => (
                <div key={p.value}>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Clé API {p.label}
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showKeys[p.value] ? "text" : "password"}
                        value={tempKeys[p.value]}
                        onChange={(e) => setTempKeys(prev => ({ ...prev, [p.value]: e.target.value }))}
                        placeholder={p.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowKey(p.value)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showKeys[p.value] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {tempKeys[p.value] && (
                      <div className="flex items-center">
                        {validateApiKey(p.value, tempKeys[p.value]) ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex gap-2 pt-2">
                <Button onClick={handleSave} size="sm">
                  Sauvegarder
                </Button>
                <Button onClick={handleCancel} size="sm" variant="outline">
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <p>Les clés API sont stockées localement dans votre navigateur.</p>
          <p>Elles ne sont jamais envoyées à nos serveurs.</p>
        </div>
      </CardContent>
    </Card>
  )
}