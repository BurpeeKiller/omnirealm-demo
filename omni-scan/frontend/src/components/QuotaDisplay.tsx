import { Progress, Badge } from '@/components/ui'
import { Sparkles } from 'lucide-react'

interface QuotaDisplayProps {
  quotaInfo: {
    used: number
    limit: number
    remaining: number
    isPro: boolean
  }
  onUpgrade?: () => void
}

export function QuotaDisplay({ quotaInfo, onUpgrade }: QuotaDisplayProps) {
  if (quotaInfo.isPro) {
    return (
      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
        <Sparkles className="w-3 h-3 mr-1" />
        Pro - Illimité
      </Badge>
    )
  }
  
  const percentage = (quotaInfo.used / quotaInfo.limit) * 100
  const isLow = quotaInfo.remaining <= 2
  
  return (
    <div className="text-right">
      <p className="text-sm text-gray-500">Scans restants</p>
      <div className="flex items-center gap-2">
        <Progress 
          value={percentage} 
          className={`w-20 h-2 ${isLow ? 'bg-orange-100' : ''}`}
        />
        <span className={`text-sm font-medium ${isLow ? 'text-orange-600' : ''}`}>
          {quotaInfo.remaining}/{quotaInfo.limit}
        </span>
      </div>
      {isLow && onUpgrade && (
        <button 
          onClick={onUpgrade}
          className="text-xs text-blue-600 hover:underline mt-1"
        >
          Passer Pro →
        </button>
      )}
    </div>
  )
}