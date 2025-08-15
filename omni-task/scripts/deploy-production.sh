#!/bin/bash
set -euo pipefail

# ╔══════════════════════════════════════════════════════════════════════════╗
# ║                    Script de Déploiement Production OmniTask             ║
# ║                             Version 1.0 - 2025                           ║
# ╚══════════════════════════════════════════════════════════════════════════╝

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
PROJECT_DIR="/home/greg/projets/dev/apps/omni-task"
VPS_USER="greg"
VPS_HOST="91.108.113.252"
VPS_DIR="/home/greg/apps/omnitask"
SUPABASE_PROJECT="omnitask"

# Fonctions utilitaires
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Vérifier les prérequis
check_prerequisites() {
    log "Vérification des prérequis..."
    
    # Vérifier que nous sommes dans le bon répertoire
    if [[ ! -f "package.json" ]] || [[ ! -f "next.config.mjs" ]]; then
        error "Ce script doit être exécuté depuis le répertoire racine d'OmniTask"
    fi
    
    # Vérifier la présence du fichier .env.production
    if [[ ! -f ".env.production" ]]; then
        error "Fichier .env.production manquant. Créez-le d'abord avec les bonnes valeurs."
    fi
    
    # Vérifier la connexion SSH
    log "Test de connexion SSH au VPS..."
    ssh -o ConnectTimeout=5 ${VPS_USER}@${VPS_HOST} "echo 'SSH OK'" || error "Impossible de se connecter au VPS"
    
    success "Prérequis vérifiés"
}

