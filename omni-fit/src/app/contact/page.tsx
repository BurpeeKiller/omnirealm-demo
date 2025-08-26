"use client";

import { motion } from "framer-motion";

export const dynamic = "force-dynamic";
import { ArrowLeft, Mail, MessageSquare, Clock, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de l'envoi");
      }

      console.log("✅ Message envoyé:", result);
      setIsSubmitted(true);
    } catch (error) {
      console.error("❌ Erreur:", error);
      // Afficher un message d'erreur à l'utilisateur
      alert("Erreur lors de l'envoi du message. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }

    // Reset du formulaire après 3 secondes
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
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
                <MessageSquare className="w-8 h-8 text-[#00D9B1]" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#2D3436] mb-6">
              Nous
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00D9B1] to-[#00B89F] mt-4">
                contacter
              </span>
            </h1>
            <p className="text-xl text-[#2D3436] max-w-2xl mx-auto mb-8">
              Une question, un problème, une suggestion ? Notre équipe est là pour vous aider.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Informations de contact */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold text-[#2D3436] mb-6">
                    Parlons de votre bien-être
                  </h2>
                  <p className="text-[#636E72] text-lg mb-8">
                    Notre équipe est passionnée par votre réussite. N&apos;hésitez pas à nous poser
                    toutes vos questions !
                  </p>
                </div>

                {/* Moyens de contact */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 p-6 bg-[#E6FFF9] rounded-xl"
                  >
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-[#00D9B1]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#2D3436] mb-2">Email principal</h3>
                      <p className="text-[#636E72] mb-1">
                        <a
                          href="mailto:contact@omnirealm.fr"
                          className="text-[#00D9B1] hover:underline"
                        >
                          contact@omnirealm.fr
                        </a>
                      </p>
                      <p className="text-sm text-[#636E72]">Réponse sous 24h en jours ouvrés</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl"
                  >
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-[#00D9B1]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#2D3436] mb-2">Support technique</h3>
                      <p className="text-[#636E72] mb-1">
                        <a
                          href="mailto:support@omnirealm.fr"
                          className="text-[#00D9B1] hover:underline"
                        >
                          support@omnirealm.fr
                        </a>
                      </p>
                      <p className="text-sm text-[#636E72]">Pour les problèmes techniques</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl"
                  >
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-[#00D9B1]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#2D3436] mb-2">Horaires de support</h3>
                      <p className="text-[#636E72] mb-1">Lundi - Vendredi : 9h - 18h</p>
                      <p className="text-sm text-[#636E72]">Heure française (CET/CEST)</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl"
                  >
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[#00D9B1]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#2D3436] mb-2">Adresse postale</h3>
                      <p className="text-[#636E72]">
                        OmniRealm
                        <br />
                        [Adresse complète]
                        <br />
                        [Code postal] [Ville], France
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Formulaire de contact */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              >
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#2D3436] mb-2">Message envoyé !</h3>
                    <p className="text-[#636E72]">
                      Nous vous répondrons dans les plus brefs délais.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-[#2D3436] mb-6">
                      Envoyez-nous un message
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#2D3436] mb-2">
                            Nom complet *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00D9B1] focus:border-[#00D9B1] outline-none transition-colors text-[#2D3436] placeholder:text-gray-400"
                            placeholder="Votre nom"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#2D3436] mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00D9B1] focus:border-[#00D9B1] outline-none transition-colors text-[#2D3436] placeholder:text-gray-400"
                            placeholder="votre@email.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#2D3436] mb-2">
                          Sujet *
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00D9B1] focus:border-[#00D9B1] outline-none transition-colors text-[#2D3436]"
                        >
                          <option value="">Choisissez un sujet</option>
                          <option value="support">Problème technique</option>
                          <option value="billing">Question de facturation</option>
                          <option value="feature">Suggestion de fonctionnalité</option>
                          <option value="partnership">Partenariat</option>
                          <option value="press">Demande presse</option>
                          <option value="other">Autre</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#2D3436] mb-2">
                          Message *
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={6}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00D9B1] focus:border-[#00D9B1] outline-none transition-colors resize-none text-[#2D3436] placeholder:text-gray-400"
                          placeholder="Décrivez votre question ou problème en détail..."
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#00D9B1] to-[#00B89F] hover:from-[#00B89F] hover:to-[#00A890] text-white py-3 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Envoi en cours...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            Envoyer le message
                          </div>
                        )}
                      </Button>
                    </form>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ rapide */}
      <section className="py-20 bg-[#E6FFF9]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-[#2D3436] mb-4">Questions fréquentes</h2>
              <p className="text-[#636E72] text-lg">Peut-être que votre réponse se trouve ici</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  q: "Comment puis-je annuler mon abonnement ?",
                  a: "Directement dans l'app (Paramètres → Abonnement) ou par email à cancel@omnirealm.fr",
                },
                {
                  q: "Mes données sont-elles sauvegardées ?",
                  a: "Oui, vos statistiques sont stockées localement ET sauvegardées dans le cloud de manière chiffrée.",
                },
                {
                  q: "L'app fonctionne-t-elle hors ligne ?",
                  a: "Oui, tous les exercices et le minuteur fonctionnent sans connexion internet.",
                },
                {
                  q: "Puis-je utiliser OmniFit sur plusieurs appareils ?",
                  a: "Absolument ! Vos données se synchronisent automatiquement entre tous vos appareils.",
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
                  <p className="text-[#636E72] text-sm">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
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
