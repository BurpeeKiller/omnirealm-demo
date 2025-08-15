import React from 'react';
import Link from 'next/link';

const ProductsSection= () => {
  return (
    <section id="produits" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="font-display tracking-tight" style={{ letterSpacing: '-0.02em' }}>
              L'Écosystème OmniRealm : Votre Futur Augmenté.
            </h2>
            <p className="max-w-[900px] font-display text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 tracking-tight">
              Découvrez les outils que nous construisons pour libérer votre potentiel.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-10">
          {/* OmniScan - OCR Intelligent */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl"></div>
            <div className="relative z-10">
              <div className="mb-4 inline-flex rounded-lg bg-blue-500/10 p-3">
                <svg
                  className="h-8 w-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="mb-2 font-display tracking-tight" style={{ letterSpacing: '-0.02em' }}>OmniScan</h3>
              <p className="mb-4 font-display text-gray-600 dark:text-gray-300 tracking-tight">
                OCR intelligent avec IA. Extrayez et structurez instantanément vos documents papier ou PDF.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-display font-bold text-blue-600 dark:text-blue-400 tracking-tight">49€<span className="text-base font-display font-normal text-gray-500 tracking-tight">/mois</span></span>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-display font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-400 tracking-tight">Production</span>
              </div>
              <div className="mt-6 flex gap-3">
                <Link
                  href="/produits/omniscan"
                  className="flex-1 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-display font-semibold text-white shadow transition-all hover:bg-blue-700 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  En savoir plus
                </Link>
                <a
                  href="https://scan.omnirealm.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center rounded-md border border-blue-600 px-4 py-2 text-sm font-display font-semibold text-blue-600 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  Essayer
                </a>
              </div>
            </div>
          </div>

          {/* OmniTask - Gestion Tâches IA */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-8 shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl"></div>
            <div className="relative z-10">
              <div className="mb-4 inline-flex rounded-lg bg-emerald-500/10 p-3">
                <svg
                  className="h-8 w-8 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <h3 className="mb-2 font-display tracking-tight" style={{ letterSpacing: '-0.02em' }}>OmniTask</h3>
              <p className="mb-4 font-display text-gray-600 dark:text-gray-300 tracking-tight">
                Gestion de tâches augmentée par l'IA. Priorisez, automatisez et accomplissez plus.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-display font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">99€<span className="text-base font-display font-normal text-gray-500 tracking-tight">/mois</span></span>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-display font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 tracking-tight">Beta</span>
              </div>
              <div className="mt-6 flex gap-3">
                <Link
                  href="/produits/omnitask"
                  className="flex-1 inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-display font-semibold text-white shadow transition-all hover:bg-emerald-700 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  En savoir plus
                </Link>
                <a
                  href="https://task.omnirealm.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center rounded-md border border-emerald-600 px-4 py-2 text-sm font-display font-semibold text-emerald-600 transition-all hover:bg-emerald-50 dark:hover:bg-emerald-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  Essayer
                </a>
              </div>
            </div>
          </div>

          {/* OmniFit - PWA Fitness */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl"></div>
            <div className="relative z-10">
              <div className="mb-4 inline-flex rounded-lg bg-purple-500/10 p-3">
                <svg
                  className="h-8 w-8 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 font-display tracking-tight" style={{ letterSpacing: '-0.02em' }}>OmniFit</h3>
              <p className="mb-4 font-display text-gray-600 dark:text-gray-300 tracking-tight">
                Coach fitness IA personnalisé. Atteignez vos objectifs avec un programme adaptatif intelligent.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-display font-bold text-purple-600 dark:text-purple-400 tracking-tight">29€<span className="text-base font-display font-normal text-gray-500 tracking-tight">/mois</span></span>
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-display font-semibold text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 tracking-tight">Alpha</span>
              </div>
              <div className="mt-6 flex gap-3">
                <Link
                  href="/produits/omnifit"
                  className="flex-1 inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-display font-semibold text-white shadow transition-all hover:bg-purple-700 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600"
                >
                  En savoir plus
                </Link>
                <a
                  href="https://fit.omnirealm.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center rounded-md border border-purple-600 px-4 py-2 text-sm font-display font-semibold text-purple-600 transition-all hover:bg-purple-50 dark:hover:bg-purple-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600"
                >
                  Essayer
                </a>
              </div>
            </div>
          </div>
        </div>{' '}
        <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center mt-8">
          <Link
            href="#newsletter"
            className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-8 text-sm font-display font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:pointer-events-none disabled:opacity-50 tracking-tight"
            prefetch={true}
          >
            Commencer Gratuitement
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
