# 🚀 Guide de Déploiement OmniScan sur VPS via Coolify

## 📋 Vue d'ensemble

OmniScan est déployé sur le VPS OmniRealm (91.108.113.252) via Coolify avec :
- **Frontend** : React/Vite sur https://scan.omnirealm.tech
- **Backend API** : FastAPI sur https://api.scan.omnirealm.tech
- **Base de données** : Supabase (hébergé externe)
- **Cache** : Redis (conteneur local)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    VPS OmniRealm                        │
│                                                         │
│  ┌─────────────┐     ┌─────────────┐    ┌──────────┐  │
│  │   Frontend  │────▶│   Backend   │───▶│  Redis   │  │
│  │  (nginx)    │     │  (FastAPI)  │    │  Cache   │  │
│  │  Port 80    │     │  Port 8001  │    │          │  │
│  └─────────────┘     └─────────────┘    └──────────┘  │
│         │                    │                          │
└─────────┼────────────────────┼─────────────────────────┘
          │                    │
          ▼                    ▼
    ┌──────────┐        ┌──────────┐
    │ Cloudflare│       │ Supabase │
    │   DNS     │       │    DB    │
    └──────────┘        └──────────┘
```

## 🔧 Configuration

### Variables d'environnement requises dans Coolify

#### Backend
```bash
# Sécurité
SECRET_KEY=<générer avec openssl rand -hex 32>
JWT_SECRET_KEY=<générer avec openssl rand -hex 32>

# Supabase
SUPABASE_URL=https://qzgfkpwlxnmrjtsaybhx.supabase.co
SUPABASE_ANON_KEY=<votre-anon-key>
SUPABASE_SERVICE_KEY=<votre-service-key>

# OpenAI
OPENAI_API_KEY=sk-<votre-clé-api>

# Frontend URL (pour CORS)
FRONTEND_URL=https://scan.omnirealm.tech
```

#### Frontend
```bash
# Supabase (public keys)
VITE_SUPABASE_URL=https://qzgfkpwlxnmrjtsaybhx.supabase.co
VITE_SUPABASE_ANON_KEY=<votre-anon-key>

# API
VITE_API_URL=https://api.scan.omnirealm.tech
```

## 📦 Déploiement Initial

### 1. Configuration dans Coolify

1. **Créer une nouvelle application** dans Coolify
2. **Source** : GitHub - Sélectionner le repo `omnirealm`
3. **Type** : Docker Compose
4. **Fichier** : `coolify-omniscan.yml`
5. **Branche** : `main`

### 2. Variables d'environnement

Dans l'interface Coolify, ajouter toutes les variables listées ci-dessus.

### 3. Domaines

Configurer les domaines dans Coolify :
- Frontend : `scan.omnirealm.tech`
- Backend : `api.scan.omnirealm.tech`

### 4. Build et déploiement

Cliquer sur "Deploy" dans Coolify. Le processus :
1. Clone le repo
2. Build les images Docker
3. Lance les conteneurs
4. Configure le proxy inverse (Traefik)
5. Génère les certificats SSL

## 🧪 Test Local

Pour tester localement avant le déploiement :

```bash
# Depuis le dossier omni-scan
cd dev/apps/omni-scan
./test-docker.sh

# Ou manuellement depuis la racine
docker-compose -f dev/apps/omni-scan/docker-compose.yml build
docker-compose -f dev/apps/omni-scan/docker-compose.yml up
```

Accès local :
- Frontend : http://localhost:3001
- Backend : http://localhost:8001

## 🔍 Vérification Post-Déploiement

### 1. Santé de l'API
```bash
curl https://api.scan.omnirealm.tech/api/v1/health
```

### 2. Frontend
Vérifier https://scan.omnirealm.tech charge correctement

### 3. Upload Test
Tester l'upload d'un document PDF simple

### 4. Logs dans Coolify
Vérifier les logs des conteneurs pour toute erreur

## 🛠️ Maintenance

### Mise à jour
```bash
# Push sur main déclenche automatiquement le redéploiement
git push origin main
```

### Logs
Dans Coolify UI : Applications > OmniScan > Logs

### Redémarrage
Dans Coolify UI : Applications > OmniScan > Restart

### Backup des uploads
```bash
# Se connecter au VPS
ssh greg@91.108.113.252

# Backup des uploads
docker cp omniscan-backend:/app/backend/uploads ./backup-uploads-$(date +%Y%m%d)
```

## 🚨 Troubleshooting

### Erreur CORS
- Vérifier `FRONTEND_URL` dans les variables backend
- S'assurer que l'URL n'a pas de slash final

### Erreur Supabase
- Vérifier les clés API
- S'assurer que l'IP du VPS est autorisée dans Supabase

### Erreur OCR
- Vérifier que Tesseract est bien installé dans l'image
- Augmenter le timeout si nécessaire

### Erreur Upload
- Vérifier les permissions du volume
- S'assurer que nginx accepte les gros fichiers

## 📊 Monitoring

### Métriques à surveiller
- CPU/RAM usage des conteneurs
- Temps de réponse API
- Taux de succès OCR
- Espace disque (uploads)

### Alertes recommandées
- API down > 5 minutes
- CPU > 80%
- Disk > 90%
- Erreurs 5xx > 10/minute

## 🔐 Sécurité

### Headers de sécurité
Configurés dans nginx :
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Strict-Transport-Security

### Rate limiting
Configuré dans le backend :
- 100 requêtes/heure par IP
- Protection contre le brute force

### Backup
- Uploads : Daily backup recommandé
- Redis : Persistence AOF activée
- Database : Géré par Supabase

## 📞 Support

En cas de problème :
1. Vérifier les logs Coolify
2. Consulter `/docs/TROUBLESHOOTING.md`
3. Contacter l'équipe dev

---

**Dernière mise à jour** : 2025-08-09
**Maintenu par** : Équipe OmniRealm