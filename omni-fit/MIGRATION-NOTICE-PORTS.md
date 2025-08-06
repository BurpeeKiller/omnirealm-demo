# ⚠️ MIGRATION IMPORTANTE - Système de Ports Multi-Dev

**Date** : 2025-07-28  
**Impact** : Configuration des variables d'environnement

## 🔄 Changements Effectués

### 1. **Nouvelle Organisation**
Le système de gestion des ports a été migré vers :
- **Avant** : `/dev/tools/ports/`
- **Maintenant** : `/shared/scripts/ports/`

### 2. **Variables Globales Exportées**
Toutes les variables de ports et URLs sont maintenant **exportées globalement** depuis `/shared/scripts/ports/.env.ports` :

```bash
# Variables automatiquement disponibles :
OMNIFIT_PORT=3003
OMNIFIT_FRONTEND_URL="http://localhost:3003"
OMNIFIT_SUPABASE_URL="..."
OMNIFIT_SUPABASE_ANON_KEY="..."
```

### 3. **Nouveau Fichier .env Simplifié**
Un fichier `.env.simplified` a été créé avec **uniquement** les variables spécifiques au projet :
- Configuration fitness spécifique
- Variables métier
- **PAS** de ports ou URLs (héritées automatiquement)

## 🚀 Action Requise

### Option 1 : Utiliser la Nouvelle Configuration (Recommandé)
```bash
# 1. Renommer l'ancien .env
mv .env .env.old

# 2. Utiliser le nouveau fichier simplifié
cp .env.simplified .env

# 3. Vérifier que tout fonctionne
cd /home/greg/projets
omnidev-start
# Choisir option 3 (OmniFit seulement)
```

### Option 2 : Garder l'Ancienne Configuration
Si vous préférez garder votre `.env` actuel, il continuera de fonctionner.
Les variables locales ont priorité sur les globales.

## 📝 Avantages de la Migration

1. **Zéro Duplication** : Les ports/URLs sont définis une seule fois
2. **Cohérence Garantie** : Impossible d'avoir des conflits de ports
3. **Maintenance Simplifiée** : Un seul fichier à modifier pour tous les projets
4. **Configuration Minimale** : Les `.env` ne contiennent que l'essentiel

## 🔧 Commandes Utiles

```bash
# Voir toutes les variables d'environnement OmniRealm
dev-env

# Démarrer avec le nouveau système
omnidev-start

# Comparer ancien vs nouveau
diff .env .env.simplified
```

## ❓ Support

En cas de problème :
1. Vérifier que les alias sont rechargés : `source ~/.bashrc`
2. Consulter : `/shared/scripts/ports/README.md`
3. Revenir à l'ancien système : `mv .env.old .env`

---

**Note** : Cette migration fait partie de l'optimisation globale du monorepo OmniRealm pour respecter le principe DRY (Don't Repeat Yourself).