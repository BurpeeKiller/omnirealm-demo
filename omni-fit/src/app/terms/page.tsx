"use client";

import { motion } from "framer-motion";

export const dynamic = "force-dynamic";
import { ArrowLeft, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
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
                <FileText className="w-8 h-8 text-[#00D9B1]" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#2D3436] mb-6">
              Conditions générales
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00D9B1] to-[#00B89F] mt-4">
                d&apos;utilisation
              </span>
            </h1>
            <p className="text-xl text-[#2D3436] max-w-2xl mx-auto mb-8">
              Les règles d&apos;utilisation d&apos;OmniFit, expliquées simplement et clairement.
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
                  <CheckCircle className="w-8 h-8 text-[#00D9B1] mx-auto mb-3" />
                  <h3 className="font-semibold text-[#2D3436] mb-2">Gratuit pour toujours</h3>
                  <p className="text-sm text-[#636E72]">
                    L&apos;accès de base reste gratuit sans limite de temps
                  </p>
                </div>
                <div className="text-center">
                  <AlertTriangle className="w-8 h-8 text-[#00D9B1] mx-auto mb-3" />
                  <h3 className="font-semibold text-[#2D3436] mb-2">Usage personnel</h3>
                  <p className="text-sm text-[#636E72]">
                    Pour votre bien-être individuel, pas de revente
                  </p>
                </div>
                <div className="text-center">
                  <FileText className="w-8 h-8 text-[#00D9B1] mx-auto mb-3" />
                  <h3 className="font-semibold text-[#2D3436] mb-2">Respect mutuel</h3>
                  <p className="text-sm text-[#636E72]">Utilisation éthique et bienveillante</p>
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
                  1. Acceptation des conditions
                </h2>
                <div className="text-[#636E72] space-y-4">
                  <p>
                    En utilisant OmniFit, vous acceptez ces conditions d&apos;utilisation. Si vous
                    n&apos;êtes pas d&apos;accord, nous vous invitons à ne pas utiliser notre
                    service.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <p className="font-medium text-[#2D3436]">
                      💡 Ces conditions peuvent évoluer. Nous vous préviendrons par email de tout
                      changement important.
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
                  2. Description du service
                </h2>
                <div className="text-[#636E72] space-y-4">
                  <p>OmniFit est une application de bien-être qui vous aide à :</p>
                  <ul className="space-y-2">
                    <li>• Faire des pauses actives pendant votre journée de travail</li>
                    <li>• Suivre vos progrès et statistiques d&apos;exercices</li>
                    <li>• Recevoir des rappels personnalisés</li>
                    <li>• Accéder à un coach IA pour des conseils (version Premium)</li>
                  </ul>
                  <div className="bg-[#E6FFF9] p-6 rounded-xl">
                    <h3 className="font-semibold text-[#2D3436] mb-3">⚠️ Avertissement santé</h3>
                    <p>
                      OmniFit n&apos;est pas un dispositif médical. Consultez un professionnel de
                      santé avant de commencer tout programme d&apos;exercices, surtout si vous avez
                      des conditions médicales particulières.
                    </p>
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
                <h2 className="text-3xl font-bold text-[#2D3436] mb-6">3. Comptes utilisateur</h2>
                <div className="text-[#636E72] space-y-4">
                  <h3 className="text-xl font-semibold text-[#2D3436]">Inscription</h3>
                  <ul className="space-y-2">
                    <li>
                      • Vous devez fournir des informations exactes lors de l&apos;inscription
                    </li>
                    <li>• Un compte par personne (usage personnel uniquement)</li>
                    <li>• Vous êtes responsable de la confidentialité de votre mot de passe</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-[#2D3436]">
                    Suspension et résiliation
                  </h3>
                  <p>
                    Nous nous réservons le droit de suspendre ou supprimer un compte en cas
                    d&apos;utilisation abusive, illégale ou contraire à ces conditions. Vous pouvez
                    supprimer votre compte à tout moment.
                  </p>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-[#2D3436] mb-6">
                  4. Utilisation acceptable
                </h2>
                <div className="text-[#636E72] space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-800 mb-2">✅ Autorisé</h3>
                      <ul className="text-sm space-y-1 text-green-700">
                        <li>• Usage personnel et familial</li>
                        <li>• Partage de vos progrès (stats anonymes)</li>
                        <li>• Suggestions d&apos;amélioration</li>
                        <li>• Support communautaire bienveillant</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <h3 className="font-semibold text-red-800 mb-2">❌ Interdit</h3>
                      <ul className="text-sm space-y-1 text-red-700">
                        <li>• Revente ou usage commercial</li>
                        <li>• Tentatives de piratage ou hacking</li>
                        <li>• Partage de compte</li>
                        <li>• Création de faux comptes</li>
                        <li>• Usage automatisé (bots)</li>
                      </ul>
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
                <h2 className="text-3xl font-bold text-[#2D3436] mb-6">
                  5. Abonnements et paiements
                </h2>
                <div className="text-[#636E72] space-y-4">
                  <div className="bg-[#E6FFF9] p-6 rounded-xl">
                    <h3 className="font-semibold text-[#2D3436] mb-3">Version gratuite</h3>
                    <p>
                      L&apos;accès de base à OmniFit est gratuit pour toujours, sans engagement ni
                      carte bancaire.
                    </p>
                  </div>

                  <h3 className="text-xl font-semibold text-[#2D3436]">
                    Version Premium (29€/mois)
                  </h3>
                  <ul className="space-y-2">
                    <li>• Essai gratuit de 7 jours (aucun prélèvement)</li>
                    <li>• Renouvellement automatique mensuel</li>
                    <li>• Annulation possible à tout moment</li>
                    <li>• Remboursement au prorata si annulation avant échéance</li>
                  </ul>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <p className="font-medium text-yellow-800">
                      🔄 Remboursements : Sous 14 jours après souscription, remboursement intégral
                      sans justification.
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
                  6. Propriété intellectuelle
                </h2>
                <div className="text-[#636E72] space-y-4">
                  <p>
                    OmniFit, son contenu, ses fonctionnalités et sa technologie sont la propriété
                    d&apos;OmniRealm et sont protégés par les lois sur les droits d&apos;auteur,
                    marques et autres droits de propriété intellectuelle.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-[#2D3436] mb-2">
                      Vos données vous appartiennent
                    </h3>
                    <p className="text-sm">
                      Vos statistiques, progrès et contenu personnel restent votre propriété. Vous
                      pouvez les exporter ou supprimer à tout moment.
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
                  7. Limitation de responsabilité
                </h2>
                <div className="text-[#636E72] space-y-4">
                  <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl">
                    <h3 className="font-semibold text-amber-800 mb-3">
                      ⚠️ Avertissement important
                    </h3>
                    <p className="text-amber-700">
                      OmniFit est fourni &ldquo;en l&apos;état&rdquo;. Nous nous efforçons
                      d&apos;offrir un service fiable, mais ne pouvons garantir qu&apos;il soit
                      exempt d&apos;erreurs ou disponible 24h/24.
                    </p>
                  </div>

                  <p>
                    Nous ne sommes pas responsables des dommages indirects, accessoires ou
                    consécutifs résultant de l&apos;utilisation ou de l&apos;impossibilité
                    d&apos;utiliser OmniFit.
                  </p>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-[#2D3436] mb-2">Notre engagement</h3>
                    <p className="text-sm">
                      Nous nous engageons à corriger rapidement tout problème signalé et à améliorer
                      continuellement le service.
                    </p>
                  </div>
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
                  8. Contact et réclamations
                </h2>
                <div className="bg-[#E6FFF9] p-6 rounded-xl">
                  <p className="text-[#2D3436] mb-4">
                    Pour toute question sur ces conditions ou pour signaler un problème :
                  </p>
                  <div className="space-y-2 text-[#636E72]">
                    <p>
                      📧 Email :{" "}
                      <a
                        href="mailto:support@omnirealm.fr"
                        className="text-[#00D9B1] hover:underline"
                      >
                        support@omnirealm.fr
                      </a>
                    </p>
                    <p>📮 Courrier : OmniRealm, Service Juridique, [Adresse]</p>
                    <p>⚡ Délai de réponse : 48h en jours ouvrés</p>
                    <p>
                      🇫🇷 Droit applicable : Droit français • Tribunaux compétents : Tribunaux de
                      [Ville]
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
              Des questions sur ces conditions ?
            </h2>
            <p className="text-[#636E72] mb-8">
              Notre équipe est là pour vous aider et clarifier tous les points.
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
