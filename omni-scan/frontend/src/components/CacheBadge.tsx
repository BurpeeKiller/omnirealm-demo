import { Badge } from '@/components/ui'
import { Zap } from 'lucide-react'

interface CacheBadgeProps {
  fromCache?: boolean
  className?: string
}

export function CacheBadge({ fromCache, className = '' }: CacheBadgeProps) {
  if (!fromCache) return null
  
  return (
    <Badge 
      variant="secondary" 
      className={`bg-purple-100 text-purple-800 ${className}`}
    >
      <Zap className="w-3 h-3 mr-1" />
      Depuis le cache
    </Badge>
  )
}