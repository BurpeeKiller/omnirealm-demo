/**
 * Page de test pour l'interface de sélection de zones OCR
 * 
 * UTILISATION:
 * 1. Ajouter cette route dans votre router: /test-ocr-zones
 * 2. Naviguer vers la page pour tester les fonctionnalités
 * 3. Supprimer ce fichier après validation
 */

import React from 'react'
import { UploadWithZones } from '@/components/ocr'

export default function TestOCRZones() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Test - OCR avec Zones</h1>
          <p className="text-gray-600 mt-2">
            Interface de test pour la fonctionnalité de sélection de zones interactives dans OmniScan
          </p>
        </div>

        <div className="space-y-8">
          {/* Composant principal */}
          <UploadWithZones />

          {/* Instructions de test */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">Instructions de test</h2>
            <div className="space-y-3 text-sm text-blue-800">
              <div>
                <strong>1. Upload :</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Uploadez une image (JPG, PNG) ou un PDF</li>
                  <li>• Formats supportés : PDF, JPG, PNG, TIFF, BMP</li>
                  <li>• Taille max : 50MB</li>
                </ul>
              </div>
              
              <div>
                <strong>2. Sélection de zones :</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Cliquez sur "Sélectionner" pour activer le mode sélection</li>
                  <li>• Glissez-déposez sur l'image pour créer des zones rectangulaires</li>
                  <li>• Créez jusqu'à 10 zones maximum</li>
                  <li>• Utilisez les boutons pour supprimer, réinitialiser ou tout sélectionner</li>
                </ul>
              </div>
              
              <div>
                <strong>3. Options :</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Langue : Auto-détection ou spécifique (FR, EN, DE, ES)</li>
                  <li>• Niveau : Rapide, Standard, Détaillé, Maximum</li>
                  <li>• Inclure image complète : traite aussi l'image entière</li>
                  <li>• Fusionner : combine les résultats des zones</li>
                </ul>
              </div>
              
              <div>
                <strong>4. Traitement :</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Cliquez "Démarrer l'OCR" pour lancer le traitement</li>
                  <li>• Suivez la progression via l'indicateur</li>
                  <li>• Les résultats s'affichent par zone et globalement</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cas de test recommandés */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-green-900 mb-4">Cas de test recommandés</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
              <div>
                <strong>Documents idéaux :</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Factures avec zones distinctes</li>
                  <li>• CV avec sections clairement délimitées</li>
                  <li>• Tableaux avec données structurées</li>
                  <li>• Formulaires avec champs séparés</li>
                </ul>
              </div>
              
              <div>
                <strong>Scénarios de test :</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Une seule zone (zone spécifique)</li>
                  <li>• Multiples zones (comparaison)</li>
                  <li>• Zones chevauchantes</li>
                  <li>• Image complète vs zones</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Informations de debug */}
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Debug & Monitoring</h2>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>Console du navigateur :</strong> Ouvrez pour voir les logs détaillés</p>
              <p><strong>Network :</strong> Vérifiez les appels API vers /api/v1/ocr/process-with-zones</p>
              <p><strong>Erreurs :</strong> Les erreurs sont loggées et un fallback automatique est implémenté</p>
              <p><strong>Performance :</strong> Les temps de traitement sont affichés dans les résultats</p>
            </div>
          </div>

          {/* Note pour la production */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-yellow-900 mb-4">⚠️ Note de développement</h2>
            <p className="text-sm text-yellow-800">
              Cette page est uniquement pour les tests de développement. 
              <strong> Supprimez ce fichier avant le déploiement en production.</strong>
              <br />
              L'intégration finale doit se faire via le composant <code>UploadWithZones</code> 
              dans vos pages existantes selon le guide d'intégration.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}