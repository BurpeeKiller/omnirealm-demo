'use client'

import Link from 'next/link'
import { Logo } from '@/components/logo'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo et description */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Logo size="sm" animate={false} />
                <span className="font-bold text-lg">OmniTask</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gestion de tâches moderne avec IA intégrée. 
                Partie de l'écosystème OmniRealm.
              </p>
            </div>

            {/* Produit */}
            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/features" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    Démo
                  </Link>
                </li>
                <li>
                  <Link href="/changelog" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    Nouveautés
                  </Link>
                </li>
              </ul>
            </div>

            {/* Écosystème */}
            <div>
              <h3 className="font-semibold mb-4">Écosystème OmniRealm</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://omniscan.omnirealm.com" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    OmniScan
                  </a>
                </li>
                <li>
                  <a href="https://fitness.omnirealm.com" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    OmniFit
                  </a>
                </li>
                <li>
                  <a href="https://bible.omnirealm.com" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    Bible LMS
                  </a>
                </li>
                <li>
                  <a href="https://omnirealm.com" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    Plus d'apps →
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/help" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    Centre d'aide
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    CGU
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Séparateur */}
          <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                © {currentYear} OmniRealm. Tous droits réservés.
              </div>
              
              {/* Badges de confiance */}
              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>100% Sécurisé</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>RGPD Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>IA Intégrée</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}