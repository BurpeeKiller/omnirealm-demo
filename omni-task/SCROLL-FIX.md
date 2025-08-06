# 🖱️ Correction du scroll dans les colonnes

## Problème
Les colonnes Kanban ne permettaient pas de scroller quand il y avait beaucoup de tâches.

## Solution appliquée

### 1. **Hauteur maximale définie**
- Ajout de `maxHeight: calc(100vh - 300px)` aux colonnes
- Permet de limiter la hauteur et activer le scroll

### 2. **Overflow configuré**
- `overflow-y-auto` : Scroll vertical automatique
- `overflow-x-hidden` : Pas de scroll horizontal
- `min-h-0` : Permet au flexbox de réduire la hauteur

### 3. **Scrollbar personnalisée**
- Largeur : 6px (discrète)
- Couleurs adaptées au thème clair/sombre
- Hover effect pour meilleure visibilité

### 4. **Indicateur visuel**
- Message "↓ Faire défiler pour voir plus ↓" 
- Apparaît quand > 5 tâches dans une colonne
- Aide l'utilisateur à comprendre qu'il peut scroller

## Résultat

✅ Les colonnes sont maintenant scrollables avec la souris
✅ Scrollbar élégante et discrète
✅ Indicateur clair quand il y a plus de contenu
✅ Le drag & drop fonctionne toujours parfaitement

## Test

1. Ajouter 10+ tâches dans "À faire"
2. La colonne devient scrollable
3. La molette de la souris fonctionne
4. Le drag & drop reste fluide même en scrollant