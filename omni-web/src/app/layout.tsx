import Header from '@/components/Header';
import { Providers } from '@/components/Providers';
import CookieBanner from '@/components/legal/CookieBanner';
import UmamiProvider from '@/components/UmamiProvider';
import type { Metadata } from 'next';
import { Inter, Fira_Code } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const firaCode = Fira_Code({
  variable: '--font-fira-code',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Omnirealm - Votre Solution IA pour la Pause',
  description:
    'Découvrez Omnirealm, la plateforme IA qui optimise vos pauses pour une productivité maximale et un bien-être accru.',
  icons: {
    icon: '/img/logo_pasdefond.png',
    shortcut: '/img/logo_pasdefond.png',
    apple: '/img/logo_pasdefond.png',
  },
  openGraph: {
    title: 'Omnirealm - Votre Solution IA pour la Pause',
    description:
      'Découvrez Omnirealm, la plateforme IA qui optimise vos pauses pour une productivité maximale et un bien-être accru.',
    url: 'https://www.omnirealm.com',
    siteName: 'Omnirealm',
    images: [
      {
        url: 'https://www.omnirealm.com/img/logo_pasdefond.png',
        width: 800,
        height: 600,
        alt: 'Omnirealm Logo',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omnirealm - Votre Solution IA pour la Pause',
    description:
      'Découvrez Omnirealm, la plateforme IA qui optimise vos pauses pour une productivité maximale et un bien-être accru.',
    images: ['https://www.omnirealm.com/img/logo_pasdefond.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Google Analytics sera chargé après consentement cookies */}
      </head>
      <body className={`${inter.variable} ${firaCode.variable} antialiased`}>
        <UmamiProvider 
          websiteId="TODO-REPLACE-WITH-UMAMI-WEBSITE-ID"
          enabled={process.env.NODE_ENV === 'production'}
        />
        <Providers>
          <Header />
          {children}
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
