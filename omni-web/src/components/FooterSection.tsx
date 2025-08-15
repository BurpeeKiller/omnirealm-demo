import React from 'react';
import Link from 'next/link';

const FooterSection= () => {
  return (
    <footer className="w-full bg-gray-50 dark:bg-gray-900 border-t">
      {/* Section principale du footer */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Colonne 1: Manifeste */}
          <div>
            <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">OmniRealm</h3>
            <p className="text-sm font-display text-gray-600 dark:text-gray-400 mb-4 tracking-tight">
              Construisons une IA distribuée, souveraine, éthique et modulaire qui libère au lieu de
              contrôler.
            </p>
            <div className="flex gap-3">
              <a
                href="mailto:contact@omnirealm.tech"
                aria-label="Email"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </a>
              <a
                href="https://twitter.com/omnirealm_tech" // URL Twitter simulée
                aria-label="Twitter"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.417-4.293 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012 10.77a4.096 4.096 0 003.29 4.027 4.115 4.115 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.844" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/omnirealm" // URL LinkedIn simulée
                aria-label="LinkedIn"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Colonne 2: Produits */}
          <div>
            <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">Produits</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#produits"
                  className="font-display text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 tracking-tight"
                  prefetch={true}
                >
                  OmniScan
                </Link>
              </li>
              <li>
                <Link
                  href="#produits"
                  className="font-display text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 tracking-tight"
                  prefetch={true}
                >
                  OmniTask
                </Link>
              </li>{' '}
              <li>
                <Link
                  href="#produits"
                  className="font-display text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 tracking-tight"
                  prefetch={true}
                >
                  OmniFit
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3: Communauté */}
          <div>
            <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">Communauté</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#newsletter"
                  className="font-display text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 tracking-tight"
                  prefetch={true}
                >
                  Newsletter
                </Link>
              </li>
              <li>
                <Link
                  href="/#newsletter"
                  className="font-display text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 tracking-tight"
                  prefetch={true}
                >
                  Rejoindre
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="font-display text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 tracking-tight"
                  prefetch={true}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4: Ressources */}
          <div>
            <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">Ressources</h3>{' '}
            <ul className="space-y-2 text-sm">
              <li>
                {' '}
                <Link
                  href="/about"
                  className="font-display text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 tracking-tight"
                  prefetch={true}
                >
                  Manifeste
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="font-display text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 tracking-tight"
                  prefetch={true}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="font-display text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 tracking-tight"
                  prefetch={true}
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section copyright */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <p className="font-display tracking-tight">&copy; 2025 OmniRealm. Tous droits réservés.</p>
            <div className="flex gap-4 mt-2 sm:mt-0">
              <Link href="/legal-mentions" className="font-display hover:text-gray-900 dark:hover:text-gray-50 tracking-tight">
                Mentions Légales
              </Link>
              <Link href="/privacy-policy" className="font-display hover:text-gray-900 dark:hover:text-gray-50 tracking-tight">
                Confidentialité
              </Link>
              <Link href="/terms-of-use" className="font-display hover:text-gray-900 dark:hover:text-gray-50 tracking-tight">
                CGU
              </Link>
              <Link href="/terms-of-sale" className="font-display hover:text-gray-900 dark:hover:text-gray-50 tracking-tight">
                CGV
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
