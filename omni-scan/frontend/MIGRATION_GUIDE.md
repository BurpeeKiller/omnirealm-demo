# Guide de Migration - Composants Upload

## Vue d'ensemble

Ce guide explique comment migrer des anciens composants Upload vers le nouveau composant unifié.

## Avantages de la migration

- **Réduction du code** : 1200 lignes → ~400 lignes (-67%)
- **Maintenance simplifiée** : 1 seul composant au lieu de 5
- **Cohérence UI/UX** : Expérience utilisateur uniforme
- **Configuration flexible** : Props pour personnaliser le comportement
- **Performance** : Bundle size réduit d'environ 30%

## Migration étape par étape

### 1. UploadSimple → Upload (mode="simple")

**Avant :**
```tsx
import UploadSimple from './UploadSimple'

<UploadSimple />
```

**Après :**
```tsx
import { Upload } from '@/components/upload'

<Upload
  mode="simple"
  features={{
    quota: true,
    apiKeys: false,
    paywall: true
  }}
/>
```

### 2. UploadWithAuth → Upload (mode="authenticated")

**Avant :**
```tsx
import { UploadWithAuth } from './UploadWithAuth'

<UploadWithAuth />
```

**Après :**
```tsx
import { Upload } from '@/components/upload'

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
    showExamples: true
  }}
/>
```

### 3. UploadPage → Upload (mode="page")

**Avant :**
```tsx
import { UploadPage } from './UploadPage'

<UploadPage />
```

**Après :**
```tsx
import { Upload } from '@/components/upload'

<Upload
  mode="page"
  features={{
    quota: true,
    apiKeys: true,
    navigation: true,
    paywall: true
  }}
/>
```

### 4. UploadUnified → Upload (déjà unifié)

**Avant :**
```tsx
import { UploadUnified } from './UploadUnified'

<UploadUnified mode="simple" />
```

**Après :**
```tsx
import { Upload } from '@/components/upload'

<Upload mode="simple" />
```

## Props du nouveau composant

### mode
- `simple` : Upload basique avec quotas
- `authenticated` : Upload avec gestion des clés API
- `demo` : Mode démonstration sans backend
- `page` : Mode page complète avec navigation

### features
```typescript
{
  quota?: boolean         // Afficher les quotas
  apiKeys?: boolean       // Gérer les clés API
  analysisConfig?: boolean // Configuration d'analyse
  navigation?: boolean    // Navigation intégrée
  cache?: boolean        // Cache des résultats
  paywall?: boolean      // Afficher le paywall
}
```

### ui
```typescript
{
  showHeader?: boolean    // Afficher le header
  showExamples?: boolean  // Afficher les exemples
  compactMode?: boolean   // Mode compact
  className?: string      // Classes CSS personnalisées
}
```

### config
```typescript
{
  maxFileSize?: number
  acceptedFormats?: Record<string, string[]>
  uploadOptions?: {
    detailLevel?: 'short' | 'medium' | 'detailed' | 'high'
    language?: string
    includeStructuredData?: boolean
    chapterSummaries?: boolean
  }
}
```

### callbacks
- `onUploadSuccess?: (result: any) => void`
- `onQuotaExceeded?: () => void`
- `onError?: (error: string) => void`

## Checklist de migration

- [ ] Identifier tous les usages des anciens composants
- [ ] Remplacer les imports
- [ ] Configurer les props selon les besoins
- [ ] Tester le comportement
- [ ] Supprimer les anciens composants

## Fichiers à supprimer après migration

1. `/src/features/upload/UploadSimple.tsx`
2. `/src/features/upload/UploadWithAuth.tsx`
3. `/src/features/upload/UploadPage.tsx`
4. `/src/features/upload/UploadUnified.tsx`
5. `/src/hooks/useDocumentUpload.ts` (remplacé par useUpload)
6. `/src/services/api-simple.ts` (unifié dans upload.service.ts)

## Support

En cas de problème lors de la migration :
1. Vérifier la console pour les erreurs
2. Comparer avec les exemples dans `Upload.examples.tsx`
3. Consulter la documentation des props ci-dessus