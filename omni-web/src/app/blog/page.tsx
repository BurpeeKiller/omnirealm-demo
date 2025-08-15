import React from 'react';
import Link from 'next/link';

export default function BlogPage() {
  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8">Blog OmniRealm</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Notre blog est en cours de construction. Revenez bientôt pour découvrir nos articles sur l'IA souveraine, 
            les dernières actualités d'OmniRealm et des guides pratiques.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <p className="text-blue-800 dark:text-blue-200 font-medium">
              📧 En attendant, inscrivez-vous à notre newsletter pour recevoir nos dernières actualités !
            </p>
          </div>
          <Link 
            href="/#newsletter"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            S'inscrire à la newsletter
          </Link>
        </div>
      </div>
    </main>
  );
}