# Préparer la base de données
prepare_database() {
    log "Préparation de la base de données..."
    
    # Exporter le schéma actuel
    log "Export du schéma de développement..."
    supabase db dump -f supabase/migrations/production_schema.sql --local
    
    # Copier les migrations sur le VPS
    log "Copie des migrations sur le VPS..."
    ssh ${VPS_USER}@${VPS_HOST} "mkdir -p ${VPS_DIR}/supabase/migrations"
    scp -r supabase/migrations/* ${VPS_USER}@${VPS_HOST}:${VPS_DIR}/supabase/migrations/
    
    # Appliquer les migrations sur le VPS
    log "Application des migrations..."
    ssh ${VPS_USER}@${VPS_HOST} "cd ${VPS_DIR} && docker exec coolify-postgres psql -U postgres -d ${SUPABASE_PROJECT} -f supabase/migrations/production_schema.sql" || warning "Certaines migrations peuvent avoir déjà été appliquées"
    
    success "Base de données préparée"
}

# Build de l'application
build_application() {
    log "Build de l'application..."
    
    # Clean build
    rm -rf .next
    
    # Installer les dépendances
    pnpm install --frozen-lockfile
    
    # Build production
    NODE_ENV=production pnpm run build
    
    # Vérifier le build
    if [[ ! -d ".next/standalone" ]]; then
        error "Build standalone non trouvé. Vérifiez next.config.mjs"
    fi
    
    success "Build terminé"
}

# Déployer sur le VPS
deploy_to_vps() {
    log "Déploiement sur le VPS..."
    
    # Créer le répertoire sur le VPS
    ssh ${VPS_USER}@${VPS_HOST} "mkdir -p ${VPS_DIR}"
    
    # Copier les fichiers nécessaires
    log "Copie des fichiers..."
    
    # Créer une archive du build
    tar czf omnitask-deploy.tar.gz \
        .next/standalone \
        .next/static \
        public \
        .env.production \
        package.json
    
    # Transférer l'archive
    scp omnitask-deploy.tar.gz ${VPS_USER}@${VPS_HOST}:${VPS_DIR}/
    
    # Extraire sur le VPS
    ssh ${VPS_USER}@${VPS_HOST} "cd ${VPS_DIR} && tar xzf omnitask-deploy.tar.gz && rm omnitask-deploy.tar.gz"
    
    # Nettoyer l'archive locale
    rm omnitask-deploy.tar.gz
    
    success "Fichiers déployés"
}

# Configurer Supabase en production
configure_supabase() {
    log "Configuration de Supabase en production..."
    
    # Récupérer les clés Supabase du VPS
    log "Récupération des clés Supabase..."
    ANON_KEY=$(ssh ${VPS_USER}@${VPS_HOST} "docker exec coolify-supabase-kong cat /var/lib/kong/anon.key 2>/dev/null || echo 'NOT_FOUND'")
    SERVICE_KEY=$(ssh ${VPS_USER}@${VPS_HOST} "docker exec coolify-supabase-kong cat /var/lib/kong/service.key 2>/dev/null || echo 'NOT_FOUND'")
    
    if [[ "$ANON_KEY" == "NOT_FOUND" ]] || [[ "$SERVICE_KEY" == "NOT_FOUND" ]]; then
        warning "Clés Supabase non trouvées. Vérifiez l'installation Supabase sur le VPS."
        warning "Utilisez: /home/greg/projets/dev/tools/vps/scripts/supabase.manager.sh status"
    else
        # Mettre à jour .env.production sur le VPS
        ssh ${VPS_USER}@${VPS_HOST} "cd ${VPS_DIR} && sed -i 's/your_production_anon_key_here/${ANON_KEY}/g' .env.production"
        ssh ${VPS_USER}@${VPS_HOST} "cd ${VPS_DIR} && sed -i 's/your_production_service_role_key_here/${SERVICE_KEY}/g' .env.production"
        success "Clés Supabase configurées"
    fi
}

# Configurer PM2
configure_pm2() {
    log "Configuration de PM2..."
    
    # Créer le fichier ecosystem
    cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'omnitask',
    script: '.next/standalone/server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3002
    },
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_file: 'logs/combined.log',
    time: true,
    max_memory_restart: '500M',
    watch: false,
    autorestart: true,
    restart_delay: 5000
  }]
}
EOF

    # Copier ecosystem sur le VPS
    scp ecosystem.config.js ${VPS_USER}@${VPS_HOST}:${VPS_DIR}/
    rm ecosystem.config.js
    
    # Configurer PM2 sur le VPS
    ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
cd ${VPS_DIR}
mkdir -p logs

# Arrêter l'ancienne instance si elle existe
pm2 stop omnitask 2>/dev/null || true
pm2 delete omnitask 2>/dev/null || true

# Démarrer la nouvelle instance
pm2 start ecosystem.config.js

# Sauvegarder la configuration PM2
pm2 save
pm2 startup systemd -u ${VPS_USER} --hp /home/${VPS_USER}
ENDSSH

    success "PM2 configuré"
}

# Configuration Nginx
configure_nginx() {
    log "Configuration Nginx..."
    
    # Créer la configuration Nginx
    cat > omnitask.nginx << 'EOF'
server {
    listen 80;
    server_name task.omnirealm.tech;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name task.omnirealm.tech;

    ssl_certificate /etc/letsencrypt/live/omnirealm.tech/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/omnirealm.tech/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self' https://supabase.omnirealm.tech; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;" always;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
    }
}
EOF

    # Copier et activer la configuration
    scp omnitask.nginx ${VPS_USER}@${VPS_HOST}:/tmp/
    ssh ${VPS_USER}@${VPS_HOST} "sudo mv /tmp/omnitask.nginx /etc/nginx/sites-available/omnitask && sudo ln -sf /etc/nginx/sites-available/omnitask /etc/nginx/sites-enabled/"
    ssh ${VPS_USER}@${VPS_HOST} "sudo nginx -t && sudo systemctl reload nginx"
    
    rm omnitask.nginx
    success "Nginx configuré"
}

# Vérifier le déploiement
verify_deployment() {
    log "Vérification du déploiement..."
    
    # Vérifier PM2
    ssh ${VPS_USER}@${VPS_HOST} "pm2 status omnitask"
    
    # Vérifier l'accès HTTP
    log "Test d'accès HTTPS..."
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://task.omnirealm.tech || echo "000")
    
    if [[ "$HTTP_STATUS" == "200" ]] || [[ "$HTTP_STATUS" == "302" ]]; then
        success "Application accessible sur https://task.omnirealm.tech"
    else
        warning "Application non accessible (HTTP $HTTP_STATUS). Vérifiez les logs."
    fi
}

# Menu principal
main_menu() {
    clear
    echo -e "${BLUE}╔══════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║        Déploiement Production OmniTask               ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════╝${NC}"
    echo
    echo "1) Déploiement complet"
    echo "2) Build seulement"
    echo "3) Déployer seulement (build existant)"
    echo "4) Configurer Supabase"
    echo "5) Configurer Nginx"
    echo "6) Vérifier le déploiement"
    echo "0) Quitter"
    echo
    read -p "Choix: " choice
    
    case $choice in
        1)
            check_prerequisites
            prepare_database
            build_application
            deploy_to_vps
            configure_supabase
            configure_pm2
            configure_nginx
            verify_deployment
            success "Déploiement complet terminé!"
            ;;
        2)
            build_application
            ;;
        3)
            check_prerequisites
            deploy_to_vps
            configure_pm2
            verify_deployment
            ;;
        4)
            configure_supabase
            ;;
        5)
            configure_nginx
            ;;
        6)
            verify_deployment
            ;;
        0)
            exit 0
            ;;
        *)
            error "Choix invalide"
            ;;
    esac
}

# Exécution
if [[ $# -eq 0 ]]; then
    main_menu
else
    case $1 in
        --help|-h)
            echo "Usage: $0 [--help]"
            echo "Lance le menu de déploiement interactif"
            ;;
        *)
            main_menu
            ;;
    esac
fi