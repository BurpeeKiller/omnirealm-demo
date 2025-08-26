"use client";

import { motion } from "framer-motion";

export const dynamic = "force-dynamic";
import { Check, Star, Shield, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { LoginModal } from "@/components/Auth/LoginModal";

export default function PricingPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  const handleLoginSuccess = () => {
    console.log("🎉 Connexion réussie, redirection...");
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 100);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button
            onClick={() => (window.location.href = "/")}
            variant="ghost"
            className="text-[#636E72] hover:text-[#2D3436]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>

          <div className="flex items-center">
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00D9B1] to-[#00B89F]">
              OmniFit
            </span>
          </div>

          {isAuthenticated ? (
            <Button
              onClick={() => (window.location.href = "/dashboard")}
              variant="default"
              className="bg-gradient-to-r from-[#00D9B1] to-[#00B89F] hover:from-[#00B89F] hover:to-[#00A890]"
            >
              Dashboard
            </Button>
          ) : (
            <Button
              onClick={() => setShowLoginModal(true)}
              variant="ghost"
              className="text-[#636E72] hover:text-[#2D3436]"
            >
              Se connecter
            </Button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-[#FAFAFA] to-[#E6FFF9]">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-[#2D3436] mb-6">
              Tarifs
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00D9B1] to-[#00B89F] mt-4">
                transparents
              </span>
            </h1>
            <p className="text-xl text-[#2D3436] max-w-2xl mx-auto mb-12">
              Commencez gratuitement et évoluez selon vos besoins. Aucun engagement, annulation à
              tout moment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Plan Gratuit */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border-2 border-gray-100"
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-[#2D3436] mb-2">Gratuit</h3>
                  <p className="text-[#636E72] mb-6">Pour commencer en douceur</p>
                  <div className="text-5xl font-bold text-[#2D3436] mb-6">
                    0€<span className="text-lg font-normal text-[#636E72]">/mois</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    "5 exercices de base",
                    "Minuteur 1-6 minutes",
                    "Rappels simples",
                    "Statistiques de base",
                    "Mode hors ligne",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-[#00D9B1]" />
                      <span className="text-[#2D3436]">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={
                    isAuthenticated
                      ? () => (window.location.href = "/dashboard")
                      : () => setShowLoginModal(true)
                  }
                  className="w-full bg-gradient-to-r from-[#00D9B1] to-[#00B89F] hover:from-[#00B89F] hover:to-[#00A890] text-white"
                >
                  {isAuthenticated ? "Accéder au Dashboard" : "Commencer gratuitement"}
                </Button>
                <p className="text-center text-[#636E72] text-sm mt-3">Gratuit pour toujours</p>
              </motion.div>

              {/* Plan Premium */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-[#00D9B1] to-[#00B89F] p-8 rounded-2xl shadow-lg text-white relative overflow-hidden"
              >
                <div className="absolute top-4 right-4">
                  <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    Populaire
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Premium</h3>
                  <p className="text-white/80 mb-6">Pour des résultats rapides</p>
                  <div className="text-5xl font-bold mb-6">
                    29€<span className="text-lg font-normal text-white/60">/mois</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    "50+ exercices variés",
                    "Coach IA personnel",
                    "Programmes sur mesure",
                    "Stats avancées",
                    "Mode hors ligne",
                    "Support prioritaire",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-white" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={
                    isAuthenticated
                      ? () => (window.location.href = "/dashboard")
                      : () => setShowLoginModal(true)
                  }
                  className="w-full bg-white text-[#00D9B1] hover:bg-[#FAFAFA] font-semibold"
                >
                  {isAuthenticated ? "Upgrader vers Premium" : "Essai gratuit 7 jours"}
                </Button>
                <p className="text-center text-white/60 text-sm mt-3">
                  Sans engagement • Annulez quand vous voulez
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[#E6FFF9]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-[#2D3436] mb-4">Questions fréquentes</h2>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  q: "Puis-je vraiment utiliser OmniFit gratuitement ?",
                  a: "Absolument ! La version gratuite vous donne accès aux fonctionnalités essentielles pour commencer votre transformation. Aucune carte bancaire requise.",
                },
                {
                  q: "Comment fonctionne l'essai gratuit Premium ?",
                  a: "7 jours d'accès complet aux fonctionnalités Premium. Aucun prélèvement pendant l'essai. Vous pouvez annuler à tout moment.",
                },
                {
                  q: "Puis-je changer de plan à tout moment ?",
                  a: "Oui, vous pouvez passer au Premium ou revenir au gratuit quand vous voulez. Votre progression est conservée.",
                },
                {
                  q: "Y a-t-il des frais cachés ?",
                  a: "Non, nos tarifs sont transparents. Le gratuit reste gratuit, le Premium est à 29€/mois. Aucun frais supplémentaire.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
                  <h3 className="font-semibold text-[#2D3436] mb-2">{faq.q}</h3>
                  <p className="text-[#636E72]">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-gradient-to-r from-[#00D9B1] to-[#00B89F] rounded-3xl p-12 text-center text-white"
          >
            <h2 className="text-4xl font-bold mb-4">Prêt à commencer ?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Rejoignez des milliers d&apos;employés qui transforment leurs pauses en progrès
            </p>
            <Button
              onClick={
                isAuthenticated
                  ? () => (window.location.href = "/dashboard")
                  : () => setShowLoginModal(true)
              }
              size="lg"
              className="bg-white text-[#00D9B1] hover:bg-[#FAFAFA] px-8 py-6 text-lg font-semibold"
            >
              {isAuthenticated ? "Accéder au Dashboard" : "Commencer gratuitement"}
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
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

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
