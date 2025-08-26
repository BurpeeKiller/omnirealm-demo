"use client";

import { motion } from "framer-motion";

export const dynamic = "force-dynamic";
import { ArrowLeft, Shield, Eye, Lock, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
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
                <Shield className="w-8 h-8 text-[#00D9B1]" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#2D3436] mb-6">
              Politique de
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00D9B1] to-[#00B89F] mt-4">
                confidentialité
              </span>
            </h1>
            <p className="text-xl text-[#2D3436] max-w-2xl mx-auto mb-8">
              Votre vie privée est notre priorité. Découvrez comment nous protégeons vos données.
            </p>
            <p className="text-sm text-[#636E72]">Dernière mise à jour : 23 août 2025</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Résumé */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#E6FFF9] p-8 rounded-2xl mb-16"
            >
              <h2 className="text-2xl font-bold text-[#2D3436] mb-6">En résumé</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Lock className="w-8 h-8 text-[#00D9B1] mx-auto mb-3" />
                  <h3 className="font-semibold text-[#2D3436] mb-2">Données locales</h3>
                  <p className="text-sm text-[#636E72]">
                    Vos exercices et stats restent sur votre appareil
                  </p>
                </div>
                <div className="text-center">
                  <Eye className="w-8 h-8 text-[#00D9B1] mx-auto mb-3" />
                  <h3 className="font-semibold text-[#2D3436] mb-2">Minimum collecté</h3>
                  <p className="text-sm text-[#636E72]">
                    Seuls email et préférences sont sauvegardés
                  </p>
                </div>
                <div className="text-center">
                  <Database className="w-8 h-8 text-[#00D9B1] mx-auto mb-3" />
                  <h3 className="font-semibold text-[#2D3436] mb-2">Pas de revente</h3>
                  <p className="text-sm text-[#636E72]">
                    Vos données ne sont jamais vendues ou partagées
                  </p>
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
                <h2 className="text-3xl font-bold text-[#2D3436] mb-6">1. Données collectées</h2>
                <div className="space-y-6 text-[#2D3436]">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Informations de compte</h3>
                    <ul className="space-y-2 text-[#636E72]">
                      <li>• Adresse email (pour la connexion)</li>
                      <li>• Nom d&apos;utilisateur (optionnel)</li>
                      <li>• Préférences de l&apos;application</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Données d&apos;utilisation</h3>
                    <ul className="space-y-2 text-[#636E72]">
                      <li>• Statistiques d&apos;exercices (stockées localement)</li>
                      <li>• Préférences de minuteur</li>
                      <li>• Paramètres de rappels</li>
                    </ul>
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
                  2. Utilisation des données
                </h2>
                <div className="text-[#636E72] space-y-4">
                  <p>Nous utilisons vos données uniquement pour :</p>
                  <ul className="space-y-2">
                    <li>• Gérer votre compte et authentification</li>
                    <li>• Sauvegarder vos préférences</li>
                    <li>• Améliorer l&apos;expérience utilisateur</li>
                    <li>• Vous contacter pour le support technique</li>
                  </ul>
                  <p className="font-medium text-[#2D3436]">
                    Nous ne vendons, ne louons, ni ne partageons vos données personnelles avec des
                    tiers.
                  </p>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-[#2D3436] mb-6">3. Stockage et sécurité</h2>
                <div className="text-[#636E72] space-y-4">
                  <div className="bg-[#E6FFF9] p-6 rounded-xl">
                    <h3 className="font-semibold text-[#2D3436] mb-3">
                      🔒 Stockage local prioritaire
                    </h3>
                    <p>
                      Vos données d&apos;exercices, statistiques et progrès sont stockées localement
                      sur votre appareil. Elles ne quittent jamais votre téléphone ou ordinateur.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#2D3436] mb-3">
                      Données cloud (minimales)
                    </h3>
                    <ul className="space-y-2">
                      <li>• Compte utilisateur : Base de données chiffrée (Supabase, EU)</li>
                      <li>• Préférences : Synchronisation optionnelle entre appareils</li>
                      <li>• Backups : Sauvegarde chiffrée sur demande uniquement</li>
                    </ul>
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
                <h2 className="text-3xl font-bold text-[#2D3436] mb-6">4. Vos droits</h2>
                <div className="text-[#636E72] space-y-4">
                  <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-[#2D3436] mb-2">✉️ Accès et portabilité</h3>
                      <p className="text-sm">Demandez une copie de vos données ou exportez-les.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-[#2D3436] mb-2">✏️ Rectification</h3>
                      <p className="text-sm">Modifiez ou corrigez vos informations personnelles.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-[#2D3436] mb-2">🗑️ Suppression</h3>
                      <p className="text-sm">Supprimez définitivement votre compte et données.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-[#2D3436] mb-2">⏸️ Opposition</h3>
                      <p className="text-sm">Opposez-vous au traitement de vos données.</p>
                    </div>
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
                <h2 className="text-3xl font-bold text-[#2D3436] mb-6">5. Contact</h2>
                <div className="bg-[#E6FFF9] p-6 rounded-xl">
                  <p className="text-[#2D3436] mb-4">
                    Pour toute question concernant cette politique de confidentialité ou
                    l&apos;exercice de vos droits :
                  </p>
                  <div className="space-y-2 text-[#636E72]">
                    <p>
                      📧 Email :{" "}
                      <a
                        href="mailto:privacy@omnirealm.fr"
                        className="text-[#00D9B1] hover:underline"
                      >
                        privacy@omnirealm.fr
                      </a>
                    </p>
                    <p>📮 Courrier : OmniRealm, Service Protection des Données, [Adresse]</p>
                    <p>⚡ Délai de réponse : 72h maximum</p>
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
              Une question sur vos données ?
            </h2>
            <p className="text-[#636E72] mb-8">
              Nous sommes transparents et à votre écoute pour protéger votre vie privée.
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
