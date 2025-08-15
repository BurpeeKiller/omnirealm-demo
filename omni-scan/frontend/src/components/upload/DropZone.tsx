import { useDropzone, Accept } from 'react-dropzone'
import { Upload, FileText, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DropZoneProps {
  onDrop: (files: File[]) => void
  isLoading?: boolean
  isDragActive?: boolean
  accept?: Accept
  maxSize?: number
  maxFiles?: number
  className?: string
  disabled?: boolean
  compact?: boolean
}

export function DropZone({
  onDrop,
  isLoading = false,
  accept = {
    'application/pdf': ['.pdf'],
    'image/*': ['.jpg', '.jpeg', '.png', '.tiff', '.bmp']
  },
  maxSize = 50 * 1024 * 1024, // 50MB par défaut
  maxFiles = 1,
  className,
  disabled = false,
  compact = false
}: DropZoneProps) {
  const { getRootProps, getInputProps, isDragActive: isActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    disabled: disabled || isLoading
  })

  const baseClasses = cn(
    "border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-200",
    compact ? "p-6" : "p-12",
    isActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
    (isLoading || disabled) && "opacity-50 cursor-not-allowed",
    className
  )

  return (
    <div {...getRootProps()} className={baseClasses}>
      <input {...getInputProps()} />
      
      {isLoading ? (
        <div className="space-y-4">
          <Loader2 className={cn("mx-auto animate-spin text-blue-500", compact ? "w-8 h-8" : "w-12 h-12")} />
          <p className="text-gray-600">Traitement en cours...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <Upload className={cn("mx-auto text-gray-400", compact ? "w-8 h-8" : "w-12 h-12")} />
          <div>
            <p className={cn("font-medium", compact ? "text-base" : "text-lg")}>
              {isActive ? 'Déposez le fichier ici' : 'Glissez-déposez un fichier ici'}
            </p>
            <p className="text-sm text-gray-500 mt-2">ou cliquez pour sélectionner</p>
          </div>
          <p className="text-xs text-gray-400">
            Formats supportés : PDF, JPG, PNG, TIFF, BMP (max {Math.round(maxSize / 1024 / 1024)}MB)
          </p>
        </div>
      )}
    </div>
  )
}