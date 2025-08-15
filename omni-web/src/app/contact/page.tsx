'use client';
import React, { useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import FooterSection from '@/components/FooterSection';
import { useUmami } from '@/hooks/useUmami';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const { trackConversion } = useUmami();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est requis';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Envoi vers l'API contact
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        trackConversion('contact'); // Track contact form submission
      } else {
        const errorData = await response.json();
        console.error('Erreur API:', errorData);
        alert(`Erreur : ${errorData.message || "Quelque chose s'est mal passé."}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Effacer l'erreur du champ en cours de modification
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-6xl mx-auto">
              <Breadcrumbs items={[{ label: 'Contact' }]} />

              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-4">
                  Contactez-nous
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Nous sommes là pour répondre à toutes vos questions et vous accompagner dans votre
                  transformation digitale avec l'IA.
                </p>
              </div>

              {isSubmitted ? (
                <div className="max-w-2xl mx-auto">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <svg
                        className="h-12 w-12 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                      Message envoyé avec succès !
                    </h3>
                    <p className="text-green-700 dark:text-green-300">
                      Nous avons bien reçu votre message et vous répondrons dans les plus brefs
                      délais.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="mt-4 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 underline"
                    >
                      Envoyer un autre message
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Informations de contact */}
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Nos coordonnées</h2>
                      <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-6 w-6 text-blue-600 dark:text-blue-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">Email</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                              contact@omnirealm.com
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-6 w-6 text-blue-600 dark:text-blue-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">Téléphone</h3>
                            <p className="text-gray-600 dark:text-gray-300">+33 1 23 45 67 89</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-6 w-6 text-blue-600 dark:text-blue-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">Adresse</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                              123 Rue de l'Innovation
                              <br />
                              75001 Paris, France
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-6 w-6 text-blue-600 dark:text-blue-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">Horaires</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                              Du lundi au vendredi
                              <br />
                              9h00 à 18h00 (CET)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                      <h3 className="font-semibold mb-2">Réponse rapide garantie</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Nous nous engageons à répondre à votre demande sous 24 heures ouvrées
                        maximum.
                      </p>
                    </div>
                  </div>

                  {/* Formulaire de contact */}
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 ${
                            errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="Votre nom complet"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 ${
                            errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="votre@email.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-2">
                          Sujet *
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 ${
                            errors.subject
                              ? 'border-red-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="Objet de votre message"
                        />
                        {errors.subject && (
                          <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={6}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 resize-none ${
                            errors.message
                              ? 'border-red-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="Décrivez votre projet ou posez votre question..."
                        />
                        {errors.message && (
                          <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
}
