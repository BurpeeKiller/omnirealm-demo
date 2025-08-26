"use client";

import { motion } from "framer-motion";

export const dynamic = "force-dynamic";
import { ArrowLeft, ShoppingCart, CreditCard, RefreshCw, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CGVPage() {
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

          <div className="w-20"></div>
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
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-[#E6FFF9] rounded-2xl flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-[#00D9B1]" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#2D3436] mb-6">
              Conditions générales
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00D9B1] to-[#00B89F] mt-4">
                de vente
              </span>
            </h1>
            <p className="text-xl text-[#2D3436] max-w-2xl mx-auto mb-8">
              Toutes les informations sur nos offres Premium et les conditions de vente.
            </p>
            <p className="text-sm text-[#636E72]">
              Dernière mise à jour : 23 août 2025 • Entrée en vigueur : 23 août 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Points clés */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#E6FFF9] p-8 rounded-2xl mb-16"
            >
              <h2 className="text-2xl font-bold text-[#2D3436] mb-6">Points essentiels</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <CreditCard className="w-8 h-8 text-[#00D9B1] mx-auto mb-3" />
                  <h3 className="font-semibold text-[#2D3436] mb-2">Premium 29€/mois</h3>
                  <p className="text-sm text-[#636E72]">Essai gratuit 7 jours sans prélèvement</p>
                </div>
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 text-[#00D9B1] mx-auto mb-3" />
                  <h3 className="font-semibold text-[#2D3436] mb-2">Annulation libre</h3>
                  <p className="text-sm text-[#636E72]">
                    Sans engagement, résiliez quand vous voulez
                  </p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-[#00D9B1] mx-auto mb-3" />
                  <h3 className="font-semibold text-[#2D3436] mb-2">Paiement sécurisé</h3>
                  <p className="text-sm text-[#636E72]">Traitement par Stripe, conforme PCI DSS</p>
                </div>
              </div>
            </motion.div>

            <div className="prose prose-lg max-w-none">
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-[#2D3436] mb-6">
                  1. Informations sur l&apos;entreprise
                </h2>
                <div className="bg-[#E6FFF9] p-6 rounded-xl">
                  <div className="text-[#2D3436] space-y-3">
                    <p>
                      <strong>Dénomination sociale :</strong> OmniRealm
                    </p>
                    <p>
                      <strong>Forme juridique :</strong> [Statut juridique]
                    </p>
                    <p>
                      <strong>Adresse :</strong> [Adresse complète]
                    </p>
                    <p>
                      <strong>Email :</strong>{" "}
                      <a
                        href="mailto:contact@omnirealm.fr"
                        className="text-[#00D9B1] hover:underline"
                      >
                        contact@omnirealm.fr
                      </a>
                    </p>
                    <p>
                      <strong>Numéro SIRET :</strong> [Numéro SIRET]
                    </p>
                    <p>
                      <strong>TVA intracommunautaire :</strong> [Numéro TVA]
                    </p>
                  </div>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-[#2D3436] mb-6">
                  2. Description des services
                </h2>
                <div className="text-[#636E72] space-y-4">
                  <h3 className="text-xl font-semibold text-[#2D3436]">Version Gratuite</h3>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="font-medium text-[#2D3436] mb-2">Inclus à vie :</p>
                    <ul className="space-y-2">
                      <li>• 5 exercices de base</li>
                      <li>• Minuteur 1-6 minutes</li>
                      <li>• Rappels simples</li>
                      <li>• Statistiques de base</li>
                      <li>• Mode hors ligne</li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-semibold text-[#2D3436]">
                    Version Premium (29€/mois)
                  </h3>
                  <div className="bg-[#E6FFF9] p-4 rounded-lg">
                    <p className="font-medium text-[#2D3436] mb-2">Fonctionnalités avancées :</p>
                    <ul className="space-y-2">
                      <li>• Plus de 50 exercices variés</li>
                      <li>• Coach IA personnel avec conseils</li>
                      <li>• Programmes d&apos;entraînement sur mesure</li>
                      <li>• Statistiques détaillées et analyses</li>
                      <li>• Support client prioritaire</li>
                      <li>• Nouvelles fonctionnalités en avant-première</li>
                    </ul>
                  </div>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-[#2D3436] mb-6">
                  3. Commande et souscription
                </h2>
                <div className="text-[#636E72] space-y-4">
                  <h3 className="text-xl font-semibold text-[#2D3436]">
                    Processus de souscription
                  </h3>
                  <ol className="space-y-2 list-decimal list-inside">
                    <li>Création d&apos;un compte gratuit</li>
                    <li>Choix de l&apos;abonnement Premium</li>
                    <li>Période d&apos;essai gratuit de 7 jours</li>
                    <li>Activation automatique si non annulé</li>
                    <li>Prélèvement mensuel récurrent</li>
                  </ol>

                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <p className="font-medium text-[#2D3436]">
                      📋 La souscription constitue un contrat entre vous et OmniRealm. Vous recevrez
                      un email de confirmation avec tous les détails.
                    </p>
                  </div>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-[#2D3436] mb-6">4. Tarifs et paiement</h2>
                <div className="text-[#636E72] space-y-4">
                  <div className="bg-[#E6FFF9] p-6 rounded-xl">
                    <h3 className="font-semibold text-[#2D3436] mb-4">Structure tarifaire</h3>
                    <div className="space-y-3">
                      <p>
                        <strong>Version Gratuite :</strong> 0€ - À vie, sans limitation de temps
                      </p>
                      <p>
                        <strong>Version Premium :</strong> 29€/mois TTC
                      </p>
                      <p>
                        <strong>Essai gratuit :</strong> 7 jours sans prélèvement
                      </p>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-[#2D3436]">Modalités de paiement</h3>
                  <ul className="space-y-2">
                    <li>• Prélèvement automatique mensuel</li>
                    <li>• Cartes acceptées : Visa, Mastercard, American Express</li>
                    <li>• Traitement sécurisé par Stripe</li>
                    <li>• Facturation le même jour chaque mois</li>
                    <li>• Facture envoyée par email</li>
                  </ul>

                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <h3 className="font-semibold text-amber-800 mb-2">💳 Défaut de paiement</h3>
                    <p className="text-amber-700 text-sm">
                      En cas d&apos;échec de prélèvement, l&apos;accès Premium est suspendu après
                      48h. Le service reprend automatiquement dès régularisation du paiement.
                    </p>
                  </div>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-[#2D3436] mb-6">
                  5. Droit de rétractation et remboursement
                </h2>
                <div className="text-[#636E72] space-y-4">
                  <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
                    <h3 className="font-semibold text-green-800 mb-3">
                      ✅ Droit de rétractation (14 jours)
                    </h3>
                    <p className="text-green-700 mb-3">
                      Conformément au droit européen, vous disposez de 14 jours après souscription
                      pour vous rétracter sans avoir à justifier de motifs.
                    </p>
                    <p className="text-green-700 font-medium">
                      Remboursement intégral sous 14 jours ouvrés.
                    </p>
                  </div>

                  <h3 className="text-xl font-semibold text-[#2D3436]">
                    Conditions de remboursement
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-[#2D3436] mb-2">📞 Demande par email</h4>
                      <p className="text-sm">
                        Email à :{" "}
                        <a
                          href="mailto:refund@omnirealm.fr"
                          className="text-[#00D9B1] hover:underline"
                        >
                          refund@omnirealm.fr
                        </a>
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-[#2D3436] mb-2">⏱️ Délai de traitement</h4>
                      <p className="text-sm">5-10 jours ouvrés selon votre banque</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <p className="font-medium text-yellow-800">
                      ℹ️ Annulation en cours de mois : Remboursement au prorata des jours non
                      utilisés.
                    </p>
                  </div>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-[#2D3436] mb-6">
                  6. Livraison et accès au service
                </h2>
                <div className="text-[#636E72] space-y-4">
                  <p>
                    OmniFit étant un service numérique, l&apos;&ldquo;accès est immédiat après
                    souscription :
                  </p>
                  <ul className="space-y-2">
                    <li>
                      • <strong>Activation instantanée</strong> des fonctionnalités Premium
                    </li>
                    <li>
                      • <strong>Accès 24h/24, 7j/7</strong> depuis tout appareil connecté
                    </li>
                    <li>
                      • <strong>Synchronisation automatique</strong> entre vos appareils
                    </li>
                    <li>
                      • <strong>Mise à jour continue</strong> des fonctionnalités
                    </li>
                  </ul>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-[#2D3436] mb-2">
                      ⚡ Disponibilité du service
                    </h3>
                    <p className="text-sm">
                      Nous nous engageons à maintenir une disponibilité &gt; 99.5%. En cas
                      d&apos;interruption planifiée, vous serez prévenus 24h à l&apos;avance.
                    </p>
                  </div>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-[#2D3436] mb-6">
                  7. Résiliation et suspension
                </h2>
                <div className="text-[#636E72] space-y-4">
                  <h3 className="text-xl font-semibold text-[#2D3436]">
                    Résiliation par le client
                  </h3>
                  <div className="bg-[#E6FFF9] p-4 rounded-lg">
                    <p className="mb-2">
                      Vous pouvez résilier votre abonnement Premium à tout moment :
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li>• Directement depuis l&apos;application (Paramètres → Abonnement)</li>
                      <li>
                        • Par email à{" "}
                        <a
                          href="mailto:cancel@omnirealm.fr"
                          className="text-[#00D9B1] hover:underline"
                        >
                          cancel@omnirealm.fr
                        </a>
                      </li>
                      <li>• Effet immédiat ou à la fin de la période payée</li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-semibold text-[#2D3436]">
                    Résiliation par OmniRealm
                  </h3>
                  <p>Nous nous réservons le droit de suspendre ou résilier un compte en cas de :</p>
                  <ul className="space-y-2">
                    <li>• Non-paiement après relance</li>
                    <li>• Violation des conditions d&apos;utilisation</li>
                    <li>• Usage abusif ou frauduleux</li>
                    <li>• Activité contraire à nos valeurs</li>
                  </ul>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-[#2D3436] mb-6">
                  8. Réclamations et médiation
                </h2>
                <div className="bg-[#E6FFF9] p-6 rounded-xl">
                  <p className="text-[#2D3436] mb-4">
                    Pour toute réclamation concernant votre commande ou facturation :
                  </p>
                  <div className="space-y-2 text-[#636E72]">
                    <p>
                      📧 <strong>Service client :</strong>{" "}
                      <a
                        href="mailto:support@omnirealm.fr"
                        className="text-[#00D9B1] hover:underline"
                      >
                        support@omnirealm.fr
                      </a>
                    </p>
                    <p>
                      📞 <strong>Téléphone :</strong> [Numéro support]
                    </p>
                    <p>
                      ⏱️ <strong>Délai de réponse :</strong> 48h maximum en jours ouvrés
                    </p>
                    <p>
                      🏛️ <strong>Médiation :</strong> En cas de litige non résolu, vous pouvez
                      saisir le médiateur de la consommation compétent
                    </p>
                    <p>
                      ⚖️ <strong>Tribunaux compétents :</strong> Tribunaux français du ressort du
                      siège social
                    </p>
                  </div>
                </div>
              </motion.section>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#E6FFF9]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-[#2D3436] mb-4">
              Questions sur nos conditions de vente ?
            </h2>
            <p className="text-[#636E72] mb-8">
              Notre équipe commerciale est là pour vous accompagner et clarifier tous les points.
            </p>
            <Button
              onClick={() => (window.location.href = "/contact")}
              className="bg-gradient-to-r from-[#00D9B1] to-[#00B89F] hover:from-[#00B89F] hover:to-[#00A890] text-white px-8 py-3"
            >
              Nous contacter
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
    </div>
  );
}
