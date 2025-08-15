'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 px-4 lg:px-6 h-16 flex items-center backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50">
      <Link href="/" className="flex items-center space-x-3 group" prefetch={true}>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          <Image
            src="/img/logo_pasdefond.png"
            alt="Omnirealm Logo"
            width={40}
            height={40}
            className="relative h-10 w-10 rounded-lg shadow-md transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <span className="font-display font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight" style={{ letterSpacing: '-0.02em' }}>
          OmniRealm
        </span>
      </Link>
      {/* Navigation Desktop */}
      <nav className="ml-auto hidden md:flex items-center gap-8">
        {/* Dropdown Produits */}
        <div className="relative group">
          <button className="relative text-base font-display font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 tracking-tight flex items-center gap-1">
            <span>Produits</span>
            <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
          </button>
          
          {/* Dropdown Menu */}
          <div className="absolute left-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left scale-95 group-hover:scale-100">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* OmniScan */}
              <a
                href="https://scan.omnirealm.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group/item"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400">OmniScan</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">OCR intelligent avec IA</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">Live</span>
                </div>
              </a>
              
              {/* OmniTask */}
              <a
                href="https://task.omnirealm.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group/item"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-emerald-600 dark:text-emerald-400">OmniTask</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Gestion de tâches IA</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full">Beta</span>
                </div>
              </a>
              
              {/* OmniFit */}
              <a
                href="https://fit.omnirealm.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group/item"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-purple-600 dark:text-purple-400">OmniFit</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Coach fitness IA</p>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-1 rounded-full">Alpha</span>
                </div>
              </a>
              
              <div className="border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="/#produits"
                  className="block px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center font-medium"
                >
                  Voir tous les produits →
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <Link
          href="/about"
          className="relative text-base font-display font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 group tracking-tight"
          prefetch={true}
        >
          <span>Manifeste</span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
        </Link>
        <Link
          href="/contact"
          className="relative text-base font-display font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 group tracking-tight"
          prefetch={true}
        >
          <span>Contact</span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
        </Link>
        <Link
          href="/#newsletter"
          className="ml-4 inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 text-sm font-display font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 tracking-tight"
          prefetch={true}
        >
          S'abonner
        </Link>
      </nav>{' '}
      {/* Bouton hamburger pour mobile */}{' '}
      <button
        className="ml-auto md:hidden flex flex-col items-center justify-center w-8 h-8"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
        aria-expanded={!!isMobileMenuOpen}
      >
        <span
          className={`w-6 h-0.5 bg-current transition-all duration-300 ${
            isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
          }`}
        ></span>
        <span
          className={`w-6 h-0.5 bg-current transition-all duration-300 mt-1 ${
            isMobileMenuOpen ? 'opacity-0' : ''
          }`}
        ></span>
        <span
          className={`w-6 h-0.5 bg-current transition-all duration-300 mt-1 ${
            isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
          }`}
        ></span>
      </button>
      {/* Menu mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        >
          <nav
            className="fixed top-16 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 shadow-xl z-50 py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-2 px-6">
              {/* Section Produits */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-2">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-4">Nos Produits</h3>
                
                <a
                  href="https://scan.omnirealm.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-lg font-display font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  onClick={closeMobileMenu}
                >
                  <div>
                    <span className="text-blue-600 dark:text-blue-400">OmniScan</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">OCR intelligent</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">Live</span>
                </a>
                
                <a
                  href="https://task.omnirealm.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-lg font-display font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  onClick={closeMobileMenu}
                >
                  <div>
                    <span className="text-emerald-600 dark:text-emerald-400">OmniTask</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Gestion de tâches</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full">Beta</span>
                </a>
                
                <a
                  href="https://fit.omnirealm.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-lg font-display font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  onClick={closeMobileMenu}
                >
                  <div>
                    <span className="text-purple-600 dark:text-purple-400">OmniFit</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Coach fitness</p>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-1 rounded-full">Alpha</span>
                </a>
              </div>
              
              <Link
                href="/about"
                className="text-lg font-display font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 tracking-tight"
                prefetch={true}
                onClick={closeMobileMenu}
              >
                Manifeste
              </Link>
              <Link
                href="/contact"
                className="text-lg font-display font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 tracking-tight"
                prefetch={true}
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
              <Link
                href="/#newsletter"
                className="mt-4 inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 text-base font-display font-semibold text-white shadow-md transition-all duration-300 tracking-tight"
                prefetch={true}
                onClick={closeMobileMenu}
              >
                S'abonner à la Newsletter
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
