# Stratégie d'Unification des Composants Upload - OmniScan

## Analyse de l'existant

### Composants Upload actuels (5 fichiers, ~1236 lignes)

1. **UploadPage.tsx** (246 lignes)
   - Utilise l'authentification via `useAuth()`
   - Navigation avec React Router
   - Polling du statut de document
   - UI complète avec header et navigation

2. **UploadWithAuth.tsx** (387 lignes) 
   - Gestion complète des quotas (connecté/non-connecté)
   - Configuration des clés API
   - Modal de configuration d'analyse
   - Support multi-providers IA
   - Cache local des scans

3. **UploadUnified.tsx** (279 lignes)
   - Tentative d'unification avec modes (simple/authenticated/demo)
   - Utilise `useDocumentUpload` hook
   - Options d'analyse configurables
   - Support batch upload

4. **UploadSimple.tsx** (319 lignes)
   - Version standalone avec paywall
   - Polling avec progression détaillée
   - Gestion des quotas via API
   - Affichage des résultats optimisé

5. **UploadSimpleWrapper.tsx** (5 lignes)
   - Simple wrapper sans logique

### Services API dupliqués

- **api.ts** : Auth Bearer, upload simple
- **api-simple.ts** : Polling jobs, clés API custom
- Potentiellement api-unified.ts et api-client.ts

### Code dupliqué identifié

1. **Zone Dropzone** (~50 lignes x 4 = 200 lignes)
   ```tsx
   <div {...getRootProps()} className={...}>
     <input {...getInputProps()} />
     {/* Icônes et textes répétés */}
   </div>
   ```

2. **Affichage résultats** (~100 lignes x 4 = 400 lignes)
   - Texte extrait
   - Analyse IA
   - Métadonnées
   - Actions (copier, télécharger)

3. **Gestion quotas** (~50 lignes x 3 = 150 lignes)
   - Calcul des scans restants
   - Affichage progress bar
   - Messages d'alerte

4. **Upload logic** (~80 lignes x 4 = 320 lignes)
   - FormData création
   - Headers configuration
   - Error handling
   - Progress tracking

**Total estimé : ~1070 lignes de code dupliqué**

## Stratégie d'unification proposée

### 1. Créer des composants atomiques

```typescript
// components/upload/DropZone.tsx
interface DropZoneProps {
  onDrop: (files: File[]) => void
  isLoading?: boolean
  isDragActive?: boolean
  accept?: Accept
  maxSize?: number
  maxFiles?: number
  className?: string
}

// components/upload/QuotaDisplay.tsx  
interface QuotaDisplayProps {
  used: number
  limit: number
  isPro?: boolean
  variant?: 'compact' | 'detailed'
}

// components/upload/UploadProgress.tsx
interface UploadProgressProps {
  status: JobStatus
  fileName?: string
}

// components/upload/ResultsView.tsx
interface ResultsViewProps {
  result: AnalysisResult
  onCopy?: () => void
  onDownload?: () => void
  onNewScan?: () => void
  showRawText?: boolean
  showAIAnalysis?: boolean
}
```

### 2. Unifier les hooks

```typescript
// hooks/useUpload.ts - Hook unifié
export function useUpload(options?: UploadOptions) {
  const { mode = 'simple' } = options
  
  // Logique commune
  const [state, setState] = useState<UploadState>()
  const { checkQuota, updateQuota } = useQuota()
  const { uploadFile, pollStatus } = useAPI()
  
  // Variations selon le mode
  const upload = useCallback(async (file: File, config?: AnalysisConfig) => {
    if (!checkQuota()) {
      // Gérer quota exceeded
      return
    }
    
    // Upload logic commune
    const result = await uploadFile(file, config)
    updateQuota()
    
    return result
  }, [mode])
  
  return {
    upload,
    state,
    // ... autres méthodes
  }
}
```

### 3. Composant Upload unifié

```typescript
// features/upload/Upload.tsx
interface UploadProps {
  // Configuration du mode
  mode?: 'simple' | 'authenticated' | 'demo' | 'page'
  
  // Features à activer/désactiver
  features?: {
    quota?: boolean
    apiKeys?: boolean
    analysisConfig?: boolean
    navigation?: boolean
    cache?: boolean
  }
  
  // Personnalisation UI
  ui?: {
    showHeader?: boolean
    showExamples?: boolean
    compactMode?: boolean
  }
  
  // Callbacks
  onUploadSuccess?: (result: any) => void
  onQuotaExceeded?: () => void
  
  // Configuration
  config?: {
    maxFileSize?: number
    acceptedFormats?: string[]
    apiEndpoint?: string
  }
}

export function Upload({ 
  mode = 'simple',
  features = {},
  ui = {},
  ...props 
}: UploadProps) {
  const upload = useUpload({ mode })
  
  return (
    <div className="upload-container">
      {ui.showHeader && <UploadHeader mode={mode} />}
      
      {features.quota && <QuotaDisplay {...upload.quotaInfo} />}
      
      <Card>
        <CardContent>
          <DropZone 
            onDrop={upload.handleDrop}
            isLoading={upload.isUploading}
          />
        </CardContent>
      </Card>
      
      {upload.result && (
        <ResultsView 
          result={upload.result}
          onNewScan={upload.reset}
        />
      )}
      
      {features.apiKeys && <ApiKeyManager />}
    </div>
  )
}
```

