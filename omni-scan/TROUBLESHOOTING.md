# Guide de dépannage OmniScan

## 🐛 Problèmes fréquents et solutions

### Déploiement Coolify

#### 1. Frontend - Healthcheck nginx échoue

**Symptôme** :
```
wget: can't connect to remote host (::1): Address not available
```

**Cause** : nginx écoute uniquement sur IPv4, mais wget tente une connexion IPv6.

**Solution** :
1. Modifier le Dockerfile pour activer l'écoute IPv6 :
```dockerfile
RUN echo 'server { \
    listen 80; \
    listen [::]:80; \  # Ajouter cette ligne
    ...
}' > /etc/nginx/conf.d/default.conf
```

2. Forcer le healthcheck à utiliser IPv4 :
```dockerfile
HEALTHCHECK CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:80/ || exit 1
```

#### 2. Backend - Tables Supabase introuvables

**Symptôme** :
```
postgrest.exceptions.APIError: {'code': '42P01', 'message': 'relation "public.documents" does not exist'}
```

**Cause** : Les tables n'existent pas dans le schéma `public` de la base de données.

**Solution** :
1. Se connecter au conteneur PostgreSQL :
```bash
ssh -p 22 omni-admin@100.87.146.1
docker exec -it supabase-db-<id> psql -U postgres
```

2. Exécuter le script de création des tables :
```sql
-- Voir /dev/apps/omni-scan/supabase/create_public_tables.sql
```

#### 3. Backend - Erreur async/await avec Supabase

**Symptôme** :
```
TypeError: object APIResponse[~_ReturnT] can't be used in 'await' expression
```

**Cause** : Le client Supabase Python est synchrone, pas asynchrone.

**Solution** :
Retirer le mot-clé `await` devant les appels Supabase :
```python
# ❌ Incorrect
await supabase.table("documents").select("count").execute()

# ✅ Correct
supabase.table("documents").select("count").execute()
```

#### 4. Backend - Dépendances OpenCV manquantes

**Symptôme** :
Erreur lors de l'installation de `opencv-python-headless`.

**Cause** : Les bibliothèques système nécessaires ne sont pas présentes dans l'image Alpine.

**Solution** :
Utiliser une image Debian et installer les dépendances :
```dockerfile
FROM python:3.11-slim  # Debian au lieu d'Alpine

RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*
```

### Problèmes de développement local

#### 1. CORS bloqué

**Symptôme** :
```
Access to fetch at 'http://localhost:8001' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution** :
Vérifier que `CORS_ORIGINS` inclut l'URL du frontend dans `.env` :
```env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### 2. Connexion Supabase échoue

**Symptôme** :
```
❌ Erreur connexion Supabase: Network request failed
```

**Solution** :
1. Vérifier les variables d'environnement :
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`

2. Vérifier que l'URL ne contient pas de slash final :
   ```env
   # ✅ Correct
   SUPABASE_URL=https://api.supabase.omnirealm.tech
   
   # ❌ Incorrect
   SUPABASE_URL=https://api.supabase.omnirealm.tech/
   ```

### Maintenance VPS

#### Espace disque saturé

**Symptôme** :
```
No space left on device
```

**Solution** :
1. Vérifier l'utilisation :
```bash
ssh -p 22 omni-admin@100.87.146.1 "df -h /"
```

2. Nettoyer Docker :
```bash
# Script sécurisé disponible
./dev/tools/vps/cleanup-disk-safe.sh

# Ou manuellement (attention !)
docker system prune -a -f --volumes
```

#### Conteneur qui redémarre en boucle

**Solution** :
1. Vérifier les logs :
```bash
docker logs <container-id> --tail 100
```

2. Vérifier le healthcheck :
```bash
docker inspect <container-id> | grep -A 10 Health
```

### Debugging

#### Activer les logs détaillés

Backend :
```env
LOG_LEVEL=DEBUG
DEBUG=true
```

Frontend :
```env
VITE_DEBUG=true
```

#### Tester l'API manuellement

```bash
# Health check
curl https://api.scan.omnirealm.tech/api/v1/health

# Upload test
curl -X POST https://api.scan.omnirealm.tech/api/v1/upload/simple \
  -H "Authorization: Bearer <token>" \
  -F "file=@test.pdf"
```

### Contact support

Si le problème persiste :
1. Vérifier les logs complets
2. Documenter les étapes de reproduction
3. Contacter l'équipe technique

---
*Dernière mise à jour : 2025-08-12*