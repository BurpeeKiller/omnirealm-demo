# 🎬 Scripts de Démonstration - Projets OmniRealm

## 📋 OmniTask - Démo Kanban (5 min)

### Préparation
```bash
cd dev/apps/omni-task
./start-turbo.sh  # Démarrage optimisé
# Ouvrir http://localhost:3000
```

### Scénario de démo

**1. Performance Turbopack (30s)**
- Montrer le démarrage en 2.3s
- Faire un changement dans le code
- Montrer le hot reload < 500ms
- Comparer avec les 15s du mode standard

**2. Authentification (30s)**
- Créer un compte démo
- Se connecter
- Montrer la persistance de session

**3. Gestion multi-projets (1 min)**
- Créer un nouveau projet "Demo Tech"
- Basculer entre projets
- Montrer l'isolation des données

**4. Kanban drag & drop (2 min)**
- Créer 3 tâches avec priorités différentes
- Drag & drop entre colonnes
- Éditer une tâche (deadline, tags)
- Montrer les animations fluides

**5. Points techniques (1 min)**
- Ouvrir VSCode
- Montrer la structure avec Zustand
- Montrer @omnirealm/ui partagé
- Performance : 600MB RAM vs 1.1GB

### Points clés à souligner
- ⚡ "Performance 10x supérieure grâce à Turbopack"
- 🎯 "Architecture modulaire avec packages partagés"
- 💡 "State management moderne avec Zustand + Immer"

---

## 🔍 OmniScan - Démo OCR + IA (5 min)

### Préparation
```bash
cd dev/apps/omni-scan
# Terminal 1 - Backend
cd backend && source venv/bin/activate && python run.py
# Terminal 2 - Frontend  
cd frontend && pnpm dev
# Ouvrir http://localhost:5173
```

### Fichiers de test
- Préparer : facture PDF, carte d'identité, document manuscrit

### Scénario de démo

**1. Upload et OCR (1.5 min)**
- Drag & drop d'une facture PDF
- Montrer la preview instantanée
- Lancer l'OCR
- Afficher le texte extrait

**2. Analyse IA (2 min)**
- Cliquer "Analyser avec l'IA"
- Montrer l'extraction automatique :
  - Montant total
  - Date
  - Fournisseur
  - Articles
- Expliquer GPT-4 pour compréhension contextuelle

**3. Export et historique (1 min)**
- Export JSON structuré
- Export CSV pour Excel
- Montrer l'historique des scans
- Recherche dans les documents

**4. Architecture technique (30s)**
- FastAPI pour performance Python
- React + TypeScript frontend
- Supabase pour persistance
- Architecture microservices

### Points clés
- 🤖 "Seule solution OCR + IA intégrée du marché"
- 🌍 "Multi-langues avec Tesseract"
- 📊 "Export structuré pour comptabilité"

---

## 💪 OmniFit - Démo PWA (5 min)

### Préparation
```bash
cd dev/apps/omni-fit
pnpm dev
# Ouvrir http://localhost:5173
# Préparer un mobile pour installation PWA
```

### Scénario de démo

**1. Installation PWA (1 min)**
- Ouvrir sur mobile via QR code
- Montrer le prompt d'installation
- Installer l'app
- Montrer l'icône sur home screen
- Lancer depuis l'icône

**2. Configuration des rappels (1 min)**
- Définir plage horaire 9h-18h
- Fréquence toutes les 30 min
- 10 burpees par rappel
- Activer les notifications

**3. Enregistrement d'exercices (1 min)**
- Cliquer sur chaque exercice
- Montrer l'animation + son
- Compteurs qui s'incrémentent
- Vue temps réel de l'horloge

**4. Statistiques (1 min)**
- Onglet jour : progression
- Onglet semaine : graphique
- Historique complet
- Export CSV des données

**5. Mode offline (1 min)**
- Couper le WiFi
- Montrer que tout fonctionne
- Données dans IndexedDB
- Reconnexion = sync auto

### Points clés
- 📱 "PWA = Pas besoin d'app store"
- 🔔 "Notifications natives sans serveur"
- 💾 "100% offline avec IndexedDB"
- 🎯 "< 5MB vs 50MB app native"

---

## ⚡ Tips pour une démo réussie

### Avant la démo
1. **Tester tout** 15 min avant
2. **Fermer** les apps gourmandes
3. **Préparer** les données de test
4. **Ouvrir** les terminaux nécessaires
5. **Mode présentation** dans VSCode

### Pendant la démo
1. **Parler en faisant** - Pas de silence
2. **Pointer** les éléments importants
3. **Ralentir** sur les points techniques
4. **Anticiper** les questions
5. **Backup** : vidéos si problème

### Gestion des problèmes
- **Bug ?** → "C'est en développement actif"
- **Lenteur ?** → "Sur le VPS c'est instantané"
- **Erreur ?** → Passer à la feature suivante
- **Question ?** → "Excellente question, j'y reviens après"

---

## 🎯 Ordre de présentation recommandé

1. **OmniTask** - Le plus impressionnant visuellement
2. **OmniScan** - La valeur business évidente  
3. **OmniFit** - L'innovation technique (PWA)

**Transitions entre projets** :
- Task → Scan : "De la productivité individuelle à l'automatisation business..."
- Scan → Fit : "Et pour montrer notre polyvalence technique, une PWA complète..."

---

## 📝 Phrases clés à retenir

### OmniTask
> "Regardez cette performance : 2.3 secondes de démarrage grâce à Turbopack, contre 15 secondes en mode standard."

### OmniScan  
> "En un clic, on transforme n'importe quel document en données structurées exploitables, avec une précision de 98%."

### OmniFit
> "Une vraie app mobile, mais sans passer par l'App Store. Installation en 10 secondes, fonctionne 100% offline."

### Architecture
> "Un monorepo optimisé qui partage 80% du code entre projets, réduisant le temps de développement de 60%."

---

**Rappel** : L'objectif est de montrer tes compétences techniques ET ta vision business. Bonne chance ! 🚀