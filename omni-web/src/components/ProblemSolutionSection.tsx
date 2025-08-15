import React from 'react';
import Image from 'next/image';

const ProblemSolutionSection= () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-10">
              Face à l'IA centralisée : Notre Alternative.
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Face à l'accélération incontrôlée de l'IA par les géants du numérique, des voix
              s'élèvent pour appeler à une pause. Ce mouvement exprime des craintes légitimes :
              perte de contrôle humain, biais systémiques, manipulation cognitive, centralisation du
              pouvoir, et destruction massive d'emplois sans transition sociale structurée.
            </p>
          </div>
        </div>{' '}
        <div className="mx-auto grid max-w-5xl items-stretch gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          {/* Problème */}{' '}
          <div className="flex flex-col justify-between space-y-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md h-full min-h-[400px]">
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold text-red-500 text-center">Le Problème</h3>
              <p className="text-gray-700 text-center dark:text-gray-300">
                L'IA centralisée pose des risques majeurs : perte de contrôle humain, biais
                systémiques, manipulation cognitive, et concentration du pouvoir. Par exemple, des
                algorithmes opaques peuvent influencer les élections ou discriminer des populations
                entières.
              </p>
            </div>
            <div className="mt-4 text-center">
              <Image
                src="/img/problem-visual.svg"
                alt="Problème IA Centralisée"
                width={128}
                height={128}
                className="mx-auto"
              />
            </div>
          </div>
          {/* Solution */}{' '}
          <div className="flex flex-col justify-between space-y-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md h-full min-h-[400px]">
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold text-green-500 text-center">
                La Solution OmniRealm
              </h3>
              <p className="text-gray-700 text-center dark:text-gray-300">
                OmniRealm propose une IA distribuée, souveraine, éthique et modulaire. Une IA au
                service des humains, pas au-dessus d'eux. Nous offrons une alternative technologique
                réaliste et nécessaire.
              </p>
            </div>
            <div className="mt-4 text-center">
              <Image
                src="/img/solution-visual.svg"
                alt="Solution OmniRealm"
                width={128}
                height={128}
                className="mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
