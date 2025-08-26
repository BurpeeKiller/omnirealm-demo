"use client";

import { motion } from "framer-motion";
import { Check, Crown, Zap, Star, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const plans = [
  {
    id: "free",
    name: "Gratuit",
    price: 0,
    period: "Toujours gratuit",
    description: "Parfait pour commencer votre parcours fitness",
    features: [
      "Exercices de base",
      "3 rappels par jour",
      "Statistiques simples",
      "Support communautaire",
    ],
    limitations: [
      "Exercices limités",
      "Pas d'analyses avancées",
      "Pas de programmes personnalisés",
    ],
    buttonText: "Plan actuel",
    buttonVariant: "outline" as const,
    popular: false,
    color: "gray",
  },
  {
    id: "monthly",
    name: "Premium Mensuel",
    price: 29,
    period: "/mois",
    description: "Débloquez tout votre potentiel fitness",
    features: [
      "Tous les exercices premium",
      "Rappels illimités",
      "Analyses détaillées",
      "Programmes personnalisés",
      "Suivi avancé",
      "Support prioritaire",
      "Nouvelles fonctionnalités en avant-première",
    ],
    limitations: [],
    buttonText: "Commencer l'essai gratuit",
    buttonVariant: "default" as const,
    popular: true,
    color: "mint",
    badge: "7 jours gratuits",
  },
  {
    id: "yearly",
    name: "Premium Annuel",
    price: 199,
    originalPrice: 348,
    period: "/an",
    description: "La meilleure valeur pour votre transformation",
    features: [
      "Tout du plan mensuel",
      "Coaching personnalisé",
      "Consultations fitness",
      "Défis exclusifs",
      "Communauté VIP",
      "Garantie satisfaction 30j",
    ],
    limitations: [],
    buttonText: "Économisez 43%",
    buttonVariant: "default" as const,
    popular: false,
    color: "gold",
    badge: "Meilleure offre",
    savings: "43% d'économie",
  },
];

export const PricingSection = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("monthly");

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // Ici on pourrait intégrer Stripe ou un autre système de paiement
    console.log("Plan sélectionné:", planId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#2D3436] mb-3">Choisissez votre plan</h2>
        <p className="text-[#636E72] text-lg max-w-2xl mx-auto">
          Transformez votre routine quotidienne avec nos outils premium. Commencez gratuitement,
          évoluez quand vous êtes prêt.
        </p>
      </div>

      {/* Plans de pricing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative bg-white/80 backdrop-blur-md rounded-xl p-6 border shadow-sm transition-all duration-300 hover:shadow-md ${
              plan.popular
                ? "border-[#00D9B1] ring-2 ring-[#00D9B1]/20"
                : plan.color === "gold"
                  ? "border-[#FDCB6E]/50"
                  : "border-gray-200"
            }`}
          >
            {/* Badge */}
            {plan.badge && (
              <div
                className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold ${
                  plan.popular
                    ? "bg-gradient-to-r from-[#00D9B1] to-[#00B89F] text-white"
                    : "bg-gradient-to-r from-[#FDCB6E] to-[#E84393] text-white"
                }`}
              >
                {plan.badge}
              </div>
            )}

            {/* Header */}
            <div className="text-center mb-6">
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  plan.color === "mint"
                    ? "bg-gradient-to-r from-[#E6FFF9] to-[#F0F8FF]"
                    : plan.color === "gold"
                      ? "bg-gradient-to-r from-[#FFF5D6] to-[#FFE8CC]"
                      : "bg-gray-100"
                }`}
              >
                {plan.color === "mint" ? (
                  <Crown className="w-8 h-8 text-[#00D9B1]" />
                ) : plan.color === "gold" ? (
                  <Sparkles className="w-8 h-8 text-[#FDCB6E]" />
                ) : (
                  <Zap className="w-8 h-8 text-[#636E72]" />
                )}
              </div>

              <h3 className="text-xl font-bold text-[#2D3436] mb-2">{plan.name}</h3>

              <div className="mb-2">
                {plan.originalPrice && (
                  <span className="text-sm text-[#636E72] line-through mr-2">
                    {plan.originalPrice}€{plan.period}
                  </span>
                )}
                <span className="text-3xl font-bold text-[#2D3436]">{plan.price}€</span>
                <span className="text-[#636E72]">{plan.period}</span>
              </div>

              {plan.savings && (
                <div className="text-sm text-[#00D9B1] font-semibold">{plan.savings}</div>
              )}

              <p className="text-sm text-[#636E72] mt-2">{plan.description}</p>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {plan.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D9B1] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#2D3436]">{feature}</span>
                </div>
              ))}

              {plan.limitations.map((limitation, limitIndex) => (
                <div key={limitIndex} className="flex items-start gap-3 opacity-60">
                  <div className="w-5 h-5 flex-shrink-0 mt-0.5 flex items-center justify-center">
                    <div className="w-3 h-0.5 bg-[#636E72]" />
                  </div>
                  <span className="text-sm text-[#636E72]">{limitation}</span>
                </div>
              ))}
            </div>

            {/* Button */}
            <Button
              onClick={() => handleSelectPlan(plan.id)}
              variant={plan.buttonVariant}
              className={`w-full ${
                plan.buttonVariant === "default"
                  ? plan.color === "gold"
                    ? "bg-gradient-to-r from-[#FDCB6E] to-[#E84393] hover:from-[#FDCB6E]/90 hover:to-[#E84393]/90 text-white border-0"
                    : "bg-gradient-to-r from-[#00D9B1] to-[#00B89F] hover:from-[#00B89F] hover:to-[#00A890] text-white border-0"
                  : "border-gray-300 text-[#636E72] bg-white hover:bg-[#E6FFF9] hover:border-[#00D9B1]"
              }`}
              disabled={plan.id === "free"} // Plan actuel
            >
              {plan.buttonText}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <Star className="w-6 h-6 text-[#FDCB6E]" />
          <h3 className="text-xl font-bold text-[#2D3436]">Questions fréquentes</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-[#2D3436] mb-2">Puis-je annuler à tout moment ?</h4>
              <p className="text-sm text-[#636E72]">
                Oui, vous pouvez annuler votre abonnement à tout moment depuis vos paramètres. Aucun
                engagement à long terme.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#2D3436] mb-2">
                Y a-t-il une période d'essai gratuite ?
              </h4>
              <p className="text-sm text-[#636E72]">
                Oui ! Le plan Premium mensuel inclut 7 jours d'essai gratuit. Aucune carte bancaire
                requise.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#2D3436] mb-2">
                Que se passe-t-il si je reviens au plan gratuit ?
              </h4>
              <p className="text-sm text-[#636E72]">
                Vos données restent sauvegardées. Vous perdez simplement l'accès aux fonctionnalités
                premium jusqu'à votre prochain upgrade.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-[#2D3436] mb-2">Les prix sont-ils définitifs ?</h4>
              <p className="text-sm text-[#636E72]">
                Les prix actuels sont garantis pour tous les abonnés existants. Les modifications
                s'appliquent uniquement aux nouveaux abonnements.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#2D3436] mb-2">
                Acceptez-vous les remboursements ?
              </h4>
              <p className="text-sm text-[#636E72]">
                Nous offrons une garantie satisfaction de 30 jours sur le plan annuel.
                Contactez-nous pour plus de détails.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#2D3436] mb-2">
                Y a-t-il des réductions étudiants ?
              </h4>
              <p className="text-sm text-[#636E72]">
                Nous proposons 50% de réduction sur tous nos plans pour les étudiants avec une
                adresse email universitaire valide.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Témoignages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-[#E6FFF9] to-[#F0F8FF] rounded-xl p-6 border border-[#00D9B1]/20 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-6 h-6 text-[#00D9B1]" />
          <h3 className="text-xl font-bold text-[#2D3436]">Ce que disent nos utilisateurs</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className="w-4 h-4 fill-[#FDCB6E] text-[#FDCB6E]" />
              ))}
            </div>
            <p className="text-sm text-[#2D3436] mb-3">
              "OmniFit a transformé ma routine au bureau. Les rappels personnalisés m'aident à
              rester actif toute la journée !"
            </p>
            <p className="text-xs text-[#636E72] font-semibold">- Marie, Développeuse</p>
          </div>

          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className="w-4 h-4 fill-[#FDCB6E] text-[#FDCB6E]" />
              ))}
            </div>
            <p className="text-sm text-[#2D3436] mb-3">
              "Les analyses détaillées m'ont permis de comprendre mes habitudes et d'améliorer ma
              productivité."
            </p>
            <p className="text-xs text-[#636E72] font-semibold">- Thomas, Manager</p>
          </div>

          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className="w-4 h-4 fill-[#FDCB6E] text-[#FDCB6E]" />
              ))}
            </div>
            <p className="text-sm text-[#2D3436] mb-3">
              "Interface intuitive et exercices vraiment efficaces. Je recommande vivement le plan
              premium !"
            </p>
            <p className="text-xs text-[#636E72] font-semibold">- Sarah, Designer</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
