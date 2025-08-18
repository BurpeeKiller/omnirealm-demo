import { motion } from 'framer-motion';
import { OmniFitLogo } from '@/components/Branding/OmniFitLogo';
import { Crown, Zap, Brain, Trophy, ArrowRight, Play, Users, LogIn } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useState } from 'react';
import { UpgradePrompt } from '@/components/Premium';
import { LoginModal } from '@/components/Auth/LoginModalShadcn';

interface LandingPageProps {
  onStartFree: () => void;
  onLogin?: () => void;
}

export const LandingPage = ({ onStartFree }: LandingPageProps) => {
  const { startTrial } = useSubscription();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const features = [
    {
      icon: Zap,
      title: 'Rappels Intelligents',
      description: 'Ne manquez plus jamais vos exercices',
      free: true
    },
    {
      icon: Brain,
      title: 'Coach IA Personnel',
      description: 'Conseils adaptés à vos progrès',
      premium: true
    },
    {
      icon: Trophy,
      title: 'Suivi de Progression',
      description: 'Visualisez vos performances',
      free: true
    },
    {
      icon: Crown,
      title: 'Programmes Sur Mesure',
      description: 'Plans d\'entraînement personnalisés',
      premium: true
    }
  ];

  const testimonials = [
    {
      name: 'Marie L.',
      role: 'Utilisatrice Premium',
      text: 'Le coach IA m\'a aidée à tenir mes objectifs. -15kg en 3 mois !',
      rating: 5
    },
    {
      name: 'Thomas B.',
      role: 'Sportif amateur',
      text: 'Simple et efficace. Les rappels m\'ont fait prendre l\'habitude.',
      rating: 5
    },
    {
      name: 'Sophie M.',
      role: 'Maman active',
      text: 'Parfait pour s\'entraîner à la maison entre deux réunions.',
      rating: 5
    }
  ];

  const handleStartPremiumTrial = () => {
    startTrial();
    onStartFree();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header avec connexion */}
      <header className="fixed top-0 right-0 p-6 z-[90]">
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowLoginModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
        >
          <LogIn className="w-4 h-4" />
          Se connecter
        </motion.button>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse" />
        
        <div className="relative container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="mb-8">
              <OmniFitLogo size="large" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Votre Coach Fitness
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> IA Personnel</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Transformez votre routine fitness avec des rappels intelligents et un coach IA 
              qui s'adapte à vos progrès. Simple, efficace, motivant.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartPremiumTrial}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-lg flex items-center gap-2 justify-center"
              >
                <Play className="w-5 h-5" />
                Essai Gratuit 7 Jours
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStartFree}
                className="px-8 py-4 bg-gray-800 text-white font-bold rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
              >
                Commencer Gratuitement
              </motion.button>
            </div>
            
            <p className="text-sm text-gray-400 mt-4">
              Aucune carte bancaire requise • 100% privé • Annulation à tout moment
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold text-center text-white mb-12"
          >
            Tout ce dont vous avez besoin pour réussir
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 bg-opacity-95 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <feature.icon className="w-8 h-8 text-purple-400" />
                  {feature.premium && (
                    <span className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 bg-gray-800/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Rejoignez des milliers d'utilisateurs satisfaits
            </h2>
            <div className="flex items-center justify-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>10,000+ utilisateurs actifs</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span>4.8/5 de satisfaction</span>
              </div>
            </div>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-lg p-6"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Prêt à transformer votre routine fitness ?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Commencez gratuitement et découvrez la différence d'un coach IA personnel
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUpgradePrompt(true)}
                className="px-8 py-4 bg-white text-purple-600 font-bold rounded-lg shadow-lg flex items-center gap-2 justify-center"
              >
                <Crown className="w-5 h-5" />
                Voir les Plans Premium
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStartFree}
                className="px-8 py-4 bg-purple-700 text-white font-bold rounded-lg shadow-lg hover:bg-purple-800 transition-colors flex items-center gap-2 justify-center"
              >
                Démarrer Maintenant
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <OmniFitLogo size="small" />
              <span className="text-gray-400">© 2025 OmniRealm</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="/pricing" className="hover:text-white transition-colors">
                Tarifs
              </a>
              <a href="/privacy" className="hover:text-white transition-colors">
                Confidentialité
              </a>
              <a href="/terms" className="hover:text-white transition-colors">
                CGU
              </a>
              <a href="/cgv" className="hover:text-white transition-colors">
                CGV
              </a>
              <a href="mailto:support@omnirealm.com" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Upgrade Modal */}
      <UpgradePrompt isOpen={showUpgradePrompt} onClose={() => setShowUpgradePrompt(false)} />
      
      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};