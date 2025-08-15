# ✅ Checklist de Déploiement OmniTask Production

## 📋 Phase 1 : Préparation

### Infrastructure VPS
- [ ] VPS accessible via SSH (greg@91.108.113.252)
- [ ] Coolify installé et fonctionnel
- [ ] PostgreSQL opérationnel
- [ ] Nginx configuré avec SSL
- [ ] Domaine task.omnirealm.tech configuré

### Supabase VPS
- [ ] Supabase installé via Coolify
- [ ] Service accessible sur https://supabase.omnirealm.tech
- [ ] Clés API générées (anon_key et service_role_key)
- [ ] Base de données `omnitask` créée

**Commande de vérification :**
```bash
ssh greg@91.108.113.252 "cd /home/greg/projets/dev/tools/vps/scripts && ./supabase.manager.sh status"
```

## 📋 Phase 2 : Configuration Locale

### Fichiers de configuration
- [x] `.env.production` créé (avec clés temporaires)
- [x] Script de déploiement `scripts/deploy-production.sh` prêt
- [x] Script de test `scripts/test-supabase-connection.sh` fonctionnel
- [ ] Clés Supabase production récupérées et configurées

### Base de données locale
- [x] Supabase local fonctionnel (port 54321)
- [x] Tables `tasks` et `projects` accessibles
- [x] Migrations à jour dans `supabase/migrations/`
- [x] Schéma exportable pour production

**Commande de test :**
```bash
./scripts/test-supabase-connection.sh
```

## 📋 Phase 3 : Déploiement

### Étapes de déploiement
- [ ] Export du schéma de développement
- [ ] Application des migrations sur le VPS
- [ ] Build de production Next.js avec output standalone
- [ ] Transfert des fichiers vers le VPS
- [ ] Configuration PM2 pour l'application
- [ ] Configuration Nginx avec SSL
- [ ] Test d'accès HTTPS

### Commandes principales
```bash
# Déploiement complet
./scripts/deploy-production.sh

# Ou étape par étape :
# 1. Build
pnpm run build

# 2. Test local du build
npm start

# 3. Déployer
./scripts/deploy-production.sh
```

## 📋 Phase 4 : Vérification

### Tests de fonctionnement
- [ ] Application accessible sur https://task.omnirealm.tech
- [ ] Inscription utilisateur fonctionne
- [ ] Connexion utilisateur fonctionne
- [ ] Création de tâches fonctionne
- [ ] Gestion des projets fonctionne
- [ ] API REST répond correctement

### Performance et sécurité
- [ ] Headers de sécurité configurés
- [ ] SSL/TLS opérationnel (A+ sur SSL Labs)
- [ ] Rate limiting actif
- [ ] Logs applicatifs fonctionnels (`pm2 logs omnitask`)
- [ ] Monitoring basique en place

## 📋 Phase 5 : Maintenance

### Backups
- [ ] Backup automatique de la base de données (cron quotidien)
- [ ] Backup des fichiers application
- [ ] Test de restauration effectué

### Monitoring
- [ ] Alertes Telegram configurées
- [ ] Logs rotatifs configurés
- [ ] Métriques de base surveillées (CPU, RAM, disque)

### Documentation
- [ ] Guide de troubleshooting créé
- [ ] Procédures de mise à jour documentées
- [ ] Contacts et escalade définis

## 🚨 Actions Immédiates Nécessaires

1. **Vérifier Supabase sur le VPS**
   ```bash
   ssh greg@91.108.113.252
   cd /home/greg/projets/dev/tools/vps/scripts
   ./supabase.manager.sh status
   ```

2. **Récupérer les clés Supabase**
   ```bash
   # Noter les clés affichées par la commande status
   # Mettre à jour .env.production avec les vraies valeurs
   ```

3. **Premier déploiement**
   ```bash
   ./scripts/deploy-production.sh
   # Choisir option 1 (déploiement complet)
   ```

## 📊 Métriques de Succès

- ✅ Temps de réponse < 2 secondes
- ✅ Disponibilité > 99%
- ✅ Zero erreurs 500 après déploiement
- ✅ Connexions utilisateur fonctionnelles
- ✅ Données utilisateur sécurisées (RLS actif)

## 🆘 En cas de problème

1. **Application inaccessible**
   - Vérifier PM2 : `pm2 status omnitask`
   - Vérifier Nginx : `sudo nginx -t && sudo systemctl status nginx`
   - Vérifier les logs : `pm2 logs omnitask`

2. **Base de données inaccessible**
   - Vérifier Supabase : `./supabase.manager.sh status`
   - Vérifier PostgreSQL : `docker logs coolify-postgres`

3. **Rollback d'urgence**
   ```bash
   # Arrêter l'application
   pm2 stop omnitask
   
   # Restaurer depuis backup si nécessaire
   docker exec coolify-postgres psql -U postgres -d omnitask < backup.sql
   ```

---

**Status actuel :** Phase 1-2 complète ✅ | Phase 3-5 en attente ⏳