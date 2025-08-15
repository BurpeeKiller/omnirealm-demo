import React from 'react';
import MetricCard from './MetricCard';

const EngagementsSection= () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Nos Fondations : Transparence, Souveraineté, Modularité.
            </h2>{' '}
            <p className="mx-auto max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Nos engagements concrets pour une IA au service de l'humanité.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Engagement 1: Transparence et Flexibilité */}
          <div className="grid gap-1 p-4 rounded-lg shadow-md bg-white dark:bg-gray-900">
            <div className="flex items-center space-x-2">
              <svg
                className="h-6 w-6 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
              <h3 className="text-xl font-bold">Transparence & Flexibilité</h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Architecture ouverte, auditable, modulaire. Aucune dépendance à un modèle fermé
              unique. Interopérabilité totale.
            </p>
          </div>
          {/* Engagement 2: Souveraineté Utilisateur */}
          <div className="grid gap-1 p-4 rounded-lg shadow-md bg-white dark:bg-gray-900">
            <div className="flex items-center space-x-2">
              <svg
                className="h-6 w-6 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
              <h3 className="text-xl font-bold">Souveraineté Utilisateur</h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Vos données restent les vôtres. Pas de vol de données, pas de profilage caché.
              Contrôle total sur vos informations.
            </p>
          </div>
          {/* Engagement 3: Intelligence Augmentée */}
          <div className="grid gap-1 p-4 rounded-lg shadow-md bg-white dark:bg-gray-900">
            <div className="flex items-center space-x-2">
              <svg
                className="h-6 w-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
              <h3 className="text-xl font-bold">Intelligence Augmentée</h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Agents IA spécialisés, activables et désactivables à volonté. Système inspiré du
              vivant (Swarm IA, intelligence collective).
            </p>
          </div>{' '}
          {/* Engagement 4: Évolution Collaborative */}
          <div className="grid gap-1 p-4 rounded-lg shadow-md bg-white dark:bg-gray-900">
            <div className="flex items-center space-x-2">
              <svg
                className="h-6 w-6 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
              <h3 className="text-xl font-bold">Évolution Collaborative</h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Intégration du feedback utilisateur dans l'évolution des modules. Une IA qui apprend
              et s'améliore avec vous.
            </p>
          </div>
        </div>

        {/* Section Métriques et Indicateurs */}
        <div className="mx-auto max-w-5xl py-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Notre Impact en Chiffres
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Des objectifs concrets pour une IA vraiment éthique
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <MetricCard value="100%" label="Open Source" color="blue" />
            <MetricCard value="0" label="Données Vendues" color="green" />
            <MetricCard value="+50" label="Modules IA" color="purple" />
            <MetricCard value="∞" label="Possibilités" color="orange" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EngagementsSection;
