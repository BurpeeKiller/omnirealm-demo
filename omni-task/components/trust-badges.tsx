export function TrustBadges() {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {/* Utilisateurs */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">10K+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Utilisateurs actifs</div>
          </div>
          
          {/* Tâches gérées */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">500K+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Tâches gérées</div>
          </div>
          
          {/* Satisfaction */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">4.9/5</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Note moyenne</div>
          </div>
          
          {/* Uptime */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">99.9%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Disponibilité</div>
          </div>
        </div>
      </div>
    </section>
  )
}