import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
  title: 'OmniFit - Coach Fitness IA Personnalisé | OmniRealm',
  description: 'Atteignez vos objectifs fitness avec un coach IA qui s\'adapte à votre niveau, vos contraintes et vos progrès. Programme personnalisé et suivi intelligent.',
  openGraph: {
    title: 'OmniFit - Coach Fitness IA Personnalisé',
    description: 'Atteignez vos objectifs fitness avec un coach IA adaptatif.',
    images: ['/og-omnifit.jpg'],
  },
};

export default function OmniFitPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg dark:bg-gray-900/80 dark:border-gray-800">
        <div className="container flex h-14 items-center justify-between px-4 mx-auto">
          <Link href="/" className="font-display font-bold text-xl tracking-tight">
            OmniRealm
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Accueil
            </Link>
            <Link href="/#produits" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Produits
            </Link>
            <a
              href="https://fit.omnirealm.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow transition-all hover:bg-purple-700 hover:shadow-lg"
            >
              Commencer Maintenant
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                <span className="mr-2">🚀</span> Version Alpha
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                OmniFit
                <span className="block text-purple-600 dark:text-purple-400">Votre coach fitness personnel IA</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Un programme d'entraînement qui s'adapte à vous. Notre IA analyse vos progrès, ajuste vos exercices 
                et vous motive pour atteindre vos objectifs plus rapidement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://fit.omnirealm.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md bg-purple-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-purple-700 hover:shadow-xl hover:scale-105"
                >
                  Démarrer mon programme
                </a>
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 px-8 py-3 text-base font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Découvrir les fonctionnalités
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Sans équipement requis
                </span>
                <span className="flex items-center gap-1">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Programme adaptatif
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-8 shadow-2xl">
                <div className="h-full w-full rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <svg className="h-32 w-32 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Un coach qui vous comprend
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Des fonctionnalités intelligentes pour un entraînement optimal
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-purple-100 dark:bg-purple-900/30 p-3">
                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Programme Personnalisé</h3>
              <p className="text-gray-600 dark:text-gray-300">
                L'IA crée un programme unique basé sur votre niveau, objectifs et contraintes de temps
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-emerald-100 dark:bg-emerald-900/30 p-3">
                <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Adaptation Continue</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Ajustements automatiques selon vos performances et votre ressenti après chaque séance
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-blue-100 dark:bg-blue-900/30 p-3">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Vidéos Démonstratives</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Chaque exercice avec démonstration vidéo et instructions détaillées pour une exécution parfaite
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-orange-100 dark:bg-orange-900/30 p-3">
                <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Timer Intelligent</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Chronomètre intégré avec rappels sonores et gestion automatique des temps de repos
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-pink-100 dark:bg-pink-900/30 p-3">
                <svg className="h-6 w-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Suivi des Progrès</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Graphiques détaillés de vos performances, poids, mesures et objectifs atteints
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-indigo-100 dark:bg-indigo-900/30 p-3">
                <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Application PWA</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Fonctionne hors-ligne sur mobile et desktop. Installez comme une app native
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workout Types */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Pour tous les objectifs
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Quel que soit votre but, OmniFit s'adapte
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Strength */}
            <div className="text-center">
              <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-orange-500">
                <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Force</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Développez votre force avec des exercices progressifs au poids du corps
              </p>
            </div>

            {/* Cardio */}
            <div className="text-center">
              <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-cyan-500">
                <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Cardio</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Améliorez votre endurance avec des séances HIIT adaptées à votre niveau
              </p>
            </div>

            {/* Flexibility */}
            <div className="text-center">
              <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-500">
                <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Souplesse</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Gagnez en flexibilité avec des routines de stretching et yoga guidées
              </p>
            </div>

            {/* Balance */}
            <div className="text-center">
              <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-teal-500">
                <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Équilibre</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Renforcez votre core et améliorez votre équilibre avec des exercices ciblés
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="px-4 py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Ils ont transformé leur vie
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Découvrez les témoignages de nos utilisateurs
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Story 1 */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
                <div>
                  <p className="font-semibold">Julie M.</p>
                  <p className="text-sm text-gray-500">-15kg en 4 mois</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "OmniFit m'a permis de m'entraîner à mon rythme, sans pression. Les séances s'adaptent vraiment à mon niveau et j'ai enfin trouvé du plaisir à faire du sport!"
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Story 2 */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-green-400"></div>
                <div>
                  <p className="font-semibold">Marc D.</p>
                  <p className="text-sm text-gray-500">Gain musculaire +8kg</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "En tant que débutant, j'avais peur de mal faire. Les vidéos et l'adaptation progressive m'ont permis de progresser sans blessure. Je recommande!"
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Story 3 */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-red-400"></div>
                <div>
                  <p className="font-semibold">Sophie L.</p>
                  <p className="text-sm text-gray-500">Marathon complété</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "Le programme cardio progressif m'a préparée pour mon premier marathon. L'IA a su doser les efforts et j'ai atteint mon objectif sans surentraînement."
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Investissez dans votre santé
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Un coach personnel pour le prix d'un café par jour
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-8 shadow-xl text-white">
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-2">OmniFit Pro</h3>
                <p className="text-purple-100 mb-6">Accès complet à toutes les fonctionnalités</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold">29€</span>
                  <span className="text-purple-100">/mois</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-white mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Programme personnalisé évolutif avec IA</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-white mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>+500 exercices avec vidéos HD</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-white mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Suivi détaillé des progrès et statistiques</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-white mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Mode hors-ligne sur mobile</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-white mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Plans nutrition personnalisés (bientôt)</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-white mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Support prioritaire 7j/7</span>
                </li>
              </ul>

              <a
                href="https://fit.omnirealm.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center rounded-md bg-white px-6 py-3 text-base font-semibold text-purple-600 shadow transition-all hover:bg-gray-50"
              >
                Commencer mon essai gratuit
              </a>
              
              <p className="text-center text-sm text-purple-100 mt-4">
                7 jours d'essai gratuit • Sans engagement • Annulation à tout moment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Questions Fréquentes
            </h2>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
              <h3 className="text-lg font-semibold mb-2">Ai-je besoin d'équipement ?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Non! OmniFit propose des programmes au poids du corps. Si vous avez du matériel, l'app s'adapte pour l'intégrer.
              </p>
            </div>

            <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
              <h3 className="text-lg font-semibold mb-2">Combien de temps durent les séances ?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                C'est vous qui choisissez! Les séances peuvent durer de 15 à 60 minutes selon vos disponibilités.
              </p>
            </div>

            <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
              <h3 className="text-lg font-semibold mb-2">L'app fonctionne-t-elle hors ligne ?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Oui! Une fois installée, OmniFit fonctionne sans connexion internet. Vos données se synchronisent dès que vous êtes en ligne.
              </p>
            </div>

            <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
              <h3 className="text-lg font-semibold mb-2">Puis-je annuler à tout moment ?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Absolument! Aucun engagement, vous pouvez annuler votre abonnement à tout moment depuis votre compte.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Commencez votre transformation aujourd'hui
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Rejoignez des milliers d'utilisateurs qui ont déjà changé leur vie avec OmniFit
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://fit.omnirealm.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-purple-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-purple-700 hover:shadow-xl hover:scale-105"
            >
              Démarrer mon programme gratuit
            </a>
            <Link
              href="/#newsletter"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 px-8 py-3 text-base font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 dark:bg-gray-900 px-4 py-12">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© 2024 OmniRealm. Tous droits réservés.</p>
            <div className="mt-4 flex justify-center gap-4">
              <Link href="/privacy-policy" className="hover:text-purple-600 transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/terms-of-use" className="hover:text-purple-600 transition-colors">
                Conditions d'utilisation
              </Link>
              <Link href="/legal-mentions" className="hover:text-purple-600 transition-colors">
                Mentions légales
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}