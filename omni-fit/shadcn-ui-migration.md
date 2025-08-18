# Migration vers shadcn/ui - OmniFit

## ✅ Installation complétée

### Composants installés :
- **Button** : Bouton avec variantes (default, destructive, outline, secondary, ghost, link)
- **Input** : Champ de saisie stylisé
- **Card** : Container avec header, content, footer
- **Dialog** : Modal/Dialog réutilisable
- **Alert** : Notifications et alertes

### Utilitaire ajouté :
- `/src/lib/utils.ts` : Fonction `cn()` pour combiner les classes Tailwind

## 🔧 Exemples d'utilisation

### Remplacer un bouton existant :

```tsx
// Avant
<button className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">
  Valider
</button>

// Après
import { Button } from "@/components/ui/button"

<Button variant="default">
  Valider
</Button>
```

### Utiliser un Input :

```tsx
import { Input } from "@/components/ui/input"

<Input 
  type="email" 
  placeholder="Email" 
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Créer une Card :

```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Contenu de la carte
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Dialog/Modal :

```tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>Ouvrir</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Titre du dialog</DialogTitle>
      <DialogDescription>
        Description du dialog
      </DialogDescription>
    </DialogHeader>
    {/* Contenu */}
  </DialogContent>
</Dialog>
```

## 🎨 Personnalisation

Les composants shadcn/ui utilisent des variables CSS pour les couleurs. Vous pouvez les personnaliser dans votre CSS :

```css
:root {
  --primary: 346 84% 61%; /* Rose OmniFit */
  --primary-foreground: 0 0% 100%;
  /* ... autres variables */
}
```

## 📝 Prochaines étapes

1. Remplacer progressivement les boutons existants par le composant Button
2. Utiliser Card pour les cartes d'exercices
3. Remplacer LoginModal par Dialog
4. Utiliser Alert pour les notifications d'erreur
5. Ajouter d'autres composants selon les besoins (Select, Checkbox, etc.)

## 🔗 Ressources

- Documentation : https://ui.shadcn.com/docs
- Composants : https://ui.shadcn.com/docs/components
- Thèmes : https://ui.shadcn.com/themes