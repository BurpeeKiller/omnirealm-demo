import { Metadata } from 'next'
import { Button } from '@/components/ui'
import Link from 'next/link'
import { 
  Kanban,
  BarChart3,
  Clock,
  Users,
  Zap,
  Shield,
  Smartphone,
  Globe,
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Fonctionnalités - OmniTask',
  description: 'Découvrez toutes les fonctionnalités d\'OmniTask pour organiser et gérer vos projets avec efficacité. Kanban, multi-projets, statistiques et bien plus.',
  keywords: 'gestion tâches, kanban, projets, productivité, équipe, statistiques',
}

const features = [
  {
    icon: Kanban,
    title: 'Tableau Kanban Intuitif',
    description: 'Visualisez vos tâches en colonnes personnalisables : À faire, En cours, Terminé. Drag & drop pour un réorganisation fluide.',
    benefits: ['Interface glisser-déposer', 'Colonnes personnalisables', 'Mise à jour temps réel']
  },
  {
    icon: BarChart3,
    title: 'Gestion Multi-Projets',
    description: 'Organisez vos tâches par projet avec des couleurs et icônes personnalisées. Suivez la progression de chaque projet individuellement.',
    benefits: ['Projets illimités', 'Couleurs personnalisées', 'Statistiques par projet']
  },
  {
    icon: Clock,
    title: 'Suivi du Temps',
    description: 'Estimez et suivez le temps passé sur chaque tâche. Analysez votre productivité avec des rapports détaillés.',
    benefits: ['Estimation temps', 'Suivi automatique', 'Rapports hebdomadaires']
  },
  {
    icon: Users,
    title: 'Collaboration Équipe',
    description: 'Travaillez en équipe avec partage de projets, attribution de tâches et commentaires en temps réel.',
    benefits: ['Partage projets', 'Attribution tâches', 'Commentaires temps réel'],
    pro: true
  },
  {
    icon: Zap,
    title: 'Assistant IA Intégré',
    description: 'Obtenez des suggestions automatiques pour organiser vos tâches et optimiser votre planning quotidien.',
    benefits: ['Suggestions automatiques', 'Optimisation planning', 'Analyse prédictive'],
    pro: true
  },
  {
    icon: Shield,
    title: 'Sécurité Avancée',
    description: 'Vos données sont protégées avec chiffrement de bout en bout et conformité RGPD complète.',
    benefits: ['Chiffrement E2E', 'Conformité RGPD', 'Backups automatiques']
  },
  {
    icon: Smartphone,
    title: 'Application Mobile',
    description: 'Accédez à vos tâches partout avec notre PWA optimisée pour mobile. Fonctionne hors ligne.',
    benefits: ['PWA responsive', 'Mode hors ligne', 'Notifications push']
  },
  {
    icon: Globe,
    title: 'API & Intégrations',
    description: 'Connectez OmniTask à vos outils favoris : Slack, GitHub, Google Calendar et 50+ applications.',
    benefits: ['API REST complète', 'Webhooks', '50+ intégrations'],
    pro: true
  }
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechStart",
    content: "OmniTask a transformé notre façon de gérer les projets. L'interface Kanban est parfaite et les statistiques nous aident à optimiser notre productivité.",
    rating: 5
  },
  {
    name: "Marc Dubois",
    role: "Freelance Developer",
    company: "Independent",
    content: "Simple, efficace et puissant. Exactement ce qu'il me fallait pour gérer mes projets clients sans me compliquer la vie.",
    rating: 5
  },
  {
    name: "Julie Martin",
    role: "Team Lead",
    company: "AgencePro",
    content: "Nos équipes ont adopté OmniTask en quelques jours. Le partage de projets et les notifications temps réel sont parfaits.",
    rating: 5
  }
]

export default function FeaturesPage() {
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
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                Tarifs
              </Link>
              <Link href="/features" className="text-blue-600 font-medium">
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
            Tout ce dont vous avez besoin pour
            <span className="text-blue-600"> gérer vos projets</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Découvrez comment OmniTask révolutionne la gestion de tâches avec des fonctionnalités 
            pensées pour maximiser votre productivité et celle de votre équipe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Essayer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg">
                Voir la démo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fonctionnalités complètes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              De la simple gestion de tâches à la collaboration d'équipe avancée, 
              OmniTask s'adapte à tous vos besoins.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index}
                  className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      {feature.pro && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                          Pro
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-lg text-gray-600">
              Plus de 10 000 professionnels font confiance à OmniTask
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-4">
                  "{testimonial.content}"
                </blockquote>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role} • {testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à transformer votre productivité ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez des milliers d'utilisateurs qui organisent déjà leurs projets avec OmniTask.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Commencer gratuitement
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                Voir les tarifs
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