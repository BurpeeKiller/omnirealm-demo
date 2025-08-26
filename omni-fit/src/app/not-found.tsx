import Link from "next/link";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page non trouvée</h2>
        <p className="text-gray-400 mb-8">
          Désolé, nous n'avons pas trouvé la page que vous recherchez.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-lg transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
