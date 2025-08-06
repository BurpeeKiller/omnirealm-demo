# Guide de Déploiement - OmniScan v2.0

## Prérequis

- Docker et Docker Compose
- Compte Supabase
- Clé API OpenAI
- Tesseract OCR installé sur le serveur

## Variables d'environnement

Créer un fichier `.env` en production avec :

```bash
# Application
ENVIRONMENT=production
SECRET_KEY=<générer-une-clé-sécurisée>

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_KEY=<your-service-key>

# OpenAI
OPENAI_API_KEY=sk-...

# CORS (adapter selon votre domaine)
CORS_ORIGINS=https://omniscan.example.com
```

## Déploiement avec Docker

### 1. Build des images

```bash
docker build -f docker/Dockerfile.backend -t omniscan-backend .
docker build -f docker/Dockerfile.frontend -t omniscan-frontend .
```

### 2. Docker Compose Production

```yaml
version: '3.8'

services:
  backend:
    image: omniscan-backend
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
    env_file:
      - .env
    volumes:
      - ./uploads:/app/uploads
      - ./temp:/app/temp
    restart: unless-stopped

  frontend:
    image: omniscan-frontend
    ports:
      - "80:80"
    environment:
      - VITE_BACKEND_URL=https://api.omniscan.example.com
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend
    restart: unless-stopped
```

### 3. Configuration Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name omniscan.example.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    location / {
        proxy_pass http://frontend:80;
    }

    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Déploiement sur VPS

1. **Installer les dépendances** :
```bash
sudo apt update
sudo apt install -y docker.io docker-compose tesseract-ocr tesseract-ocr-fra
```

2. **Cloner le projet** :
```bash
git clone https://github.com/omnirealm-dev/omni-scan.git
cd omni-scan
```

3. **Configurer l'environnement** :
```bash
cp .env.example .env
# Éditer .env avec les bonnes valeurs
```

4. **Lancer les services** :
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Monitoring

### Logs

```bash
# Backend
docker logs omniscan-backend -f

# Frontend
docker logs omniscan-frontend -f
```

### Health Check

```bash
curl https://api.omniscan.example.com/api/v1/health
```

## Sauvegardes

Script de sauvegarde automatique des uploads :

```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="/backups/omniscan"
DATE=$(date +%Y%m%d_%H%M%S)

# Sauvegarder les uploads
tar -czf "$BACKUP_DIR/uploads_$DATE.tar.gz" /app/uploads/

# Nettoyer les vieilles sauvegardes (garder 30 jours)
find "$BACKUP_DIR" -name "uploads_*.tar.gz" -mtime +30 -delete
```

Ajouter au crontab :
```bash
0 2 * * * /path/to/backup.sh
```

## Mise à jour

1. **Pull les derniers changements** :
```bash
git pull origin main
```

2. **Rebuild les images** :
```bash
docker-compose -f docker-compose.prod.yml build
```

3. **Redémarrer les services** :
```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

## Sécurité

- Toujours utiliser HTTPS en production
- Limiter les CORS aux domaines autorisés
- Utiliser des secrets forts
- Activer le rate limiting
- Monitorer les logs régulièrement
- Garder les dépendances à jour