'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import Link from 'next/link'
import { 
  ChevronDown,
  ChevronUp,
  Search,
  BookOpen,
  Users,
  CreditCard,
  Shield,
  Settings,
  Headphones
} from 'lucide-react'

const faqCategories = [
  {
    id: 'general',
    name: 'Général',
    icon: BookOpen,
    faqs: [
      {
        question: "Qu'est-ce qu'OmniTask ?",
        answer: "OmniTask est une plateforme complète de gestion de tâches et projets. Elle combine un tableau Kanban intuitif, la gestion multi-projets, des statistiques avancées et la collaboration d'équipe dans une interface moderne et performante."
      },
      {
        question: "Comment commencer avec OmniTask ?",
        answer: "Créez simplement un compte gratuit en 30 secondes. Vous aurez immédiatement accès à toutes les fonctionnalités de base : création de projets, gestion de tâches via Kanban, et statistiques. Aucune carte bancaire requise."
      },
      {
        question: "OmniTask fonctionne-t-il hors ligne ?",
        answer: "Oui ! Notre PWA (Progressive Web App) permet de consulter et modifier vos tâches même sans connexion internet. Toutes les modifications sont automatiquement synchronisées dès que vous retrouvez une connexion."
      },
      {
        question: "Sur quelles plateformes OmniTask est-il disponible ?",
        answer: "OmniTask fonctionne sur tous les navigateurs modernes (Chrome, Firefox, Safari, Edge) et peut être installé comme une application native sur mobile et desktop grâce à la technologie PWA."
      }
    ]
  },
  {
    id: 'collaboration',
    name: 'Collaboration',
    icon: Users,
    faqs: [
      {
        question: "Comment inviter des collaborateurs ?",
        answer: "Dans un projet, cliquez sur 'Partager' puis saisissez les emails de vos collaborateurs. Ils recevront une invitation par email et pourront rejoindre le projet instantanément. Vous pouvez définir leurs permissions : lecture seule, édition, ou administration."
      },
      {
        question: "Combien de personnes peuvent collaborer sur un projet ?",
        answer: "Plan Gratuit : vous seul. Plan Pro : jusqu'à 5 collaborateurs par projet. Plan Team : collaborateurs illimités avec gestion avancée des permissions et espaces de travail multiples."
      },
      {
        question: "Comment fonctionne le système de notifications ?",
        answer: "Recevez des notifications en temps réel pour : nouvelles tâches assignées, commentaires sur vos tâches, échéances approchantes, et mises à jour de projets. Personnalisez vos préférences dans les paramètres."
      },
      {
        question: "Peut-on attribuer des tâches à des personnes spécifiques ?",
        answer: "Absolument ! Chaque tâche peut être assignée à un ou plusieurs collaborateurs. L'assigné reçoit une notification et la tâche apparaît dans sa vue personnalisée. Idéal pour le suivi des responsabilités."
      }
    ]
  },
  {
    id: 'pricing',
    name: 'Tarifs et Abonnements',
    icon: CreditCard,
    faqs: [
      {
        question: "Le plan gratuit a-t-il des limitations de durée ?",
        answer: "Non ! Le plan gratuit est permanent et inclut 3 projets, tâches illimitées, tableau Kanban et export basique. C'est parfait pour tester OmniTask ou gérer des projets personnels."
      },
      {
        question: "Comment fonctionne la période d'essai ?",
        answer: "Tous les plans payants incluent 14 jours d'essai gratuit complet. Aucune carte bancaire requise pendant l'essai. Si vous n'êtes pas convaincu, votre compte revient automatiquement au plan gratuit."
      },
      {
        question: "Puis-je annuler mon abonnement à tout moment ?",
        answer: "Oui, résiliation possible en un clic depuis vos paramètres. Votre abonnement reste actif jusqu'à la fin de la période payée, puis votre compte passe automatiquement au plan gratuit sans perte de données."
      },
      {
        question: "Proposez-vous des remises pour les associations ou étudiants ?",
        answer: "Oui ! 50% de réduction sur tous les plans payants pour les étudiants (avec justificatif) et organisations à but non lucratif. Contactez notre support pour obtenir votre code promo."
      },
      {
        question: "Acceptez-vous les paiements par virement bancaire ?",
        answer: "Pour les plans Team et les abonnements annuels, nous acceptons les virements bancaires et pouvons émettre des devis sur demande. Idéal pour les entreprises avec des processus comptables spécifiques."
      }
    ]
  },
  {
    id: 'security',
    name: 'Sécurité et Confidentialité',
    icon: Shield,
    faqs: [
      {
        question: "Mes données sont-elles sécurisées ?",
        answer: "Absolument ! Toutes les données sont chiffrées en transit (HTTPS/TLS) et au repos (AES-256). Hébergement sécurisé en Europe avec conformité RGPD complète. Backups automatiques chiffrés quotidiennement."
      },
      {
        question: "Qui peut accéder à mes projets ?",
        answer: "Seuls vous et les collaborateurs que vous invitez explicitement. Nos équipes techniques n'accèdent jamais à vos données sauf demande express de support de votre part. Chaque projet a ses propres permissions."
      },
      {
        question: "OmniTask est-il conforme au RGPD ?",
        answer: "Oui, conformité RGPD complète depuis 2018. Droit à l'oubli, portabilité des données, transparence totale sur leur utilisation. Nos serveurs sont en Europe et respectent les standards les plus stricts."
      },
      {
        question: "Que se passe-t-il si je supprime mon compte ?",
        answer: "Toutes vos données sont définitivement supprimées sous 30 jours. Vous pouvez exporter toutes vos données avant suppression. Les projets partagés continuent d'exister pour les autres collaborateurs."
      }
    ]
  },
  {
    id: 'features',
    name: 'Fonctionnalités',
    icon: Settings,
    faqs: [
      {
        question: "Qu'est-ce que l'assistant IA d'OmniTask ?",
        answer: "Notre IA analyse vos habitudes de travail et suggère automatiquement : réorganisation de tâches, estimations de temps réalistes, détection de goulots d'étranglement, et optimisation de votre planning quotidien."
      },
      {
        question: "Puis-je personnaliser mon tableau Kanban ?",
        answer: "Complètement ! Ajoutez/supprimez des colonnes, changez les couleurs, définissez des limites WIP (Work In Progress), et créez des vues filtrées par projet, assigné, ou priorité."
      },
      {
        question: "Comment fonctionnent les intégrations ?",
        answer: "OmniTask se connecte à 50+ outils : Slack (notifications automatiques), Google Calendar (synchronisation échéances), GitHub (création de tâches depuis les issues), Zapier (automatisations personnalisées), et bien plus."
      },
      {
        question: "Puis-je importer mes données depuis d'autres outils ?",
        answer: "Oui ! Import direct depuis : Trello (tableaux et cartes), Asana (projets et tâches), CSV/Excel (format personnalisé), et API pour migrations complexes. Notre équipe peut vous accompagner pour de gros volumes."
      },
      {
        question: "Les rapports sont-ils personnalisables ?",
        answer: "Plans Pro/Team incluent des rapports avancés : vélocité d'équipe, temps passé par projet, analyse de productivité, graphiques de burn-down, et exports PDF/Excel avec filtres personnalisés."
      }
    ]
  },
  {
    id: 'support',
    name: 'Support et Aide',
    icon: Headphones,
    faqs: [
      {
        question: "Comment contacter le support ?",
        answer: "Plan Gratuit : documentation et communauté. Plan Pro : support email sous 24h. Plan Team : support téléphonique + gestionnaire de compte dédié. Tous les utilisateurs ont accès à notre base de connaissances complète."
      },
      {
        question: "Dans quelles langues OmniTask est-il disponible ?",
        answer: "Interface complètement traduite en français, anglais, espagnol, allemand et italien. Support client francophone disponible de 9h à 18h (heure de Paris) du lundi au vendredi."
      },
      {
        question: "Proposez-vous des formations pour les équipes ?",
        answer: "Plan Team inclut : session de formation initiale (2h), webinaires mensuels sur les bonnes pratiques, et formation personnalisée pour les équipes de 10+ personnes. Certifications disponibles."
      },
      {
        question: "Y a-t-il une API pour développer des intégrations personnalisées ?",
        answer: "Oui ! API REST complète avec authentification OAuth2. Documentation développeur détaillée, SDKs JavaScript/Python, et sandbox de test. Rate limiting généreux : 1000 requêtes/heure en gratuit, illimité en payant."
      }
    ]
  }
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0)

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
              <Link href="/features" className="text-gray-600 hover:text-gray-900">
                Fonctionnalités
              </Link>
              <Link href="/faq" className="text-blue-600 font-medium">
                FAQ
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
            Questions fréquentes
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Trouvez rapidement les réponses à toutes vos questions sur OmniTask. 
            Notre équipe support est là pour vous aider.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher dans la FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Catégories
                </h3>
                <nav className="space-y-2">
                  {faqCategories.map((category) => {
                    const Icon = category.icon
                    const isActive = selectedCategory === category.id
                    const hasResults = filteredFAQs.find(c => c.id === category.id)
                    
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center px-3 py-2 rounded-md text-left transition-colors ${
                          isActive 
                            ? 'bg-blue-100 text-blue-700' 
                            : hasResults
                            ? 'text-gray-700 hover:bg-gray-100'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={!hasResults}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {category.name}
                        {hasResults && (
                          <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                            {hasResults.faqs.length}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>

            {/* FAQ Items */}
            <div className="lg:col-span-3">
              {searchTerm ? (
                // Show all filtered results when searching
                <div className="space-y-8">
                  {filteredFAQs.map((category) => (
                    <div key={category.id} className="bg-white rounded-lg shadow-sm">
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center">
                          <category.icon className="h-6 w-6 text-blue-600 mr-3" />
                          <h2 className="text-xl font-semibold text-gray-900">
                            {category.name}
                          </h2>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {category.faqs.map((faq, index) => {
                          const itemId = `${category.id}-${index}`
                          const isOpen = openItems.includes(itemId)
                          
                          return (
                            <div key={index} className="p-6">
                              <button
                                onClick={() => toggleItem(itemId)}
                                className="w-full flex justify-between items-start text-left"
                              >
                                <h3 className="text-lg font-medium text-gray-900 pr-4">
                                  {faq.question}
                                </h3>
                                {isOpen ? (
                                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                )}
                              </button>
                              {isOpen && (
                                <div className="mt-4 text-gray-600 leading-relaxed">
                                  {faq.answer}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Show selected category only when not searching
                (() => {
                  const category = faqCategories.find(c => c.id === selectedCategory)
                  if (!category) return null
                  
                  return (
                    <div className="bg-white rounded-lg shadow-sm">
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center">
                          <category.icon className="h-6 w-6 text-blue-600 mr-3" />
                          <h2 className="text-xl font-semibold text-gray-900">
                            {category.name}
                          </h2>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {category.faqs.map((faq, index) => {
                          const itemId = `${category.id}-${index}`
                          const isOpen = openItems.includes(itemId)
                          
                          return (
                            <div key={index} className="p-6">
                              <button
                                onClick={() => toggleItem(itemId)}
                                className="w-full flex justify-between items-start text-left"
                              >
                                <h3 className="text-lg font-medium text-gray-900 pr-4">
                                  {faq.question}
                                </h3>
                                {isOpen ? (
                                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                )}
                              </button>
                              {isOpen && (
                                <div className="mt-4 text-gray-600 leading-relaxed">
                                  {faq.answer}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })()
              )}
              
              {filteredFAQs.length === 0 && searchTerm && (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun résultat trouvé
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Essayez avec d'autres mots-clés ou contactez notre support.
                  </p>
                  <Link href="/contact">
                    <Button>Contacter le support</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Vous ne trouvez pas votre réponse ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Notre équipe support francophone est là pour vous aider. 
            Temps de réponse moyen : 2 heures en semaine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary">
                Contacter le support
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                Essayer gratuitement
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
              <Link href="/faq" className="hover:text-white">
                FAQ
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