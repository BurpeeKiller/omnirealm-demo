import { Link } from 'react-router-dom'
import { Shield, Mail, FileText } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* À propos */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">OmniScan</h3>
            <p className="text-sm text-gray-600">
              OCR et analyse intelligente de documents. 
              Aucun stockage, 100% sécurisé.
            </p>
          </div>

          {/* Produit */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Produit</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-gray-900">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-600 hover:text-gray-900">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <a href="/api/docs" className="text-gray-600 hover:text-gray-900">
                  API
                </a>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Légal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  CGU
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-gray-600 hover:text-gray-900">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-600 hover:text-gray-900">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Contact
                </Link>
              </li>
              <li>
                <a href="mailto:support@omniscan.app" className="text-gray-600 hover:text-gray-900">
                  support@omniscan.app
                </a>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-gray-900">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {currentYear} OmniScan. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>🇫🇷 France</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-green-600" />
                RGPD Compliant
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}