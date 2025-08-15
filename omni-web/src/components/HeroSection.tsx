'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const HeroSection= () => {
  const [videoError, setVideoError] = useState(false);

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 relative">
      {/* Vidéo d'arrière-plan avec fallback */}
      {!videoError ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/img/logo_pasdefond.png"
          className="absolute inset-0 w-full h-full object-cover z-0"
          onError={() => setVideoError(true)}
        >
          <source src="/img/hero.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la vidéo HTML5.
        </video>
      ) : (
        // Fallback si la vidéo ne charge pas
        <div className="absolute inset-0 w-full h-full z-0 bg-gradient-to-br from-blue-500 via-purple-500 to-purple-700" />
      )}
      {/* Overlay sombre pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-black/30 z-5" /> {/* Contenu principal */}
      <div className="container px-4 md:px-6 text-center mx-auto relative z-10">
        <h1 className="text-white opacity-0 animate-fade-in-up">
          <span className="block text-5xl md:text-6xl lg:text-8xl font-display font-bold" style={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
            OmniRealm.
          </span>
          <span className="block text-3xl md:text-4xl lg:text-5xl font-display font-light mt-2 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent" style={{ letterSpacing: '-0.02em' }}>
            L'intelligence devient territoire.
          </span>
        </h1>
        <p className="mx-auto max-w-[800px] text-gray-100 text-lg md:text-xl lg:text-2xl mt-6 font-display font-light leading-relaxed opacity-0 animate-fade-in-up animation-delay-300 tracking-tight">
          Construisons une IA distribuée, souveraine, éthique et modulaire qui libère au lieu de
          contrôler.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 opacity-0 animate-fade-in-up animation-delay-600">
          <Link
            href="#newsletter"
            className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-10 text-base font-display font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent tracking-tight"
            prefetch={true}
          >
            <span className="relative z-10">Rejoindre le Mouvement</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>
          <Link
            href="#produits"
            className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm px-10 text-base font-display font-semibold text-white shadow-lg transition-all duration-300 hover:bg-white/20 hover:border-white/50 hover:shadow-2xl hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent tracking-tight"
            prefetch={true}
          >
            Découvrir nos Solutions
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
