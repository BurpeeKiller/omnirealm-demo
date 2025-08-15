import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Link } from 'react-router-dom'
import { ArrowLeft, Building, Mail, Phone, Globe } from 'lucide-react'

export function Legal() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'application
        </Link>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Mentions Légales</CardTitle>
            <p className="text-gray-500 mt-2">Conformément à la loi pour la confiance dans l'économie numérique (LCEN)</p>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <h2>1. Éditeur du Site</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="flex items-start gap-2 mb-2">
                <Building className="w-5 h-5 text-gray-600 mt-1" />
                <span>
                  <strong>OmniScan SAS</strong><br />
                  Société par Actions Simplifiée au capital de [MONTANT]€<br />
                  [Adresse du siège social]<br />
                  [Code postal] [Ville]
                </span>
              </p>
              <p className="mb-2">
                <strong>RCS</strong> : [Ville] [Numéro]<br />
                <strong>SIRET</strong> : [Numéro SIRET]<br />
                <strong>TVA Intracommunautaire</strong> : FR[Numéro]
              </p>
              <p className="mb-2">
                <strong>Directeur de la publication</strong> : [Nom du dirigeant]
              </p>
            </div>

            <h2>2. Contact</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="flex items-center gap-2 mb-2">
                <Mail className="w-5 h-5 text-gray-600" />
                <span><strong>Email</strong> : contact@omniscan.app</span>
              </p>
              <p className="flex items-center gap-2 mb-2">
                <Phone className="w-5 h-5 text-gray-600" />
                <span><strong>Téléphone</strong> : +33 (0)1 XX XX XX XX</span>
              </p>
              <p className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-600" />
                <span><strong>Site web</strong> : https://omniscan.app</span>
              </p>
            </div>

            <h2>3. Hébergement</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p>
                <strong>OVH SAS</strong><br />
                2 rue Kellermann<br />
                59100 Roubaix - France<br />
                Téléphone : 1007<br />
                Email : support@ovh.com<br />
                Site : www.ovh.com
              </p>
            </div>

            <h2>4. Propriété Intellectuelle</h2>
            <p>
              L'ensemble du contenu de ce site (structure, textes, logos, images, vidéos, etc.) 
              est la propriété exclusive d'OmniScan SAS ou de ses partenaires. Toute reproduction, 
              représentation, modification, publication, adaptation totale ou partielle de l'un 
              quelconque de ces éléments est strictement interdite sans autorisation écrite préalable.
            </p>
            
            <p>
              La marque OmniScan® est une marque déposée. Toute utilisation non autorisée est 
              susceptible de constituer une contrefaçon engageant la responsabilité civile et 
              pénale du contrefacteur.
            </p>

            <h2>5. Protection des Données Personnelles</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la 
              loi Informatique et Libertés, vous disposez de droits sur vos données personnelles.
            </p>
            <p>
              Pour plus d'informations, consultez notre{' '}
              <Link to="/privacy" className="text-blue-600 hover:underline">
                Politique de Confidentialité
              </Link>.
            </p>
            <p>
              <strong>Délégué à la Protection des Données (DPO)</strong> : dpo@omniscan.app
            </p>

            <h2>6. Cookies</h2>
            <p>
              Ce site utilise des cookies. Pour en savoir plus, consultez notre{' '}
              <Link to="/cookies" className="text-blue-600 hover:underline">
                Politique de Cookies
              </Link>.
            </p>

            <h2>7. Conditions d'Utilisation</h2>
            <p>
              L'utilisation de ce site implique l'acceptation pleine et entière des{' '}
              <Link to="/terms" className="text-blue-600 hover:underline">
                Conditions Générales d'Utilisation
              </Link>.
            </p>

            <h2>8. Responsabilité</h2>
            <p>
              OmniScan SAS s'efforce d'assurer l'exactitude et la mise à jour des informations 
              diffusées sur ce site. Toutefois, OmniScan SAS ne peut garantir l'exactitude, 
              la précision ou l'exhaustivité des informations mises à disposition sur ce site.
            </p>

            <h2>9. Droit Applicable et Juridiction</h2>
            <p>
              Les présentes mentions légales sont régies par le droit français. En cas de litige, 
              et après échec de toute tentative de recherche d'une solution amiable, les tribunaux 
              français seront seuls compétents.
            </p>

            <h2>10. Crédits</h2>
            <p>
              <strong>Conception et développement</strong> : OmniRealm<br />
              <strong>Technologies utilisées</strong> : React, FastAPI, Tesseract OCR<br />
              <strong>IA</strong> : OpenAI, Anthropic Claude
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
              <p className="text-blue-700 mb-0">
                <strong>Note</strong> : Ces mentions légales sont un modèle à adapter avec les 
                informations réelles de votre société. Consultez un juriste pour vous assurer 
                de la conformité légale.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}