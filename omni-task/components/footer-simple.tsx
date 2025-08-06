'use client'

export function FooterSimple() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div>
            © {currentYear} OmniRealm - OmniTask
          </div>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
            <a href="/help" className="hover:text-gray-900 dark:hover:text-white">
              Aide
            </a>
            <span>•</span>
            <a href="/privacy" className="hover:text-gray-900 dark:hover:text-white">
              Confidentialité
            </a>
            <span>•</span>
            <a href="https://omnirealm.com" className="hover:text-gray-900 dark:hover:text-white">
              Écosystème OmniRealm
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}