'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import Link from 'next/link'
import { 
  Mail,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle,
  Send
} from 'lucide-react'

const contactMethods = [
  {
    icon: Mail,
    title: 'Email',
    description: 'support@omnitask.fr',
    response: 'Réponse sous 2h en moyenne',
    color: 'blue'
  },
  {
    icon: Phone,
    title: 'Téléphone',
    description: '+33 1 84 88 32 44',
    response: 'Lun-Ven 9h-18h (Plan Team)',
    color: 'green'
  },
  {
    icon: MessageSquare,
    title: 'Chat en direct',
    description: 'Disponible dans l\'app',
    response: 'Instantané pendant les heures ouvrées',
    color: 'purple'
  }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    plan: 'gratuit',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simuler l'envoi
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Message envoyé !
          </h2>
          <p className="text-gray-600 mb-6">
            Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard">
              <Button className="w-full">
                Accéder au tableau de bord
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsSubmitted(false)
                setFormData({
                  name: '',
                  email: '',
                  company: '',
                  plan: 'gratuit',
                  subject: '',
                  message: ''
                })
              }}
              className="w-full"
            >
              Nouveau message
            </Button>
          </div>
        </div>
      </div>
    )
  }

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
              <Link href="/faq" className="text-gray-600 hover:text-gray-900">
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
            Contactez notre équipe
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Une question ? Un problème ? Une suggestion ? Notre équipe support francophone 
            est là pour vous accompagner dans votre réussite.
          </p>
          <div className="inline-flex items-center bg-green-50 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <Clock className="h-4 w-4 mr-2" />
            Temps de réponse moyen : 2 heures
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => {
              const Icon = method.icon
              return (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <div className={`p-4 bg-${method.color}-100 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                    <Icon className={`h-8 w-8 text-${method.color}-600`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-900 font-medium mb-1">
                    {method.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    {method.response}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Envoyez-nous un message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entreprise
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nom de votre entreprise"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plan actuel
                    </label>
                    <select
                      name="plan"
                      value={formData.plan}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="gratuit">Gratuit</option>
                      <option value="pro">Pro</option>
                      <option value="team">Team</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Résumé de votre demande"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Décrivez votre demande en détail..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  {isSubmitting ? (
                    'Envoi en cours...'
                  ) : (
                    <>
                      Envoyer le message
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Info Panel */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Informations utiles
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Support technique</h4>
                  <p className="text-gray-600 text-sm">
                    Pour les problèmes techniques, n'hésitez pas à inclure : votre navigateur, 
                    le plan utilisé, et une description détaillée du problème.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Demandes commerciales</h4>
                  <p className="text-gray-600 text-sm">
                    Pour les devis, démonstrations ou questions sur les plans Enterprise, 
                    notre équipe commerciale vous répondra sous 4h.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Partenariats</h4>
                  <p className="text-gray-600 text-sm">
                    Intéressé par un partenariat ou une intégration ? Contactez-nous 
                    avec les détails de votre proposition.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Urgences</h4>
                  <p className="text-gray-600 text-sm">
                    Pour les urgences critiques (utilisateurs Plan Team), appelez 
                    directement notre hotline au +33 1 84 88 32 44.
                  </p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Le saviez-vous ?</h4>
                <p className="text-blue-800 text-sm">
                  95% de nos utilisateurs trouvent leurs réponses dans notre 
                  <Link href="/faq" className="font-medium underline ml-1">FAQ détaillée</Link>. 
                  Jetez-y un œil avant de nous écrire !
                </p>
              </div>
            </div>
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
              <Link href="/contact" className="hover:text-white">
                Contact
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