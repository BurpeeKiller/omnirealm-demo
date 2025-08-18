import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dumbbell, Filter, X } from 'lucide-react'
import { trainingPrograms, TrainingProgram } from '@/data/training-programs'
import { ProgramCard } from './ProgramCard'
import { useExercisesStore } from '@/stores/exercises.store'
import { useSubscription } from '@/hooks/useSubscription'

interface ProgramsListProps {
  onClose?: () => void
}

export function ProgramsList({ onClose }: ProgramsListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const { setExercises } = useExercisesStore()
  const { isPremium } = useSubscription()

  const categories = [
    { id: 'all', label: 'Tous', icon: '🎯' },
    { id: 'cardio', label: 'Cardio', icon: '🏃' },
    { id: 'force', label: 'Force', icon: '💪' },
    { id: 'mobilité', label: 'Mobilité', icon: '🧘' },
    { id: 'full-body', label: 'Full Body', icon: '🏋️' },
    { id: 'hiit', label: 'HIIT', icon: '🔥' }
  ]

  const levels = [
    { id: 'all', label: 'Tous niveaux' },
    { id: 'débutant', label: 'Débutant', color: 'text-green-400' },
    { id: 'intermédiaire', label: 'Intermédiaire', color: 'text-orange-400' },
    { id: 'avancé', label: 'Avancé', color: 'text-red-400' }
  ]

  const filteredPrograms = trainingPrograms.filter(program => {
    const categoryMatch = selectedCategory === 'all' || program.category === selectedCategory
    const levelMatch = selectedLevel === 'all' || program.level === selectedLevel
    return categoryMatch && levelMatch
  })

  const handleSelectProgram = (program: TrainingProgram) => {
    if (program.isPremium && !isPremium) return
    
    // Réinitialiser les compteurs des exercices
    const freshExercises = program.exercises.map(exercise => ({
      ...exercise,
      count: 0,
      completed: false
    }))
    
    setExercises(freshExercises)
    onClose?.()
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Dumbbell className="w-8 h-8" />
            Programmes d'Entraînement
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          )}
        </div>
        <p className="text-purple-100">
          {isPremium ? 'Accès à tous les programmes' : `${trainingPrograms.filter(p => !p.isPremium).length} programmes gratuits disponibles`}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400 font-medium">Filtres</span>
        </div>
        
        {/* Catégories */}
        <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Niveaux */}
        <div className="flex gap-2">
          {levels.map(level => (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedLevel === level.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              } ${level.color || ''}`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Programs Grid */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-900">
        <AnimatePresence mode="wait">
          {filteredPrograms.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-4 md:grid-cols-2"
            >
              {filteredPrograms.map((program, index) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProgramCard 
                    program={program} 
                    onSelect={handleSelectProgram}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-500">Aucun programme trouvé avec ces filtres</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}