import { AlertTriangle, Zap, Check } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Card,
  Button,
  Badge
} from '@omnirealm/ui'

interface QuotaLimitProps {
  isOpen: boolean
  onClose: () => void
  onLogin: () => void
  onUpgrade: () => void
  scansUsed: number
  scansLimit: number
}

export function QuotaLimit({ 
  isOpen, 
  onClose, 
  onLogin, 
  onUpgrade,
  scansUsed,
  scansLimit
}: QuotaLimitProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Limite atteinte
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Statistiques d'usage */}
          <div className="text-center">
            <p className="text-gray-600 mb-2">Vous avez utilisé</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-bold">{scansUsed}</span>
              <span className="text-xl text-gray-500">/ {scansLimit}</span>
              <span className="text-gray-500">scans gratuits</span>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            {/* Option gratuite */}
            <Card className="p-4 border-gray-200">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Continuer gratuitement</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Connectez-vous pour obtenir 5 scans gratuits supplémentaires par mois
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-3"
                    onClick={onLogin}
                  >
                    Se connecter
                  </Button>
                </div>
              </div>
            </Card>

            {/* Option Pro */}
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">Passer Pro</h3>
                    <Badge className="bg-blue-500 text-white">
                      Recommandé
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Scans illimités + Analyse IA avancée + Support prioritaire
                  </p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>OCR illimité</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Analyse IA (GPT-4, Claude)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Export en plusieurs formats</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-2xl font-bold">49€</span>
                    <span className="text-gray-500">/mois</span>
                  </div>
                  <Button 
                    className="mt-3 w-full bg-blue-600 hover:bg-blue-700"
                    onClick={onUpgrade}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Devenir Pro
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center pt-2">
            <button
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              Peut-être plus tard
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}