"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Timer,
  Bell,
  TrendingUp,
  Users,
  Star,
  Play,
  ChevronRight,
  Clock,
  Target,
  Heart,
  Shield,
  LogIn,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/Auth/LoginModal";

interface LandingPageProps {
  onStartFree?: () => void;
}

export const LandingPage = ({}: LandingPageProps) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const userName = session?.user?.name || session?.user?.email?.split("@")[0];

  const handleLoginSuccess = () => {
    console.log("🎉 Connexion réussie, redirection...");
    // Petit délai pour laisser la session se propager
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 100);
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const navigateToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FAFAFA]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00D9B1] to-[#00B89F]">
              OmniFit
            </span>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#636E72]">Salut {userName} !</span>
              <Button
                onClick={() => (window.location.href = "/dashboard")}
                variant="default"
                className="bg-gradient-to-r from-[#00D9B1] to-[#00B89F] hover:from-[#00B89F] hover:to-[#00A890]"
              >
                <User className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                onClick={() => signOut()}
                variant="ghost"
                className="text-[#636E72] hover:text-[#2D3436]"
              >
                Déconnexion
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setShowLoginModal(true)}
              variant="ghost"
              className="text-[#636E72] hover:text-[#2D3436]"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Se connecter
            </Button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient subtil */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA] to-[#E6FFF9]" />

        {/* Animated circles */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-20 w-96 h-96 bg-[#00D9B1] rounded-full blur-3xl opacity-20"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-[#74B9FF] rounded-full blur-3xl opacity-20"
        />

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative container mx-auto px-4 py-32 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#E6FFF9] rounded-full text-[#00B89F] text-sm font-medium mb-8"
            >
              <Heart className="w-4 h-4" />
              <span>Recommandé par 10,000+ employés de bureau</span>
            </motion.div>

            {/* Titre principal */}
            <h1 className="text-5xl md:text-7xl font-bold text-[#2D3436] mb-6 leading-tight">
              Transforme tes pauses
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00D9B1] to-[#00B89F] mt-4 leading-tight pb-2">
                en progrès
              </span>
            </h1>

            {/* Sous-titre */}
            <p className="text-xl md:text-2xl text-[#2D3436] max-w-2xl mx-auto mb-6">
              À partir d&apos;1 minute par heure, jusqu&apos;à ton rythme idéal.
              <span className="block text-lg text-[#636E72] mt-2">
                Simple pour débuter • Évolutif pour progresser • Sans équipement
              </span>
            </p>

            {/* Indicateur évolution */}
            <div className="flex items-center justify-center gap-8 mb-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00D9B1]">1-6 min</div>
                <div className="text-[#636E72]">par session</div>
              </div>
              <div className="text-[#B2BEC3]">×</div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00B89F]">4-8×</div>
                <div className="text-[#636E72]">par jour</div>
              </div>
              <div className="text-[#B2BEC3]">=</div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00B894]">8-48 min</div>
                <div className="text-[#636E72]">d&apos;activité/jour</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {isAuthenticated ? (
                <Button
                  onClick={() => (window.location.href = "/dashboard")}
                  size="lg"
                  className="bg-gradient-to-r from-[#00D9B1] to-[#00B89F] hover:from-[#00B89F] hover:to-[#00A890] text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  Accéder au Dashboard
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => setShowLoginModal(true)}
                    size="lg"
                    className="bg-gradient-to-r from-[#00D9B1] to-[#00B89F] hover:from-[#00B89F] hover:to-[#00A890] text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                  >
                    Commencer Gratuitement
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>

                  <Button
                    onClick={() => navigateToSection("demo")}
                    size="lg"
                    variant="outline"
                    className="border-2 border-[#00D9B1] text-[#00D9B1] hover:bg-[#E6FFF9] px-8 py-6 text-lg rounded-xl"
                  >
                    <Play className="mr-2 w-5 h-5" />
                    Voir la démo
                  </Button>
                </>
              )}
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-8 text-sm text-[#B2BEC3]">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>100% privé</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>4.8/5 (1000+ avis)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Sans engagement</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#2D3436] mb-4">
                La sédentarité, l&apos;ennemi invisible
              </h2>
              <p className="text-xl text-[#2D3436]">Les chiffres qui font réfléchir</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div variants={fadeInUp} className="text-center">
                <div className="text-5xl font-bold text-[#FF6B6B] mb-2">87%</div>
                <p className="text-[#2D3436]">des employés de bureau ont des douleurs chroniques</p>
              </motion.div>
              <motion.div variants={fadeInUp} className="text-center">
                <div className="text-5xl font-bold text-[#FDCB6E] mb-2">+23%</div>
                <p className="text-[#2D3436]">de risque cardiaque après 8h assis</p>
              </motion.div>
              <motion.div variants={fadeInUp} className="text-center">
                <div className="text-5xl font-bold text-[#74B9FF] mb-2">-40%</div>
                <p className="text-[#2D3436]">de productivité sans pauses actives</p>
              </motion.div>
            </div>

            <motion.div
              variants={fadeInUp}
              className="mt-12 p-8 bg-gray-100 rounded-2xl text-center"
            >
              <p className="text-lg text-[#2D3436] italic">
                &ldquo;La position assise prolongée est le nouveau tabagisme&rdquo;
              </p>
              <p className="text-sm text-[#636E72] mt-2">- Organisation Mondiale de la Santé</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gradient-to-b from-white to-[#E6FFF9]">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#2D3436] mb-4">
                La solution ? Simple comme bonjour
              </h2>
              <p className="text-xl text-[#2D3436]">3 étapes pour transformer votre journée</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                variants={fadeInUp}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-[#E6FFF9] rounded-2xl flex items-center justify-center mb-6">
                  <Timer className="w-8 h-8 text-[#00D9B1]" />
                </div>
                <h3 className="text-2xl font-semibold text-[#2D3436] mb-3">
                  1. Commence doucement
                </h3>
                <p className="text-[#2D3436]">
                  1 minute pour débuter, puis augmente à ton rythme : 2, 3... jusqu&apos;à 6 minutes
                </p>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-[#E6FFF9] rounded-2xl flex items-center justify-center mb-6">
                  <Bell className="w-8 h-8 text-[#00D9B1]" />
                </div>
                <h3 className="text-2xl font-semibold text-[#2D3436] mb-3">
                  2. Rappels intelligents
                </h3>
                <p className="text-[#2D3436]">
                  Notifications au bon moment, jamais pendant vos réunions importantes
                </p>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-[#E6FFF9] rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 text-[#00D9B1]" />
                </div>
                <h3 className="text-2xl font-semibold text-[#2D3436] mb-3">3. Progrès visibles</h3>
                <p className="text-[#2D3436]">
                  Suivez vos performances et célébrez chaque victoire avec des stats motivantes
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section id="demo" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold text-[#2D3436] mb-4">Voyez OmniFit en action</h2>
            <p className="text-xl text-[#2D3436] mb-12">
              15 secondes pour comprendre comment ça marche
            </p>

            <div className="relative bg-gradient-to-br from-[#E6FFF9] to-[#F8F9FA] rounded-2xl p-8 aspect-video flex items-center justify-center">
              <Button
                onClick={() => navigateToSection("features")}
                size="lg"
                className="bg-gradient-to-r from-[#00D9B1] to-[#00B89F] hover:from-[#00B89F] hover:to-[#00A890] text-white rounded-full w-24 h-24"
              >
                <Play className="w-8 h-8" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-[#E6FFF9]">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#2D3436] mb-4">
                Tout ce dont vous avez besoin
              </h2>
              <p className="text-xl text-[#2D3436]">
                Une app complète pour votre bien-être au travail
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Timer,
                  title: "Minuteur flexible",
                  description: "1 à 6 minutes, adaptez selon votre emploi du temps",
                },
                {
                  icon: Bell,
                  title: "Rappels intelligents",
                  description: "Notifications douces qui respectent vos réunions",
                },
                {
                  icon: TrendingUp,
                  title: "Suivi de progrès",
                  description: "Statistiques détaillées et objectifs personnalisés",
                },
                {
                  icon: Target,
                  title: "Exercices guidés",
                  description: "Plus de 50 exercices sans équipement",
                },
                {
                  icon: Users,
                  title: "Défis d'équipe",
                  description: "Motivez-vous entre collègues avec des challenges",
                },
                {
                  icon: Shield,
                  title: "100% privé",
                  description: "Vos données restent sur votre appareil",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-[#E6FFF9] rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-[#00D9B1]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2D3436] mb-2">{feature.title}</h3>
                  <p className="text-[#636E72]">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-gradient-to-r from-[#00D9B1] to-[#00B89F] rounded-3xl p-12 md:p-16 text-center text-white"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">Prêt à transformer vos pauses ?</h2>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d&apos;employés qui ont déjà dit adieu aux douleurs de bureau
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Button
                  onClick={() => (window.location.href = "/dashboard")}
                  size="lg"
                  className="bg-white text-[#00D9B1] hover:bg-[#FAFAFA] px-8 py-6 text-lg font-semibold"
                >
                  Accéder au Dashboard
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              ) : (
                <Button
                  onClick={() => setShowLoginModal(true)}
                  size="lg"
                  className="bg-white text-[#00D9B1] hover:bg-[#FAFAFA] px-8 py-6 text-lg font-semibold"
                >
                  Commencer maintenant
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              )}
            </div>
            <p className="text-white/80 text-sm mt-6">
              ✓ Gratuit pour toujours • ✓ Pas de carte bancaire • ✓ Résultats en 7 jours
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00D9B1] to-white">
                  OmniFit
                </span>
                <span className="text-gray-400 ml-2">© 2025 OmniRealm</span>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-gray-300">
                <a href="/pricing" className="hover:text-[#00D9B1] transition-colors">
                  Tarifs
                </a>
                <a href="/privacy" className="hover:text-[#00D9B1] transition-colors">
                  Confidentialité
                </a>
                <a href="/terms" className="hover:text-[#00D9B1] transition-colors">
                  CGU
                </a>
                <a href="/cgv" className="hover:text-[#00D9B1] transition-colors">
                  CGV
                </a>
                <a href="/contact" className="hover:text-[#00D9B1] transition-colors">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
};
