'use client';

import { useOmniScanSocialProofTest, useABTestContext } from './ABTestProvider';

export function ABOptimizedSocialProof() {
  const socialProofTest = useOmniScanSocialProofTest();
  const { trackConversion } = useABTestContext();

  const config = socialProofTest?.config || { showTestimonials: false, showStats: false };

  // Don't render anything for control (no social proof)
  if (!config.showTestimonials && !config.showStats) {
    return null;
  }

  if (socialProofTest?.isLoading) {
    return <div className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>;
  }

  const handleSocialProofView = () => {
    trackConversion('omniscan_social_proof', 'social_proof_view');
  };

  return (
    <section className="px-4 py-16 bg-white dark:bg-gray-800" onLoad={handleSocialProofView}>
      <div className="container mx-auto max-w-6xl">
        {/* Stats Variant */}
        {config.showStats && (
          <div className="text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-8">
              Ils nous font déjà confiance
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                  {config.stats.users}
                </div>
                <p className="text-gray-600 dark:text-gray-300">Utilisateurs actifs</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                  {config.stats.documents}
                </div>
                <p className="text-gray-600 dark:text-gray-300">Documents traités</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                  {config.stats.satisfaction}
                </div>
                <p className="text-gray-600 dark:text-gray-300">Satisfaction client</p>
              </div>
            </div>
          </div>
        )}

        {/* Testimonials Variant */}
        {config.showTestimonials && (
          <div className="text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-12">
              Ce que disent nos clients
            </h2>
            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              {config.testimonials?.map((testimonial: any, index: number) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    {/* Star rating */}
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="h-5 w-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
                    "{testimonial.text}"
                  </p>
                  <div className="text-sm">
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}