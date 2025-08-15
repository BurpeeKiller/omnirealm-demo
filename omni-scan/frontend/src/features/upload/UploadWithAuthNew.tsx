import { Upload } from '@/components/upload'

export function UploadWithAuthNew() {
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
        showExamples: true,
        compactMode: false
      }}
      config={{
        uploadOptions: {
          detailLevel: 'detailed',
          includeStructuredData: true,
          chapterSummaries: true
        }
      }}
      onUploadSuccess={(result) => {
        console.log('Upload avec auth réussi:', result)
      }}
    />
  )
}

// Export pour remplacer progressivement
export { UploadWithAuthNew as UploadWithAuth }