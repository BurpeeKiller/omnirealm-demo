import React from 'react';

const SocialShareSection= () => {
  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-gray-900 dark:text-white mb-6" style={{ letterSpacing: '-0.02em' }}>
          Partagez notre vision
        </h2>
        <p className="text-lg font-display text-gray-700 dark:text-gray-300 mb-8 tracking-tight">
          Aidez-nous à diffuser notre message en partageant sur vos réseaux sociaux.
        </p>{' '}
        <div className="flex justify-center space-x-4">
          {/* Icône de partage X (Twitter) */}
          <a
            href="https://twitter.com/intent/tweet?text=Découvrez%20OmniRealm%20-%20Une%20IA%20distribuée,%20souveraine%20et%20éthique&url=https://www.omnirealm.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300"
            aria-label="Partager sur X (Twitter)"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SocialShareSection;
