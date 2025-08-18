● 🔄 Workflow Développement Capacitor + OmniFit

  1️⃣ Développement Web First

  # Dev normal sur navigateur
  pnpm run dev:host  # Accessible sur réseau local
  # http://localhost:5173 + http://192.168.x.x:5173
  - ✅ Hot reload instantané
  - ✅ DevTools Chrome complet
  - ✅ 95% des features se dev ici

  2️⃣ Test sur Mobile (Live Reload)

  # Option A: Via navigateur mobile
  # Ouvre http://192.168.x.x:5173 sur ton téléphone

  # Option B: App native avec live reload
  npx cap add android  # Première fois seulement
  pnpm run cap:sync    # Sync web → native
  pnpm run cap:run:android --livereload --external

  3️⃣ Build Production Mobile

  # 1. Build l'app web
  pnpm run build

  # 2. Sync avec projets natifs
  npx cap sync

  # 3. Ouvrir dans IDE natif
  pnpm run cap:android  # → Android Studio
  pnpm run cap:ios      # → Xcode

  📱 Architecture des dossiers

  omni-fit/
  ├── src/           # Code web (React/TS)
  ├── dist/          # Build web → Capacitor copie ça
  ├── android/       # Projet Android généré (ignoré git)
  ├── ios/           # Projet iOS généré (ignoré git)
  └── capacitor.config.ts

  🛠️ Commandes essentielles

  | Commande                         | Action
       |
  |----------------------------------|----------------------
  -----|
  | pnpm run dev:host                | Dev web avec accès
  réseau |
  | npx cap add android/ios          | Init plateforme (1x)
       |
  | pnpm run cap:sync                | Build + sync native
       |
  | pnpm run cap:android             | Ouvrir Android Studio
       |
  | npx cap run android --livereload | Dev avec hot reload
       |

  ⚡ Tips workflow

  1. 90% du dev = navigateur (rapide)
  2. Test mobile = via URL réseau ou livereload
  3. Features natives (notifs, etc) = émulateur/device
  4. Build final = Android Studio/Xcode