# Migration des Modaux vers shadcn/ui Dialog

## Résumé de la migration

Tous les composants modaux ont été migrés vers le système Dialog de shadcn/ui pour une meilleure cohérence et maintenabilité.

### Composants migrés

1. **SecurityModal** → Dialog avec custom-dialog
2. **AICoachModal** → Dialog avec tabs personnalisés
3. **ProgramsModal** → Dialog simple avec header personnalisé
4. **PricingModal** → Dialog standard shadcn/ui
5. **Settings** → Dialog avec tabs via DialogTabs
6. **Stats** → Dialog avec tabs et gestion des permissions
7. **UpgradePrompt** → Dialog avec styles premium

### Nouveaux composants créés

1. **custom-dialog.tsx** - Extension du Dialog shadcn/ui avec :
   - Support des headers avec gradients et icônes
   - Mode fullHeight pour les modaux plein écran mobile
   - Structure cohérente (DialogHeader, DialogBody, DialogFooter)

2. **dialog-tabs.tsx** - Système de tabs réutilisable pour les modaux :
   - Support des tabs premium avec lock
   - Animations motion
   - Personnalisation des couleurs actives

### Composants supprimés

- **BaseModal.tsx** - N'était plus utilisé
- Dossier **/components/Modal/** - Vide après suppression

### Améliorations apportées

1. **Cohérence** : Tous les modaux utilisent maintenant le même système
2. **Accessibilité** : Dialog de Radix UI offre une meilleure accessibilité
3. **Performance** : Moins de code dupliqué, composants réutilisables
4. **Maintenabilité** : Structure uniforme pour tous les modaux
5. **Animations** : Conservées via Framer Motion et les classes Tailwind

### Structure type d'un modal migré

```tsx
<Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent showCloseButton={false}>
    <DialogHeader
      gradient="from-purple-600 to-pink-600"
      icon={<Icon className="w-8 h-8 text-white" />}
      subtitle="Description"
    >
      Titre
    </DialogHeader>
    
    <DialogTabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      activeColor="purple"
    />
    
    <DialogBody>
      {/* Contenu */}
    </DialogBody>
    
    <DialogFooter>
      {/* Actions */}
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Notes importantes

- Les animations de transition sont préservées
- Les styles spécifiques à chaque modal sont conservés
- Le comportement responsive (mobile/desktop) est maintenu
- LoginModal et LoginModalShadcn coexistent (migration progressive)

### Prochaines étapes suggérées

1. Migrer LoginModal vers LoginModalShadcn et supprimer l'ancien
2. Vérifier et ajuster les animations si nécessaire
3. Tester sur mobile pour valider le comportement responsive
4. Considérer la migration d'autres composants UI vers shadcn/ui