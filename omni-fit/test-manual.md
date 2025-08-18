# Test Manuel OmniFit - Guide Complet

## 🚀 Démarrage

1. **Lancer l'application**
   ```bash
   cd /home/greg/projets/dev/apps/omni-fit
   pnpm run dev
   ```

2. **Ouvrir dans le navigateur**
   - http://localhost:3003

## ✅ Tests à effectuer

### 1. **Page d'accueil**
- [ ] La page se charge sans erreurs
- [ ] Le bouton "Se connecter" est visible en haut à droite
- [ ] Le bouton "Se connecter" est cliquable
- [ ] Les boutons "Essai Gratuit" et "Commencer Gratuitement" sont visibles

### 2. **Modal de connexion**
- [ ] Cliquer sur "Se connecter" ouvre la modal
- [ ] La modal est centrée et accessible
- [ ] On peut fermer la modal en cliquant sur X ou à l'extérieur
- [ ] Les champs email et mot de passe sont fonctionnels
- [ ] Le switch entre "Connexion" et "Inscription" fonctionne

### 3. **Inscription/Connexion**
- [ ] Créer un nouveau compte avec un email valide
- [ ] Le mot de passe doit avoir au moins 6 caractères
- [ ] Après inscription, redirection vers le dashboard
- [ ] La connexion avec le compte créé fonctionne

### 4. **Dashboard**
- [ ] Les exercices s'affichent correctement
- [ ] On peut ajouter jusqu'à 3 exercices (limite gratuite)
- [ ] Au 4ème exercice, la modal Premium s'affiche

### 5. **Modal Premium**
- [ ] La modal s'affiche au centre
- [ ] Tous les éléments sont cliquables
- [ ] Les plans Mensuel/Annuel sont sélectionnables
- [ ] Le bouton "Commencer l'essai gratuit" est cliquable

### 6. **Paiement Stripe**
- [ ] Cliquer sur "Commencer l'essai gratuit" redirige vers Stripe
- [ ] L'URL Stripe contient les bons paramètres
- [ ] On peut entrer les infos de test :
  - Email: test@test.com
  - Carte: 4242 4242 4242 4242
  - Date: 12/34
  - CVC: 123
- [ ] Après paiement, retour sur l'app avec statut premium

## 🐛 Bugs connus à vérifier

1. **Z-index corrigés** : Les modales devraient maintenant être au-dessus de tout
2. **Click handlers** : Les clics en dehors des modales les ferment
3. **Responsive** : L'app doit fonctionner sur mobile

## 📊 Résultats

| Test | Status | Notes |
|------|--------|-------|
| Page d'accueil | ⏳ | |
| Modal connexion | ⏳ | |
| Auth flow | ⏳ | |
| Dashboard | ⏳ | |
| Modal Premium | ⏳ | |
| Stripe | ⏳ | |

## 🔧 Commandes utiles

```bash
# Logs du serveur
pnpm run dev

# Vérifier les Edge Functions
curl https://api.supabase.omnirealm.tech/functions/v1/verify-subscription \
  -H "Authorization: Bearer YOUR_TOKEN"

# Console développeur (F12)
# Vérifier les erreurs dans la console
# Vérifier les requêtes réseau
```