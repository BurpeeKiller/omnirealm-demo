import Breadcrumbs from '@/components/Breadcrumbs';
import FooterSection from '@/components/FooterSection';

export default function TermsOfUsePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-4xl mx-auto">
              <Breadcrumbs items={[{ label: "Conditions d'Utilisation" }]} />

              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-8 text-center">
                Conditions Générales d'Utilisation
              </h1>

              <div className="prose max-w-none dark:prose-invert">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-8">
                  <p className="text-lg font-medium">
                    Bienvenue sur OmniRealm. En accédant à notre site web et en utilisant nos
                    services, vous acceptez d'être lié par les présentes Conditions Générales
                    d'Utilisation (CGU). Veuillez les lire attentivement.
                  </p>
                  <p className="text-sm mt-4 text-gray-600 dark:text-gray-300">
                    <strong>Dernière mise à jour :</strong> 2 juin 2025
                  </p>
                </div>{' '}
                <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptation des CGU</h2>
                <p>
                  En utilisant le site OmniRealm, vous reconnaissez avoir lu, compris et accepté
                  d'être lié par ces CGU, ainsi que par notre{' '}
                  <a href="/privacy-policy" className="text-blue-600 hover:underline">
                    Politique de Confidentialité
                  </a>
                  . Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site.
                </p>
                <h2 className="text-2xl font-bold mt-8 mb-4">2. Objet et champ d'application</h2>
                <p>
                  OmniRealm est une plateforme dédiée au développement d'une intelligence
                  artificielle distribuée, souveraine, éthique et modulaire. Ces CGU régissent
                  l'utilisation de notre site web, de nos services et de toute interaction avec
                  notre plateforme.
                </p>
                <h2 className="text-2xl font-bold mt-8 mb-4">3. Accès au site</h2>
                <p>Nous nous efforçons d'assurer l'accès au site 24h/24, 7j/7, sauf en cas de :</p>
                <ul className="list-disc list-inside ml-6 mb-4">
                  <li>Force majeure ou événements hors de notre contrôle</li>
                  <li>Pannes techniques</li>
                  <li>Interventions de maintenance nécessaires</li>
                  <li>Mises à jour de sécurité</li>
                </ul>
                <h2 className="text-2xl font-bold mt-8 mb-4">4. Propriété intellectuelle</h2>
                <p>
                  Tous les contenus présents sur le site OmniRealm (textes, images, graphismes,
                  logos, icônes, sons, logiciels, etc.) sont la propriété exclusive d'OmniRealm ou
                  de ses partenaires et sont protégés par les lois françaises et internationales
                  relatives à la propriété intellectuelle.
                </p>
                <p>
                  Toute reproduction, représentation, modification, publication, adaptation de tout
                  ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est
                  interdite, sauf autorisation écrite préalable d'OmniRealm.
                </p>
                <h2 className="text-2xl font-bold mt-8 mb-4">5. Comportement de l'utilisateur</h2>
                <p>
                  L'utilisateur s'engage à utiliser le site de manière responsable et à ne pas :
                </p>
                <ul className="list-disc list-inside ml-6 mb-4">
                  <li>Utiliser le site à des fins illégales ou non autorisées</li>
                  <li>Porter atteinte aux droits d'OmniRealm ou de tiers</li>
                  <li>Introduire des virus informatiques ou tout autre code malveillant</li>
                  <li>Tenter d'obtenir un accès non autorisé à nos systèmes ou réseaux</li>
                  <li>Perturber le fonctionnement normal du site</li>
                  <li>Harceler, menacer ou intimider d'autres utilisateurs</li>
                </ul>
                <h2 className="text-2xl font-bold mt-8 mb-4">
                  6. Protection des données personnelles
                </h2>
                <p>
                  OmniRealm s'engage à protéger vos données personnelles conformément au RGPD et à
                  la loi Informatique et Libertés. Pour plus d'informations, consultez notre
                  <a href="/privacy-policy" className="text-blue-600 hover:underline ml-1">
                    Politique de Confidentialité
                  </a>
                  .
                </p>
                <h2 className="text-2xl font-bold mt-8 mb-4">7. Services proposés</h2>
                <p>
                  OmniRealm propose des services liés au développement d'IA distribuée, incluant
                  mais non limités à :
                </p>
                <ul className="list-disc list-inside ml-6 mb-4">
                  <li>Information et sensibilisation sur l'IA éthique</li>
                  <li>Newsletter et contenus éducatifs</li>
                  <li>Outils et ressources de développement (à venir)</li>
                  <li>Communauté et collaboration</li>
                </ul>
                <h2 className="text-2xl font-bold mt-8 mb-4">8. Limitation de responsabilité</h2>
                <p>
                  OmniRealm ne pourra être tenu responsable des dommages directs et indirects causés
                  au matériel de l'utilisateur, lors de l'accès au site, et résultant soit de
                  l'utilisation d'un matériel ne répondant pas aux spécifications techniques, soit
                  de l'apparition d'un bug ou d'une incompatibilité.
                </p>
                <p>
                  Les informations fournies sur le site le sont à titre informatif et ne constituent
                  pas des conseils professionnels.
                </p>
                <h2 className="text-2xl font-bold mt-8 mb-4">9. Liens hypertextes</h2>
                <p>
                  Le site OmniRealm peut contenir des liens hypertextes vers d'autres sites.
                  OmniRealm n'exerce aucun contrôle sur ces sites et décline toute responsabilité
                  quant à leur contenu.
                </p>
                <h2 className="text-2xl font-bold mt-8 mb-4">10. Modifications des CGU</h2>
                <p>
                  OmniRealm se réserve le droit de modifier les présentes CGU à tout moment. Les
                  modifications prendront effet dès leur publication sur le site. Il est de votre
                  responsabilité de consulter régulièrement les CGU pour prendre connaissance des
                  éventuelles modifications.
                </p>
                <p>
                  En cas de modification substantielle, nous vous en informerons par email ou par
                  une notification sur le site.
                </p>
                <h2 className="text-2xl font-bold mt-8 mb-4">
                  11. Droit applicable et juridiction compétente
                </h2>
                <p>
                  Les présentes CGU sont régies par le droit français. Tout litige en relation avec
                  l'utilisation du site OmniRealm est soumis à la compétence exclusive des tribunaux
                  de Paris.
                </p>
                <div className="mt-12 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h3 className="text-xl font-bold mb-3">Contact</h3>
                  <p className="text-sm">
                    Pour toute question concernant ces Conditions Générales d'Utilisation, vous
                    pouvez nous contacter à :
                  </p>
                  <p className="mt-2">
                    <strong>Email :</strong>{' '}
                    <a href="mailto:legal@omnirealm.com" className="text-blue-600 hover:underline">
                      legal@omnirealm.com
                    </a>
                    <br />
                    <strong>Adresse :</strong> [Adresse postale à compléter]
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
