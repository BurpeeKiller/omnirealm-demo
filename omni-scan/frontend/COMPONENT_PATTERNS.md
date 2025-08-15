# Patterns de Composants - OmniScan Frontend

## Vue d'ensemble

Ce document décrit les patterns et conventions utilisés dans l'architecture des composants OmniScan, particulièrement pour le système d'upload unifié.

## Architecture en couches

### 1. Composants Atomiques (`/components/upload/`)
Les plus petites unités réutilisables, sans logique métier.

```typescript
// Exemple : DropZone.tsx
interface DropZoneProps {
  onDrop: (files: File[]) => void
  isLoading?: boolean
  // ... autres props UI
}
```

**Caractéristiques :**
- Aucune dépendance métier
- Props simples et typées
- Focalisés sur l'UI
- Testables isolément

### 2. Hooks Métier (`/hooks/`)
Encapsulent la logique métier réutilisable.

```typescript
// Exemple : useUpload.ts
export function useUpload(options: UseUploadOptions) {
  // État
  const [state, setState] = useState<UploadState>()
  
  // Logique métier
  const upload = async (file: File) => {
    // Vérifications, API calls, etc.
  }
  
  return { state, upload, /* ... */ }
}
```

**Caractéristiques :**
- Gestion d'état locale
- Appels API
- Effets de bord contrôlés
- Réutilisables entre composants

### 3. Services (`/services/`)
Couche d'abstraction pour les APIs externes.

```typescript
// Exemple : upload.service.ts
export class UploadService {
  async upload(file: File, options: UploadOptions) {
    // Logique HTTP
  }
}
```

**Caractéristiques :**
- Singleton ou instances
- Gestion des headers/auth
- Transformation des données
- Gestion d'erreurs centralisée

### 4. Composants Configurables (`/components/upload/Upload.tsx`)
Assemblent les couches précédentes avec configuration flexible.

```typescript
interface UploadProps {
  mode?: 'simple' | 'authenticated' | 'demo'
  features?: UploadFeatures
  ui?: UploadUI
  config?: UploadConfig
  // Callbacks
  onUploadSuccess?: (result: any) => void
}
```

## Patterns de configuration

### 1. Feature Flags
```typescript
interface Features {
  quota?: boolean
  apiKeys?: boolean
  paywall?: boolean
}

// Usage avec défauts
const enabledFeatures = {
  quota: features.quota ?? true,
  ...features
}
```

### 2. Configuration UI
```typescript
interface UIConfig {
  showHeader?: boolean
  compactMode?: boolean
  className?: string
}
```

### 3. Modes prédéfinis
```typescript
type Mode = 'simple' | 'authenticated' | 'demo' | 'page'

// Chaque mode a ses défauts
const modeDefaults = {
  simple: { features: { quota: true } },
  authenticated: { features: { apiKeys: true } }
}
```

## Patterns de composition

### 1. Rendu conditionnel
```typescript
{enabledFeatures.quota && (
  <QuotaDisplay {...quotaProps} />
)}
```

### 2. Variantes de composants
```typescript
<ResultsView 
  variant={ui.compactMode ? 'compact' : 'full'}
/>
```

### 3. Props spreading contrôlé
```typescript
const { mode, features, ui, ...callbacks } = props
// Passer seulement les callbacks nécessaires
```

## Patterns de test

### 1. Tests unitaires composants
```typescript
describe('DropZone', () => {
  it('renders without crashing', () => {
    render(<DropZone onDrop={mockFn} />)
  })
  
  it('handles file drop', () => {
    // Simuler interaction
  })
})
```

### 2. Tests hooks
```typescript
describe('useUpload', () => {
  it('handles quota exceeded', async () => {
    const { result } = renderHook(() => useUpload())
    // Tester la logique
  })
})
```

### 3. Mocks de services
```typescript
vi.mock('@/services/upload.service', () => ({
  uploadService: {
    upload: vi.fn()
  }
}))
```

## Conventions de nommage

### Fichiers
- Composants : `PascalCase.tsx`
- Hooks : `camelCase.ts` avec préfixe `use`
- Services : `kebab-case.service.ts`
- Tests : `ComponentName.test.tsx`

### Exports
```typescript
// Named exports pour les composants
export { Upload } from './Upload'

// Export par défaut pour les pages
export default function UploadPage() {}
```

### Types/Interfaces
```typescript
// Props : ComponentNameProps
interface UploadProps {}

// State : ComponentNameState
interface UploadState {}

// Config : FeatureConfig
interface UploadConfig {}
```

## Gestion d'état

### 1. État local (useState)
Pour l'état UI simple et isolé.

### 2. Hooks personnalisés
Pour l'état métier partagé entre composants.

### 3. Context (si nécessaire)
Pour l'état global (auth, theme, etc.).

## Performance

### 1. Lazy loading
```typescript
const Upload = lazy(() => import('./Upload'))
```

### 2. Memoization
```typescript
const memoizedValue = useMemo(() => 
  computeExpensive(data), [data]
)
```

### 3. Callbacks
```typescript
const handleClick = useCallback(() => {
  // Action
}, [dependency])
```

## Accessibilité

### 1. ARIA labels
```typescript
<button aria-label="Télécharger le fichier">
```

### 2. Rôles sémantiques
```typescript
<div role="progressbar" aria-valuenow={50}>
```

### 3. Navigation clavier
```typescript
onKeyDown={(e) => {
  if (e.key === 'Enter') handleAction()
}}
```

## Exemples de nouveaux composants

### Créer un nouveau composant atomique
```typescript
// components/FilePreview.tsx
interface FilePreviewProps {
  file: File
  onRemove?: () => void
  className?: string
}

export function FilePreview({ file, onRemove, className }: FilePreviewProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <FileIcon type={file.type} />
      <span>{file.name}</span>
      {onRemove && <button onClick={onRemove}>×</button>}
    </div>
  )
}
```

### Créer un hook métier
```typescript
// hooks/useFileValidation.ts
export function useFileValidation(options: ValidationOptions) {
  const validate = useCallback((file: File) => {
    if (file.size > options.maxSize) {
      return { valid: false, error: 'File too large' }
    }
    // Autres validations
    return { valid: true }
  }, [options])
  
  return { validate }
}
```

### Étendre le composant Upload
```typescript
// features/upload/UploadWithPreview.tsx
export function UploadWithPreview() {
  return (
    <Upload
      mode="simple"
      features={{ preview: true }}
      config={{
        onFileSelect: (file) => {
          // Logique de preview
        }
      }}
    />
  )
}
```

## Checklist nouveau composant

- [ ] Définir les props avec TypeScript
- [ ] Créer le composant atomique si nécessaire
- [ ] Créer/réutiliser les hooks métier
- [ ] Ajouter les tests unitaires
- [ ] Documenter les props
- [ ] Vérifier l'accessibilité
- [ ] Optimiser les performances
- [ ] Ajouter aux exports

## Migration progressive

Pour migrer un ancien composant :

1. Identifier les parties réutilisables
2. Extraire en composants atomiques
3. Créer les hooks nécessaires
4. Assembler avec le pattern de configuration
5. Tester la compatibilité
6. Déprécier l'ancien composant
7. Supprimer après période de transition