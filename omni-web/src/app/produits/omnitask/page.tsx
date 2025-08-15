import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
  title: 'OmniTask - Gestion de Tâches Augmentée par IA | OmniRealm',
  description: 'Révolutionnez votre productivité avec la gestion de tâches intelligente. Priorisation automatique, suggestions IA et intégrations puissantes.',
  openGraph: {
    title: 'OmniTask - Gestion de Tâches Augmentée par IA',
    description: 'Révolutionnez votre productivité avec la gestion de tâches intelligente.',
    images: ['/og-omnitask.jpg'],
  },
};

export default function OmniTaskPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg dark:bg-gray-900/80 dark:border-gray-800">
        <div className="container flex h-14 items-center justify-between px-4 mx-auto">
          <Link href="/" className="font-display font-bold text-xl tracking-tight">
            OmniRealm
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              Accueil
            </Link>
            <Link href="/#produits" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              Produits
            </Link>
            <a
              href="https://task.omnirealm.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow transition-all hover:bg-emerald-700 hover:shadow-lg"
            >
              Accès Beta
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
                <span className="mr-2">🚀</span> Beta Publique
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                OmniTask
                <span className="block text-emerald-600 dark:text-emerald-400">L'IA au service de votre productivité</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Transformez votre façon de travailler. Notre IA analyse, priorise et suggère les meilleures actions 
                pour maximiser votre efficacité au quotidien.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://task.omnirealm.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl hover:scale-105"
                >
                  Rejoindre la Beta
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
                  14 jours d'essai
                </span>
                <span className="flex items-center gap-1">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Sans engagement
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-8 shadow-2xl">
                <div className="h-full w-full rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <svg className="h-32 w-32 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Une IA qui comprend votre travail
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Des fonctionnalités pensées pour multiplier votre productivité
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-emerald-100 dark:bg-emerald-900/30 p-3">
                <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Priorisation Intelligente</h3>
              <p className="text-gray-600 dark:text-gray-300">
                L'IA analyse vos tâches et suggère l'ordre optimal selon vos deadlines, dépendances et objectifs
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-blue-100 dark:bg-blue-900/30 p-3">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Suggestions Contextuelles</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Recevez des recommandations pertinentes basées sur votre historique et vos habitudes de travail
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-purple-100 dark:bg-purple-900/30 p-3">
                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Automatisations</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Créez des workflows automatiques pour les tâches récurrentes et gagnez du temps précieux
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-orange-100 dark:bg-orange-900/30 p-3">
                <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Tableau de Bord Kanban</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Visualisez et organisez vos projets avec des vues personnalisables et des statistiques en temps réel
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-pink-100 dark:bg-pink-900/30 p-3">
                <svg className="h-6 w-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Collaboration d'Équipe</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Partagez projets, assignez tâches et suivez la progression de votre équipe en temps réel
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-indigo-100 dark:bg-indigo-900/30 p-3">
                <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Intégrations Puissantes</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connectez vos outils favoris : Slack, Gmail, Calendar, GitHub et synchronisez tout automatiquement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Commencez à être plus productif en 3 étapes simples
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">1</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Créez vos projets</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Organisez vos tâches par projet avec des couleurs et icônes personnalisées
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">2</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Ajoutez vos tâches</h3>
              <p className="text-gray-600 dark:text-gray-300">
                L'IA analyse et suggère automatiquement priorités et estimations de temps
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">3</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Laissez l'IA vous guider</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Recevez des suggestions et optimisations pour maximiser votre productivité
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Ils font confiance à OmniTask
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Découvrez comment nos utilisateurs boostent leur productivité
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                "OmniTask a révolutionné ma gestion de projets. Je gagne 2h par jour grâce aux suggestions intelligentes."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div>
                  <p className="font-semibold">Marie L.</p>
                  <p className="text-sm text-gray-500">Chef de projet</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                "L'IA comprend vraiment comment je travaille. Les priorisations automatiques sont toujours pertinentes."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div>
                  <p className="font-semibold">Thomas R.</p>
                  <p className="text-sm text-gray-500">Développeur</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                "La vue Kanban et les automatisations ont transformé notre équipe. Productivité +40% en 2 mois!"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div>
                  <p className="font-semibold">Sophie B.</p>
                  <p className="text-sm text-gray-500">CEO Startup</p>
                </div>
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
              Un prix juste pour chaque besoin
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Choisissez le plan qui correspond à votre utilisation
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Starter Plan */}
            <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Pour les freelances</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">29€</span>
                <span className="text-gray-600 dark:text-gray-400">/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>3 projets actifs</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>IA suggestions basiques</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Intégrations essentielles</span>
                </li>
              </ul>
              <a
                href="https://task.omnirealm.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Commencer
              </a>
            </div>

            {/* Pro Plan */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-8 shadow-xl text-white relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-4 py-1 text-xs font-semibold">
                POPULAIRE
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-emerald-100 mb-6">Pour les équipes</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">99€</span>
                <span className="text-emerald-100">/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-white mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Projets illimités</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-white mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>IA avancée + automatisations</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-white mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>5 membres d'équipe</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-white mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Toutes les intégrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-white mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Support prioritaire</span>
                </li>
              </ul>
              <a
                href="https://task.omnirealm.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-emerald-600 shadow transition-all hover:bg-gray-50"
              >
                Essayer 14 jours gratuits
              </a>
            </div>

            {/* Enterprise Plan */}
            <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-2">Entreprise</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Solutions sur-mesure</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">Sur devis</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Tout du plan Pro</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Membres illimités</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>IA personnalisée</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>API dédiée</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Formation équipes</span>
                </li>
              </ul>
              <Link
                href="/contact"
                className="block w-full text-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Prêt à multiplier votre productivité ?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Rejoignez la beta et découvrez comment l'IA peut transformer votre façon de travailler
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://task.omnirealm.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl hover:scale-105"
            >
              Rejoindre la Beta Gratuite
            </a>
            <Link
              href="/#newsletter"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 px-8 py-3 text-base font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Recevoir les updates
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
              <Link href="/privacy-policy" className="hover:text-emerald-600 transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/terms-of-use" className="hover:text-emerald-600 transition-colors">
                Conditions d'utilisation
              </Link>
              <Link href="/legal-mentions" className="hover:text-emerald-600 transition-colors">
                Mentions légales
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}