import { ArrowLeft } from 'lucide-react';

export function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <a
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </a>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Conditions Générales d'Utilisation
        </h1>
        
        <p className="text-gray-600 mb-8">
          Dernière mise à jour : 13 août 2025
        </p>

        <div className="prose prose-gray max-w-none">
          <h2>1. Acceptation des conditions</h2>
          <p>
            En utilisant OmniFit, vous acceptez les présentes conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser l'application.
          </p>

          <h2>2. Description du service</h2>
          <p>
            OmniFit est une application web progressive de fitness qui propose des programmes d'entraînement personnalisés, un suivi de progression et des conseils basés sur l'intelligence artificielle.
          </p>

          <h2>3. Inscription et compte utilisateur</h2>
          <ul>
            <li>L'inscription est gratuite et ouverte à tous (16 ans minimum)</li>
            <li>Vous devez fournir des informations exactes et à jour</li>
            <li>Vous êtes responsable de la confidentialité de votre compte</li>
            <li>Un compte par personne physique uniquement</li>
          </ul>

          <h2>4. Avertissement santé important</h2>
          <p className="font-semibold text-red-600">
            ATTENTION : Consultez un médecin avant de commencer tout programme d'exercice. OmniFit ne remplace pas l'avis d'un professionnel de santé.
          </p>
          <p>
            En utilisant OmniFit, vous reconnaissez que :
          </p>
          <ul>
            <li>L'exercice physique comporte des risques inhérents</li>
            <li>Vous êtes en bonne santé pour pratiquer une activité physique</li>
            <li>Vous vous entraînez à vos propres risques</li>
            <li>OmniRealm ne peut être tenu responsable de blessures</li>
          </ul>

          <h2>5. Utilisation acceptable</h2>
          <p>Vous vous engagez à :</p>
          <ul>
            <li>Utiliser OmniFit uniquement à des fins personnelles et légales</li>
            <li>Ne pas partager votre compte avec des tiers</li>
            <li>Ne pas tenter de contourner les limitations techniques</li>
            <li>Respecter les autres utilisateurs dans les espaces communautaires</li>
          </ul>

          <h2>6. Propriété intellectuelle</h2>
          <ul>
            <li>Le contenu d'OmniFit (design, textes, vidéos) est protégé</li>
            <li>Vos données d'entraînement vous appartiennent</li>
            <li>Vous accordez à OmniRealm une licence pour traiter vos données</li>
            <li>Les programmes générés par IA restent votre propriété</li>
          </ul>

          <h2>7. Limitations du service gratuit</h2>
          <ul>
            <li>3 séances par semaine maximum</li>
            <li>Accès aux exercices de base uniquement</li>
            <li>Historique limité à 30 jours</li>
            <li>Support par email uniquement</li>
          </ul>

          <h2>8. Abonnement Premium</h2>
          <ul>
            <li>Accès illimité à toutes les fonctionnalités</li>
            <li>Renouvellement automatique mensuel</li>
            <li>Résiliation possible à tout moment</li>
            <li>Voir les CGV pour les détails commerciaux</li>
          </ul>

          <h2>9. Responsabilité et garanties</h2>
          <p>
            OmniFit est fourni "en l'état" sans garantie d'aucune sorte. Nous ne garantissons pas :
          </p>
          <ul>
            <li>L'exactitude absolue des mesures et estimations</li>
            <li>Les résultats spécifiques de fitness</li>
            <li>La disponibilité continue du service</li>
            <li>L'absence totale d'erreurs ou bugs</li>
          </ul>

          <h2>10. Limitation de responsabilité</h2>
          <p>
            La responsabilité d'OmniRealm est limitée au montant de votre abonnement. Nous ne sommes pas responsables des dommages indirects, pertes de données ou manques à gagner.
          </p>

          <h2>11. Résiliation</h2>
          <p>
            Vous pouvez supprimer votre compte à tout moment. OmniRealm peut suspendre ou résilier votre compte en cas de violation des CGU.
          </p>

          <h2>12. Modifications des CGU</h2>
          <p>
            Nous pouvons modifier ces CGU avec un préavis de 30 jours. L'utilisation continue après modification vaut acceptation.
          </p>

          <h2>13. Droit applicable</h2>
          <p>
            Ces CGU sont régies par le droit français. Tout litige sera soumis aux tribunaux compétents de Paris.
          </p>

          <h2>14. Contact</h2>
          <p>
            Pour toute question sur ces CGU :<br />
            Email : legal@omnirealm.com<br />
            Adresse : [À compléter]
          </p>
        </div>
      </div>
    </div>
  );
}