# 🚀 Guide de Déploiement Production OmniScan

## 🌐 URLs de Production Actuelles
- **Frontend** : https://scan.omnirealm.tech
- **Backend API** : https://api.scan.omnirealm.tech
- **Plateforme** : Coolify sur VPS OmniRealm
- **Status** : ✅ Déployé avec succès (2025-08-12)

## 📋 Checklist Pré-Production

### 1. **Variables d'Environnement**

```bash
# Backend (.env.production)
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=<générer-avec-openssl-rand-hex-32>
JWT_SECRET_KEY=<générer-avec-openssl-rand-hex-32>

# Supabase (si utilisé)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_KEY=xxx

# Email (SendGrid recommandé)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxx

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PRICE_ID=price_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Redis
REDIS_URL=redis://redis:6379

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx

# OpenAI
OPENAI_API_KEY=sk-xxx

# Domaine
FRONTEND_URL=https://omniscan.app
BACKEND_URL=https://api.omniscan.app
```

### 2. **Infrastructure Recommandée**

#### Option A: VPS Simple (Budget)
```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    environment:
      - ENVIRONMENT=production
    ports:
      - "8001:8000"
    volumes:
      - ./uploads:/app/uploads
    restart: always

  frontend:
    build: ./frontend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/letsencrypt
    restart: always

  redis:
    image: redis:alpine
    volumes:
      - redis_data:/data
    restart: always

volumes:
  redis_data:
```

#### Option B: Kubernetes (Scale)
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: omniscan-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: omniscan-backend
  template:
    spec:
      containers:
      - name: backend
        image: omniscan/backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: ENVIRONMENT
          value: "production"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

### 3. **Sécurité SSL/TLS**

```bash
# Certbot pour Let's Encrypt
sudo certbot --nginx -d omniscan.app -d www.omniscan.app -d api.omniscan.app

# Renouvellement automatique
sudo crontab -e
0 3 * * * /usr/bin/certbot renew --quiet
```

### 4. **Configuration Nginx**

```nginx
# /etc/nginx/sites-available/omniscan
server {
    listen 443 ssl http2;
    server_name omniscan.app;

    ssl_certificate /etc/letsencrypt/live/omniscan.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/omniscan.app/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com;" always;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location / {
        root /var/www/omniscan;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name omniscan.app;
    return 301 https://$server_name$request_uri;
}
```

### 5. **Monitoring & Logs**

```yaml
# Prometheus + Grafana
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=secure_password
```

### 6. **Backup Strategy**

```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="/backups/omniscan"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup Redis
redis-cli --rdb $BACKUP_DIR/redis_$DATE.rdb

# Backup configs
tar -czf $BACKUP_DIR/config_$DATE.tar.gz /etc/omniscan

# Upload to S3
aws s3 cp $BACKUP_DIR s3://omniscan-backups/ --recursive

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -type f -mtime +30 -delete
```

### 7. **CI/CD avec GitHub Actions**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and push Docker images
        run: |
          docker build -t omniscan/backend:latest ./backend
          docker build -t omniscan/frontend:latest ./frontend
          docker push omniscan/backend:latest
          docker push omniscan/frontend:latest
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/omniscan
            docker-compose pull
            docker-compose up -d
```

## 🔍 Tests de Production

### 1. **Load Testing**
```bash
# Locust
pip install locust

# locustfile.py
from locust import HttpUser, task, between

class OmniScanUser(HttpUser):
    wait_time = between(1, 3)
    
    @task
    def upload_document(self):
        with open('test.pdf', 'rb') as f:
            self.client.post('/api/v1/upload/simple', files={'file': f})
```

### 2. **Security Scan**
```bash
# OWASP ZAP
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://omniscan.app

