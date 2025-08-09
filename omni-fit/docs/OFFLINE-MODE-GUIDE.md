# Guide du Mode Offline - OmniFit PWA

## 🚀 Vue d'ensemble

OmniFit est une Progressive Web App (PWA) complète avec un support offline avancé. L'application fonctionne entièrement sans connexion internet grâce à plusieurs technologies modernes.

## 📱 Fonctionnalités Offline

### 1. **Stockage Local Complet**
- Base de données **Dexie** (IndexedDB) pour toutes les données
- Persistance des exercices, statistiques et paramètres
- Aucune perte de données en mode offline

### 2. **Service Worker Avancé**
- Cache intelligent des ressources statiques
- Stratégies de cache optimisées :
  - **CacheFirst** : Images, sons, polices
  - **StaleWhileRevalidate** : JS/CSS
  - **NetworkFirst** : API (avec fallback cache)

### 3. **Background Sync**
- Queue de synchronisation automatique
- Synchronisation au retour de la connexion
- Indicateur visuel des éléments en attente

### 4. **Notifications Planifiées**
- Rappels d'exercices même hors ligne
- Service Worker avec Periodic Sync (si supporté)
- Fallback sur système de timer JavaScript

## 🔔 Notifications

### Configuration requise :
1. Autoriser les notifications dans le navigateur
2. Garder l'app ouverte en arrière-plan (PWA installée)
3. Activer les rappels dans les réglages

### Limitations PWA vs Native :
- Les notifications planifiées nécessitent que l'app soit en arrière-plan
- Le Periodic Background Sync n'est pas supporté sur tous les navigateurs
- Sur iOS, certaines fonctionnalités sont limitées

## 🔄 Synchronisation des Données

### Queue de Synchronisation
Toutes les actions sont ajoutées à une queue locale :
- Ajout d'exercices
- Modifications de paramètres
- Statistiques et analytics

### Processus de Sync
1. **Offline** : Les données sont stockées localement
2. **Retour Online** : Synchronisation automatique
3. **Indicateur** : Badge montrant le nombre d'éléments en attente
4. **Sync Manuel** : Bouton pour forcer la synchronisation

## 🛠️ Architecture Technique

### Service Worker Custom
```javascript
// sw-custom.js
- Background Sync API
- Periodic Sync API (si disponible)
- Gestion des notifications
- Cache strategies avancées
```

### Services Principaux
```typescript
// sync.ts - Queue de synchronisation
- Gestion de la queue offline
- Retry automatique avec backoff
- Persistance localStorage

// reminder-worker.ts - Notifications
- Planification des rappels
- Intégration Service Worker
- Fallback JavaScript timers
```

### Composants UI
```typescript
// NetworkStatus.tsx
- Indicateur online/offline
- Compteur d'éléments en attente
- Bouton de sync manuel
```

## 📊 Stratégies de Cache

### Ressources Statiques
- **Images/Icons** : Cache permanent (30 jours)
- **Sons** : Cache permanent (30 jours)
- **Polices Google** : Cache permanent (1 an)

### Ressources Dynamiques
- **JS/CSS** : Stale While Revalidate (7 jours)
- **API** : Network First avec timeout 5s (5 minutes cache)

## 🚨 Limitations Connues

### iOS Safari
- Pas de Background Sync API
- Notifications limitées
- PWA doit rester active

### Android
- Support complet des APIs
- Notifications en arrière-plan OK
- Background Sync fonctionnel

### Desktop (Chrome/Edge)
- Support complet
- Periodic Sync disponible
- Notifications système natives

## 🔧 Dépannage

### Notifications ne fonctionnent pas
1. Vérifier permissions navigateur
2. Installer la PWA (Add to Home Screen)
3. Tester avec le bouton dans Réglages
4. Vérifier console pour erreurs

### Sync ne se fait pas
1. Vérifier indicateur réseau
2. Forcer sync avec bouton refresh
3. Vérifier localStorage (F12 > Application)
4. Clear cache et réinstaller PWA

### Données perdues
1. Vérifier IndexedDB (F12 > Application)
2. Exporter backup depuis Réglages
3. Restaurer depuis fichier JSON
4. Contacter support si problème persiste

## 🎯 Best Practices

1. **Installer la PWA** pour une meilleure expérience
2. **Autoriser les notifications** dès le début
3. **Faire des backups réguliers** (auto ou manuel)
4. **Garder l'app ouverte** pour les rappels
5. **Synchroniser régulièrement** en étant online

## 📱 Installation PWA

### Android
1. Ouvrir dans Chrome
2. Menu ⋮ > "Installer l'application"
3. Suivre les instructions

### iOS
1. Ouvrir dans Safari
2. Partager > "Sur l'écran d'accueil"
3. Nommer et ajouter

### Desktop
1. Icône d'installation dans la barre d'adresse
2. Ou menu navigateur > "Installer"
3. L'app s'ouvre dans sa propre fenêtre

---

## 🚀 Roadmap Future

- [ ] Push Notifications via serveur
- [ ] Sync avec compte utilisateur
- [ ] Mode offline amélioré pour iOS
- [ ] Export/Import automatique cloud
- [ ] Widget système natif

Pour toute question ou problème, créer une issue sur GitHub.