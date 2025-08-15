# 🔧 Guide de Maintenance OmniTask

## 📋 Scripts de Maintenance

### 🧹 Nettoyage du Cache
```bash
pnpm run clean:cache
```
- Nettoie automatiquement le cache Next.js quand il dépasse 200MB
- Supprime les logs de build de plus de 7 jours
- Affiche les statistiques du cache

### 📊 Monitoring Développement
```bash
pnpm run monitor
```
- Surveille en temps réel :
  - Mémoire utilisée par Next.js
  - Mémoire TypeScript Language Server
  - Taille du cache
  - État du port 3002
  - RAM système totale
- Suggère des actions correctives

## 🛠️ Tâches de Maintenance Régulières

### Quotidien
1. **Vérifier le cache** : Si développement intensif, lancer `pnpm run clean:cache`
2. **Logs** : Nettoyer les console.log avant commit

### Hebdomadaire
1. **Dépendances** : `pnpm outdated` pour vérifier les mises à jour
2. **Tests** : `pnpm run test:coverage` pour vérifier la couverture
3. **Lint** : `pnpm run lint` pour la qualité du code

### Mensuel
1. **Audit sécurité** : `pnpm audit`
2. **Bundle size** : Vérifier avec `pnpm run build` et analyser
3. **Performance** : Lighthouse audit sur l'app déployée

## ⚡ Optimisations Performance

### Développement
- **Turbopack** activé : Démarrage 2.3s vs 15s standard
- **Cache limité** : 200MB max pour éviter les ralentissements
- **Monitoring RAM** : Redémarrer si Next.js > 800MB

### Production
- **Standalone build** : Image Docker optimisée
- **Tree shaking** : Bundles minimaux
- **Compression** : Brotli activé sur Coolify

## 🐛 Résolution de Problèmes Courants

### "Module not found"
```bash
pnpm install
pnpm run clean
pnpm install
```

### Port 3002 occupé
```bash
lsof -i :3002
kill -9 [PID]
# ou
omnidev-clean
```

### TypeScript errors après git pull
```bash
pnpm run supabase:generate-types
pnpm run type-check
```

### Build échoue en production
1. Vérifier les variables d'environnement
2. Lancer `pnpm run pre-deploy` localement
3. Vérifier les logs Coolify

## 📝 Checklist Avant Déploiement

- [ ] Aucun console.log dans le code
- [ ] Tests passent (`pnpm test`)
- [ ] Lint OK (`pnpm lint`)
- [ ] Type-check OK (`pnpm run type-check`)
- [ ] Build local réussi (`pnpm run build`)
- [ ] Cache nettoyé (`pnpm run clean:cache`)
- [ ] Pre-deploy check (`pnpm run pre-deploy`)

## 🔐 Variables d'Environnement

### Développement (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-key
```

### Production (Coolify)
- Définies dans l'interface Coolify
- Ne JAMAIS hardcoder dans le code
- Utiliser les secrets Coolify pour les clés sensibles

---

**Dernière mise à jour** : 2025-08-08