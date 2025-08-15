import { Upload } from '@/components/upload'

export default function UploadSimpleWrapper() {
  return (
    <Upload
      mode="simple"
      features={{
        quota: true,
        apiKeys: false,
        paywall: true,
        cache: true
      }}
      ui={{
        showHeader: true,
        showExamples: false,
        compactMode: false
      }}
    />
  )
}