# Nmap
nmap -sV --script ssl-cert,ssl-enum-ciphers -p 443 omniscan.app
```

### 3. **Performance**
```bash
# GTmetrix ou Lighthouse
lighthouse https://omniscan.app --output json --output-path ./lighthouse-report.json
```

## 📊 Métriques à Surveiller

1. **Application**
   - Temps de réponse API (< 200ms)
   - Taux de succès OCR (> 95%)
   - Nombre de scans/minute
   - Erreurs 5xx (< 0.1%)

2. **Infrastructure**
   - CPU usage (< 70%)
   - RAM usage (< 80%)
   - Disk I/O
   - Network latency

3. **Business**
   - Conversions free → pro
   - Churn rate
   - MRR (Monthly Recurring Revenue)
   - Support tickets

## 🚨 Plan de Rollback

```bash
#!/bin/bash
# rollback.sh
PREVIOUS_VERSION=$1

# Stop current
docker-compose down

# Restore previous version
docker pull omniscan/backend:$PREVIOUS_VERSION
docker pull omniscan/frontend:$PREVIOUS_VERSION

# Update docker-compose.yml
sed -i "s/:latest/:$PREVIOUS_VERSION/g" docker-compose.yml

# Restart
docker-compose up -d

# Notify team
curl -X POST $SLACK_WEBHOOK -d '{"text":"Rollback to version '$PREVIOUS_VERSION' completed"}'
```

## 📞 Support & Escalation

1. **Niveau 1** : Monitoring automatique (Uptime Robot, Pingdom)
2. **Niveau 2** : Alerte équipe dev (PagerDuty)
3. **Niveau 3** : Escalation CTO

## 🐛 Problèmes Rencontrés et Solutions (Déploiement Coolify)

### 1. Frontend : Erreur healthcheck nginx IPv6
**Problème** : Le healthcheck échoue car nginx n'écoute que sur IPv4 mais wget essaie IPv6.
```
wget: can't connect to remote host (::1): Address not available
```

**Solution** : 
```dockerfile
# Ajouter l'écoute IPv6 dans nginx
RUN echo 'server { \
    listen 80; \
    listen [::]:80; \
    ...
}' > /etc/nginx/conf.d/default.conf

# Forcer IPv4 dans le healthcheck
HEALTHCHECK CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:80/ || exit 1
```

### 2. Backend : Tables Supabase manquantes
**Problème** : `postgrest.exceptions.APIError: {'code': '42P01', 'message': 'relation "public.documents" does not exist'}`

**Solution** : Créer les tables dans le schéma `public` (voir `/dev/apps/omni-scan/supabase/create_public_tables.sql`)

### 3. Backend : Erreur async/await Supabase
**Problème** : `TypeError: object APIResponse[~_ReturnT] can't be used in 'await' expression`

**Solution** : Le client Supabase Python est synchrone, pas async :
```python
# ❌ Incorrect
await supabase.table("documents").select("count").execute()

# ✅ Correct  
supabase.table("documents").select("count").execute()
```

### 4. Backend : Dépendances OpenCV manquantes
**Problème** : Erreur lors de l'installation d'opencv-python-headless avec Alpine Linux.

**Solution** : Utiliser Debian et installer les dépendances système nécessaires.

## 🔧 Maintenance VPS

### Nettoyage espace disque
Un script sécurisé est disponible : `/dev/tools/vps/cleanup-disk-safe.sh`

**Résultat du nettoyage (2025-08-12)** :
- 88 GB libérés
- Utilisation réduite de 89% à 44%

## ✅ Checklist Finale

- [x] DNS configuré (scan.omnirealm.tech et api.scan.omnirealm.tech)
- [x] SSL/TLS installé et auto-renew configuré (via Coolify)
- [x] Variables d'environnement production
- [x] Tables Supabase créées dans le schéma public
- [ ] Redis configuré avec persistence
- [ ] Emails transactionnels testés
- [ ] Stripe webhooks configurés
- [ ] Monitoring actif
- [ ] Backups automatiques
- [ ] Documentation API à jour
- [ ] Pages légales accessibles
- [ ] Tests de charge passés
- [x] Plan de rollback testé (via Coolify)
- [x] Equipe notifiée du go-live

---

💡 **Note** : Toujours tester le déploiement sur un environnement de staging avant la production !