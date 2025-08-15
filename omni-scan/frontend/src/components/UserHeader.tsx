import { Button, Badge } from '@/components/ui'
import { User, LogOut, Settings } from 'lucide-react'
import { QuotaDisplay } from './QuotaDisplay'

interface UserHeaderProps {
  user?: {
    email: string
    is_pro: boolean
    scans_used: number
    scans_limit: number
  }
  isAuthenticated: boolean
  quotaInfo: {
    used: number
    limit: number
    remaining: number
    isPro: boolean
  }
  onLogin: () => void
  onLogout: () => void
  onApiConfig: () => void
  onUpgrade: () => void
}

export function UserHeader({ 
  user, 
  isAuthenticated, 
  quotaInfo,
  onLogin, 
  onLogout, 
  onApiConfig,
  onUpgrade 
}: UserHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">OmniScan OCR</h1>
        <p className="text-gray-600">Extraction de texte intelligente par IA</p>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Bouton configuration API */}
        <Button
          variant="outline"
          size="sm"
          onClick={onApiConfig}
        >
          <Settings className="w-4 h-4 mr-2" />
          Clé API
        </Button>
        
        {/* Indicateur de quota */}
        {!quotaInfo.isPro && (
          <QuotaDisplay quotaInfo={quotaInfo} onUpgrade={onUpgrade} />
        )}
        
        {/* Bouton utilisateur */}
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{user.email}</p>
              {user.is_pro && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                  Pro
                </Badge>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline"
            onClick={onLogin}
          >
            <User className="w-4 h-4 mr-2" />
            Se connecter
          </Button>
        )}
      </div>
    </div>
  )
}