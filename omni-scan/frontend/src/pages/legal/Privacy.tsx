import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Lock, Eye, Trash2 } from 'lucide-react'

export function Privacy() {
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
              <Shield className="w-8 h-8 text-blue-600" />
              Politique de Confidentialité
            </CardTitle>
            <p className="text-gray-500 mt-2">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="text-green-800 flex items-center gap-2 mt-0">
                <Lock className="w-5 h-5" />
                Notre engagement
              </h3>
              <p className="text-green-700 mb-0">
                <strong>Aucun document n'est conservé.</strong> Tous les fichiers sont traités en temps réel
                et immédiatement supprimés après traitement. Nous ne stockons JAMAIS vos documents.
              </p>
            </div>

            <h2>1. Responsable du Traitement</h2>
            <p>
              OmniScan SAS<br />
              [Adresse à compléter]<br />
              Email : privacy@omniscan.app<br />
              DPO : dpo@omniscan.app
            </p>

            <h2>2. Données Collectées</h2>
            
            <h3>2.1 Données d'identification</h3>
            <ul>
              <li>Email (pour l'authentification)</li>
              <li>Identifiant de session temporaire</li>
            </ul>

            <h3>2.2 Données d'usage</h3>
            <ul>
              <li>Nombre de scans effectués</li>
              <li>Date/heure des scans</li>
              <li>Type de fichiers traités (format uniquement, pas le contenu)</li>
            </ul>

            <h3>2.3 Données de paiement</h3>
            <ul>
              <li>Gérées exclusivement par Stripe</li>
              <li>Nous ne stockons aucune donnée bancaire</li>
            </ul>

            <h3>2.4 Ce que nous NE collectons PAS</h3>
            <ul className="text-red-600">
              <li><Trash2 className="inline w-4 h-4" /> Le contenu de vos documents</li>
              <li><Trash2 className="inline w-4 h-4" /> Les fichiers uploadés</li>
              <li><Trash2 className="inline w-4 h-4" /> Les résultats OCR après affichage</li>
              <li><Trash2 className="inline w-4 h-4" /> L'historique de vos analyses</li>
            </ul>

            <h2>3. Finalités du Traitement</h2>
            <ul>
              <li>Fourniture du service OCR</li>
              <li>Gestion des comptes utilisateurs</li>
              <li>Facturation et gestion des abonnements</li>
              <li>Support client</li>
              <li>Amélioration du service (statistiques anonymisées)</li>
            </ul>

            <h2>4. Base Légale</h2>
            <ul>
              <li><strong>Contrat</strong> : exécution du service souscrit</li>
              <li><strong>Intérêt légitime</strong> : amélioration du service</li>
              <li><strong>Obligation légale</strong> : conservation des factures</li>
            </ul>

            <h2>5. Durée de Conservation</h2>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th>Type de donnée</th>
                  <th>Durée</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Documents uploadés</td>
                  <td className="text-green-600 font-bold">0 seconde (suppression immédiate)</td>
                </tr>
                <tr>
                  <td>Session utilisateur</td>
                  <td>24 heures</td>
                </tr>
                <tr>
                  <td>Compte utilisateur</td>
                  <td>Durée de l'abonnement + 30 jours</td>
                </tr>
                <tr>
                  <td>Factures</td>
                  <td>10 ans (obligation légale)</td>
                </tr>
              </tbody>
            </table>

            <h2>6. Destinataires des Données</h2>
            <ul>
              <li><strong>Stripe</strong> : traitement des paiements</li>
              <li><strong>SendGrid/Postmark</strong> : envoi des emails transactionnels</li>
              <li><strong>OVH/AWS</strong> : hébergement de l'infrastructure</li>
            </ul>
            <p>Aucune donnée n'est vendue ou partagée à des fins marketing.</p>

            <h2>7. Transferts Internationaux</h2>
            <p>
              Les données restent dans l'Union Européenne. Si un transfert hors UE est nécessaire
              (ex: Stripe US), nous nous assurons de garanties appropriées (Privacy Shield, clauses contractuelles types).
            </p>

            <h2>8. Vos Droits (RGPD)</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul>
              <li><Eye className="inline w-4 h-4" /> <strong>Accès</strong> : obtenir une copie de vos données</li>
              <li>✏️ <strong>Rectification</strong> : corriger vos données</li>
              <li><Trash2 className="inline w-4 h-4" /> <strong>Effacement</strong> : supprimer votre compte</li>
              <li>⏸️ <strong>Limitation</strong> : limiter le traitement</li>
              <li>📤 <strong>Portabilité</strong> : recevoir vos données dans un format structuré</li>
              <li>🚫 <strong>Opposition</strong> : vous opposer à un traitement</li>
            </ul>
            
            <p>Pour exercer vos droits : dpo@omniscan.app</p>

            <h2>9. Sécurité</h2>
            <ul>
              <li>Chiffrement HTTPS de toutes les communications</li>
              <li>Authentification sécurisée par magic link</li>
              <li>Suppression automatique des fichiers</li>
              <li>Monitoring et alertes de sécurité</li>
              <li>Audits de sécurité réguliers</li>
            </ul>

            <h2>10. Cookies</h2>
            <p>
              Nous utilisons uniquement des cookies essentiels pour le fonctionnement du service
              (session d'authentification). Voir notre{' '}
              <Link to="/cookies" className="text-blue-600 hover:underline">
                Politique de Cookies
              </Link>.
            </p>

            <h2>11. Mineurs</h2>
            <p>
              OmniScan n'est pas destiné aux mineurs de moins de 16 ans. Nous ne collectons pas
              sciemment de données de mineurs.
            </p>

            <h2>12. Modifications</h2>
            <p>
              Toute modification substantielle sera notifiée par email. La poursuite de l'utilisation
              vaut acceptation des modifications.
            </p>

            <h2>13. Réclamation</h2>
            <p>
              En cas de problème, contactez d'abord notre DPO : dpo@omniscan.app<br />
              Vous pouvez aussi déposer une réclamation auprès de la CNIL : www.cnil.fr
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
              <h3 className="text-blue-800 mt-0">💡 Transparence totale</h3>
              <p className="text-blue-700 mb-0">
                Chez OmniScan, la protection de vos données est notre priorité. Nous appliquons
                le principe de "Privacy by Design" : aucune donnée n'est collectée si elle n'est
                pas absolument nécessaire au service.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}