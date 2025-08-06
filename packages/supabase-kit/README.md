# @omnirealm/supabase-kit

Kit complet pour intégrer Supabase dans l'écosystème OmniRealm.

## 📦 Installation

```bash
pnpm add @omnirealm/supabase-kit
```

## 🚀 Utilisation rapide

### Authentification

```tsx
import { AuthProvider, useAuth } from '@omnirealm/supabase-kit';

// Dans votre app root
function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}

// Dans vos composants
function LoginPage() {
  const { signIn, signUp, user, loading } = useAuth();

  // Utiliser les méthodes d'auth
}
```

### Requêtes de données

```tsx
import { useSupabaseQuery, useSupabaseMutation } from '@omnirealm/supabase-kit';

function TaskList() {
  // Lecture
  const {
    data: tasks,
    loading,
    error,
  } = useSupabaseQuery('tasks', {
    filter: { user_id: userId },
    orderBy: { column: 'created_at', ascending: false },
  });

  // Mutations
  const { insert, update, remove } = useSupabaseMutation('tasks');
}
```

### Temps réel

```tsx
import { useRealtime, usePresence } from '@omnirealm/supabase-kit';

function LiveFeature() {
  // Écouter les changements
  useRealtime('messages', (payload) => {
    console.log('Nouveau message:', payload);
  });

  // Présence en ligne
  const { presenceState, onlineCount } = usePresence('room-123');
}
```

### Synchronisation offline

```tsx
import { useOfflineSync } from '@omnirealm/supabase-kit';

function OfflineApp() {
  const { queueOperation, sync, status } = useOfflineSync({
    tables: ['tasks', 'comments'],
    syncInterval: 30000,
  });
}
```

## 📚 Documentation complète

Pour plus de détails et exemples, voir :

- [Documentation Supabase officielle](https://supabase.com/docs)
- [Guide Supabase OmniRealm](../../../docs/technical/supabase/docs/README.md)
- [Guide des hooks](../../../docs/technical/supabase/docs/README-HOOKS.md)
- [Best practices](../../../docs/technical/supabase/docs/SUPABASE-BEST-PRACTICES.md)
<!-- Configuration TaskMaster disponible dans le guide unifié Supabase -->

## 🏗️ Structure du package

```
@omnirealm/supabase-kit/
├── hooks/        # Hooks React réutilisables
├── components/   # Composants (AuthProvider, etc.)
├── services/     # Services (offline-sync)
├── utils/        # Utilitaires (clients)
└── types/        # Types TypeScript
```

## 📝 License

MIT - OmniRealm Team
