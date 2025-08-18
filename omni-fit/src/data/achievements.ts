import { Achievement, Badge, LevelSystem } from '@/types/gamification'

export const achievements: Achievement[] = [
  // Achievements de série (streak)
  {
    id: 'streak-3',
    name: 'Démarrage en Force',
    description: '3 jours d\'affilée',
    icon: '🔥',
    category: 'streak',
    requirement: 3,
    unit: 'jours',
    points: 50
  },
  {
    id: 'streak-7',
    name: 'Une Semaine Parfaite',
    description: '7 jours d\'affilée',
    icon: '📅',
    category: 'streak',
    requirement: 7,
    unit: 'jours',
    points: 100
  },
  {
    id: 'streak-30',
    name: 'Guerrier du Mois',
    description: '30 jours d\'affilée',
    icon: '🏆',
    category: 'streak',
    requirement: 30,
    unit: 'jours',
    points: 500
  },
  {
    id: 'streak-100',
    name: 'Centurion',
    description: '100 jours d\'affilée',
    icon: '💯',
    category: 'streak',
    requirement: 100,
    unit: 'jours',
    points: 1000
  },

  // Achievements d'exercices
  {
    id: 'exercises-100',
    name: 'Premier Cent',
    description: '100 exercices complétés',
    icon: '💪',
    category: 'exercises',
    requirement: 100,
    unit: 'exercices',
    points: 75
  },
  {
    id: 'exercises-500',
    name: 'Force Montante',
    description: '500 exercices complétés',
    icon: '⚡',
    category: 'exercises',
    requirement: 500,
    unit: 'exercices',
    points: 200
  },
  {
    id: 'exercises-1000',
    name: 'Millénaire',
    description: '1000 exercices complétés',
    icon: '🌟',
    category: 'exercises',
    requirement: 1000,
    unit: 'exercices',
    points: 500
  },
  {
    id: 'exercises-5000',
    name: 'Légende Vivante',
    description: '5000 exercices complétés',
    icon: '👑',
    category: 'exercises',
    requirement: 5000,
    unit: 'exercices',
    points: 1500
  },

  // Achievements de temps
  {
    id: 'time-60',
    name: 'Première Heure',
    description: '60 minutes d\'entraînement',
    icon: '⏰',
    category: 'time',
    requirement: 60,
    unit: 'minutes',
    points: 50
  },
  {
    id: 'time-300',
    name: '5 Heures de Sueur',
    description: '300 minutes d\'entraînement',
    icon: '⏱️',
    category: 'time',
    requirement: 300,
    unit: 'minutes',
    points: 150
  },
  {
    id: 'time-1000',
    name: 'Marathonien',
    description: '1000 minutes d\'entraînement',
    icon: '🏃',
    category: 'time',
    requirement: 1000,
    unit: 'minutes',
    points: 400
  },

  // Achievements spéciaux
  {
    id: 'perfect-week',
    name: 'Semaine Parfaite',
    description: 'Tous les exercices complétés pendant 7 jours',
    icon: '✨',
    category: 'special',
    requirement: 7,
    unit: 'jours parfaits',
    points: 200
  },
  {
    id: 'early-bird',
    name: 'Lève-tôt',
    description: 'Entraînement avant 7h du matin',
    icon: '🌅',
    category: 'special',
    requirement: 1,
    points: 50
  },
  {
    id: 'night-owl',
    name: 'Oiseau de Nuit',
    description: 'Entraînement après 22h',
    icon: '🦉',
    category: 'special',
    requirement: 1,
    points: 50
  },
  {
    id: 'variety-master',
    name: 'Maître de la Variété',
    description: 'Compléter 10 types d\'exercices différents',
    icon: '🎯',
    category: 'special',
    requirement: 10,
    unit: 'types',
    points: 150
  },
  {
    id: 'comeback-king',
    name: 'Roi du Comeback',
    description: 'Reprendre après 7 jours d\'absence',
    icon: '👑',
    category: 'special',
    requirement: 1,
    points: 100
  }
]

