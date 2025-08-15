import React from 'react';
import Link from 'next/link';
import FooterSection from '@/components/FooterSection';
import Breadcrumbs from '@/components/Breadcrumbs';

const AboutPage= () => {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {' '}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-4xl mx-auto">
              <Breadcrumbs items={[{ label: 'Manifeste' }]} />
              <h1 className="text-center mb-4">
                <span className="block text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Notre Manifeste
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 text-center mb-16 font-light leading-relaxed">
                Réaction à la Pause IA et vision d'une alternative souveraine
              </p>

              {/* Contexte */}
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 flex items-center">
                  <span className="text-4xl mr-3">🔍</span>
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Contexte : la question de la pause IA</span>
                </h2>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  Face à l'accélération incontrôlée de l'IA par les géants du numérique, des voix
                  s'élèvent pour appeler à une pause. Ce mouvement exprime des craintes légitimes :
                  perte de contrôle humain, biais systémiques, manipulation cognitive,
                  centralisation du pouvoir, et destruction massive d'emplois sans transition
                  sociale structurée.
                </p>
              </div>

              {/* Position */}
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 flex items-center">
                  <span className="text-4xl mr-3">🧠</span>
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Position d'OmniRealm</span>
                </h2>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  Nous ne croyons pas à une pause globale – car elle est irréaliste. Mais nous
                  croyons profondément à la nécessité d'une
                  <strong className="text-blue-600 dark:text-blue-400">
                    {' '}
                    alternance technologique
                  </strong>
                  . OmniRealm propose un chemin : une IA distribuée, souveraine, éthique et
                  modulaire. Une IA au service des humains, pas au-dessus d'eux.
                </p>
              </div>

              {/* Engagements */}
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 flex items-center">
                  <span className="text-4xl mr-3">🛠️</span>
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Nos engagements concrets</span>
                </h2>
                <ul className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 text-2xl">✓</span>
                    Architecture ouverte, auditable, modulaire
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 text-2xl">✓</span>
                    Aucune dépendance à un modèle fermé unique
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 text-2xl">✓</span>
                    Souveraineté des utilisateurs : pas de vol de données, pas de profilage caché
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 text-2xl">✓</span>
                    Interopérabilité, flexibilité, transparence
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 text-2xl">✓</span>
                    Agents IA spécialisés, activables et désactivables à volonté
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 text-2xl">✓</span>
                    Système inspiré du vivant (Swarm IA, intelligence collective)
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 text-2xl">✓</span>
                    Intégration du feedback utilisateur dans l'évolution des modules
                  </li>
                </ul>
              </div>

              {/* Ce que nous construisons */}
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center">
                  <span className="text-4xl mr-3">🚀</span>
                  <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Ce que nous construisons avec OmniRealm</span>
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 border-2 border-gray-200 rounded-2xl dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <h3 className="text-xl font-bold mb-3">Des assistants IA utiles</h3>
                    <p className="text-base text-gray-600 dark:text-gray-400">
                      Contextuels, éthiques et respectueux de votre vie privée
                    </p>
                  </div>
                  <div className="p-6 border-2 border-gray-200 rounded-2xl dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <h3 className="text-xl font-bold mb-3">Outils de productivité</h3>
                    <p className="text-base text-gray-600 dark:text-gray-400">
                      Narration augmentée et collaboration intelligente
                    </p>
                  </div>
                  <div className="p-6 border-2 border-gray-200 rounded-2xl dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <h3 className="text-xl font-bold mb-3">IA-forge de projets</h3>
                    <p className="text-base text-gray-600 dark:text-gray-400">
                      Souverains, utiles, clonables et modulaires
                    </p>
                  </div>
                  <div className="p-6 border-2 border-gray-200 rounded-2xl dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <h3 className="text-xl font-bold mb-3">Contre-pouvoir modulaire</h3>
                    <p className="text-base text-gray-600 dark:text-gray-400">
                      Alternative aux IA massives et opaques
                    </p>
                  </div>
                </div>
              </div>

              {/* Appel */}
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 p-12 rounded-3xl text-center shadow-xl">
                <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl"></div>
                <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl"></div>
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center">
                    <span className="text-5xl mr-3">📣</span>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Notre Appel</span>
                  </h2>
                  <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 max-w-3xl mx-auto">
                    Ce n'est pas le moment de s'arrêter. C'est le moment de bifurquer intelligemment.
                    Nous appelons tous les bâtisseurs, les rêveurs, les codeurs, les résistants
                    numériques à rejoindre ce mouvement. Construisons une IA qui libère au lieu de
                    contrôler.
                  </p>
                  <p className="text-3xl md:text-4xl font-extrabold mb-8">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">Bienvenue dans OmniRealm.</span>
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                    <Link
                      href="/#newsletter"
                      className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-10 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
                    >
                      <span className="relative z-10">Rejoindre le Mouvement</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </Link>
                    <Link
                      href="/#produits"
                      className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full border-2 border-purple-600/50 bg-white/50 dark:bg-black/20 backdrop-blur-sm px-10 text-base font-semibold text-purple-700 dark:text-purple-300 shadow-lg transition-all duration-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-600 hover:shadow-2xl hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
                    >
                      Découvrir nos Solutions
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
};

export default AboutPage;
