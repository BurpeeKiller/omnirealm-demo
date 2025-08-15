import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
  title: 'OmniScan - OCR Intelligent avec IA | OmniRealm',
  description: 'Transformez vos documents papier en données structurées en quelques secondes. OCR intelligent avec IA pour extraire et organiser automatiquement vos informations.',
  openGraph: {
    title: 'OmniScan - OCR Intelligent avec IA',
    description: 'Transformez vos documents papier en données structurées en quelques secondes.',
    images: ['/og-omniscan.jpg'],
  },
};

export default function OmniScanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg dark:bg-gray-900/80 dark:border-gray-800">
        <div className="container flex h-14 items-center justify-between px-4 mx-auto">
          <Link href="/" className="font-display font-bold text-xl tracking-tight">
            OmniRealm
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Accueil
            </Link>
            <Link href="/#produits" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Produits
            </Link>
            <a
              href="https://scan.omnirealm.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition-all hover:bg-blue-700 hover:shadow-lg"
            >
              Essayer Gratuitement
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
                <span className="mr-2">🚀</span> En Production
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                OmniScan
                <span className="block text-blue-600 dark:text-blue-400">OCR Intelligent avec IA</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Transformez instantanément vos documents papier, PDF et images en données structurées exploitables. 
                Notre IA comprend le contexte et organise automatiquement vos informations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://scan.omnirealm.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl hover:scale-105"
                >
                  Essayer Gratuitement
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
                  5 scans gratuits/mois
                </span>
                <span className="flex items-center gap-1">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Sans carte bancaire
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-8 shadow-2xl">
                <div className="h-full w-full rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <svg className="h-32 w-32 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Fonctionnalités Puissantes
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Tout ce dont vous avez besoin pour numériser et organiser vos documents
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-blue-100 dark:bg-blue-900/30 p-3">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">OCR Ultra-Rapide</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Extraction de texte en moins de 3 secondes avec une précision de 99.8% grâce à notre IA optimisée
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-emerald-100 dark:bg-emerald-900/30 p-3">
                <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Structuration Intelligente</h3>
              <p className="text-gray-600 dark:text-gray-300">
                L'IA organise automatiquement les données extraites : dates, montants, noms, adresses...
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-purple-100 dark:bg-purple-900/30 p-3">
                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Export Flexible</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Exportez en JSON, CSV, Excel ou intégrez directement via API dans vos outils existants
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-orange-100 dark:bg-orange-900/30 p-3">
                <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Sécurité RGPD</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Données chiffrées, hébergement français, suppression automatique après traitement
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-pink-100 dark:bg-pink-900/30 p-3">
                <svg className="h-6 w-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Multi-Langues</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Support de 95+ langues avec détection automatique et traduction intégrée si besoin
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-indigo-100 dark:bg-indigo-900/30 p-3">
                <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Templates Personnalisés</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Créez des modèles réutilisables pour vos documents récurrents : factures, contrats, formulaires
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Cas d'Usage
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              OmniScan s'adapte à tous vos besoins professionnels
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Comptabilité & Finance</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Numérisez factures, reçus et documents comptables. Extraction automatique des montants, TVA, dates et fournisseurs.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Immobilier</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Digitalisez contrats de location, états des lieux, diagnostics. Extraction des informations clés pour votre gestion.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Juridique</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Numérisez contrats, accords et documents légaux. Recherche intelligente dans vos archives numérisées.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Éducation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Numérisez notes de cours, examens, documents administratifs. Créez une bibliothèque numérique consultable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Tarification Simple et Transparente
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Commencez gratuitement, évoluez selon vos besoins
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Free Plan */}
            <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-2">Gratuit</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Pour découvrir OmniScan</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">0€</span>
                <span className="text-gray-600 dark:text-gray-400">/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>5 scans par mois</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Export JSON/CSV</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Stockage 7 jours</span>
                </li>
              </ul>
              <a
                href="https://scan.omnirealm.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Commencer
              </a>
            </div>

            {/* Pro Plan */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-8 shadow-xl text-white relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-4 py-1 text-xs font-semibold">
                POPULAIRE
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-blue-100 mb-6">Pour les professionnels</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">49€</span>
                <span className="text-blue-100">/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-white mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Scans illimités</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-white mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Export tous formats + API</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-white mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Stockage illimité</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-white mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Templates personnalisés</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-white mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Support prioritaire</span>
                </li>
              </ul>
              <a
                href="https://scan.omnirealm.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow transition-all hover:bg-gray-50"
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
                  <span>Déploiement on-premise</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>SLA garantis</span>
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
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Prêt à digitaliser vos documents ?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Rejoignez des milliers de professionnels qui ont déjà simplifié leur gestion documentaire
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://scan.omnirealm.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl hover:scale-105"
            >
              Essayer Gratuitement
            </a>
            <Link
              href="/#newsletter"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 px-8 py-3 text-base font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Recevoir la newsletter
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
              <Link href="/privacy-policy" className="hover:text-blue-600 transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/terms-of-use" className="hover:text-blue-600 transition-colors">
                Conditions d'utilisation
              </Link>
              <Link href="/legal-mentions" className="hover:text-blue-600 transition-colors">
                Mentions légales
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}