export const badges: Badge[] = [
  // Badges de niveau
  {
    id: 'beginner',
    name: 'Novice',
    description: 'Bienvenue dans l\'aventure fitness!',
    icon: '🌱',
    level: 'bronze'
  },
  {
    id: 'intermediate',
    name: 'Athlète',
    description: 'Niveau 10 atteint',
    icon: '🏃',
    level: 'silver'
  },
  {
    id: 'advanced',
    name: 'Champion',
    description: 'Niveau 25 atteint',
    icon: '🏆',
    level: 'gold'
  },
  {
    id: 'elite',
    name: 'Élite',
    description: 'Niveau 50 atteint',
    icon: '💎',
    level: 'platinum'
  },

  // Badges spéciaux
  {
    id: 'premium-member',
    name: 'Membre Premium',
    description: 'Accès illimité débloqué',
    icon: '⭐',
    level: 'gold'
  },
  {
    id: 'social-butterfly',
    name: 'Papillon Social',
    description: 'Partager 5 achievements',
    icon: '🦋',
    level: 'silver'
  },
  {
    id: 'consistency-master',
    name: 'Maître de la Constance',
    description: '30 jours sans manquer',
    icon: '🎖️',
    level: 'gold'
  }
]

export const levelSystem: LevelSystem[] = [
  {
    level: 1,
    title: 'Débutant',
    requiredPoints: 0,
    icon: '🌱',
    benefits: ['Accès aux exercices de base']
  },
  {
    level: 5,
    title: 'Apprenti',
    requiredPoints: 250,
    icon: '📈',
    benefits: ['Badge Apprenti', 'Nouveaux exercices débloqués']
  },
  {
    level: 10,
    title: 'Athlète',
    requiredPoints: 750,
    icon: '🏃',
    benefits: ['Badge Athlète', 'Statistiques détaillées']
  },
  {
    level: 15,
    title: 'Guerrier',
    requiredPoints: 1500,
    icon: '⚔️',
    benefits: ['Badge Guerrier', 'Défis personnalisés']
  },
  {
    level: 20,
    title: 'Expert',
    requiredPoints: 2500,
    icon: '🎯',
    benefits: ['Badge Expert', 'Programmes avancés']
  },
  {
    level: 25,
    title: 'Champion',
    requiredPoints: 4000,
    icon: '🏆',
    benefits: ['Badge Champion', 'Titre exclusif']
  },
  {
    level: 30,
    title: 'Maître',
    requiredPoints: 6000,
    icon: '🥋',
    benefits: ['Badge Maître', 'Coaching personnalisé']
  },
  {
    level: 40,
    title: 'Grand Maître',
    requiredPoints: 10000,
    icon: '👑',
    benefits: ['Badge Grand Maître', 'Accès VIP']
  },
  {
    level: 50,
    title: 'Légende',
    requiredPoints: 15000,
    icon: '🌟',
    benefits: ['Badge Légende', 'Hall of Fame']
  },
  {
    level: 100,
    title: 'Immortel',
    requiredPoints: 50000,
    icon: '🔥',
    benefits: ['Badge Immortel', 'Statut légendaire']
  }
]

/**
 * Calculer le niveau actuel basé sur les points
 */
export function calculateLevel(points: number): { level: number; title: string; nextLevel?: LevelSystem } {
  const sortedLevels = [...levelSystem].sort((a, b) => b.requiredPoints - a.requiredPoints)
  const currentLevelData = sortedLevels.find(l => points >= l.requiredPoints) || levelSystem[0]
  
  const currentIndex = levelSystem.findIndex(l => l.level === currentLevelData.level)
  const nextLevel = levelSystem[currentIndex + 1]
  
  return {
    level: currentLevelData.level,
    title: currentLevelData.title,
    nextLevel
  }
}

/**
 * Calculer les points pour une action
 */
export function calculatePoints(action: 'exercise' | 'workout' | 'streak' | 'achievement', value: number = 1): number {
  const pointsMap = {
    exercise: 5,      // 5 points par exercice
    workout: 25,      // 25 points par séance complète
    streak: 10,       // 10 points bonus par jour de série
    achievement: 0    // Variable selon l'achievement
  }
  
  return pointsMap[action] * value
}