# Guide de déploiement OmniTask sur Coolify

## 📋 Prérequis

- Application préparée avec le script `deploy-coolify.sh`
- Accès à votre instance Coolify
- Repository GitHub configuré
- Base de données Supabase configurée

## 🚀 Étapes de déploiement

### 1. Préparation locale

```bash
# Exécuter le script de préparation
./scripts/deploy-coolify.sh

# Vérifier que tout est OK
pnpm run pre-deploy
```

### 2. Configuration dans Coolify

#### Créer une nouvelle application

1. Connectez-vous à Coolify
2. Cliquez sur "New Application"
3. Sélectionnez "GitHub" comme source
4. Connectez votre repository `omnirealm/omni-task`
5. Sélectionnez la branche `main`

#### Configuration du build

- **Build Pack**: Docker
- **Dockerfile Path**: `/Dockerfile` (racine)
- **Port**: 3002
- **Health Check Path**: `/api/health`

#### Variables d'environnement

Dans la section "Environment Variables", ajoutez :

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key

# Application (Required)
NEXT_PUBLIC_APP_URL=https://omnitask.votre-domaine.com
NODE_ENV=production
PORT=3002

# OpenAI (Optional - for AI features)
OPENAI_API_KEY=votre-openai-api-key

# Monitoring (Optional)
NEXT_TELEMETRY_DISABLED=1
```

#### Configuration réseau

- **Domain**: `omnitask.votre-domaine.com`
- **SSL**: Activé (Let's Encrypt)
- **Force HTTPS**: Oui

### 3. Déploiement

1. Cliquez sur "Deploy"
2. Surveillez les logs de build
3. Attendez que le health check passe au vert

### 4. Vérifications post-déploiement

```bash
# Vérifier le health check
curl https://omnitask.votre-domaine.com/api/health

# Vérifier les headers de sécurité
curl -I https://omnitask.votre-domaine.com
```

## 🔧 Configuration avancée

### Limites de ressources

Dans Coolify, configurez :
- **CPU**: 1 core minimum
- **RAM**: 1GB minimum (2GB recommandé)
- **Disk**: 1GB

### Auto-scaling

```yaml
# Dans les settings avancés
replicas:
  min: 1
  max: 3
  cpu_threshold: 80
  memory_threshold: 80
```

### Monitoring

1. Activez les logs dans Coolify
2. Configurez les alertes email
3. Intégrez avec votre système de monitoring (optionnel)

## 🐛 Troubleshooting

### Build échoue

1. Vérifiez les logs de build dans Coolify
2. Assurez-vous que toutes les dépendances sont dans `package.json`
3. Vérifiez que le Dockerfile est correct

### Application ne démarre pas

1. Vérifiez les variables d'environnement
2. Consultez les logs de l'application
3. Testez le health check : `curl http://[container-ip]:3002/api/health`

### Erreurs Supabase

1. Vérifiez les clés API
2. Assurez-vous que l'URL est correcte
3. Vérifiez les politiques RLS dans Supabase

### Performance lente

1. Augmentez les ressources allouées
2. Activez le cache CDN dans Coolify
3. Optimisez les images et assets

## 📊 Monitoring et maintenance

### Logs

Les logs sont disponibles dans Coolify :
- **Application logs**: Sortie de l'application
- **Build logs**: Logs de construction Docker
- **System logs**: Logs du conteneur

### Métriques à surveiller

- CPU usage < 80%
- Memory usage < 80%
- Response time < 500ms
- Error rate < 1%

### Mise à jour

1. Poussez les changements sur GitHub
2. Dans Coolify, cliquez sur "Redeploy"
3. Surveillez le déploiement

## 🔐 Sécurité

### Headers de sécurité

Vérifiés automatiquement par le middleware :
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: max-age=31536000

### Rate limiting

Configuré dans le middleware :
- 100 requêtes par minute par IP
- Protection contre le brute force

### Backup

1. Configurez les backups Supabase
2. Sauvegardez les variables d'environnement
3. Gardez une copie des configurations Coolify

## 📞 Support

- Documentation Coolify : https://coolify.io/docs
- Issues GitHub : https://github.com/omnirealm/omni-task/issues
- Email : support@omnirealm.com

---

*Dernière mise à jour : 2025-08-10*