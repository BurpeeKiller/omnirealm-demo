# 🔐 Guide de Sécurité OmniTask

## 🛡️ Mesures de Sécurité Implémentées

### 1. Headers de Sécurité (Middleware)
- **X-Frame-Options**: DENY - Empêche le clickjacking
- **X-Content-Type-Options**: nosniff - Empêche le MIME type sniffing
- **X-XSS-Protection**: Protection contre XSS
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Permissions-Policy**: Désactive caméra, micro, géolocalisation
- **Content-Security-Policy**: Politique stricte pour les ressources

### 2. Rate Limiting
- **Limite**: 100 requêtes par minute par IP
- **Routes protégées**: Toutes les routes `/api/*`
- **Headers de réponse**: X-RateLimit-* pour informer le client
- **Status 429**: Too Many Requests avec Retry-After

### 3. Validation des Données (Zod)
```typescript
// Exemple de validation stricte
const taskSchema = z.object({
  title: z.string()
    .min(1, 'Le titre est requis')
    .max(500, 'Le titre ne peut pas dépasser 500 caractères')
    .trim(),
  // ...
})
```

### 4. Authentification Multi-Tenant
- Vérification de l'accès à OmniTask spécifiquement
- Sessions Supabase sécurisées
- Cookies httpOnly et secure
- Tokens JWT avec expiration

### 5. Row Level Security (RLS)
Toutes les tables ont des policies RLS :
- Users peuvent voir/modifier uniquement leurs données
- Isolation complète entre utilisateurs
- Vérifications côté base de données

## 🚨 Bonnes Pratiques

### Variables d'Environnement
```bash
# ❌ JAMAIS dans le code
const API_KEY = "sk-123456"

# ✅ TOUJOURS via env
const API_KEY = process.env.API_KEY
```

### Validation des Entrées
```typescript
// ❌ JAMAIS faire confiance aux données client
const task = await createTask(req.body)

// ✅ TOUJOURS valider
const validatedData = taskSchema.parse(req.body)
const task = await createTask(validatedData)
```

### Gestion des Erreurs
```typescript
// ❌ JAMAIS exposer les détails internes
catch (error) {
  return res.json({ error: error.stack })
}

// ✅ Messages génériques
catch (error) {
  console.error(error) // Log interne
  return res.json({ error: 'Erreur serveur' })
}
```

## 🔍 Checklist Sécurité

### Avant chaque déploiement
- [ ] Aucune clé API dans le code
- [ ] Validation Zod sur toutes les entrées utilisateur
- [ ] Pas de console.log avec données sensibles
- [ ] Headers de sécurité configurés
- [ ] Rate limiting actif
- [ ] Tests de sécurité passés

### Audit mensuel
- [ ] Vérifier les dépendances : `pnpm audit`
- [ ] Revoir les policies RLS
- [ ] Analyser les logs d'erreurs
- [ ] Tester les injections SQL
- [ ] Vérifier les permissions fichiers

## 🐛 Vulnérabilités Connues

### Corrigées
- ✅ XSS via descriptions de tâches (sanitization ajoutée)
- ✅ CSRF sur formulaires (tokens CSRF via Supabase)
- ✅ Exposition d'IDs séquentiels (UUIDs utilisés)

### En cours
- ⚠️ Rate limiting en mémoire (Redis prévu pour production)
- ⚠️ Pas de 2FA (prévu v2)

## 📞 Contact Sécurité

Pour signaler une vulnérabilité :
- Email : security@omnirealm.tech
- PGP Key : [À ajouter]
- Délai de réponse : < 24h

## 🎯 Conformité

### RGPD
- Données minimales collectées
- Droit à l'effacement implémenté
- Export des données disponible
- Consentement explicite

### Standards
- OWASP Top 10 : Vérifié
- CSP Level 3 : Implémenté
- SameSite Cookies : Strict

---

**Dernière mise à jour** : 2025-08-08
**Prochain audit** : 2025-09-08