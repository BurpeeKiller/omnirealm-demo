# @omnirealm/ui

> Bibliothèque de composants UI unifiée pour l'écosystème OmniRealm - Basée sur Radix UI + Tailwind CSS

## 🎯 Vue d'ensemble

**@omnirealm/ui** centralise TOUS les composants UI réutilisables du monorepo OmniRealm. Plus besoin d'installer Radix UI directement - tout est inclus et optimisé.

### ✨ Fonctionnalités

- **13 composants Radix UI** prêts à l'emploi
- **Design système cohérent** avec Tailwind CSS
- **TypeScript strict** avec types complets
- **Tree-shaking optimisé** pour des bundles minimaux
- **Compatibilité Next.js & Vite** garantie

## 🚀 Installation

```bash
# Le package est automatiquement disponible dans le monorepo
import { Button, Dialog } from '@omnirealm/ui'

# ❌ Ne plus installer directement
# pnpm add @radix-ui/react-dialog  # INTERDIT
```

## 📦 Composants disponibles

### **Composants de base**
```typescript
import { 
  Button,       // Bouton avec variants
  Card,         // Conteneur avec header/footer
  Input,        // Champ de saisie
  Badge         // Étiquette colorée
} from '@omnirealm/ui'
```

### **Composants Radix UI**
```typescript
import {
  // Interface utilisateur
  Dialog,           // Modale/popup
  DropdownMenu,     // Menu déroulant
  Select,           // Sélecteur avancé
  Tabs,             // Onglets
  
  // Formulaires
  Label,            // Libellé accessible
  
  // Affichage
  Avatar,           // Photo de profil
  Toast,            // Notifications
  Separator         // Séparateur visuel
} from '@omnirealm/ui'
```

### **Utilitaires**
```typescript
import { cn } from '@omnirealm/ui'  // Fusion classes Tailwind
```

## 🎨 Exemples d'utilisation

### Dialog (Modale)
```tsx
import { Dialog, DialogContent, DialogTitle, Button } from '@omnirealm/ui'

function MyModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Ouvrir la modale</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Titre de la modale</DialogTitle>
        <p>Contenu de la modale...</p>
      </DialogContent>
    </Dialog>
  )
}
```

### Toast (Notifications)
```tsx
import { ToastProvider, Toast, ToastTitle } from '@omnirealm/ui'

function App() {
  return (
    <ToastProvider>
      <Toast>
        <ToastTitle>Succès !</ToastTitle>
      </Toast>
    </ToastProvider>
  )
}
```

## 🛠️ Développement

### Scripts disponibles
```bash
pnpm run dev          # Build en mode watch
pnpm run build        # Build production
pnpm run type-check   # Vérification TypeScript
pnpm run lint         # ESLint
```

### Ajouter un nouveau composant

1. **Créer le composant** dans `src/components/`
```tsx
// src/components/NewComponent.tsx
import * as React from "react"
import { cn } from "../utils"

const NewComponent = React.forwardRef<...>((props, ref) => {
  return <div {...props} ref={ref} />
})

export { NewComponent }
```

2. **L'exporter** dans `src/index.ts`
```typescript
export { NewComponent } from './components/NewComponent'
```

3. **Tester le build**
```bash
pnpm run build && pnpm run type-check
```

## 📊 Métriques

- **13 composants Radix UI** intégrés
- **Bundle size** : ~27KB (ESM) + ~33KB (CJS)
- **Tree-shaking optimisé** : seuls les composants utilisés
- **TypeScript strict** : 100% typé

## 🏷️ Tags

#ui #components #radix-ui #tailwind #typescript #design-system
