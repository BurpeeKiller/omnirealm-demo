import { Badge } from '@/components/ui'
import { 
  FileText, 
  FileSignature, 
  User, 
  Mail, 
  FileBarChart,
  Receipt,
  CreditCard,
  File
} from 'lucide-react'

interface DocumentTypeBadgeProps {
  type: string
  confidence?: number
  size?: 'sm' | 'md' | 'lg'
}

const typeConfig = {
  invoice: {
    label: 'Facture',
    icon: FileText,
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  contract: {
    label: 'Contrat',
    icon: FileSignature,
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  cv: {
    label: 'CV',
    icon: User,
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  email: {
    label: 'Email',
    icon: Mail,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  report: {
    label: 'Rapport',
    icon: FileBarChart,
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  },
  receipt: {
    label: 'Reçu',
    icon: Receipt,
    color: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  business_card: {
    label: 'Carte de visite',
    icon: CreditCard,
    color: 'bg-pink-100 text-pink-800 border-pink-200'
  },
  general: {
    label: 'Document',
    icon: File,
    color: 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export function DocumentTypeBadge({ type, confidence, size = 'md' }: DocumentTypeBadgeProps) {
  const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.general
  const Icon = config.icon
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  }
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }
  
  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant="outline"
        className={`${config.color} ${sizeClasses[size]} border flex items-center gap-1.5`}
      >
        <Icon className={iconSizes[size]} />
        <span>{config.label}</span>
      </Badge>
      
      {confidence !== undefined && confidence > 0 && (
        <span className="text-xs text-gray-500">
          ({Math.round(confidence * 100)}%)
        </span>
      )}
    </div>
  )
}