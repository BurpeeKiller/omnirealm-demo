import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  FileText, 
  Zap, 
  Shield, 
 
  BarChart3, 
  CheckCircle,
  Upload,
  FileSearch,
  Languages,
  Download,
  Users,
  Star,
  TrendingUp,
  Clock
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FileSearch className="w-6 h-6" />,
      title: 'OCR Intelligent',
      description: 'Extraction de texte haute précision depuis vos PDF et images avec Tesseract OCR'
    },
    {
      icon: <Languages className="w-6 h-6" />,
      title: 'Multilingue',
      description: 'Détection automatique et analyse en français, anglais, espagnol et plus'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Analyse IA',
      description: 'Résumés intelligents, points clés et extraction d\'entités en temps réel'
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: 'Export Flexible',
      description: 'Téléchargez vos résultats en PDF, Excel ou JSON selon vos besoins'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Sécurité RGPD',
      description: 'Vos documents sont chiffrés et supprimés automatiquement après 30 jours'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'API Puissante',
      description: 'Intégrez OmniScan dans vos applications avec notre API REST complète'
    }
  ];

  const testimonials = [
    {
      name: "Marie Dupont",
      role: "Responsable Administrative",
      company: "TechCorp",
      content: "OmniScan a divisé par 5 notre temps de traitement des factures. L'extraction automatique des montants et dates est remarquable.",
      rating: 5
    },
    {
      name: "Jean-Marc Laurent",
      role: "Avocat",
      company: "Cabinet Laurent & Associés",
      content: "Parfait pour analyser rapidement des contrats volumineux. Les résumés IA nous font gagner des heures chaque semaine.",
      rating: 5
    },
    {
      name: "Sophie Chen",
      role: "Data Analyst",
      company: "DataVision",
      content: "L'API est simple à intégrer et très fiable. Nous traitons maintenant 10 000 documents par jour sans effort.",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Gratuit",
      price: "0€",
      period: "",
      features: [
        "3 scans par mois",
        "OCR basique",
        "Export PDF uniquement",
        "Support communautaire"
      ],
      cta: "Commencer gratuitement",
      highlighted: false
    },
    {
      name: "Pro",
      price: "49€",
      period: "/mois",
      features: [
        "500 scans par mois",
        "Tous formats d'export",
        "API avec 10K requêtes",
        "Templates prédéfinis",
        "Support prioritaire"
      ],
      cta: "Essai gratuit 14 jours",
      highlighted: true
    },
    {
      name: "Business",
      price: "149€",
      period: "/mois",
      features: [
        "Scans illimités",
        "API illimitée",
        "Templates personnalisés",
        "Webhooks avancés",
        "Account Manager dédié"
      ],
      cta: "Contactez-nous",
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">OmniScan</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition">Fonctionnalités</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition">Tarifs</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition">Témoignages</a>
              <Link to="/login" className="text-gray-600 hover:text-gray-900 transition">Connexion</Link>
              <button 
                onClick={() => navigate('/upload')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Essayer gratuitement
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              +150% de productivité pour nos 500+ clients
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              Transformez vos documents <br />
              <span className="text-blue-600">en données exploitables</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              OmniScan utilise l'OCR avancé et l'IA pour extraire, analyser et structurer 
              le contenu de vos documents en quelques secondes. Factures, contrats, rapports... 
              tout devient searchable et analysable.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={() => navigate('/upload')}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition flex items-center justify-center"
              >
                Essayer gratuitement
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate('/pricing')}
                className="bg-white text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-lg text-lg font-medium hover:border-gray-300 transition"
              >
                Voir les tarifs
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                <span>RGPD Compliant</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span>500+ Entreprises</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>Support 24/7</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Demo */}
          <div className="mt-16 relative">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-xl">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Upload className="w-6 h-6 text-blue-600 mr-3" />
                  <span className="font-semibold text-gray-900">Glissez votre document ici</span>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">PDF, JPG, PNG jusqu'à 50MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des fonctionnalités puissantes pour transformer votre gestion documentaire
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-blue-100">Précision OCR</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">2.5M+</div>
              <div className="text-blue-100">Documents traités</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-100">Entreprises clientes</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">4.9/5</div>
              <div className="text-blue-100">Note moyenne</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez comment OmniScan transforme le quotidien de nos clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tarifs simples et transparents
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choisissez le plan qui correspond à vos besoins. Sans engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-xl p-8 ${
                  plan.highlighted 
                    ? 'ring-2 ring-blue-600 shadow-xl scale-105' 
                    : 'shadow-sm'
                }`}
              >
                {plan.highlighted && (
                  <div className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                    Plus populaire
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => navigate(plan.name === 'Business' ? '/contact' : '/signup')}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition ${
                    plan.highlighted
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à transformer vos documents ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez plus de 500 entreprises qui ont déjà optimisé leur gestion documentaire
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition inline-flex items-center"
          >
            Démarrer gratuitement
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
          <p className="text-blue-100 mt-4">
            Pas de carte bancaire requise • 3 scans gratuits
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <FileText className="w-6 h-6 text-white" />
                <span className="ml-2 text-lg font-bold text-white">OmniScan</span>
              </div>
              <p className="text-sm">
                La solution d'OCR et d'analyse documentaire propulsée par l'IA
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition">Fonctionnalités</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Tarifs</a></li>
                <li><Link to="/api-docs" className="hover:text-white transition">API</Link></li>
                <li><Link to="/changelog" className="hover:text-white transition">Changelog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white transition">À propos</Link></li>
                <li><Link to="/blog" className="hover:text-white transition">Blog</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><Link to="/careers" className="hover:text-white transition">Carrières</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/legal" className="hover:text-white transition">Mentions légales</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition">Confidentialité</Link></li>
                <li><Link to="/cgu" className="hover:text-white transition">CGU</Link></li>
                <li><Link to="/cookies" className="hover:text-white transition">Cookies</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>&copy; 2025 OmniScan. Tous droits réservés. Made with ❤️ in France</p>
          </div>
        </div>
      </footer>
    </div>
  );
};