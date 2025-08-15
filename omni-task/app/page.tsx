'use client'

import { Button } from '@/components/ui'
import { AnnouncementBar } from '@/components/announcement-bar'
import { CookieBanner } from '@/components/cookie-banner'
import { FeedbackWidget } from '@/components/feedback-widget'
import { TrustBadges } from '@/components/trust-badges'
import Link from 'next/link'
import { 
  ArrowRight,
  CheckCircle,
  Kanban,
  BarChart3,
  Users,
  Zap,
  Star,
  Play
} from 'lucide-react'

const features = [
  {
    icon: Kanban,
    title: 'Kanban Intuitif',
    description: 'Organisez vos tâches visuellement avec un système de colonnes glisser-déposer.'
  },
  {
    icon: BarChart3,
    title: 'Multi-Projets',
    description: 'Gérez tous vos projets depuis une interface unifiée avec des couleurs personnalisées.'
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'Travaillez en équipe avec partage temps réel et notifications intelligentes.'
  },
  {
    icon: Zap,
    title: 'Assistant IA',
    description: 'Optimisez votre productivité avec des suggestions automatiques personnalisées.'
  }
]

const testimonials = [
  {
    name: "Sarah Martin",
    role: "Chef de Projet",
    company: "TechCorp",
    content: "OmniTask a révolutionné notre gestion de projets. Interface intuitive et fonctionnalités parfaites.",
    rating: 5,
    avatar: "SM"
  },
  {
    name: "Pierre Dubois",
    role: "Freelance",
    company: "Independent",
    content: "Exactement ce qu'il me fallait. Simple, efficace et qui ne me fait pas perdre de temps.",
    rating: 5,
    avatar: "PD"
  },
  {
    name: "Marie Chen",
    role: "Team Lead",
    company: "StartupXYZ",
    content: "Nos équipes ont adopté OmniTask immédiatement. La collaboration n'a jamais été aussi fluide.",
    rating: 5,
    avatar: "MC"
  }
]

const stats = [
  { value: '10K+', label: 'Utilisateurs actifs' },
  { value: '500K+', label: 'Tâches créées' },
  { value: '1K+', label: 'Projets livrés' },
  { value: '99.9%', label: 'Disponibilité' }
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-blue-600">
              OmniTask
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/features" className="text-gray-600 hover:text-gray-900 font-medium">
                Fonctionnalités
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 font-medium">
                Tarifs
              </Link>
              <Link href="/faq" className="text-gray-600 hover:text-gray-900 font-medium">
                FAQ
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Commencer gratuitement
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Star className="h-4 w-4 mr-2" />
                  Noté 4.9/5 par plus de 10 000 utilisateurs
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                  Organisez vos projets
                  <span className="text-blue-600"> avec intelligence</span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  La plateforme tout-en-un pour gérer vos tâches, collaborer en équipe 
                  et livrer vos projets à temps. Simple, puissant et conçu pour votre réussite.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link href="/register">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                      Commencer gratuitement
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                    <Play className="mr-2 h-5 w-5" />
                    Voir la démo (2 min)
                  </Button>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Gratuit pour toujours
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Aucune carte bancaire
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Configuration en 2 minutes
                  </div>
                </div>
              </div>
              
              {/* Hero Image/Demo */}
              <div className="relative">
                <div className="bg-white rounded-xl shadow-2xl p-4 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="bg-gray-100 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Projet Marketing Q1</h3>
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div className="bg-white rounded p-3">
                        <div className="text-gray-600 mb-2">À faire</div>
                        <div className="space-y-2">
                          <div className="bg-blue-100 text-blue-800 p-2 rounded">Recherche marché</div>
                          <div className="bg-purple-100 text-purple-800 p-2 rounded">Wireframes</div>
                        </div>
                      </div>
                      <div className="bg-white rounded p-3">
                        <div className="text-gray-600 mb-2">En cours</div>
                        <div className="space-y-2">
                          <div className="bg-orange-100 text-orange-800 p-2 rounded">Design UI</div>
                        </div>
                      </div>
                      <div className="bg-white rounded p-3">
                        <div className="text-gray-600 mb-2">Terminé</div>
                        <div className="space-y-2">
                          <div className="bg-green-100 text-green-800 p-2 rounded">Brief projet</div>
                          <div className="bg-green-100 text-green-800 p-2 rounded">Kick-off meeting</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-gray-600">Ils nous font confiance</p>
            </div>
            <TrustBadges />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Tout ce dont vous avez besoin pour réussir
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Des fonctionnalités pensées pour maximiser votre productivité et celle de votre équipe.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="text-center group">
                    <div className="p-4 bg-blue-100 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                OmniTask en chiffres
              </h2>
              <p className="text-xl text-blue-100">
                Une croissance qui témoigne de la confiance de nos utilisateurs
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-blue-100">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ce que disent nos utilisateurs
              </h2>
              <p className="text-xl text-gray-600">
                Découvrez pourquoi plus de 10 000 professionnels choisissent OmniTask
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-4 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role} • {testimonial.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Prêt à transformer votre productivité ?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Rejoignez des milliers d'utilisateurs qui organisent déjà leurs projets avec OmniTask. 
              Gratuit pour commencer, sans engagement.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900 text-lg px-8 py-3">
                  Demander une démo
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Configuration en 2 minutes
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Support francophone
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Données sécurisées en Europe
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-white font-bold text-xl mb-4">OmniTask</div>
              <p className="text-gray-400 text-sm mb-4">
                La plateforme de gestion de projets qui s'adapte à votre façon de travailler.
              </p>
              <div className="flex space-x-4">
                {/* Social icons could go here */}
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="text-gray-400 hover:text-white">Fonctionnalités</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white">Tarifs</Link></li>
                <li><Link href="/integrations" className="text-gray-400 hover:text-white">Intégrations</Link></li>
                <li><Link href="/api" className="text-gray-400 hover:text-white">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link href="/guides" className="text-gray-400 hover:text-white">Guides</Link></li>
                <li><Link href="/status" className="text-gray-400 hover:text-white">Statut</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-gray-400 hover:text-white">À propos</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Confidentialité</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white">Conditions</Link></li>
                <li><Link href="/security" className="text-gray-400 hover:text-white">Sécurité</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              &copy; 2025 OmniTask. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>

      <CookieBanner />
      <FeedbackWidget />
    </div>
  )
}