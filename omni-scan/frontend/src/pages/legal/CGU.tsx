import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function CGU() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'application
        </Link>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Conditions Générales d'Utilisation</CardTitle>
            <p className="text-gray-500 mt-2">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <h2>1. Objet</h2>
            <p>
              Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation du service OmniScan,
              plateforme d'OCR et d'analyse de documents par intelligence artificielle.
            </p>

            <h2>2. Acceptation des CGU</h2>
            <p>
              L'utilisation d'OmniScan implique l'acceptation pleine et entière des présentes CGU.
              Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
            </p>

            <h2>3. Description du Service</h2>
            <p>OmniScan propose :</p>
            <ul>
              <li>Extraction de texte par OCR (Reconnaissance Optique de Caractères)</li>
              <li>Analyse intelligente des documents par IA</li>
              <li>Export des résultats en différents formats</li>
              <li>Aucun stockage permanent des documents (traitement en temps réel)</li>
            </ul>

            <h2>4. Inscription et Compte</h2>
            <p>
              L'inscription se fait par email avec un système de "magic link". 
              Vous êtes responsable de la confidentialité de votre accès.
            </p>

            <h2>5. Utilisation du Service</h2>
            <h3>5.1 Utilisation autorisée</h3>
            <ul>
              <li>Usage personnel ou professionnel légal</li>
              <li>Documents dont vous détenez les droits</li>
              <li>Respect des quotas définis par votre abonnement</li>
            </ul>

            <h3>5.2 Utilisation interdite</h3>
            <ul>
              <li>Documents illégaux ou inappropriés</li>
              <li>Violation de droits d'auteur</li>
              <li>Tentative de contournement des limites</li>
              <li>Utilisation abusive ou malveillante</li>
            </ul>

            <h2>6. Tarification et Paiement</h2>
            <ul>
              <li>Plan Gratuit : 5 scans/mois</li>
              <li>Plan Pro : 49€/mois - Scans illimités</li>
              <li>Paiement sécurisé via Stripe</li>
              <li>Facturation mensuelle, annulation à tout moment</li>
            </ul>

            <h2>7. Propriété Intellectuelle</h2>
            <p>
              Vous conservez tous les droits sur vos documents. OmniScan ne revendique aucun droit
              sur le contenu que vous traitez via notre service.
            </p>

            <h2>8. Protection des Données</h2>
            <p>
              Aucun document n'est conservé après traitement. Voir notre{' '}
              <Link to="/privacy" className="text-blue-600 hover:underline">
                Politique de Confidentialité
              </Link>{' '}
              pour plus de détails.
            </p>

            <h2>9. Limitation de Responsabilité</h2>
            <p>
              OmniScan est fourni "tel quel". Nous ne garantissons pas une précision à 100% de l'OCR
              ou de l'analyse IA. L'utilisateur reste responsable de vérifier les résultats.
            </p>

            <h2>10. Résiliation</h2>
            <p>
              Vous pouvez résilier votre compte à tout moment. Nous nous réservons le droit de
              suspendre un compte en cas de violation des présentes CGU.
            </p>

            <h2>11. Modifications</h2>
            <p>
              Nous nous réservons le droit de modifier ces CGU. Les utilisateurs seront informés
              par email de tout changement significatif.
            </p>

            <h2>12. Droit Applicable</h2>
            <p>
              Les présentes CGU sont régies par le droit français. Tout litige sera soumis aux
              tribunaux compétents de Paris.
            </p>

            <h2>13. Contact</h2>
            <p>
              Pour toute question : contact@omniscan.app
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}