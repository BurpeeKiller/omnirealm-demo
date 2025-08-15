import { ArrowLeft } from 'lucide-react';

export function Privacy() {
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
          Politique de Confidentialité
        </h1>
        
        <p className="text-gray-600 mb-8">
          Dernière mise à jour : 13 août 2025
        </p>

        <div className="prose prose-gray max-w-none">
          <h2>1. Introduction</h2>
          <p>
            OmniFit, service de l'écosystème OmniRealm, s'engage à protéger la confidentialité et les données personnelles de ses utilisateurs. Cette politique explique comment nous collectons, utilisons, stockons et protégeons vos informations.
          </p>

          <h2>2. Données collectées</h2>
          <h3>2.1 Données fournies directement</h3>
          <ul>
            <li>Profil : nom, âge, poids, taille, objectifs fitness</li>
            <li>Performances : exercices réalisés, temps, répétitions</li>
            <li>Préférences : horaires d'entraînement, notifications</li>
          </ul>

          <h3>2.2 Données collectées automatiquement</h3>
          <ul>
            <li>Données d'utilisation : pages visitées, fonctionnalités utilisées</li>
            <li>Données techniques : type d'appareil, navigateur, OS</li>
            <li>Capteurs (avec permission) : accéléromètre, caméra pour analyse posture</li>
          </ul>

          <h2>3. Utilisation des données</h2>
          <p>Nous utilisons vos données pour :</p>
          <ul>
            <li>Personnaliser vos programmes d'entraînement</li>
            <li>Suivre votre progression et générer des insights</li>
            <li>Envoyer des rappels d'entraînement</li>
            <li>Améliorer nos algorithmes d'IA</li>
            <li>Assurer la sécurité et prévenir la fraude</li>
          </ul>

          <h2>4. Données de santé</h2>
          <p className="font-semibold">
            Vos données de santé sont particulièrement sensibles. Nous appliquons les mesures de sécurité les plus strictes :
          </p>
          <ul>
            <li>Chiffrement AES-256 au repos et TLS 1.3 en transit</li>
            <li>Accès strictement limité au personnel autorisé</li>
            <li>Jamais vendues ou partagées sans consentement explicite</li>
            <li>Suppression automatique après 2 ans d'inactivité</li>
          </ul>

          <h2>5. Partage des données</h2>
          <p>Nous ne partageons vos données qu'avec :</p>
          <ul>
            <li><strong>Vous-même</strong> : export complet disponible à tout moment</li>
            <li><strong>Professionnels de santé</strong> : uniquement avec votre autorisation explicite</li>
            <li><strong>Services techniques</strong> : hébergement sécurisé, uniquement les données nécessaires</li>
          </ul>

          <h2>6. Stockage et sécurité</h2>
          <ul>
            <li>Données hébergées en France (conformité RGPD)</li>
            <li>Sauvegarde quotidienne chiffrée</li>
            <li>Tests de sécurité réguliers</li>
            <li>Certification ISO 27001 en cours</li>
          </ul>

          <h2>7. Vos droits RGPD</h2>
          <p>Vous disposez des droits suivants :</p>
          <ul>
            <li><strong>Accès</strong> : obtenir une copie de vos données</li>
            <li><strong>Rectification</strong> : corriger des données inexactes</li>
            <li><strong>Effacement</strong> : supprimer votre compte et données</li>
            <li><strong>Portabilité</strong> : exporter vos données (format JSON/CSV)</li>
            <li><strong>Opposition</strong> : refuser certains traitements</li>
            <li><strong>Limitation</strong> : geler temporairement vos données</li>
          </ul>

          <h2>8. Cookies et tracking</h2>
          <p>
            OmniFit utilise des cookies essentiels uniquement. Pas de tracking publicitaire. Analytics anonymisés avec Plausible (RGPD-compliant).
          </p>

          <h2>9. Mineurs</h2>
          <p>
            OmniFit n'est pas destiné aux enfants de moins de 16 ans. Pour les 16-18 ans, autorisation parentale requise.
          </p>

          <h2>10. Modifications</h2>
          <p>
            Toute modification importante sera notifiée par email et dans l'app avec un préavis de 30 jours.
          </p>

          <h2>11. Contact DPO</h2>
          <p>
            Pour exercer vos droits ou toute question :<br />
            <strong>Délégué à la Protection des Données</strong><br />
            Email : dpo@omnirealm.com<br />
            Courrier : [Adresse à compléter]<br />
            <br />
            Vous pouvez également contacter la CNIL : www.cnil.fr
          </p>
        </div>
      </div>
    </div>
  );
}