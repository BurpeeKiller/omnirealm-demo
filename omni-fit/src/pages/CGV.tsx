import { ArrowLeft } from 'lucide-react';

export function CGV() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Conditions Générales de Vente
        </h1>
        
        <p className="text-gray-600 mb-8">
          Dernière mise à jour : 13 août 2025
        </p>

        <div className="prose prose-gray max-w-none">
          <h2>1. Objet</h2>
          <p>
            Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre OmniRealm et ses clients dans le cadre de la fourniture du service OmniFit Pro.
          </p>

          <h2>2. Description du service</h2>
          <p>
            OmniFit Pro est une application web progressive de fitness personnalisé par intelligence artificielle, offrant :
          </p>
          <ul>
            <li>Programmes d'entraînement sur mesure générés par IA</li>
            <li>Suivi en temps réel avec reconnaissance des mouvements</li>
            <li>Coaching vocal intelligent</li>
            <li>Analyse de progression détaillée</li>
            <li>Plans nutritionnels adaptés</li>
            <li>Mode hors-ligne pour s'entraîner partout</li>
          </ul>

          <h2>3. Offres et tarification</h2>
          
          <h3>3.1 Version gratuite</h3>
          <p>
            - 3 séances par semaine<br />
            - Exercices de base<br />
            - Suivi limité<br />
            - Sans engagement
          </p>

          <h3>3.2 OmniFit Pro - 29€/mois HT</h3>
          <p>
            - Séances illimitées<br />
            - +500 exercices premium<br />
            - IA avancée pour personnalisation<br />
            - Coaching vocal temps réel<br />
            - Plans nutrition personnalisés<br />
            - Export des données<br />
            - Support prioritaire<br />
            - Essai gratuit de 7 jours
          </p>

          <h2>4. Modalités de paiement</h2>
          <p>
            Le paiement s'effectue mensuellement par carte bancaire via notre prestataire sécurisé Stripe. Le prélèvement intervient à la date anniversaire de souscription. Les prix sont indiqués hors taxes (HT).
          </p>

          <h2>5. Période d'essai</h2>
          <p>
            L'offre Pro inclut une période d'essai gratuite de 7 jours. Aucun paiement n'est requis pendant cette période. L'abonnement payant démarre automatiquement à la fin de la période d'essai sauf résiliation.
          </p>

          <h2>6. Durée et résiliation</h2>
          <p>
            L'abonnement est conclu pour une durée d'un mois, renouvelable par tacite reconduction. Le client peut résilier à tout moment depuis l'application. La résiliation prend effet à la fin de la période en cours.
          </p>

          <h2>7. Droit de rétractation</h2>
          <p>
            Pour les consommateurs, conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux services numériques dont l'exécution a commencé avec votre accord exprès.
          </p>

          <h2>8. Disponibilité du service</h2>
          <p>
            OmniRealm s'engage à fournir un taux de disponibilité de 99%. L'application fonctionne en mode hors-ligne pour garantir la continuité des entraînements même sans connexion internet.
          </p>

          <h2>9. Limitations et précautions d'usage</h2>
          <h3>9.1 Avertissement santé</h3>
          <p className="font-semibold text-red-600">
            IMPORTANT : Consultez un médecin avant de commencer tout programme d'exercice. OmniFit ne remplace pas l'avis d'un professionnel de santé.
          </p>
          
          <h3>9.2 Limites de responsabilité santé</h3>
          <p>
            OmniRealm ne peut être tenu responsable de blessures ou problèmes de santé résultant de l'utilisation du service. L'utilisateur s'entraîne sous sa propre responsabilité.
          </p>

          <h3>9.3 Usage équitable</h3>
          <p>
            - Maximum 10 profils par compte<br />
            - Limite de 100 séances enregistrées par mois<br />
            - Stockage de 5 GB pour les vidéos d'analyse
          </p>

          <h2>10. Propriété intellectuelle</h2>
          <p>
            Les programmes d'entraînement générés restent la propriété du client. OmniRealm utilise des données anonymisées pour améliorer ses algorithmes de recommandation.
          </p>

          <h2>11. Protection des données</h2>
          <p>
            Les données de santé sont chiffrées et stockées conformément au RGPD et aux normes de protection des données de santé. Aucune donnée n'est partagée sans consentement explicite.
          </p>

          <h2>12. Exactitude des mesures</h2>
          <p>
            Les mesures (calories, distances, répétitions) sont des estimations basées sur l'IA et les capteurs disponibles. La précision peut varier selon l'équipement utilisé.
          </p>

          <h2>13. Support technique</h2>
          <p>
            - Version gratuite : support par email sous 72h + FAQ<br />
            - Version Pro : chat en direct 7j/7 de 8h à 22h + assistance vidéo
          </p>

          <h2>14. Modification des CGV</h2>
          <p>
            OmniRealm se réserve le droit de modifier les présentes CGV avec un préavis de 30 jours par notification dans l'application.
          </p>

          <h2>15. Loi applicable et juridiction</h2>
          <p>
            Les présentes CGV sont soumises au droit français. Tout litige sera soumis aux tribunaux compétents de Paris.
          </p>

          <h2>16. Contact</h2>
          <p>
            Pour toute question relative aux CGV :<br />
            Email : support@omnirealm.com<br />
            Chat : Disponible dans l'application Pro<br />
            Adresse : [À compléter avec l'adresse de l'entreprise]
          </p>

          <h2>17. Clause spéciale COVID-19 et situations exceptionnelles</h2>
          <p>
            En cas de fermeture des salles de sport ou confinement, OmniRealm s'engage à adapter ses programmes pour un entraînement 100% à domicile sans interruption de service.
          </p>
        </div>
      </div>
    </div>
  );
}