import { useState } from 'react';
import { Crown, Check, Zap, Brain, TrendingUp, LogIn } from 'lucide-react';
import { subscriptionService, PRICING_PLANS } from '../services/subscription';
import { logger } from '@/utils/logger';
import { useAuth } from '@/hooks/useAuth';
import { LoginModal } from '@/components/Auth/LoginModalShadcn';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UpgradeScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeScreen({ isOpen, onClose }: UpgradeScreenProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated } = useAuth();

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setLoading(true);
    try {
      const plan = PRICING_PLANS.find(p => 
        p.interval === (selectedPlan === 'monthly' ? 'month' : 'year')
      );
      
      if (plan?.stripePriceId) {
        await subscriptionService.redirectToCheckout(plan.stripePriceId);
      }
    } catch (error) {
      logger.error('Erreur upgrade:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl bg-gray-900 text-gray-100 border-gray-800">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-white">
                Passez à OmniFit Premium
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Débloquez tout le potentiel de votre entraînement
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8 mt-6">
          {/* 3 arguments de vente principaux */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gray-800/50 border-gray-700 text-center transition-all duration-200 hover:shadow-lg hover:border-gray-600 hover:translate-y-[-2px] cursor-default">
              <CardContent className="p-6">
                <Brain className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2 text-gray-100">Coach IA Personnel</h3>
                <p className="text-gray-400 text-sm">
                  Conseils personnalisés basés sur vos performances et objectifs
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700 text-center transition-all duration-200 hover:shadow-lg hover:border-gray-600 hover:translate-y-[-2px] cursor-default">
              <CardContent className="p-6">
                <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2 text-gray-100">Analytics Avancées</h3>
                <p className="text-gray-400 text-sm">
                  Suivez vos progrès avec des insights détaillés et des tendances
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700 text-center transition-all duration-200 hover:shadow-lg hover:border-gray-600 hover:translate-y-[-2px] cursor-default">
              <CardContent className="p-6">
                <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2 text-gray-100">Programmes Sur Mesure</h3>
                <p className="text-gray-400 text-sm">
                  Plans d'entraînement adaptés à votre niveau et vos objectifs
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Plans de tarification */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Plan Mensuel */}
            <Card 
              className={cn(
                "relative cursor-pointer transition-all duration-200 border-2 hover:shadow-xl hover:translate-y-[-2px]",
                selectedPlan === 'monthly' 
                  ? "border-orange-500 bg-orange-500/10" 
                  : "border-gray-700 hover:border-gray-600"
              )}
              onClick={() => setSelectedPlan('monthly')}
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-100">Mensuel</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-100">29€</span>
                  <span className="text-gray-400">/mois</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>Annulez à tout moment</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>7 jours d'essai gratuit</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Plan Annuel */}
            <Card 
              className={cn(
                "relative cursor-pointer transition-all duration-200 border-2 hover:shadow-xl hover:translate-y-[-2px]",
                selectedPlan === 'yearly' 
                  ? "border-orange-500 bg-orange-500/10" 
                  : "border-gray-700 hover:border-gray-600"
              )}
              onClick={() => setSelectedPlan('yearly')}
            >
              <Badge className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500">
                2 MOIS OFFERTS
              </Badge>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-100">Annuel</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-100">290€</span>
                  <span className="text-gray-400">/an</span>
                  <div className="text-green-400 text-sm mt-1">
                    Économisez 58€
                  </div>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>Prix bloqué à vie</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>Support prioritaire</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Toutes les fonctionnalités */}
          <Card className="bg-gray-800/30 border-gray-700">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-100">
                Tout ce qui est inclus dans Premium
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {PRICING_PLANS[0].features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={handleUpgrade}
              disabled={loading}
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Chargement...
                </>
              ) : !isAuthenticated ? (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Se connecter pour continuer
                </>
              ) : (
                <>
                  Commencer l'essai gratuit de 7 jours
                </>
              )}
            </Button>
            <p className="text-gray-400 text-sm text-center">
              Pas de carte requise pour l'essai • Annulez à tout moment
            </p>
          </div>
        </div>
      </DialogContent>
      </Dialog>
      
      {/* Modal de connexion */}
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => {
            setShowLoginModal(false);
            // Après connexion, l'utilisateur pourra réessayer
          }}
        />
      )}
    </>
  );
}