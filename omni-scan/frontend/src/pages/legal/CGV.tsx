import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function CGV() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Conditions Générales de Vente
        </h1>
        
        <p className="text-gray-600 mb-8">
          Dernière mise à jour : 13 août 2025
        </p>

        <div className="prose prose-gray max-w-none">
          <h2>1. Objet</h2>
          <p>
            Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre OmniRealm et ses clients dans le cadre de la fourniture du service OmniScan Pro.
          </p>

          <h2>2. Description du service</h2>
          <p>
            OmniScan Pro est un service d'extraction de texte par OCR (Reconnaissance Optique de Caractères) augmenté par intelligence artificielle, permettant de :
          </p>
          <ul>
            <li>Extraire le texte de documents PDF, images et documents scannés</li>
            <li>Structurer automatiquement les données extraites</li>
            <li>Exporter les résultats en formats JSON, CSV ou Excel</li>
            <li>Accéder à une API pour l'intégration dans vos outils</li>
          </ul>

          <h2>3. Offres et tarification</h2>
          
          <h3>3.1 Offre gratuite</h3>
          <p>
            - 5 scans par mois<br />
            - Export JSON/CSV<br />
            - Stockage 7 jours<br />
            - Sans engagement
          </p>

          <h3>3.2 OmniScan Pro - 49€/mois HT</h3>
          <p>
            - Scans illimités<br />
            - Tous formats d'export + API<br />
            - Stockage illimité<br />
            - Templates personnalisés<br />
            - Support prioritaire<br />
            - Essai gratuit de 14 jours
          </p>

          <h2>4. Modalités de paiement</h2>
          <p>
            Le paiement s'effectue mensuellement par carte bancaire via notre prestataire sécurisé Stripe. Le prélèvement intervient à la date anniversaire de souscription.
          </p>

          <h2>5. Période d'essai</h2>
          <p>
            L'offre Pro inclut une période d'essai gratuite de 14 jours. Aucun paiement n'est requis pendant cette période. L'abonnement payant démarre automatiquement à la fin de la période d'essai sauf résiliation.
          </p>

          <h2>6. Durée et résiliation</h2>
          <p>
            L'abonnement est conclu pour une durée d'un mois, renouvelable par tacite reconduction. Le client peut résilier à tout moment depuis son espace personnel. La résiliation prend effet à la fin de la période en cours.
          </p>

          <h2>7. Droit de rétractation</h2>
          <p>
            Pour les consommateurs, conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux services numériques dont l'exécution a commencé avec votre accord exprès.
          </p>

          <h2>8. Disponibilité du service</h2>
          <p>
            OmniRealm s'engage à fournir un taux de disponibilité de 99%. En cas d'interruption de service supérieure à 24 heures consécutives, un remboursement au prorata pourra être accordé.
          </p>

          <h2>9. Limitations d'usage</h2>
          <h3>9.1 Usage équitable</h3>
          <p>
            Bien que l'offre Pro propose des scans "illimités", un usage raisonnable est attendu. Un plafond de 10 000 scans/mois est appliqué pour éviter les abus.
          </p>

          <h3>9.2 Contenu autorisé</h3>
          <p>
            Le service ne doit pas être utilisé pour traiter du contenu illégal, diffamatoire ou portant atteinte aux droits de tiers.
          </p>

          <h2>10. Propriété intellectuelle</h2>
          <p>
            Le client conserve tous les droits sur ses documents et données. OmniRealm s'engage à ne pas utiliser ces données à d'autres fins que la fourniture du service.
          </p>

          <h2>11. Protection des données</h2>
          <p>
            Les données sont hébergées en France et traitées conformément au RGPD. Les documents sont automatiquement supprimés après traitement sauf demande de stockage du client.
          </p>

          <h2>12. Responsabilité</h2>
          <p>
            OmniRealm ne garantit pas une précision de 100% de l'extraction OCR. La responsabilité d'OmniRealm est limitée au montant de l'abonnement mensuel.
          </p>

          <h2>13. Support technique</h2>
          <p>
            - Offre gratuite : support par email sous 72h<br />
            - Offre Pro : support prioritaire sous 24h
          </p>

          <h2>14. Modification des CGV</h2>
          <p>
            OmniRealm se réserve le droit de modifier les présentes CGV avec un préavis de 30 jours par email.
          </p>

          <h2>15. Loi applicable et juridiction</h2>
          <p>
            Les présentes CGV sont soumises au droit français. Tout litige sera soumis aux tribunaux compétents de Paris.
          </p>

          <h2>16. Contact</h2>
          <p>
            Pour toute question relative aux CGV :<br />
            Email : support@omnirealm.com<br />
            Adresse : [À compléter avec l'adresse de l'entreprise]
          </p>
        </div>
      </div>
    </div>
  );
}