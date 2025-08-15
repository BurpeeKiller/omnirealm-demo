import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ToastContainer } from '@/components/toast'
import { AuthProvider } from '@/components/providers/auth-provider'
import CookieBanner from '@/components/legal/CookieBanner'
import { UmamiProvider } from '@/components/UmamiProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OmniTask - Gestion de tâches IA-augmentée',
  description: 'Boostez votre productivité avec la gestion de tâches intelligente',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <UmamiProvider 
          websiteId="TODO-REPLACE-WITH-UMAMI-WEBSITE-ID"
          enabled={process.env.NODE_ENV === 'production'}
        >
          <AuthProvider>
            <div className="min-h-screen bg-background overflow-x-hidden">
              {children}
            </div>
            <ToastContainer />
            <CookieBanner />
          </AuthProvider>
        </UmamiProvider>
      </body>
    </html>
  )
}