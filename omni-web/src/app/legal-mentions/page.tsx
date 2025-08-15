import Breadcrumbs from '@/components/Breadcrumbs';
import FooterSection from '@/components/FooterSection';

export default function LegalMentionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-4xl mx-auto">
              <Breadcrumbs items={[{ label: 'Mentions Légales' }]} />

              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-8 text-center">
                Mentions Légales
              </h1>

              <div className="prose max-w-none dark:prose-invert">
                <p className="text-lg mb-8">
                  Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la
                  confiance en l'économie numérique, il est précisé aux utilisateurs du site
                  OmniRealm l'identité des différents intervenants dans le cadre de sa réalisation
                  et de son suivi :
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">Éditeur du site</h2>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
                  <p>
                    <strong>Dénomination sociale :</strong> OmniRealm
                  </p>
                  <p>
                    <strong>Forme juridique :</strong> [À définir - SAS, SASU, etc.]
                  </p>
                  <p>
                    <strong>Adresse du siège social :</strong> [Adresse à compléter]
                  </p>
                  <p>
                    <strong>Email :</strong> contact@omnirealm.com
                  </p>
                  <p>
                    <strong>Directeur de la publication :</strong> [Nom du directeur]
                  </p>
                  <p>
                    <strong>Numéro d'immatriculation :</strong> [RCS à compléter]
                  </p>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">Hébergement</h2>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
                  <p>
                    <strong>Hébergeur :</strong> Vercel Inc.
                  </p>
                  <p>
                    <strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis
                  </p>
                  <p>
                    <strong>Site web :</strong>{' '}
                    <a href="https://vercel.com" className="text-blue-600 hover:underline">
                      vercel.com
                    </a>
                  </p>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">Propriété intellectuelle</h2>
                <p>
                  L'ensemble de ce site relève de la législation française et internationale sur le
                  droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction
                  sont réservés, y compris pour les documents téléchargeables et les représentations
                  iconographiques et photographiques.
                </p>
                <p>
                  La reproduction de tout ou partie de ce site sur un support électronique quel
                  qu'il soit est formellement interdite sauf autorisation expresse du directeur de
                  la publication.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  Protection des données personnelles
                </h2>
                <p>
                  Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi
                  Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de
                  suppression et d'opposition aux données personnelles vous concernant.
                </p>
                <p>
                  Pour exercer ces droits, vous pouvez nous contacter à l'adresse :{' '}
                  <strong>privacy@omnirealm.com</strong>
                </p>
                <p>
                  Pour plus d'informations sur notre politique de confidentialité, consultez notre
                  <a href="/privacy-policy" className="text-blue-600 hover:underline ml-1">
                    Politique de Confidentialité
                  </a>
                  .
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">Cookies</h2>
                <p>
                  Ce site utilise des cookies pour améliorer l'expérience utilisateur et analyser le
                  trafic. En continuant à naviguer sur ce site, vous acceptez l'utilisation de
                  cookies conformément à notre politique de cookies.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">Limitation de responsabilité</h2>
                <p>
                  Les informations contenues sur ce site sont aussi précises que possible et le site
                  remis à jour à différentes périodes de l'année, mais peut toutefois contenir des
                  inexactitudes ou des omissions.
                </p>
                <p>
                  Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement,
                  merci de bien vouloir le signaler par email, à l'adresse contact@omnirealm.com, en
                  décrivant le problème de la manière la plus précise possible.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  Droit applicable et attribution de juridiction
                </h2>
                <p>
                  Tout litige en relation avec l'utilisation du site omnirealm.com est soumis au
                  droit français. Il est fait attribution exclusive de juridiction aux tribunaux
                  compétents de Paris.
                </p>

                <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Dernière mise à jour :</strong> 2 juin 2025
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    Pour toute question concernant ces mentions légales, vous pouvez nous contacter
                    à :
                    <a
                      href="mailto:legal@omnirealm.com"
                      className="text-blue-600 hover:underline ml-1"
                    >
                      legal@omnirealm.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
}
