import { Footer } from '@/components/footer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
          <h1 className="text-3xl font-bold">Politique de Confidentialité</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </header>

      <main className="flex-1 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-8 prose prose-gray dark:prose-invert max-w-none">
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                OmniTask, service de l'écosystème OmniRealm, s'engage à protéger la confidentialité et les données personnelles de ses utilisateurs. 
                Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos informations personnelles 
                conformément au Règlement Général sur la Protection des Données (RGPD) et aux lois applicables.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Responsable du traitement</h2>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>OmniRealm SAS</strong><br />
                  123 Avenue de l'Innovation<br />
                  75001 Paris, France<br />
                  Email : privacy@omnirealm.com<br />
                  Téléphone : +33 1 23 45 67 89
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Données collectées</h2>
              <h3 className="text-xl font-medium mb-3">3.1 Données fournies directement</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>Informations de compte : nom, email, mot de passe (chiffré)</li>
                <li>Données de profil : photo, préférences, fuseau horaire</li>
                <li>Contenu créé : tâches, projets, notes, fichiers joints</li>
                <li>Communications : messages de support, feedback</li>
              </ul>

              <h3 className="text-xl font-medium mb-3">3.2 Données collectées automatiquement</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>Données de connexion : adresse IP, type de navigateur, système d'exploitation</li>
                <li>Données d'utilisation : pages visitées, fonctionnalités utilisées, durée des sessions</li>
                <li>Cookies et technologies similaires (voir section 7)</li>
                <li>Données de performance : temps de chargement, erreurs</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Finalités du traitement</h2>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium">Fourniture du service</h3>
                  <p className="text-gray-700 dark:text-gray-300">Gérer votre compte, synchroniser vos tâches, fournir les fonctionnalités d'IA</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-medium">Amélioration continue</h3>
                  <p className="text-gray-700 dark:text-gray-300">Analyser l'utilisation, optimiser les performances, développer de nouvelles fonctionnalités</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-medium">Communication</h3>
                  <p className="text-gray-700 dark:text-gray-300">Support client, notifications importantes, newsletters (avec consentement)</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-medium">Sécurité et conformité</h3>
                  <p className="text-gray-700 dark:text-gray-300">Prévenir la fraude, respecter nos obligations légales</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Base légale du traitement</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Traitement</th>
                    <th className="text-left py-2">Base légale</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr className="border-b">
                    <td className="py-2">Création et gestion de compte</td>
                    <td className="py-2">Exécution du contrat</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Envoi de newsletters</td>
                    <td className="py-2">Consentement</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Amélioration du service</td>
                    <td className="py-2">Intérêt légitime</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Conformité légale</td>
                    <td className="py-2">Obligation légale</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Partage des données</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos données uniquement avec :
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li><strong>Fournisseurs de services</strong> : hébergement (AWS), emails (SendGrid), paiements (Stripe)</li>
                <li><strong>Écosystème OmniRealm</strong> : intégration avec d'autres apps (avec votre consentement)</li>
                <li><strong>Autorités légales</strong> : si requis par la loi ou ordonnance judiciaire</li>
                <li><strong>Successeurs</strong> : en cas de fusion, acquisition ou vente d'actifs</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Cookies et technologies similaires</h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                <h3 className="font-medium mb-2">Types de cookies utilisés :</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li><strong>Essentiels</strong> : authentification, sécurité, préférences</li>
                  <li><strong>Performance</strong> : analytics, temps de chargement</li>
                  <li><strong>Fonctionnalité</strong> : langue, thème, personnalisation</li>
                  <li><strong>Marketing</strong> : uniquement avec votre consentement</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Vos droits RGPD</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">✓ Droit d'accès</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Obtenir une copie de vos données personnelles</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">✓ Droit de rectification</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Corriger des données inexactes ou incomplètes</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">✓ Droit à l'effacement</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Supprimer vos données dans certaines conditions</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">✓ Droit à la portabilité</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Recevoir vos données dans un format structuré</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">✓ Droit d'opposition</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">S'opposer à certains traitements</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">✓ Droit de limitation</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Limiter le traitement de vos données</p>
                </div>
              </div>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                Pour exercer vos droits, contactez-nous à : <a href="mailto:privacy@omnirealm.com" className="text-blue-600 hover:underline">privacy@omnirealm.com</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Sécurité des données</h2>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Mesures de sécurité :</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Chiffrement des données en transit (TLS 1.3) et au repos (AES-256)</li>
                  <li>Authentification à deux facteurs (2FA) disponible</li>
                  <li>Audits de sécurité réguliers et tests de pénétration</li>
                  <li>Formation du personnel sur la protection des données</li>
                  <li>Sauvegarde et plan de récupération des données</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Conservation des données</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li><strong>Données de compte actif</strong> : Conservées tant que votre compte est actif</li>
                <li><strong>Après suppression du compte</strong> : 30 jours (période de récupération), puis suppression définitive</li>
                <li><strong>Données de facturation</strong> : 10 ans (obligation légale)</li>
                <li><strong>Logs de sécurité</strong> : 1 an</li>
                <li><strong>Cookies</strong> : Voir notre politique de cookies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Transferts internationaux</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Vos données peuvent être transférées vers des serveurs situés en dehors de l'UE. 
                Nous assurons un niveau de protection adéquat via :
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>Clauses contractuelles types de la Commission européenne</li>
                <li>Certifications Privacy Shield (le cas échéant)</li>
                <li>Évaluation des garanties appropriées</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Enfants</h2>
              <p className="text-gray-700 dark:text-gray-300">
                OmniTask n'est pas destiné aux enfants de moins de 16 ans. 
                Nous ne collectons pas sciemment de données personnelles d'enfants.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">13. Modifications</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Nous pouvons mettre à jour cette politique périodiquement. 
                Les modifications importantes seront notifiées par email ou notification dans l'app.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">14. Contact et réclamations</h2>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Pour toute question ou réclamation :
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>Délégué à la Protection des Données (DPO)</strong><br />
                  Email : dpo@omnirealm.com<br />
                  Formulaire : <a href="/contact" className="text-blue-600 hover:underline">omnirealm.com/contact</a>
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Vous avez également le droit de déposer une réclamation auprès de la CNIL :<br />
                  <a href="https://www.cnil.fr" className="text-blue-600 hover:underline">www.cnil.fr</a>
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