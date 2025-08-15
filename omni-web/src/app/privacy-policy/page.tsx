import Breadcrumbs from '@/components/Breadcrumbs';
import FooterSection from '@/components/FooterSection';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-4xl mx-auto">
              <Breadcrumbs items={[{ label: 'Politique de Confidentialité' }]} />

              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-8 text-center">
                Politique de Confidentialité
              </h1>

              <div className="prose max-w-none dark:prose-invert">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-8">
                  <p className="text-lg font-medium">
                    OmniRealm s'engage à protéger votre vie privée et à traiter vos données
                    personnelles de manière transparente et sécurisée, conformément au RGPD.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                    <strong>Dernière mise à jour :</strong> 2 juin 2025
                  </p>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">1. Responsable du traitement</h2>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
                  <p>
                    <strong>Dénomination :</strong> OmniRealm
                  </p>
                  <p>
                    <strong>Email de contact :</strong> privacy@omnirealm.com
                  </p>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">2. Vos droits</h2>
                <p>
                  Conformément au RGPD, vous disposez de droits sur vos données personnelles. Pour
                  les exercer, contactez-nous à :
                  <a
                    href="mailto:privacy@omnirealm.com"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    privacy@omnirealm.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
}
