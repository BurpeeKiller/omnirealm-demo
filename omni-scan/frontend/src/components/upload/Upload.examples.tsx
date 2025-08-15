/**
 * Exemples d'utilisation du composant Upload unifié
 * pour remplacer les anciens composants
 */

import { Upload } from './Upload'

// 1. Remplacer UploadSimple
export function UploadSimpleExample() {
  return (
    <Upload
      mode="simple"
      features={{
        quota: true,
        apiKeys: false,
        paywall: true
      }}
      ui={{
        showHeader: true,
        compactMode: false
      }}
    />
  )
}

// 2. Remplacer UploadWithAuth
export function UploadWithAuthExample() {
  return (
    <Upload
      mode="authenticated"
      features={{
        quota: true,
        apiKeys: true,
        analysisConfig: true,
        cache: true,
        paywall: true
      }}
      ui={{
        showHeader: true,
        showExamples: true
      }}
      config={{
        uploadOptions: {
          detailLevel: 'detailed',
          includeStructuredData: true,
          chapterSummaries: true
        }
      }}
    />
  )
}

// 3. Remplacer UploadPage (avec navigation)
export function UploadPageExample() {
  return (
    <Upload
      mode="page"
      features={{
        quota: true,
        apiKeys: true,
        navigation: true,
        paywall: true
      }}
      ui={{
        showHeader: true,
        showExamples: false
      }}
    />
  )
}

// 4. Mode Demo (sans backend)
export function UploadDemoExample() {
  return (
    <Upload
      mode="demo"
      features={{
        quota: false,
        apiKeys: false,
        paywall: false
      }}
      ui={{
        showHeader: true,
        showExamples: true,
        compactMode: false
      }}
      onUploadSuccess={(result) => {
        console.log('Demo upload success:', result)
      }}
    />
  )
}

// 5. Mode Compact (pour intégration dans d'autres pages)
export function UploadCompactExample() {
  return (
    <Upload
      mode="simple"
      features={{
        quota: true,
        apiKeys: false
      }}
      ui={{
        showHeader: false,
        compactMode: true,
        className: "shadow-lg rounded-xl"
      }}
      config={{
        maxFileSize: 10 * 1024 * 1024, // 10MB
        acceptedFormats: {
          'application/pdf': ['.pdf']
        }
      }}
    />
  )
}

// 6. Avec callbacks personnalisés
export function UploadWithCallbacksExample() {
  return (
    <Upload
      mode="simple"
      features={{
        quota: true,
        paywall: true
      }}
      onUploadSuccess={(result) => {
        console.log('Upload réussi:', result)
        // Rediriger, afficher une notification, etc.
      }}
      onQuotaExceeded={() => {
        console.log('Quota dépassé!')
        // Afficher un message, proposer l'upgrade, etc.
      }}
      onError={(error) => {
        console.error('Erreur upload:', error)
        // Gérer l'erreur
      }}
    />
  )
}