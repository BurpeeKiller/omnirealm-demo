# 🎓 Guide de Présentation pour le Professeur

**Repository** : https://github.com/BurpeeKiller/omnirealm-demo  
**Auteur** : Greg  
**Date** : Août 2025

## 📋 Structure du Repository de Démonstration

```
omnirealm-demo/
├── README.md           # Vue d'ensemble des 3 projets
├── omni-scan/         # Projet 1 : OCR + IA
├── omni-task/         # Projet 2 : Gestion de tâches
├── omni-fit/          # Projet 3 : Coach Fitness PWA
└── packages/          # Code partagé entre projets
    ├── ui/            # Composants React réutilisables
    ├── utils/         # Fonctions utilitaires
    └── supabase-kit/  # Services base de données
```

## 🚀 Message à envoyer au professeur

> Bonjour [Nom du Prof],
>
> Voici le lien vers mes 3 projets pour la présentation :  
> **https://github.com/BurpeeKiller/omnirealm-demo**
>
> Ces projets font partie d'un écosystème SaaS plus large développé en architecture monorepo. J'ai extrait les 3 projets principaux dans ce repository public pour faciliter votre accès.
>
> **Points clés :**
> - Chaque projet a son propre README avec instructions
> - Le dossier `/packages` contient le code partagé entre projets
> - Les technologies utilisées : React, Next.js, TypeScript, FastAPI, Supabase
>
> Je reste disponible pour toute question ou pour une démonstration en direct.
>
> Cordialement,  
> Greg

## 🎯 Points à mettre en avant lors de la présentation

### 1. Architecture Monorepo
"J'ai utilisé une architecture monorepo pour partager efficacement du code entre projets. Vous pouvez voir dans `/packages` les composants réutilisables."

### 2. Technologies modernes
- **OmniScan** : FastAPI pour la performance Python + React pour l'UI
- **OmniTask** : Next.js 14 avec Turbopack pour des performances 10x
- **OmniFit** : PWA installable sans app store

### 3. Approche professionnelle
- Score RICE+ pour prioriser les features
- Tests automatisés
- CI/CD configuré (dans le monorepo principal)
- Documentation complète

## 📊 Ordre de présentation suggéré

1. **Introduction** (2 min)
   - Vision globale du système OmniRealm
   - Objectif business : SaaS B2B/B2C
   - Architecture technique

2. **OmniTask** (5 min) - Commencer par le plus impressionnant
   - Démo du Kanban drag & drop
   - Performance Turbopack
   - Architecture Next.js 14

3. **OmniScan** (5 min) - Valeur business évidente
   - Upload → OCR → Analyse IA
   - Architecture microservices
   - Use cases entreprise

4. **OmniFit** (5 min) - Innovation technique
   - Installation PWA
   - Fonctionnement offline
   - Notifications natives

5. **Code partagé** (3 min)
   - Montrer `/packages/ui`
   - Expliquer la réutilisabilité
   - Gains de productivité

## 🛠️ Commandes de démo rapide

```bash
# Cloner le repo
git clone https://github.com/BurpeeKiller/omnirealm-demo.git
cd omnirealm-demo

# OmniTask (le plus simple à démarrer)
cd omni-task
npm install  # ou pnpm install
npm run dev
# Ouvrir http://localhost:3000

# OmniFit 
cd ../omni-fit
npm install
npm run dev
# Ouvrir http://localhost:5173

# OmniScan (nécessite Python)
cd ../omni-scan/backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python run.py
# Dans un autre terminal
cd ../frontend
npm install
npm run dev
```

## ⚠️ Points d'attention

1. **Variables d'environnement** : Les `.env` ne sont pas inclus (sécurité)
   - Préparer des clés de démo si nécessaire
   - Ou faire la démo en local avec tes clés

2. **Base de données** : 
   - OmniTask et OmniScan utilisent Supabase
   - Prévoir une instance de démo ou utiliser le mode local

3. **Dépendances Python** :
   - S'assurer que Python 3.11+ est installé pour OmniScan
   - Tesseract OCR peut nécessiter une installation système

## 💡 Questions anticipées du prof

**Q : Pourquoi ces 3 projets spécifiquement ?**
> "Ils représentent 3 marchés différents (B2B entreprise, B2B PME, B2C) avec des stacks techniques variées, montrant ma polyvalence."

**Q : Comment gérez-vous le partage de code ?**
> "Via le dossier `/packages` avec des composants versionnés. Dans le monorepo complet, c'est géré par pnpm workspaces."

**Q : Quel est le modèle économique ?**
> "SaaS avec pricing adapté : 99€/mois pour OmniScan (entreprises), 50€/mois pour OmniTask (PME), 29€/mois pour OmniFit (particuliers)."

**Q : Pourquoi pas tout en Next.js ?**
> "Choix technique adapté : FastAPI pour OmniScan car meilleur pour l'IA/OCR en Python, Next.js pour OmniTask car parfait pour les dashboards, React+Vite pour OmniFit car optimal pour les PWA."

## ✅ Checklist finale

- [ ] Tester que le repo se clone correctement
- [ ] Vérifier qu'aucun fichier sensible n'est présent
- [ ] Préparer l'environnement de démo local
- [ ] Avoir des données de test prêtes
- [ ] Préparer les réponses aux questions techniques

---

**Astuce finale** : Si le prof veut voir le monorepo complet, tu peux dire :
> "Ce repository est un extrait de mon monorepo principal qui contient 15+ projets et outils. J'ai isolé ces 3 projets pour faciliter la présentation, mais l'architecture complète est encore plus riche."

Bonne chance pour ta présentation ! 🚀