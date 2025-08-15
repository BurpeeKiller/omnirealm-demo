# Guide de Déploiement OmniTask sur Coolify

## 🚨 Points Critiques pour les Variables d'Environnement

### 1. Configuration des Variables dans Coolify

Dans l'interface Coolify, section "Environment Variables" :

```bash
# Variables PUBLIQUES (disponibles côté client)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://omnitask.yourdomain.com

# Variables PRIVÉES (serveur uniquement)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-api-key

# Configuration Next.js
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=production
PORT=3002
```

### 2. ⚠️ Configuration BUILD ARGS dans Coolify

**CRUCIAL** : Les variables `NEXT_PUBLIC_*` doivent aussi être définies dans "Build Arguments" :

1. Aller dans Settings → Build Configuration
2. Ajouter dans "Build Arguments" :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_APP_URL=https://omnitask.yourdomain.com
   ```

### 3. Pourquoi c'est nécessaire ?

- Next.js injecte les variables `NEXT_PUBLIC_*` **au moment du build**
- Elles sont intégrées dans le bundle JavaScript client
- Sans les Build Args, elles seront `undefined` côté client

## 🔍 Debug en cas de problème

### 1. Vérifier les logs de build
Le Dockerfile inclut un script de debug qui affiche les variables pendant le build :
```
=== NEXT_PUBLIC_* VARIABLES ===
✅ NEXT_PUBLIC_SUPABASE_URL: https://abc...xyz
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: eyJhbGciO...12345
```

### 2. Tester l'endpoint de santé
```bash
curl https://omnitask.yourdomain.com/api/health
```

Si les variables sont manquantes, vous verrez :
```json
{
  "status": "unhealthy",
  "error": "Missing environment variables",
  "missing": ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]
}
```

### 3. Vérifier côté client
Dans la console du navigateur :
```javascript
// Si undefined = problème de build
console.log(window.__NEXT_DATA__.runtimeConfig)
```

## 📋 Checklist de Déploiement

- [ ] Variables définies dans "Environment Variables"
- [ ] Variables `NEXT_PUBLIC_*` AUSSI définies dans "Build Arguments"
- [ ] Pas d'interpolation dans les valeurs (pas de ${VAR})
- [ ] Dockerfile utilise le bon fichier : `Dockerfile`
- [ ] Build Context : `/` (racine du monorepo)
- [ ] Port configuré : 3002

## 🚀 Commande de Build Locale (pour tester)

```bash
# Depuis la racine du monorepo
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key" \
  --build-arg NEXT_PUBLIC_APP_URL="http://localhost:3002" \
  -f dev/apps/omni-task/Dockerfile \
  -t omnitask:test \
  .
```

## 🐛 Problèmes Connus

### Variables undefined côté client
**Symptôme** : L'app charge mais aucune fonctionnalité ne marche
**Solution** : Vérifier que les Build Arguments sont bien configurés dans Coolify

### Build qui échoue
**Symptôme** : Erreur de validation Zod pendant le build
**Solution** : Vérifier que toutes les variables requises sont dans Build Arguments

### Page blanche
**Symptôme** : Site accessible mais page vide
**Solution** : Ouvrir la console du navigateur, vérifier les erreurs de config

## 📞 Support

Si les problèmes persistent après avoir suivi ce guide :
1. Vérifier les logs de build complets dans Coolify
2. Tester le build en local avec la commande ci-dessus
3. Vérifier que Supabase accepte les connexions depuis votre domaine