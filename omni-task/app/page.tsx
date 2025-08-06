'use client'

import { useState } from 'react'
import { Button } from '@omnirealm/ui'
import { Logo } from '@/components/logo'
import { Footer } from '@/components/footer'
import { AnnouncementBar } from '@/components/announcement-bar'
import { CookieBanner } from '@/components/cookie-banner'
import { FeedbackWidget } from '@/components/feedback-widget'
import { TrustBadges } from '@/components/trust-badges'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleStartClick = () => {
    setIsLoading(true)
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <main className="flex-1">
        <div className="flex items-center justify-center p-24">
          <div className="max-w-2xl text-center">
            <div className="flex justify-center mb-8">
              <Logo size="lg" animate={true} />
            </div>
            <h1 className="text-6xl font-bold tracking-tight mb-6">
              OmniTask
            </h1>
            <p className="text-2xl text-muted-foreground mb-4">
              Gestion de tâches moderne avec IA intégrée
            </p>
            <p className="text-sm text-muted-foreground mb-8 max-w-lg mx-auto">
              Fait partie de l'écosystème OmniRealm : OmniScan, OmniTask, Fitness Reminder et plus encore. 
              Toutes vos applications professionnelles interconnectées.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={handleStartClick}
                disabled={isLoading}
                className="relative"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  <>
                    Commencer gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              <Link href="/demo">
                <Button size="lg" variant="outline">
                  Voir la démo
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <TrustBadges />
      </main>
      <Footer />
      <CookieBanner />
      <FeedbackWidget />
    </div>
  )
}