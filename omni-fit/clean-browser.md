# Nettoyer le cache navigateur pour OmniFit

## Étapes pour résoudre le problème d'écran blanc :

### 1. Dans Chrome DevTools (F12) :
- Onglet **Application** > **Storage** > **Clear site data**
- Onglet **Application** > **Service Workers** > Unregister tous les workers
- Onglet **Network** > Cocher "Disable cache"

### 2. Vider le cache complet :
- Chrome : `Ctrl+Shift+Delete` > Cocher tout > Clear data
- Ou : Ouvrir en mode incognito `Ctrl+Shift+N`

### 3. Relancer OmniFit :
```bash
# Arrêter tous les processus
pkill -f "node.*vitest"

# Relancer proprement
cd /home/greg/projets/dev/apps/omni-fit
pnpm run dev
```

### 4. Accéder à l'app :
- Ouvrir http://localhost:3003 dans un nouvel onglet incognito
- Si erreur persiste, essayer un autre port :
  ```bash
  pnpm run dev -- --port 3004
  ```