# 🚀 Guide d'utilisation OmniTask

## 📋 Vue d'ensemble

OmniTask est une application de gestion de tâches moderne avec :
- 🎯 **Tableau Kanban** avec drag & drop fluide
- 📁 **Gestion multi-projets** 
- 🏷️ **Tags et priorités**
- ⏱️ **Suivi du temps** (estimé vs réel)
- 🔄 **Synchronisation temps réel**

## 🎨 Interface principale

### Colonnes Kanban
L'application affiche 4 colonnes par défaut :
1. **À FAIRE** (TODO) - Nouvelles tâches
2. **EN COURS** (IN_PROGRESS) - Tâches actives
3. **EN REVUE** (REVIEW) - En attente de validation
4. **TERMINÉ** (DONE) - Tâches complétées

### Priorités des tâches
- 🔴 **URGENT** - Rouge
- 🟠 **HIGH** - Orange  
- 🟡 **MEDIUM** - Jaune
- 🟢 **LOW** - Vert

## 🎮 Comment utiliser

### 1. Créer des données de test
```bash
# Depuis le dossier omni-task
node test-create-data.js <ton-mot-de-passe>
```

### 2. Drag & Drop
- **Cliquer et maintenir** sur une carte de tâche
- **Glisser** vers une autre colonne ou position
- **Relâcher** pour déposer la tâche

### 3. Fonctionnalités à venir
- ➕ **Bouton "Nouvelle tâche"** (modal de création)
- ✏️ **Édition** en cliquant sur une tâche
- 🗑️ **Suppression** avec confirmation
- 🔍 **Filtres** par projet, tags, priorité
- 📊 **Vue statistiques** 

## 🐛 Résolution de problèmes

### Si le drag & drop ne fonctionne pas
1. Vérifier la console du navigateur (F12)
2. S'assurer que les tâches sont bien chargées
3. Rafraîchir la page

### Si aucune tâche n'apparaît
1. Exécuter le script de données de test
2. Vérifier la connexion à Supabase
3. Regarder les logs dans la console

## 🔧 Architecture technique

- **Frontend** : Next.js 14 + TypeScript
- **État** : Zustand avec Immer
- **Base de données** : Supabase (PostgreSQL)
- **Drag & Drop** : @hello-pangea/dnd
- **Styling** : Tailwind CSS

## 📝 Notes importantes

- Les données sont isolées dans le schéma `omnitask`
- Chaque utilisateur ne voit que ses propres tâches
- Les modifications sont sauvegardées automatiquement
- Support multi-utilisateurs avec RLS activé

---

**Prochaine étape** : Tester le drag & drop avec les données créées !