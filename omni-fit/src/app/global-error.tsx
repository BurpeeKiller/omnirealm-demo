"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("Global error caught:", error);

  return (
    <html>
      <body className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-4xl font-bold mb-4">Oops!</h1>
          <h2 className="text-xl font-semibold mb-4">Une erreur est survenue</h2>
          <p className="text-gray-400 mb-6">
            Une erreur inattendue s'est produite. Nous nous excusons pour la gêne occasionnée.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => reset()}
              className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-lg transition-colors"
            >
              Réessayer
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
          {process.env.NODE_ENV === "development" && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500">
                Détails de l'erreur (dev)
              </summary>
              <pre className="mt-2 text-xs bg-gray-800 p-3 rounded overflow-auto">
                {error.message}
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      </body>
    </html>
  );
}
