# Synchronisation Temps Réel OmniTask

## Vue d'ensemble

Ce document décrit l'implémentation de la synchronisation temps réel pour OmniTask, permettant aux utilisateurs de voir leurs tâches et projets se synchroniser instantanément entre tous leurs appareils.

## Architecture

### Composants principaux

1. **Database Layer** - Configuration Supabase Realtime
2. **Hooks Layer** - Hooks React pour la synchronisation
3. **UI Layer** - Composants visuels pour le statut
4. **Provider Layer** - Contexte global de synchronisation

### Technologies utilisées

- **Supabase Realtime** - WebSocket pour les événements temps réel
- **React Hooks** - Gestion d'état et effets de bord
- **Network API** - Détection du statut réseau
- **Last-write-wins** - Résolution de conflits

## Configuration Database

### Migration requise

```sql
-- Activer Realtime sur les tables
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE user_preferences;
```

La migration complète est dans : `/supabase/migrations/20250813000001_enable_realtime.sql`

### Tables synchronisées

- `tasks` - Tâches utilisateur
- `projects` - Projets utilisateur  
- `user_preferences` - Préférences utilisateur
- `realtime_conflicts` - Log des conflits (debug)

## Hooks de synchronisation

### useRealtimeSync

Hook principal gérant la synchronisation des tâches et projets.

```typescript
const {
  syncStatus,
  tasks,
  projects,
  forcSync,
  clearSyncError,
  resolveConflicts
} = useRealtimeSync()
```

**Fonctionnalités:**
- Subscription aux channels par `user_id`
- Gestion des événements INSERT/UPDATE/DELETE
- Détection de conflits basique
- Cache des timestamps pour optimisation

### useRealtimeProjects

Hook spécialisé pour les projets avec CRUD operations.

```typescript
const {
  projects,
  syncStatus,
  createProject,
  updateProject,
  deleteProject,
  archiveProject
} = useRealtimeProjects()
```

**Fonctionnalités:**
- Operations CRUD avec sync automatique
- Queue d'opérations offline
- Mise à jour optimiste
- Gestion d'erreurs spécialisée

### useNetworkStatus

Hook pour la détection du statut réseau.

```typescript
const {
  networkStatus,
  isOnline,
  isOffline,
  isSlowConnection,
  canSync,
  reconnect
} = useNetworkStatus()
```

**Fonctionnalités:**
- Détection online/offline
- Analyse qualité connexion
- Mode économie données
- Reconnexion manuelle

## Composants UI

### SyncStatusIndicator

Indicateur visuel du statut de synchronisation.

```tsx
<SyncStatusIndicator
  syncStatus={syncStatus}
  networkStatus={networkStatus}
  onForceSync={forceSync}
  onReconnect={reconnect}
  onResolveConflicts={resolveConflicts}
/>
```

**États visuels:**
- 🟢 Synchronisé - Tout est à jour
- 🔵 Synchronisation - En cours
- 🟠 Conflits - Conflits détectés
- 🔴 Erreur - Problème de sync
- ⚫ Hors ligne - Pas de connexion

### RealtimeProvider

Provider global fournissant le contexte de synchronisation.

```tsx
<RealtimeProvider showStatusIndicator={true}>
  <App />
</RealtimeProvider>
```

## Intégration

### Dans le layout dashboard

```tsx
// app/dashboard/layout.tsx
<AuthProvider>
  <RealtimeProvider>
    {children}
  </RealtimeProvider>
</AuthProvider>
```

### Dans les composants

```tsx
// Utiliser les hooks du contexte
import { useRealtimeTasks } from '@/components/sync/realtime-provider'

const { tasks, syncStatus } = useRealtimeTasks()
```

## Gestion des conflits

### Stratégie Last-Write-Wins

- Le dernier `updated_at` gagne
- Les conflits sont loggés dans `realtime_conflicts`
- Résolution automatique côté client
- Option de résolution manuelle

### Détection de conflits

```typescript
const lastUpdate = lastUpdatesRef.current.get(record.id)
const currentUpdate = new Date(record.updatedAt)

if (lastUpdate && currentUpdate < lastUpdate) {
  // Conflit détecté
  setSyncStatus(prev => ({ 
    ...prev, 
    conflicts: prev.conflicts + 1 
  }))
}
```

## Mode Offline

### Fonctionnalités

1. **Détection automatique** - Via Navigator.onLine + Connection API
2. **Queue d'operations** - Stockage des modifications offline
3. **Sync différée** - Traitement automatique au retour online
4. **Mise à jour optimiste** - UI responsive même offline

### Gestion de la queue

```typescript
// Ajouter une opération à la queue
operationQueueRef.current.push(() => 
  supabase.from('tasks').update(data).eq('id', id)
)

// Traiter la queue au retour online
if (isOnline && canSync) {
  processOperationQueue()
}
```

## Performance

### Optimisations

1. **Channels par utilisateur** - `tasks_user_{userId}`
2. **Cache des timestamps** - Évite les re-renders inutiles
3. **Debounce des événements** - Limite les mises à jour
4. **Lazy loading** - Chargement initial optimisé

### Monitoring

- Métriques de connexion dans l'indicateur
- Log des performances dans la console
- Compteur de conflits
- Statut réseau temps réel

## Tests

### Hooks testés

- `useRealtimeSync` - Synchronisation principale
- `useNetworkStatus` - Détection réseau  
- `useRealtimeProjects` - CRUD projets

### Commandes

```bash
# Tests unitaires
pnpm test lib/hooks/__tests__/

# Coverage
pnpm test:coverage
```

## Déploiement

### Via Coolify (comme configuré)

La synchronisation temps réel est activée automatiquement avec la configuration Supabase existante. Aucune configuration supplémentaire nécessaire.

### Variables d'environnement

```bash
# Déjà configurées dans .env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Troubleshooting

### Problèmes courants

1. **Pas de synchronisation**
   - Vérifier la connexion Supabase
   - Vérifier l'activation Realtime
   - Consulter les logs navigateur

2. **Conflits persistants**
   - Utiliser l'action "Résoudre conflits"
   - Forcer une synchronisation
   - Vérifier les timestamps

3. **Performance dégradée**
   - Vérifier la qualité réseau
   - Désactiver temporairement le mode temps réel
   - Réduire la fréquence de polling

### Debug

```typescript
// Activer les logs détaillés
localStorage.setItem('debug', 'omnitask:realtime*')
```

---

**Dernière mise à jour:** 2025-08-13  
**Version:** 1.0.0  
**Status:** ✅ Production Ready