#!/bin/bash

# Script de migration PostHog → Plausible
# Usage: ./scripts/migrate-to-plausible.sh

set -e

echo "🔄 Migration PostHog → Plausible Analytics"
echo "=========================================="

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Backup actuel
echo -e "\n${YELLOW}📦 Création d'un backup...${NC}"
cp src/app/layout.tsx src/app/layout.tsx.backup-posthog
echo -e "${GREEN}✓ Backup créé: layout.tsx.backup-posthog${NC}"

# 2. Supprimer PostHog des dépendances
echo -e "\n${YELLOW}🗑️  Suppression de PostHog...${NC}"
if grep -q "posthog-js" package.json; then
    npm uninstall posthog-js
    echo -e "${GREEN}✓ PostHog supprimé des dépendances${NC}"
else
    echo -e "${GREEN}✓ PostHog n'est pas dans les dépendances${NC}"
fi

# 3. Nettoyer les fichiers PostHog
echo -e "\n${YELLOW}🧹 Nettoyage des fichiers...${NC}"

# Supprimer PostHogProvider
if [ -f "src/app/PostHogProvider.tsx" ]; then
    rm src/app/PostHogProvider.tsx
    echo -e "${GREEN}✓ PostHogProvider.tsx supprimé${NC}"
fi

# 4. Créer le nouveau layout avec Plausible
echo -e "\n${YELLOW}📝 Mise à jour de layout.tsx...${NC}"

cat > src/app/layout.tsx.plausible << 'EOF'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PlausibleProvider from "@/components/PlausibleProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://omnirealm.tech"),
  title: {
    default: "OmniRealm | Suite complète de 40+ micro-SaaS IA",
    template: "%s | OmniRealm"
  },
  description: "Transformez vos idées en micro-SaaS rentables avec notre écosystème tout-en-un de 40+ applications AI-first. Solution créée en France 🇫🇷",
  keywords: ["micro-saas", "ai", "intelligence artificielle", "développement", "automatisation", "productivité", "france"],
  authors: [{ name: "OmniRealm" }],
  creator: "OmniRealm",
  publisher: "OmniRealm",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://omnirealm.tech",
    siteName: "OmniRealm",
    title: "OmniRealm | Suite complète de 40+ micro-SaaS IA",
    description: "Transformez vos idées en micro-SaaS rentables avec notre écosystème tout-en-un de 40+ applications AI-first. Solution créée en France 🇫🇷",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OmniRealm - Micro-SaaS AI-First"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "OmniRealm | Suite complète de 40+ micro-SaaS IA",
    description: "Transformez vos idées en micro-SaaS rentables avec notre écosystème tout-en-un",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon-precomposed.png",
    },
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <PlausibleProvider />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
EOF

# 5. Nettoyer les imports PostHog dans tous les fichiers
echo -e "\n${YELLOW}🔍 Recherche et nettoyage des références PostHog...${NC}"

# Trouver tous les fichiers contenant posthog
files_with_posthog=$(grep -r "posthog" src/ --include="*.tsx" --include="*.ts" -l 2>/dev/null || true)

if [ -n "$files_with_posthog" ]; then
    echo "Fichiers contenant 'posthog':"
    echo "$files_with_posthog"
    
    for file in $files_with_posthog; do
        # Créer un backup
        cp "$file" "$file.backup-posthog"
        
        # Commenter les lignes PostHog
        sed -i 's/.*import.*posthog.*/#&/g' "$file"
        sed -i 's/.*usePostHog.*/#&/g' "$file"
        sed -i 's/.*posthog\..*/#&/g' "$file"
        
        echo -e "${GREEN}✓ Nettoyé: $file${NC}"
    done
else
    echo -e "${GREEN}✓ Aucune référence PostHog trouvée${NC}"
fi

# 6. Mettre à jour les variables d'environnement
echo -e "\n${YELLOW}🔐 Mise à jour des variables d'environnement...${NC}"

if [ -f ".env.local" ]; then
    cp .env.local .env.local.backup-posthog
    
    # Commenter les variables PostHog
    sed -i 's/^NEXT_PUBLIC_POSTHOG_KEY=/#&/g' .env.local
    sed -i 's/^NEXT_PUBLIC_POSTHOG_HOST=/#&/g' .env.local
    
    # Ajouter les variables Plausible
    echo "" >> .env.local
    echo "# Plausible Analytics (privacy-first)" >> .env.local
    echo "NEXT_PUBLIC_PLAUSIBLE_DOMAIN=omnirealm.tech" >> .env.local
    echo "# Pour self-hosted, décommentez et modifiez:" >> .env.local
    echo "# NEXT_PUBLIC_PLAUSIBLE_URL=https://analytics.omnirealm.tech" >> .env.local
    
    echo -e "${GREEN}✓ Variables d'environnement mises à jour${NC}"
fi

# 7. Instructions finales
echo -e "\n${GREEN}✅ Migration terminée !${NC}"
echo -e "\n${YELLOW}📋 Prochaines étapes :${NC}"
echo "1. Créez un compte sur https://plausible.io"
echo "2. Ajoutez votre domaine : omnirealm.tech"
echo "3. Vérifiez le nouveau layout.tsx"
echo "4. Testez avec: npm run dev"
echo ""
echo -e "${YELLOW}💡 Pour restaurer PostHog :${NC}"
echo "- Layout: mv src/app/layout.tsx.backup-posthog src/app/layout.tsx"
echo "- Env: mv .env.local.backup-posthog .env.local"
echo "- Réinstaller: npm install posthog-js"

# 8. Proposer de remplacer le layout
echo -e "\n${YELLOW}Voulez-vous appliquer le nouveau layout maintenant ? (y/n)${NC}"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    mv src/app/layout.tsx.plausible src/app/layout.tsx
    echo -e "${GREEN}✓ Layout mis à jour avec Plausible${NC}"
else
    echo -e "${YELLOW}Le nouveau layout est disponible dans: layout.tsx.plausible${NC}"
    echo "Pour l'appliquer: mv src/app/layout.tsx.plausible src/app/layout.tsx"
fi

echo -e "\n${GREEN}🎉 Bienvenue dans l'analytics privacy-first !${NC}"