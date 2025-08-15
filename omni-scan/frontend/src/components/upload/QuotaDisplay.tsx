import { Progress } from '@/components/ui'
import { CheckCircle, AlertCircle, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuotaDisplayProps {
  used: number
  limit: number
  isPro?: boolean
  variant?: 'compact' | 'detailed'
  className?: string
}

export function QuotaDisplay({
  used,
  limit,
  isPro = false,
  variant = 'detailed',
  className
}: QuotaDisplayProps) {
  const percentage = Math.round((used / limit) * 100)
  const remaining = Math.max(0, limit - used)
  const isNearLimit = percentage >= 80 && !isPro
  const isAtLimit = used >= limit && !isPro

  if (variant === 'compact') {
    return (
      <div className={cn("inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm", className)}>
        {isPro ? (
          <>
            <Crown className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-900 font-semibold">Pro illimité</span>
          </>
        ) : (
          <>
            <span className="text-gray-600">Scans gratuits :</span>
            <span className={cn(
              "font-semibold",
              isAtLimit ? "text-red-600" : isNearLimit ? "text-yellow-600" : "text-gray-900"
            )}>
              {used} / {limit}
            </span>
          </>
        )}
      </div>
    )
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isPro ? (
            <>
              <Crown className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">Abonnement Pro</span>
            </>
          ) : (
            <span className="font-medium">Quota mensuel</span>
          )}
        </div>
        {!isPro && (
          <span className={cn(
            "text-sm font-medium",
            isAtLimit ? "text-red-600" : isNearLimit ? "text-yellow-600" : "text-gray-600"
          )}>
            {remaining} {remaining === 1 ? 'scan restant' : 'scans restants'}
          </span>
        )}
      </div>

      {!isPro && (
        <>
          <Progress 
            value={percentage} 
            className={cn(
              "h-2",
              isAtLimit && "bg-red-100",
              isNearLimit && !isAtLimit && "bg-yellow-100"
            )}
          />
          
          {isNearLimit && !isAtLimit && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-yellow-800 font-medium">Quota bientôt atteint</p>
                <p className="text-yellow-700 mt-1">
                  Il vous reste {remaining} {remaining === 1 ? 'scan' : 'scans'} ce mois-ci.
                  <button className="text-yellow-800 underline ml-1 hover:text-yellow-900">
                    Passer à Pro
                  </button>
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {isPro && (
        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-green-800 font-medium">Scans illimités activés</p>
            <p className="text-green-700 mt-1">
              Profitez de votre abonnement Pro sans limite mensuelle.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}