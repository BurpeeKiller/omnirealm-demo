import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Input, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { Key, Save, Trash2, Eye, EyeOff } from 'lucide-react'

interface ApiKeyManagerProps {
  onKeyUpdate?: () => void
}

export function ApiKeyManager({ onKeyUpdate }: ApiKeyManagerProps) {
  const [provider, setProvider] = useState('openai')
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Charger la clé sauvegardée
    const savedProvider = localStorage.getItem('ai_provider') || 'openai'
    const savedKey = localStorage.getItem(`${savedProvider}_api_key`) || ''
    setProvider(savedProvider)
    setApiKey(savedKey)
    setSaved(!!savedKey)
  }, [])

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('ai_provider', provider)
      localStorage.setItem(`${provider}_api_key`, apiKey)
      setSaved(true)
      onKeyUpdate?.()
    }
  }

  const handleClear = () => {
    localStorage.removeItem(`${provider}_api_key`)
    setApiKey('')
    setSaved(false)
    onKeyUpdate?.()
  }

  const getProviderInfo = () => {
    switch (provider) {
      case 'openai':
        return { 
          url: 'https://platform.openai.com/api-keys',
          prefix: 'sk-',
          name: 'OpenAI'
        }
      case 'groq':
        return { 
          url: 'https://console.groq.com/keys',
          prefix: 'gsk_',
          name: 'Groq (Gratuit)'
        }
      case 'anthropic':
        return { 
          url: 'https://console.anthropic.com/settings/keys',
          prefix: 'sk-ant-',
          name: 'Anthropic Claude'
        }
      case 'openrouter':
        return { 
          url: 'https://openrouter.ai/keys',
          prefix: 'sk-or-',
          name: 'OpenRouter'
        }
      default:
        return { url: '', prefix: '', name: '' }
    }
  }

  const info = getProviderInfo()

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          Configuration de l'IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Fournisseur d'IA</label>
          <Select value={provider} onValueChange={setProvider}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI (GPT-4)</SelectItem>
              <SelectItem value="groq">Groq (Gratuit - Llama 3)</SelectItem>
              <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
              <SelectItem value="openrouter">OpenRouter (Multi-modèles)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            <a 
              href={info.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Obtenir une clé API {info.name}
            </a>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Clé API</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`${info.prefix}...`}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button 
              onClick={handleSave} 
              disabled={!apiKey.trim()}
              variant={saved ? "outline" : "default"}
            >
              <Save className="w-4 h-4 mr-2" />
              {saved ? 'Mise à jour' : 'Sauvegarder'}
            </Button>
            {saved && (
              <Button onClick={handleClear} variant="destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-700">
              ✅ Clé API configurée. Vos analyses utiliseront {info.name}.
            </p>
          </div>
        )}

        {!saved && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-700">
              ⚠️ Sans clé API, l'analyse sera basique (détection de langue et catégorie uniquement).
            </p>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>💡 <strong>Conseil :</strong> Groq est gratuit et offre d'excellentes performances.</p>
          <p>🔒 Votre clé est stockée localement dans votre navigateur, jamais sur nos serveurs.</p>
        </div>
      </CardContent>
    </Card>
  )
}