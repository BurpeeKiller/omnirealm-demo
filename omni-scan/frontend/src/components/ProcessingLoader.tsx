import { Loader2, FileText, Brain, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ProcessingLoaderProps {
  isProcessing: boolean
  fileName?: string
}

export function ProcessingLoader({ isProcessing, fileName }: ProcessingLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0)
  
  const steps = [
    { icon: FileText, text: "Lecture du document...", duration: 1500 },
    { icon: Brain, text: "Extraction du texte avec OCR...", duration: 2500 },
    { icon: CheckCircle, text: "Finalisation...", duration: 1000 }
  ]
  
  useEffect(() => {
    if (!isProcessing) {
      setCurrentStep(0)
      return
    }
    
    let totalTime = 0
    const timers: NodeJS.Timeout[] = []
    
    steps.forEach((step, index) => {
      const timer = setTimeout(() => {
        setCurrentStep(index)
      }, totalTime)
      
      timers.push(timer)
      totalTime += step.duration
    })
    
    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [isProcessing])
  
  if (!isProcessing) return null
  
  const CurrentIcon = steps[currentStep]?.icon || FileText
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center">
          {/* Animation du loader principal */}
          <div className="relative">
            <Loader2 className="h-16 w-16 text-indigo-600 animate-spin" />
            <CurrentIcon className="h-8 w-8 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          
          {/* Texte de statut */}
          <h3 className="mt-6 text-lg font-semibold text-gray-900">
            Traitement en cours
          </h3>
          
          {fileName && (
            <p className="mt-2 text-sm text-gray-600">
              {fileName}
            </p>
          )}
          
          {/* Étape actuelle */}
          <p className="mt-4 text-sm text-indigo-600 font-medium">
            {steps[currentStep]?.text || "Préparation..."}
          </p>
          
          {/* Barre de progression */}
          <div className="mt-6 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          
          {/* Message d'attente */}
          <p className="mt-4 text-xs text-gray-500 text-center">
            Cela peut prendre quelques secondes selon la taille du document
          </p>
        </div>
      </div>
    </div>
  )
}