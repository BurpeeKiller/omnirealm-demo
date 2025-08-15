import Breadcrumbs from '@/components/Breadcrumbs';
import FooterSection from '@/components/FooterSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente - OmniRealm',
  description: 'Conditions générales de vente des services OmniRealm',
};

export default function TermsOfSalePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <Breadcrumbs
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'CGV' },
              ]}
              className="mb-8"
            />
            <div className="mx-auto max-w-3xl">
              <h1 className="text-4xl font-bold mb-8">Conditions Générales de Vente</h1>
              <p className="text-sm text-gray-600 mb-8">Dernière mise à jour : 13 août 2025</p>

              <div className="prose prose-gray max-w-none">
                <h2>1. Objet</h2>
                <p>
                  Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre OmniRealm et ses clients dans le cadre de la vente de services numériques accessibles via nos applications web.
                </p>

                <h2>2. Services proposés</h2>
                <p>OmniRealm propose les services suivants :</p>
                <ul>
                  <li><strong>OmniScan Pro</strong> : Service d'OCR intelligent avec IA - 49€/mois</li>
                  <li><strong>OmniTask Pro</strong> : Gestion de tâches augmentée par IA - 99€/mois</li>
                  <li><strong>OmniFit Pro</strong> : Coach fitness personnalisé par IA - 29€/mois</li>
                </ul>

                <h2>3. Prix et modalités de paiement</h2>
                <h3>3.1 Tarification</h3>
                <p>
                  Les prix sont indiqués en euros, toutes taxes comprises (TTC). OmniRealm se réserve le droit de modifier ses prix à tout moment, étant entendu que le prix figurant au jour de la commande sera le seul applicable au client.
                </p>

                <h3>3.2 Paiement</h3>
                <p>
                  Le paiement s'effectue par carte bancaire via notre prestataire sécurisé Stripe. L'abonnement est prélevé mensuellement à la date anniversaire de souscription.
                </p>

                <h3>3.3 Période d'essai</h3>
                <p>
                  Certains services proposent une période d'essai gratuite. Les conditions spécifiques sont précisées sur chaque offre.
                </p>

                <h2>4. Souscription et durée</h2>
                <p>
                  Les abonnements sont souscrits pour une durée d'un mois, renouvelable automatiquement par tacite reconduction. Le client peut résilier son abonnement à tout moment depuis son espace personnel.
                </p>

                <h2>5. Droit de rétractation</h2>
                <p>
                  Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux services pleinement exécutés avant la fin du délai de rétractation et dont l'exécution a commencé avec l'accord préalable exprès du consommateur.
                </p>

                <h2>6. Accès aux services</h2>
                <h3>6.1 Compte utilisateur</h3>
                <p>
                  L'accès aux services nécessite la création d'un compte utilisateur. Le client s'engage à fournir des informations exactes et à maintenir ses identifiants confidentiels.
                </p>

                <h3>6.2 Disponibilité</h3>
                <p>
                  OmniRealm s'engage à tout mettre en œuvre pour assurer une disponibilité optimale de ses services, sans toutefois garantir une disponibilité ininterrompue.
                </p>

                <h2>7. Résiliation</h2>
                <h3>7.1 Par le client</h3>
                <p>
                  Le client peut résilier son abonnement à tout moment depuis son espace personnel. La résiliation prend effet à la fin de la période en cours.
                </p>

                <h3>7.2 Par OmniRealm</h3>
                <p>
                  OmniRealm se réserve le droit de résilier un abonnement en cas de non-respect des CGU ou de défaut de paiement.
                </p>

                <h2>8. Remboursement</h2>
                <p>
                  Aucun remboursement n'est effectué pour la période en cours. En cas d'interruption de service imputable à OmniRealm pendant plus de 7 jours consécutifs, un remboursement au prorata pourra être accordé.
                </p>

                <h2>9. Propriété intellectuelle</h2>
                <p>
                  Le client conserve tous les droits sur ses données. OmniRealm dispose d'une licence d'utilisation limitée au traitement nécessaire à la fourniture du service.
                </p>

                <h2>10. Responsabilité</h2>
                <p>
                  OmniRealm ne saurait être tenu responsable des dommages indirects, de la perte de données ou du manque à gagner. Notre responsabilité est limitée au montant de l'abonnement mensuel.
                </p>

                <h2>11. Données personnelles</h2>
                <p>
                  Le traitement des données personnelles est effectué conformément à notre <a href="/privacy-policy" className="text-blue-600 hover:underline">Politique de Confidentialité</a> et au RGPD.
                </p>

                <h2>12. Modification des CGV</h2>
                <p>
                  OmniRealm se réserve le droit de modifier les présentes CGV. Les clients seront informés par email avec un préavis de 30 jours.
                </p>

                <h2>13. Litiges</h2>
                <p>
                  Les présentes CGV sont régies par le droit français. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux français seront compétents.
                </p>

                <h2>14. Contact</h2>
                <p>
                  Pour toute question relative aux présentes CGV :<br />
                  Email : legal@omnirealm.com<br />
                  Adresse : [À compléter avec l'adresse de l'entreprise]
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
}