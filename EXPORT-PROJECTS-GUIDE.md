# 📦 Guide d'Export des Projets du Monorepo

## 🎯 Solution Recommandée : Inviter le professeur

### Méthode 1 : Collaborateur GitHub (RECOMMANDÉ) ✅

**Étapes :**
1. Va sur ton repo GitHub
2. Settings → Manage access → Invite a collaborator
3. Entre l'email/username du prof
4. Sélectionne "Read" permission only
5. Le prof reçoit une invitation par email

**Avantages :**
- ✅ Zéro configuration
- ✅ Accès complet au contexte monorepo
- ✅ Peut voir les packages partagés
- ✅ Révocable à tout moment
- ✅ Historique Git complet

**Script de présentation au prof :**
```
"J'ai utilisé une architecture monorepo professionnelle.
Je vous ai envoyé une invitation GitHub en lecture seule.
Les 3 projets sont dans /dev/apps/."
```

---

## 🔧 Méthode 2 : Export avec git subtree (Si repos séparés obligatoires)

### Préparation des exports

```bash
# 1. Créer une branche d'export clean
git checkout -b export-projects
git checkout main -- .

# 2. Exporter OmniTask
git subtree push --prefix=dev/apps/omni-task origin omni-task-export
# Puis créer un nouveau repo public et pousser cette branche

# 3. Exporter OmniScan  
git subtree push --prefix=dev/apps/omni-scan origin omni-scan-export

# 4. Exporter OmniFit
git subtree push --prefix=dev/apps/omni-fit origin omni-fit-export
```

### Script d'export automatisé

```bash
#!/bin/bash
# export-projects.sh

PROJECTS=("omni-task" "omni-scan" "omni-fit")
GITHUB_USER="ton-username"

for project in "${PROJECTS[@]}"; do
  echo "📦 Exporting $project..."
  
  # Créer le repo sur GitHub (nécessite gh CLI)
  gh repo create "$project-demo" --public --description "Demo project for presentation"
  
  # Exporter avec subtree
  git subtree push --prefix="dev/apps/$project" "git@github.com:$GITHUB_USER/$project-demo.git" main
  
  # Cloner et ajouter les dépendances manquantes
  cd /tmp
  git clone "git@github.com:$GITHUB_USER/$project-demo.git"
  cd "$project-demo"
  
  # Copier les packages nécessaires
  mkdir -p packages
  cp -r ~/projets/dev/packages/ui packages/
  cp -r ~/projets/dev/packages/utils packages/
  
  # Ajuster package.json pour les dépendances locales
  sed -i 's|"@omnirealm/ui": "workspace:\*"|"@omnirealm/ui": "file:./packages/ui"|g' package.json
  
  # Copier les configs essentielles
  cp ~/projets/tsconfig.base.json .
  cp ~/projets/.eslintrc.js .
  
  # Commit et push
  git add .
  git commit -m "Add required dependencies for standalone demo"
  git push
  
  echo "✅ $project exported to https://github.com/$GITHUB_USER/$project-demo"
done
```

### Problèmes de cette approche
- ❌ Perte du contexte monorepo
- ❌ Duplication de code
- ❌ Package.json à adapter
- ❌ Configs TypeScript à ajuster
- ❌ Maintenance double

---

## 🚀 Méthode 3 : Démo en ligne (Production)

### Déployer sur Vercel/Netlify gratuitement

**Pour OmniTask (Next.js) :**
```bash
# Vercel
cd dev/apps/omni-task
vercel --prod

# Variables d'env à configurer dans Vercel UI
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

**Pour OmniFit (Vite) :**
```bash
# Netlify
cd dev/apps/omni-fit
npm run build
netlify deploy --prod --dir=dist
```

**URLs de démo :**
- omni-task.vercel.app
- omni-fit.netlify.app
- omni-scan nécessite un backend (plus complexe)

---

## 📋 Checklist de décision

### Questions à poser au prof :

1. **"Préférez-vous accéder au code complet du monorepo ?"**
   → Si OUI : Méthode 1 (collaborateur)

2. **"Avez-vous besoin de repos séparés publics ?"**
   → Si OUI : Méthode 2 (export subtree)

3. **"Une démo en ligne suffit-elle ?"**
   → Si OUI : Méthode 3 (Vercel/Netlify)

### Ce que je recommande de dire :

> "J'ai développé ces projets dans une architecture monorepo professionnelle 
> qui partage du code entre projets. Je peux soit :
> 1. Vous donner accès au repo complet (recommandé pour voir l'architecture)
> 2. Exporter chaque projet séparément (mais perd le contexte)
> 3. Vous montrer des démos en ligne
> 
> Quelle option préférez-vous ?"

---

## 🛡️ Sécurité : Que vérifier avant de partager

```bash
# 1. Vérifier qu'aucun secret n'est commité
git secrets --scan

# 2. Chercher les clés API
grep -r "sk-" --exclude-dir=node_modules
grep -r "SUPABASE_SERVICE" --exclude-dir=node_modules

# 3. Vérifier les .env ne sont pas commités
git ls-files | grep -E "\.env$|\.env\.local$"

# 4. S'assurer que les .gitignore sont corrects
cat .gitignore | grep -E "\.env|node_modules|\.next"
```

---

## 💡 Mon conseil final

**Go avec la Méthode 1** (inviter comme collaborateur) car :

1. **Montre ton professionnalisme** - Tu maîtrises les workflows Git
2. **Garde l'intégrité** - Le prof voit la vraie architecture
3. **Zéro effort** - Pas de maintenance supplémentaire
4. **Contrôle total** - Tu peux révoquer l'accès après

Si le prof insiste pour des repos séparés, utilise le script d'export ci-dessus, mais préviens-le que c'est une version "extraite" qui ne reflète pas l'architecture réelle.

**Phrase clé :**
> "L'architecture monorepo est un choix technique qui divise par 3 
> le temps de développement. Je peux vous montrer comment les projets 
> partagent 80% de leur code de base."