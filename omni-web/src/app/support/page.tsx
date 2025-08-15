import React from 'react';
import Link from 'next/link';

export default function SupportPage() {
  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Centre d'Aide OmniRealm</h1>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Comment pouvons-nous vous aider ?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Notre équipe est là pour vous accompagner dans votre utilisation des solutions OmniRealm.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-3">📧 Support par Email</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Pour toute question technique ou commerciale
                </p>
                <a href="mailto:support@omnirealm.com" className="text-blue-600 hover:text-blue-700 font-medium">
                  support@omnirealm.com
                </a>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-3">💬 Contact Direct</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Utilisez notre formulaire de contact
                </p>
                <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
                  Accéder au formulaire
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Questions Fréquentes</h2>
            
            <div className="space-y-4">
              <details className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <summary className="font-semibold cursor-pointer">Qu'est-ce qu'OmniRealm ?</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">
                  OmniRealm est une suite d'applications IA souveraines conçues pour augmenter votre productivité 
                  tout en respectant votre vie privée. Nos solutions incluent OmniScan (OCR intelligent), 
                  OmniTask (gestion de tâches IA) et OmniFit (coach fitness personnel).
                </p>
              </details>
              
              <details className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <summary className="font-semibold cursor-pointer">Comment démarrer avec OmniRealm ?</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">
                  Chaque application OmniRealm offre un essai gratuit. Inscrivez-vous simplement sur l'application 
                  de votre choix et suivez le guide d'onboarding. Aucune carte de crédit n'est requise pour l'essai.
                </p>
              </details>
              
              <details className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <summary className="font-semibold cursor-pointer">Mes données sont-elles sécurisées ?</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">
                  Absolument. Nous utilisons un chiffrement de bout en bout et vos données sont stockées sur des 
                  serveurs européens. Nous ne vendons jamais vos données et respectons strictement le RGPD.
                </p>
              </details>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Vous ne trouvez pas la réponse à votre question ?
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Contactez-nous
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}