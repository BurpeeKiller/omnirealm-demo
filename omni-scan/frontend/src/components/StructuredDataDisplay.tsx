import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui'
import { FileText, Calendar, Euro, User, Building, Hash } from 'lucide-react'

interface StructuredDataDisplayProps {
  data: any
  type?: string
}

export function StructuredDataDisplay({ data, type }: StructuredDataDisplayProps) {
  if (!data || (data.confidence && data.confidence < 0.5)) return null

  // Affichage pour factures
  if (data.type === 'invoice' || type === 'invoice') {
    const invoiceData = data.data || {}
    
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Données de facture extraites
            </div>
            <Badge variant="secondary" className="text-xs">
              Confiance: {Math.round((data.confidence || 0) * 100)}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Numéro de facture */}
            {invoiceData.invoice_number && (
              <div className="flex items-start gap-3">
                <Hash className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">N° Facture</p>
                  <p className="font-medium">{invoiceData.invoice_number}</p>
                </div>
              </div>
            )}
            
            {/* Date */}
            {invoiceData.date && (
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{invoiceData.date}</p>
                </div>
              </div>
            )}
            
            {/* Montant TTC */}
            {invoiceData.total_amount && (
              <div className="flex items-start gap-3">
                <Euro className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Montant TTC</p>
                  <p className="font-medium text-lg">{invoiceData.total_amount.toFixed(2)}€</p>
                </div>
              </div>
            )}
            
            {/* TVA */}
            {invoiceData.tax_amount && (
              <div className="flex items-start gap-3">
                <Euro className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">TVA</p>
                  <p className="font-medium">{invoiceData.tax_amount.toFixed(2)}€</p>
                </div>
              </div>
            )}
            
            {/* Vendeur */}
            {invoiceData.vendor && (
              <div className="flex items-start gap-3">
                <Building className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Vendeur</p>
                  <p className="font-medium">{invoiceData.vendor}</p>
                </div>
              </div>
            )}
            
            {/* Client */}
            {invoiceData.client && (
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Client</p>
                  <p className="font-medium">{invoiceData.client}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Lignes d'articles */}
          {data.line_items && data.line_items.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h4 className="font-medium mb-3">Articles / Services</h4>
              <div className="space-y-2">
                {data.line_items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center py-1">
                    <span className="text-sm text-gray-700">{item.description}</span>
                    <span className="font-medium">{item.amount.toFixed(2)}€</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Conditions de paiement */}
          {invoiceData.payment_terms && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Conditions de paiement :</span> {invoiceData.payment_terms}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Affichage générique pour autres types
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Données structurées extraites
        </CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </CardContent>
    </Card>
  )
}