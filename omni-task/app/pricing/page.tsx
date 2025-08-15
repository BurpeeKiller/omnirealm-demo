import { Metadata } from 'next'
import { Button } from '@/components/ui'
import Link from 'next/link'
import { 
  Check,
  X,
  Star,
  ArrowRight,
  Users,
  Zap,
  Shield,
  Headphones
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tarifs - OmniTask',
  description: 'Plans flexibles pour tous vos besoins. Commencez gratuitement, passez au Pro pour plus de fonctionnalités ou choisissez Team pour votre équipe.',
  keywords: 'tarifs, prix, abonnement, gratuit, pro, équipe, gestion tâches',
}

const plans = [
  {
    name: 'Gratuit',
    price: '0',
    period: 'mois',
    description: 'Parfait pour débuter et gérer vos projets personnels',
    features: [
      { name: 'Jusqu\'à 3 projets', included: true },
      { name: 'Tâches illimitées', included: true },
      { name: 'Tableau Kanban', included: true },
      { name: 'Mobile PWA', included: true },
      { name: 'Export basique', included: true },
      { name: 'Support communautaire', included: true },
      { name: 'Collaboration équipe', included: false },
      { name: 'Assistant IA', included: false },
      { name: 'Intégrations', included: false },
      { name: 'Support prioritaire', included: false },
    ],
    cta: 'Commencer gratuitement',
    href: '/register',
    popular: false,
    color: 'gray'
  },
  {
    name: 'Pro',
    price: '9',
    period: 'mois',
    description: 'Pour les professionnels qui veulent maximiser leur productivité',
    features: [
      { name: 'Projets illimités', included: true },
      { name: 'Tâches illimitées', included: true },
      { name: 'Tableau Kanban avancé', included: true },
      { name: 'Mobile PWA', included: true },
      { name: 'Export avancé (PDF, Excel)', included: true },
      { name: 'Assistant IA intégré', included: true },
      { name: 'Collaboration jusqu\'à 5 personnes', included: true },
      { name: '20+ intégrations', included: true },
      { name: 'Rapports détaillés', included: true },
      { name: 'Support email', included: true },
    ],
    cta: 'Commencer l\'essai Pro',
    href: '/register?plan=pro',
    popular: true,
    color: 'blue'
  },
  {
    name: 'Team',
    price: '25',
    period: 'mois',
    description: 'Conçu pour les équipes qui collaborent sur de nombreux projets',
    features: [
      { name: 'Tout du plan Pro', included: true },
      { name: 'Utilisateurs illimités', included: true },
      { name: 'Espaces de travail multiples', included: true },
      { name: 'Permissions avancées', included: true },
      { name: 'Audit et historique', included: true },
      { name: 'Intégrations personnalisées', included: true },
      { name: 'Support téléphonique', included: true },
      { name: 'Formations équipe', included: true },
      { name: 'SLA 99.9%', included: true },
      { name: 'Gestionnaire de compte dédié', included: true },
    ],
    cta: 'Contacter les ventes',
    href: '/contact',
    popular: false,
    color: 'purple'
  }
]

const faqs = [
  {
    question: "Puis-je changer de plan à tout moment ?",
    answer: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement et nous calculons au prorata."
  },
  {
    question: "Y a-t-il une période d'essai gratuite ?",
    answer: "Le plan Gratuit est disponible de façon permanente. Les plans Pro et Team incluent 14 jours d'essai gratuit, sans engagement."
  },
  {
    question: "Que se passe-t-il si je dépasse les limites de mon plan ?",
    answer: "Nous vous préviendrons avant d'atteindre vos limites. Vous pourrez upgrader votre plan ou supprimer du contenu pour rester dans les limites."
  },
  {
    question: "Proposez-vous des réductions pour les étudiants ou associations ?",
    answer: "Oui, nous offrons 50% de réduction sur tous nos plans payants pour les étudiants et organisations à but non lucratif."
  },
  {
    question: "Comment fonctionne l'assistance client ?",
    answer: "Plan Gratuit : support communautaire. Plan Pro : support email sous 24h. Plan Team : support téléphonique et gestionnaire dédié."
  },
  {
    question: "Puis-je exporter mes données ?",
    answer: "Absolument. Vous pouvez exporter toutes vos données à tout moment au format JSON, CSV ou PDF selon votre plan."
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              OmniTask
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/pricing" className="text-blue-600 font-medium">
                Tarifs
              </Link>
              <Link href="/features" className="text-gray-600 hover:text-gray-900">
                Fonctionnalités
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  Commencer gratuitement
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Des tarifs simples et
            <span className="text-blue-600"> transparents</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Commencez gratuitement et évoluez selon vos besoins. 
            Pas de frais cachés, résiliation possible à tout moment.
          </p>
          <div className="inline-flex items-center bg-green-50 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <Star className="h-4 w-4 mr-2" />
            14 jours d'essai gratuit sur tous les plans payants
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`bg-white rounded-xl shadow-lg overflow-hidden relative ${
                  plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Plus populaire
                    </span>
                  </div>
                )}
                
                <div className="p-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {plan.description}
                    </p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}€
                      </span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>

                    <Link href={plan.href}>
                      <Button 
                        className={`w-full mb-6 ${
                          plan.popular 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : plan.color === 'purple' 
                            ? 'bg-purple-600 hover:bg-purple-700'
                            : 'bg-gray-600 hover:bg-gray-700'
                        }`}
                        size="lg"
                      >
                        {plan.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mr-3 flex-shrink-0" />
                        )}
                        <span className={
                          feature.included 
                            ? 'text-gray-700' 
                            : 'text-gray-400'
                        }>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir OmniTask ?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="p-4 bg-blue-100 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Collaboration native
              </h3>
              <p className="text-gray-600">
                Travaillez en équipe naturellement avec partage temps réel et notifications intelligentes.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-green-100 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Performance optimale
              </h3>
              <p className="text-gray-600">
                Interface ultra-rapide et synchronisation instantanée, même avec des milliers de tâches.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-purple-100 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sécurité entreprise
              </h3>
              <p className="text-gray-600">
                Chiffrement de bout en bout, conformité RGPD et hébergement sécurisé en Europe.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-orange-100 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Headphones className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Support réactif
              </h3>
              <p className="text-gray-600">
                Équipe support francophone disponible pour vous accompagner dans votre réussite.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-lg text-gray-600">
              Tout ce que vous devez savoir sur nos plans et tarifs
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Besoin d'une solution sur mesure ?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Pour les grandes entreprises, nous proposons des solutions personnalisées 
            avec intégration dédiée, formation et support premium.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary">
                Contacter les ventes
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                Demander une démo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Simple */}
      <footer className="bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white font-bold text-xl mb-4 md:mb-0">
              OmniTask
            </div>
            <div className="flex space-x-6 text-gray-400">
              <Link href="/privacy" className="hover:text-white">
                Confidentialité
              </Link>
              <Link href="/features" className="hover:text-white">
                Fonctionnalités
              </Link>
              <Link href="/pricing" className="hover:text-white">
                Tarifs
              </Link>
              <Link href="/support" className="hover:text-white">
                Support
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 OmniTask. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}