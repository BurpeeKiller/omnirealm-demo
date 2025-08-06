# 🚀 Instructions de déploiement OmniFit

## Méthode 1 : Via l'interface Netlify (Recommandé)

1. **Accède à Netlify** : https://app.netlify.com
2. **Trouve le site** : fitness.omnirealm.tech (ou frolicking-stardust-cd010f)
3. **Drag & Drop** : Glisse le dossier `dist/` sur la zone de déploiement
4. **Attendre** : ~30 secondes pour le déploiement

## Méthode 2 : Via CLI (si le site est lié)

```bash
# Si tu veux lier manuellement
netlify link
# Choisis "Enter a project ID"
# Entre : 3d68a8f0-f41e-47c2-812c-d0834fba2e46

# Puis déployer
netlify deploy --prod --dir=dist
```

## Méthode 3 : Via l'API directement

```bash
# Créer un zip du dossier dist
cd dist && zip -r ../omnifit-deploy.zip . && cd ..

# Uploader via curl (remplace YOUR_ACCESS_TOKEN)
curl -H "Content-Type: application/zip" \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     --data-binary "@omnifit-deploy.zip" \
     https://api.netlify.com/api/v1/sites/3d68a8f0-f41e-47c2-812c-d0834fba2e46/deploys
```

## URLs finales

- **Production** : https://fitness.omnirealm.tech
- **Netlify direct** : https://frolicking-stardust-cd010f.netlify.app

## Vérification post-déploiement

1. Vide le cache navigateur (Ctrl+Shift+R)
2. Teste la landing : https://fitness.omnirealm.tech/?view=landing
3. Vérifie le logo OmniFit et le nouveau design

---

Le build est déjà prêt dans le dossier `dist/`. Il ne reste qu'à le déployer !