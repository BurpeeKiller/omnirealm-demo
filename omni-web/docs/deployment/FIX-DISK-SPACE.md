# 🚨 Résolution : Erreur "no space left on device"

## Problème
Le déploiement échoue avec l'erreur :
```
ERROR: failed to copy files: copy file range failed: no space left on device
```

## Solution rapide (sur le VPS)

### 1. Se connecter au VPS
```bash
ssh greg@91.108.113.252
# ou via Tailscale
ssh greg@100.84.134.70
```

### 2. Vérifier l'espace disque
```bash
df -h
```

### 3. Nettoyer Docker (⚠️ ATTENTION : Sauvegardez d'abord les données importantes)
```bash
# Arrêter les conteneurs non critiques
docker ps -a

# Nettoyer les images non utilisées
docker image prune -a -f

# Nettoyer les conteneurs arrêtés
docker container prune -f

# Nettoyer les volumes non utilisés
docker volume prune -f

# Nettoyer le cache de build
docker builder prune -a -f

# Nettoyer tout en une fois (TRÈS AGRESSIF)
docker system prune -a --volumes -f
```

### 4. Identifier les gros fichiers
```bash
# Top 20 des plus gros répertoires
du -h / 2>/dev/null | sort -rh | head -20

# Rechercher les gros fichiers (>1GB)
find / -type f -size +1G -exec ls -lh {} \; 2>/dev/null
```

### 5. Nettoyer les logs
```bash
# Logs Docker
truncate -s 0 /var/lib/docker/containers/*/*-json.log

# Journaux système (garder 7 jours)
journalctl --vacuum-time=7d

# Logs Apache/Nginx si présents
find /var/log -name "*.log" -type f -mtime +30 -delete
```

## Solutions préventives

### 1. Limiter la taille des logs Docker
Créer `/etc/docker/daemon.json` :
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

### 2. Script de nettoyage automatique (cron)
```bash
# Ajouter au crontab
crontab -e

# Nettoyer tous les dimanches à 3h du matin
0 3 * * 0 docker system prune -a -f --filter "until=168h"
```

### 3. Monitoring d'espace disque
```bash
# Script d'alerte
#!/bin/bash
THRESHOLD=90
USAGE=$(df / | grep / | awk '{ print $5 }' | sed 's/%//g')
if [ $USAGE -gt $THRESHOLD ]; then
    echo "Alerte: Espace disque à $USAGE%" | mail -s "VPS Disk Alert" your-email@example.com
fi
```

## Commande rapide pour libérer de l'espace

```bash
# Copier-coller cette commande pour un nettoyage rapide et sûr
docker image prune -a -f && \
docker container prune -f && \
docker volume prune -f && \
docker builder prune -a -f && \
df -h
```

## Notes importantes

1. **Toujours vérifier** quels conteneurs/images sont en cours d'utilisation avant de nettoyer
2. **Sauvegarder** les données importantes avant un nettoyage agressif
3. **Coolify** peut avoir ses propres mécanismes de nettoyage - vérifier la documentation
4. Si le problème persiste, envisager d'augmenter l'espace disque du VPS

## Après le nettoyage

Relancer le déploiement dans Coolify ou via :
```bash
cd /home/greg/projets
./scripts/deploy-omniweb.sh
```