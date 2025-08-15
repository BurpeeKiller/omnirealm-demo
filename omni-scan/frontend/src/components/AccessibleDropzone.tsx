import { useDropzone, DropzoneOptions } from 'react-dropzone'
import { Upload, FileText } from 'lucide-react'
import { useCallback, useId } from 'react'

interface AccessibleDropzoneProps extends DropzoneOptions {
  isUploading?: boolean
  currentFile?: File | null
  className?: string
}

export function AccessibleDropzone({ 
  isUploading = false, 
  currentFile,
  className = '',
  ...dropzoneOptions 
}: AccessibleDropzoneProps) {
  const dropzoneId = useId()
  const descriptionId = useId()
  const statusId = useId()

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    ...dropzoneOptions,
    disabled: isUploading
  })

  // Message d'état pour lecteurs d'écran
  const getStatusMessage = useCallback(() => {
    if (isUploading) return "Téléchargement en cours, veuillez patienter"
    if (currentFile) return `Fichier sélectionné : ${currentFile.name}`
    if (acceptedFiles.length > 0) return `Fichier prêt : ${acceptedFiles[0].name}`
    if (isDragActive) return "Relâchez le fichier pour le télécharger"
    return "Zone de dépôt prête"
  }, [isUploading, currentFile, acceptedFiles, isDragActive])

  return (
    <div
      {...getRootProps({
        className: `
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 
          focus-visible:ring-blue-500 focus-visible:ring-offset-2
          ${isDragActive ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `,
        role: "button",
        "aria-labelledby": dropzoneId,
        "aria-describedby": descriptionId,
        "aria-disabled": isUploading,
        "aria-busy": isUploading
      })}
    >
      <input 
        {...getInputProps({
          "aria-label": "Sélectionner un fichier à analyser",
          id: `file-input-${dropzoneId}`
        })} 
      />
      
      {/* Icône animée */}
      <div className="relative">
        {currentFile ? (
          <FileText className="w-12 h-12 mx-auto text-green-500" aria-hidden="true" />
        ) : (
          <Upload 
            className={`w-12 h-12 mx-auto transition-colors ${
              isDragActive ? 'text-blue-500 animate-bounce' : 'text-gray-400'
            }`}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Titre principal */}
      <h3 id={dropzoneId} className="text-lg font-medium mt-4">
        {currentFile ? (
          <span className="text-green-600">{currentFile.name}</span>
        ) : isDragActive ? (
          <span className="text-blue-600">Déposez le fichier ici</span>
        ) : (
          "Glissez-déposez un fichier ici"
        )}
      </h3>

      {/* Description */}
      <div id={descriptionId} className="space-y-2 mt-2">
        {!currentFile && !isDragActive && (
          <>
            <p className="text-sm text-gray-500">
              ou{' '}
              <span className="text-blue-600 underline">
                cliquez pour sélectionner
              </span>
            </p>
            <p className="text-xs text-gray-400">
              Formats supportés : PDF, JPG, PNG, TIFF, BMP, TXT
            </p>
            <p className="text-xs text-gray-400">
              Taille maximale : 50 MB
            </p>
          </>
        )}
        
        {currentFile && (
          <p className="text-sm text-gray-600">
            Taille : {(currentFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
        )}
      </div>

      {/* Message d'état pour lecteurs d'écran */}
      <div
        id={statusId}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {getStatusMessage()}
      </div>

      {/* Instructions clavier (visibles au focus) */}
      <div className="mt-4 text-xs text-gray-500 opacity-0 focus-within:opacity-100 transition-opacity">
        <p>Utilisez <kbd className="px-1 py-0.5 bg-gray-100 rounded">Espace</kbd> ou <kbd className="px-1 py-0.5 bg-gray-100 rounded">Entrée</kbd> pour ouvrir le sélecteur de fichiers</p>
      </div>
    </div>
  )
}