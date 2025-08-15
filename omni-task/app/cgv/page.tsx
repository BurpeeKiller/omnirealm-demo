import { Footer } from '@/components/footer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CGVPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
          <h1 className="text-3xl font-bold">Conditions Générales de Vente</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Dernière mise à jour : 13 août 2025</p>
        </div>
      </header>

      <main className="flex-1 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-8 prose prose-gray dark:prose-invert max-w-none">
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Objet</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre OmniRealm et ses clients dans le cadre de la fourniture du service OmniTask Pro.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Description du service</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                OmniTask Pro est un système de gestion de tâches augmenté par intelligence artificielle, offrant :
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>Organisation intelligente des tâches avec IA</li>
                <li>Suggestions automatiques de priorisation</li>
                <li>Conversion voix vers tâche</li>
                <li>Intégration avec vos outils favoris</li>
                <li>Analyse de productivité avancée</li>
                <li>Templates intelligents personnalisés</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Offres et tarification</h2>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-4">
                <h3 className="text-xl font-medium mb-3">3.1 Version gratuite</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>3 projets maximum</li>
                  <li>100 tâches actives</li>
                  <li>Fonctionnalités de base</li>
                  <li>Sans engagement</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-4">
                <h3 className="text-xl font-medium mb-3">3.2 OmniTask Pro - 99€/mois HT</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Projets et tâches illimités</li>
                  <li>IA avancée pour priorisation et suggestions</li>
                  <li>Conversion voix vers tâche</li>
                  <li>Intégrations premium (Slack, Teams, etc.)</li>
                  <li>Analytics et rapports détaillés</li>
                  <li>API complète</li>
                  <li>Support prioritaire 24/7</li>
                  <li>Essai gratuit de 14 jours</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Modalités de paiement</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Le paiement s'effectue mensuellement par carte bancaire via notre prestataire sécurisé Stripe. Le prélèvement intervient à la date anniversaire de souscription.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Les prix sont exprimés hors taxes (HT). La TVA applicable sera ajoutée selon la législation en vigueur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Période d'essai</h2>
              <p className="text-gray-700 dark:text-gray-300">
                L'offre Pro inclut une période d'essai gratuite de 14 jours avec accès complet à toutes les fonctionnalités. Aucun paiement n'est requis pendant cette période. L'abonnement payant démarre automatiquement à la fin de la période d'essai sauf résiliation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Durée et résiliation</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                L'abonnement est conclu pour une durée d'un mois, renouvelable par tacite reconduction. Le client peut résilier à tout moment depuis son espace personnel ou en contactant le support. La résiliation prend effet à la fin de la période en cours.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Les données restent accessibles pendant 30 jours après résiliation pour permettre leur export.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Droit de rétractation</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Pour les consommateurs, conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux services numériques dont l'exécution a commencé avec votre accord exprès et renoncement au droit de rétractation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Disponibilité du service</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                OmniRealm s'engage à fournir un taux de disponibilité de 99.9% calculé mensuellement. En cas d'interruption de service supérieure à 8 heures consécutives, un crédit au prorata sera accordé sur la facture suivante.
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>SLA (Service Level Agreement)</strong><br />
                  - Disponibilité garantie : 99.9%<br />
                  - Temps de réponse support Pro : &lt; 2 heures<br />
                  - Maintenance planifiée : notification 48h à l'avance
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Limitations d'usage</h2>
              <h3 className="text-xl font-medium mb-3">9.1 Usage équitable</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Bien que l'offre Pro propose un usage "illimité", un usage raisonnable est attendu :
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>Maximum 100 000 tâches actives simultanément</li>
                <li>Limite de 1000 requêtes API par heure</li>
                <li>Stockage maximal de 50 GB de pièces jointes</li>
              </ul>

              <h3 className="text-xl font-medium mb-3">9.2 Contenu autorisé</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Le service ne doit pas être utilisé pour stocker ou gérer du contenu illégal, diffamatoire, ou portant atteinte aux droits de tiers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Propriété intellectuelle</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Le client conserve tous les droits sur ses données, tâches et contenus. OmniRealm dispose d'une licence limitée pour traiter ces données aux fins de fourniture du service.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Les suggestions générées par l'IA restent la propriété du client. OmniRealm peut utiliser des données anonymisées pour améliorer ses algorithmes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Protection des données</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Les données sont hébergées en France et traitées conformément au RGPD. Chiffrement AES-256 au repos et TLS 1.3 en transit. Voir notre <Link href="/privacy" className="text-blue-600 hover:underline">Politique de Confidentialité</Link> pour plus de détails.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Responsabilité</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                OmniRealm met tout en œuvre pour fournir un service de qualité mais ne peut garantir :
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>L'exactitude absolue des suggestions IA</li>
                <li>La compatibilité avec tous les systèmes tiers</li>
                <li>L'absence totale d'interruptions</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">
                La responsabilité d'OmniRealm est limitée au montant des 3 derniers mois d'abonnement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">13. Support technique</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Version gratuite</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300">
                    <li>Support par email : 72h</li>
                    <li>Base de connaissances</li>
                    <li>Forum communautaire</li>
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Version Pro</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300">
                    <li>Support prioritaire : 2h</li>
                    <li>Chat en direct</li>
                    <li>Appels vidéo sur RDV</li>
                    <li>Formation personnalisée</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">14. Modification des CGV</h2>
              <p className="text-gray-700 dark:text-gray-300">
                OmniRealm se réserve le droit de modifier les présentes CGV avec un préavis de 30 jours par email. L'utilisation continue du service après modification vaut acceptation des nouvelles conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">15. Loi applicable et juridiction</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Les présentes CGV sont soumises au droit français. Tout litige sera soumis aux tribunaux compétents de Paris, après tentative de résolution amiable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">16. Contact</h2>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  Pour toute question relative aux CGV :<br />
                  <strong>Service Commercial</strong><br />
                  Email : sales@omnirealm.com<br />
                  Téléphone : +33 1 23 45 67 89<br />
                  Adresse : [À compléter avec l'adresse de l'entreprise]<br />
                  <br />
                  <strong>Support Technique</strong><br />
                  Email : support@omnirealm.com<br />
                  Chat : Disponible dans l'application
                </p>
              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}