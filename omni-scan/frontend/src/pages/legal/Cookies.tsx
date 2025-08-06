import { Card, CardContent, CardHeader, CardTitle } from '@omnirealm/ui'
import { Link } from 'react-router-dom'
import { ArrowLeft, Cookie } from 'lucide-react'

export function Cookies() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'application
        </Link>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Cookie className="w-8 h-8 text-yellow-600" />
              Politique de Cookies
            </CardTitle>
            <p className="text-gray-500 mt-2">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <h2>1. Qu'est-ce qu'un cookie ?</h2>
            <p>
              Un cookie est un petit fichier texte stocké sur votre appareil lors de votre visite sur OmniScan.
              Il permet au site de mémoriser vos actions et préférences.
            </p>

            <h2>2. Cookies utilisés par OmniScan</h2>
            
            <h3>2.1 Cookies essentiels (obligatoires)</h3>
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Finalité</th>
                  <th>Durée</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>omniscan-auth</code></td>
                  <td>Maintenir votre session connectée</td>
                  <td>24 heures</td>
                </tr>
                <tr>
                  <td><code>cookie_consent</code></td>
                  <td>Mémoriser votre choix sur les cookies</td>
                  <td>1 an</td>
                </tr>
                <tr>
                  <td><code>omniscan_scans_used</code></td>
                  <td>Compteur de scans gratuits (non connecté)</td>
                  <td>30 jours</td>
                </tr>
              </tbody>
            </table>

            <h3>2.2 Cookies que nous N'utilisons PAS</h3>
            <ul className="text-red-600">
              <li>❌ Cookies publicitaires</li>
              <li>❌ Cookies de tracking tiers</li>
              <li>❌ Cookies de réseaux sociaux</li>
              <li>❌ Cookies Google Analytics</li>
            </ul>

            <h2>3. Gestion des cookies</h2>
            
            <h3>3.1 Accepter ou refuser</h3>
            <p>
              Lors de votre première visite, une bannière vous permet d'accepter ou refuser les cookies.
              Seuls les cookies essentiels sont obligatoires pour le fonctionnement du service.
            </p>

            <h3>3.2 Modifier vos préférences</h3>
            <p>
              Vous pouvez à tout moment modifier vos préférences en cliquant sur le lien "Cookies" 
              en bas de page.
            </p>

            <h3>3.3 Paramètres du navigateur</h3>
            <p>Vous pouvez également gérer les cookies via votre navigateur :</p>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600">Chrome</a></li>
              <li><a href="https://support.mozilla.org/fr/kb/cookies-informations-sites-enregistrent" target="_blank" rel="noopener noreferrer" className="text-blue-600">Firefox</a></li>
              <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600">Safari</a></li>
              <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600">Edge</a></li>
            </ul>

            <h2>4. Impact du refus des cookies</h2>
            <p>
              Si vous refusez les cookies essentiels, certaines fonctionnalités seront impactées :
            </p>
            <ul>
              <li>Impossibilité de maintenir une session connectée</li>
              <li>Réinitialisation du compteur de scans gratuits</li>
              <li>Obligation de re-valider vos préférences à chaque visite</li>
            </ul>

            <h2>5. Cookies tiers</h2>
            <p>
              OmniScan peut intégrer des services tiers qui utilisent leurs propres cookies :
            </p>
            <ul>
              <li><strong>Stripe</strong> : uniquement sur la page de paiement (cookies de sécurité)</li>
            </ul>

            <h2>6. Modifications</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique. Toute modification sera
              notifiée via la bannière de cookies.
            </p>

            <h2>7. Contact</h2>
            <p>
              Pour toute question sur notre utilisation des cookies :<br />
              Email : privacy@omniscan.app
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-8">
              <h3 className="text-green-800 mt-0">✅ Notre engagement</h3>
              <p className="text-green-700 mb-0">
                OmniScan s'engage à utiliser le minimum de cookies nécessaires. 
                Nous ne vendons jamais vos données et n'utilisons aucun tracker publicitaire.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}