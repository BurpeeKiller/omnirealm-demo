'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useUmami } from '@/hooks/useUmami';

const CallToActionSection= () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { trackConversion } = useUmami();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // <-- Début du bloc try
      // Envoi de l'e-mail à l'API Route Next.js
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setEmail(''); // Réinitialiser le champ après succès
        trackConversion('signup'); // Track newsletter signup
      } else {
        const errorData = await response.json();
        alert(`Erreur : ${errorData.message || "Quelque chose s'est mal passé."}`);
      }
    } catch (error) {
      // <-- Début du bloc catch
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      // <-- Début du bloc finally
      setIsLoading(false);
    }
  };

  return (
    <section id="newsletter" className="w-full py-12 md:py-24 lg:py-32 border-t">
      <div className="container px-4 md:px-6 text-center mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Rejoignez la Révolution de l'IA Souveraine.
        </h2>{' '}
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
          Ce n'est pas le moment de s'arrêter. C'est le moment de bifurquer intelligemment.
        </p>
        <div className="mx-auto max-w-[600px] mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-200 font-medium text-sm">
            🚀 Accès anticipé disponible • Plus de 1000 utilisateurs nous font déjà confiance
          </p>
        </div>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg dark:text-gray-400 mt-4">
          Recevez nos dernières actualités, analyses exclusives et invitations à nos événements.
        </p>
        {/* Formulaire Newsletter */}
        <div className="mx-auto max-w-md mt-8">
          {!isSubmitted ? (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
              >
                {isLoading ? 'Inscription...' : "S'inscrire"}
              </button>
            </form>
          ) : (
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-md dark:bg-green-900/20 dark:border-green-800">
              <p className="text-green-700 dark:text-green-300">
                ✅ Merci ! Vous êtes maintenant inscrit(e) à notre newsletter.
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center mt-8">
          <Link
            href="/signup"
            className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
            prefetch={true}
          >
            Rejoindre la Communauté
          </Link>
          <a
            href="mailto:contact@omnirealm.tech" // TODO: Envisager une page de contact dédiée pour une meilleure UX et un meilleur suivi
            className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
          >
            Nous Contacter
          </a>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
