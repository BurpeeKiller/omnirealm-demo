import { Exercise } from '@/types'

export interface TrainingProgram {
  id: string
  name: string
  description: string
  duration: string
  level: 'débutant' | 'intermédiaire' | 'avancé'
  category: 'cardio' | 'force' | 'mobilité' | 'full-body' | 'hiit'
  isPremium: boolean
  exercises: Exercise[]
  tips: string[]
  icon: string
}

export const trainingPrograms: TrainingProgram[] = [
  {
    id: 'beginner-full-body',
    name: 'Démarrage en Douceur',
    description: 'Programme complet pour débuter le fitness sans matériel',
    duration: '15-20 min',
    level: 'débutant',
    category: 'full-body',
    isPremium: false,
    icon: '🌱',
    exercises: [
      {
        type: 'jumping-jacks',
        name: 'Jumping Jacks',
        target: 30,
        count: 0,
        icon: '⭐',
        completed: false,
        category: 'cardio',
        description: 'Échauffement parfait pour tout le corps'
      },
      {
        type: 'wall-pushups',
        name: 'Pompes au Mur',
        target: 15,
        count: 0,
        icon: '🙌',
        completed: false,
        category: 'force',
        description: 'Version facile des pompes pour débuter'
      },
      {
        type: 'squats',
        name: 'Squats',
        target: 15,
        count: 0,
        icon: '🦵',
        completed: false,
        category: 'force',
        description: 'Renforce jambes et fessiers'
      },
      {
        type: 'knee-raises',
        name: 'Montées de Genoux',
        target: 20,
        count: 0,
        icon: '🏃',
        completed: false,
        category: 'cardio',
        description: 'Cardio simple et efficace'
      },
      {
        type: 'plank',
        name: 'Planche',
        target: 20,
        count: 0,
        icon: '🧘',
        completed: false,
        category: 'core',
        description: 'Gainage en secondes'
      }
    ],
    tips: [
      'Échauffez-vous toujours avant de commencer',
      'Respectez votre rythme, pas de précipitation',
      'Hydratez-vous régulièrement',
      'Concentrez-vous sur la forme plutôt que la vitesse'
    ]
  },
  
  {
    id: 'hiit-express',
    name: 'HIIT Express 7 Minutes',
    description: 'Entraînement haute intensité pour brûler des calories rapidement',
    duration: '7 min',
    level: 'intermédiaire',
    category: 'hiit',
    isPremium: false,
    icon: '🔥',
    exercises: [
      {
        type: 'burpees',
        name: 'Burpees',
        target: 10,
        count: 0,
        icon: '💪',
        completed: false,
        category: 'full-body',
        description: 'Exercice complet haute intensité'
      },
      {
        type: 'mountain-climbers',
        name: 'Mountain Climbers',
        target: 30,
        count: 0,
        icon: '⛰️',
        completed: false,
        category: 'cardio',
        description: 'Cardio et abdos en même temps'
      },
      {
        type: 'jump-squats',
        name: 'Squats Sautés',
        target: 15,
        count: 0,
        icon: '🦘',
        completed: false,
        category: 'cardio',
        description: 'Explosivité des jambes'
      },
      {
        type: 'push-ups',
        name: 'Pompes',
        target: 12,
        count: 0,
        icon: '💪',
        completed: false,
        category: 'force',
        description: 'Haut du corps'
      },
      {
        type: 'high-knees',
        name: 'Montées de Genoux Rapides',
        target: 40,
        count: 0,
        icon: '🏃',
        completed: false,
        category: 'cardio',
        description: 'Sprint sur place'
      },
      {
        type: 'plank-jacks',
        name: 'Planche Jacks',
        target: 20,
        count: 0,
        icon: '⭐',
        completed: false,
        category: 'core',
        description: 'Gainage dynamique'
      }
    ],
    tips: [
      '30 secondes d\'effort, 10 secondes de repos entre exercices',
      'Donnez votre maximum pendant les phases d\'effort',
      'Forme > Vitesse pour éviter les blessures',
      'Terminez par 2-3 minutes de récupération active'
    ]
  },

  {
    id: 'morning-mobility',
    name: 'Réveil Mobilité',
    description: 'Routine matinale pour réveiller le corps en douceur',
    duration: '10 min',
    level: 'débutant',
    category: 'mobilité',
    isPremium: true,
    icon: '🌅',
    exercises: [
      {
        type: 'neck-rolls',
        name: 'Rotations du Cou',
        target: 10,
        count: 0,
        icon: '🔄',
        completed: false,
        category: 'mobilité',
        description: 'Dans chaque sens'
      },
      {
        type: 'shoulder-rolls',
        name: 'Rotations des Épaules',
        target: 15,
        count: 0,
        icon: '🔄',
        completed: false,
        category: 'mobilité',
        description: 'Avant et arrière'
      },
      {
        type: 'hip-circles',
        name: 'Rotations des Hanches',
        target: 10,
        count: 0,
        icon: '🔄',
        completed: false,
        category: 'mobilité',
        description: 'Dans chaque sens'
      },
      {
        type: 'cat-cow',
        name: 'Chat-Vache',
        target: 15,
        count: 0,
        icon: '🐈',
        completed: false,
        category: 'mobilité',
        description: 'Mobilité colonne vertébrale'
      },
      {
        type: 'lunges',
        name: 'Fentes Alternées',
        target: 10,
        count: 0,
        icon: '🦵',
        completed: false,
        category: 'mobilité',
        description: 'Étirement dynamique jambes'
      },
      {
        type: 'arm-circles',
        name: 'Cercles de Bras',
        target: 20,
        count: 0,
        icon: '🌀',
        completed: false,
        category: 'mobilité',
        description: 'Grands et petits cercles'
      }
    ],
    tips: [
      'Mouvements lents et contrôlés',
      'Respirez profondément pendant chaque exercice',
      'Parfait avec une musique relaxante',
      'Idéal avant le petit-déjeuner'
    ]
  },

  {
    id: 'power-strength',
    name: 'Force & Puissance',
    description: 'Développez votre force sans équipement',
    duration: '25-30 min',
    level: 'avancé',
    category: 'force',
    isPremium: true,
    icon: '💪',
    exercises: [
      {
        type: 'diamond-pushups',
        name: 'Pompes Diamant',
        target: 12,
        count: 0,
        icon: '💎',
        completed: false,
        category: 'force',
        description: 'Triceps focus'
      },
      {
        type: 'pistol-squats',
        name: 'Pistol Squats (assistés)',
        target: 8,
        count: 0,
        icon: '🔫',
        completed: false,
        category: 'force',
        description: 'Par jambe'
      },
      {
        type: 'pike-pushups',
        name: 'Pike Push-ups',
        target: 15,
        count: 0,
        icon: '🏔️',
        completed: false,
        category: 'force',
        description: 'Épaules'
      },
      {
        type: 'hindu-pushups',
        name: 'Pompes Hindu',
        target: 10,
        count: 0,
        icon: '🕉️',
        completed: false,
        category: 'force',
        description: 'Full body flow'
      },
      {
        type: 'bulgarian-split-squats',
        name: 'Bulgarian Split Squats',
        target: 12,
        count: 0,
        icon: '🇧🇬',
        completed: false,
        category: 'force',
        description: 'Par jambe'
      },
      {
        type: 'v-ups',
        name: 'V-ups',
        target: 15,
        count: 0,
        icon: 'V',
        completed: false,
        category: 'core',
        description: 'Abdos avancés'
      },
      {
        type: 'hollow-hold',
        name: 'Hollow Hold',
        target: 30,
        count: 0,
        icon: '⭕',
        completed: false,
        category: 'core',
        description: 'En secondes'
      }
    ],
    tips: [
      '3 séries de chaque exercice',
      '90 secondes de repos entre séries',
      'Focalisez sur le contrôle du mouvement',
      'Progression : augmentez les reps chaque semaine'
    ]
  },

  {
    id: 'office-warrior',
    name: 'Guerrier du Bureau',
    description: 'Exercices discrets à faire au bureau pour rester actif',
    duration: '5-10 min',
    level: 'débutant',
    category: 'mobilité',
    isPremium: true,
    icon: '💼',
    exercises: [
      {
        type: 'desk-pushups',
        name: 'Pompes sur Bureau',
        target: 15,
        count: 0,
        icon: '🖥️',
        completed: false,
        category: 'force',
        description: 'Mains sur le bureau'
      },
      {
        type: 'chair-squats',
        name: 'Squats Chaise',
        target: 20,
        count: 0,
        icon: '🪑',
        completed: false,
        category: 'force',
        description: 'Assis-debout répétés'
      },
      {
        type: 'calf-raises',
        name: 'Extensions Mollets',
        target: 30,
        count: 0,
        icon: '🦶',
        completed: false,
        category: 'force',
        description: 'Debout derrière la chaise'
      },
      {
        type: 'seated-twists',
        name: 'Rotations Assises',
        target: 20,
        count: 0,
        icon: '🔄',
        completed: false,
        category: 'mobilité',
        description: 'Pour le dos'
      },
      {
        type: 'leg-lifts',
        name: 'Levées de Jambes',
        target: 15,
        count: 0,
        icon: '🦵',
        completed: false,
        category: 'core',
        description: 'Assis, jambes tendues'
      },
      {
        type: 'wrist-circles',
        name: 'Cercles Poignets',
        target: 20,
        count: 0,
        icon: '⭕',
        completed: false,
        category: 'mobilité',
        description: 'Anti-tendinite'
      }
    ],
    tips: [
      'Parfait pour les pauses de 5 minutes',
      'Restez discret, vos collègues vous remercieront',
      'Programmez des rappels toutes les 2 heures',
      'Combinez avec des étirements du cou et des épaules'
    ]
  }
]

/**
 * Obtenir un programme par son ID
 */
export function getProgramById(id: string): TrainingProgram | undefined {
  return trainingPrograms.find(program => program.id === id)
}

/**
 * Obtenir les programmes gratuits
 */
export function getFreePPrograms(): TrainingProgram[] {
  return trainingPrograms.filter(program => !program.isPremium)
}

/**
 * Obtenir les programmes par niveau
 */
export function getProgramsByLevel(level: TrainingProgram['level']): TrainingProgram[] {
  return trainingPrograms.filter(program => program.level === level)
}

/**
 * Obtenir les programmes par catégorie
 */
export function getProgramsByCategory(category: TrainingProgram['category']): TrainingProgram[] {
  return trainingPrograms.filter(program => program.category === category)
}