### 4. Migration des usages

```typescript
// App.tsx - Remplacer les différentes versions
function App() {
  return (
    <Routes>
      {/* Avant: <UploadPage /> */}
      <Route path="/upload" element={
        <Upload 
          mode="page"
          features={{ quota: true, navigation: true }}
          ui={{ showHeader: true }}
        />
      } />
      
      {/* Avant: <UploadSimple /> */}
      <Route path="/scan" element={
        <Upload 
          mode="simple"
          features={{ quota: true }}
        />
      } />
      
      {/* Avant: <UploadWithAuth /> */}
      <Route path="/pro" element={
        <Upload 
          mode="authenticated"
          features={{ quota: true, apiKeys: true, analysisConfig: true }}
          ui={{ showExamples: true }}
        />
      } />
    </Routes>
  )
}
```

### 5. Unifier les services API

```typescript
// services/api/upload.service.ts
export class UploadService {
  private client: AxiosInstance
  
  constructor(config?: ApiConfig) {
    this.client = createApiClient(config)
  }
  
  // Méthode unifiée pour tous les types d'upload
  async upload(file: File, options?: UploadOptions) {
    const formData = this.createFormData(file, options)
    
    // Simple upload ou avec job selon config
    if (options?.useJobQueue) {
      return this.uploadWithJob(formData)
    }
    
    return this.uploadDirect(formData)
  }
  
  private async uploadWithJob(formData: FormData) {
    const { job_id } = await this.client.post('/upload/job', formData)
    return this.pollJob(job_id)
  }
  
  private async uploadDirect(formData: FormData) {
    return this.client.post('/upload/direct', formData)
  }
}
```

## Plan de migration

### Phase 1 : Créer les composants atomiques (2h)
1. ✅ Créer DropZone.tsx
2. ✅ Créer QuotaDisplay.tsx  
3. ✅ Créer UploadProgress.tsx
4. ✅ Créer ResultsView.tsx
5. ✅ Tests unitaires

### Phase 2 : Unifier les hooks et services (3h)
1. ✅ Créer useUpload hook unifié
2. ✅ Unifier les services API
3. ✅ Migrer useDocumentUpload
4. ✅ Tests d'intégration

### Phase 3 : Créer le composant unifié (2h)
1. ✅ Implémenter Upload.tsx
2. ✅ Gérer tous les modes
3. ✅ Documentation props
4. ✅ Storybook stories

### Phase 4 : Migration et nettoyage (3h)
1. ✅ Remplacer UploadPage
2. ✅ Remplacer UploadSimple
3. ✅ Remplacer UploadWithAuth
4. ✅ Supprimer UploadUnified (remplacé)
5. ✅ Supprimer code dupliqué
6. ✅ Tests E2E

## Bénéfices attendus

1. **Réduction du code** : ~1200 lignes → ~400 lignes (-67%)
2. **Maintenabilité** : 1 composant au lieu de 5
3. **Cohérence** : UI/UX uniforme
4. **Flexibilité** : Configuration par props
5. **Testabilité** : Composants isolés testables
6. **Performance** : Moins de re-renders, code optimisé

## Métriques de succès

- [ ] Tous les tests passent
- [ ] Coverage > 80%
- [ ] Bundle size réduit d'au moins 30%
- [ ] Temps de développement nouvelles features -50%
- [ ] 0 duplication selon SonarQube

## Risques et mitigation

1. **Régression fonctionnelle**
   - Mitigation : Tests E2E complets avant suppression ancien code

2. **Breaking changes**
   - Mitigation : Période de dépréciation avec warnings

3. **Complexité du composant unifié**
   - Mitigation : Composition over configuration

## Prochaines étapes

1. Valider la stratégie avec l'équipe
2. Créer une branche feature/upload-unification
3. Implémenter phase par phase
4. Review et merge progressif

---

*Document créé le 2025-08-13*
*Estimation totale : 10h de développement*