import { motion } from 'framer-motion'
import { Clock, Users, Sparkles, Lock } from 'lucide-react'
import { TrainingProgram } from '@/data/training-programs'
import { useSubscription } from '@/hooks/useSubscription'

interface ProgramCardProps {
  program: TrainingProgram
  onSelect: (program: TrainingProgram) => void
}

export function ProgramCard({ program, onSelect }: ProgramCardProps) {
  const { isPremium } = useSubscription()
  const isLocked = program.isPremium && !isPremium

  const levelColors = {
    débutant: 'text-green-400 bg-green-400/10',
    intermédiaire: 'text-orange-400 bg-orange-400/10',
    avancé: 'text-red-400 bg-red-400/10'
  }

  const categoryColors = {
    cardio: 'from-pink-500 to-rose-500',
    force: 'from-purple-500 to-indigo-500',
    mobilité: 'from-blue-500 to-cyan-500',
    'full-body': 'from-green-500 to-emerald-500',
    hiit: 'from-orange-500 to-red-500'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative bg-gray-800 rounded-lg p-6 border-2 transition-all duration-200 cursor-pointer ${
        isLocked 
          ? 'border-gray-700 opacity-75' 
          : 'border-gray-700 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/20'
      }`}
      onClick={() => !isLocked && onSelect(program)}
    >
      {/* Badge Premium */}
      {program.isPremium && (
        <div className="absolute top-4 right-4">
          {isLocked ? (
            <Lock className="w-5 h-5 text-gray-500" />
          ) : (
            <Sparkles className="w-5 h-5 text-purple-400" />
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`text-4xl p-3 rounded-lg bg-gradient-to-br ${categoryColors[program.category]} bg-opacity-20`}>
          {program.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-100 mb-1">{program.name}</h3>
          <p className="text-sm text-gray-400">{program.description}</p>
        </div>
      </div>

      {/* Métadonnées */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>{program.duration}</span>
        </div>
        <div className={`flex items-center gap-1.5 text-sm px-2 py-1 rounded-full ${levelColors[program.level]}`}>
          <Users className="w-4 h-4" />
          <span className="capitalize">{program.level}</span>
        </div>
      </div>

      {/* Aperçu des exercices */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          {program.exercises.length} exercices
        </p>
        <div className="flex flex-wrap gap-2">
          {program.exercises.slice(0, 4).map((exercise, index) => (
            <div 
              key={index}
              className="text-xs bg-gray-700/50 px-2 py-1 rounded-lg text-gray-300"
            >
              {exercise.icon} {exercise.name}
            </div>
          ))}
          {program.exercises.length > 4 && (
            <div className="text-xs bg-gray-700/50 px-2 py-1 rounded-lg text-gray-400">
              +{program.exercises.length - 4} autres
            </div>
          )}
        </div>
      </div>

      {/* Overlay pour les programmes verrouillés */}
      {isLocked && (
        <div className="absolute inset-0 bg-gray-900/50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400 font-medium">Premium</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}