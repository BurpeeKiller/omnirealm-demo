// Types
export interface ExerciseDefinition {
  id: string;
  name: string;
  category: "strength" | "cardio" | "flexibility" | "breathing" | "balance";
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number; // seconds
  icon: string; // emoji
  description: string;
  instructions: string[];
  benefits: string[];
  muscles: string[];
  equipment: string[];
  isPremium: boolean;
  level: number;
  calories?: number;
}

// Exercices gratuits
export const FREE_EXERCISES: ExerciseDefinition[] = [
  {
    id: "pushups",
    name: "Pompes",
    category: "strength",
    difficulty: "beginner",
    duration: 30,
    icon: "💪",
    description: "Exercice classique pour renforcer le haut du corps",
    instructions: [
      "Placez-vous en position de planche",
      "Descendez en contrôlant le mouvement",
      "Remontez en poussant avec les bras",
    ],
    benefits: ["Renforce les pectoraux", "Tonifie les triceps", "Améliore la stabilité"],
    muscles: ["Pectoraux", "Triceps", "Deltoïdes", "Core"],
    equipment: [],
    isPremium: false,
    level: 1,
    calories: 50,
  },
  {
    id: "squats",
    name: "Squats",
    category: "strength",
    difficulty: "beginner",
    duration: 30,
    icon: "🦵",
    description: "Mouvement fondamental pour les jambes et fessiers",
    instructions: [
      "Écartez les pieds à largeur d'épaules",
      "Descendez comme si vous vous asseyiez",
      "Remontez en poussant sur les talons",
    ],
    benefits: ["Renforce les quadriceps", "Tonifie les fessiers", "Améliore la mobilité"],
    muscles: ["Quadriceps", "Fessiers", "Ischio-jambiers", "Mollets"],
    equipment: [],
    isPremium: false,
    level: 1,
    calories: 45,
  },
  {
    id: "plank",
    name: "Planche",
    category: "strength",
    difficulty: "beginner",
    duration: 60,
    icon: "🧘",
    description: "Excellent pour renforcer le core et la stabilité",
    instructions: [
      "Placez-vous en position de planche sur les avant-bras",
      "Gardez le dos droit, aligné avec les jambes",
      "Contractez les abdominaux et tenez la position",
    ],
    benefits: ["Renforce le core", "Améliore la posture", "Stabilise le dos"],
    muscles: ["Abdominaux", "Dorsaux", "Deltoïdes", "Fessiers"],
    equipment: [],
    isPremium: false,
    level: 1,
    calories: 25,
  },
  {
    id: "jumping-jacks",
    name: "Jumping Jacks",
    category: "cardio",
    difficulty: "beginner",
    duration: 30,
    icon: "🤸",
    description: "Exercice cardio dynamique pour tout le corps",
    instructions: [
      "Commencez debout, pieds joints, bras le long du corps",
      "Sautez en écartant les pieds et levant les bras",
      "Revenez à la position de départ",
    ],
    benefits: ["Améliore l'endurance", "Brûle des calories", "Réchauffe tout le corps"],
    muscles: ["Quadriceps", "Mollets", "Deltoïdes", "Core"],
    equipment: [],
    isPremium: false,
    level: 1,
    calories: 60,
  },
  {
    id: "lunges",
    name: "Fentes",
    category: "strength",
    difficulty: "intermediate",
    duration: 45,
    icon: "🤺",
    description: "Travail unilatéral des jambes et de l'équilibre",
    instructions: [
      "Faites un grand pas en avant",
      "Descendez le genou arrière vers le sol",
      "Remontez en poussant sur la jambe avant",
    ],
    benefits: ["Renforce les jambes", "Améliore l'équilibre", "Tonifie les fessiers"],
    muscles: ["Quadriceps", "Fessiers", "Ischio-jambiers", "Mollets"],
    equipment: [],
    isPremium: false,
    level: 2,
    calories: 40,
  },
  {
    id: "burpees",
    name: "Burpees",
    category: "cardio",
    difficulty: "intermediate",
    duration: 30,
    icon: "🏃",
    description: "Exercice complet intense qui fait travailler tout le corps",
    instructions: [
      "Commencez debout",
      "Descendez en squat, placez les mains au sol",
      "Sautez en arrière en position de planche",
      "Faites une pompe (optionnel)",
      "Ramenez les pieds vers les mains",
      "Sautez vers le haut avec les bras tendus",
    ],
    benefits: ["Brûle énormément de calories", "Travaille tout le corps", "Améliore l'explosivité"],
    muscles: ["Tout le corps"],
    equipment: [],
    isPremium: false,
    level: 3,
    calories: 100,
  },
];

// Exercices premium
export const PREMIUM_EXERCISES: ExerciseDefinition[] = [
  {
    id: "mountain-climbers",
    name: "Mountain Climbers",
    category: "cardio",
    difficulty: "intermediate",
    duration: 30,
    icon: "🏔️",
    description: "Exercice cardio intense en position de planche",
    instructions: [
      "Placez-vous en position de planche",
      "Alternez en ramenant les genoux vers la poitrine",
      "Gardez un rythme rapide et constant",
    ],
    benefits: ["Brûle des calories", "Renforce le core", "Améliore l'endurance"],
    muscles: ["Core", "Quadriceps", "Deltoïdes", "Fessiers"],
    equipment: [],
    isPremium: true,
    level: 3,
    calories: 80,
  },
  {
    id: "pike-pushups",
    name: "Pompes Pike",
    category: "strength",
    difficulty: "advanced",
    duration: 30,
    icon: "🤸‍♂️",
    description: "Variante avancée des pompes ciblant les épaules",
    instructions: [
      "Placez-vous en position de V inversé",
      "Descendez la tête vers le sol",
      "Remontez en poussant avec les épaules",
    ],
    benefits: [
      "Renforce les épaules",
      "Développe la force du haut du corps",
      "Améliore l'équilibre",
    ],
    muscles: ["Deltoïdes", "Triceps", "Core", "Trapèzes"],
    equipment: [],
    isPremium: true,
    level: 4,
    calories: 60,
  },
  {
    id: "single-leg-glute-bridges",
    name: "Pont Fessier Unilatéral",
    category: "strength",
    difficulty: "intermediate",
    duration: 45,
    icon: "🌉",
    description: "Travail ciblé des fessiers et ischio-jambiers",
    instructions: [
      "Allongez-vous sur le dos, genoux fléchis",
      "Levez une jambe tendue",
      "Soulevez les hanches en contractant les fessiers",
    ],
    benefits: ["Renforce les fessiers", "Améliore la stabilité", "Corrige les déséquilibres"],
    muscles: ["Fessiers", "Ischio-jambiers", "Core"],
    equipment: [],
    isPremium: true,
    level: 3,
    calories: 35,
  },
];

// Fonctions utilitaires
export const getAllExercises = (): ExerciseDefinition[] => {
  return [...FREE_EXERCISES, ...PREMIUM_EXERCISES];
};

export const getFreeExercises = (): ExerciseDefinition[] => {
  return FREE_EXERCISES;
};

export const getPremiumExercises = (): ExerciseDefinition[] => {
  return PREMIUM_EXERCISES;
};

export const getExercisesByCategory = (
  category: ExerciseDefinition["category"]
): ExerciseDefinition[] => {
  return getAllExercises().filter(exercise => exercise.category === category);
};

export const getExercisesByDifficulty = (
  difficulty: ExerciseDefinition["difficulty"]
): ExerciseDefinition[] => {
  return getAllExercises().filter(exercise => exercise.difficulty === difficulty);
};

export const getExerciseById = (id: string): ExerciseDefinition | undefined => {
  return getAllExercises().find(exercise => exercise.id === id);
};

export const getExercisesByLevel = (minLevel: number, maxLevel?: number): ExerciseDefinition[] => {
  return getAllExercises().filter(exercise => {
    if (maxLevel) {
      return exercise.level >= minLevel && exercise.level <= maxLevel;
    }
    return exercise.level >= minLevel;
  });
};

// Constantes pour les catégories
export const CATEGORIES = [
  { id: "strength", name: "Force", emoji: "💪" },
  { id: "cardio", name: "Cardio", emoji: "❤️" },
  { id: "flexibility", name: "Souplesse", emoji: "🤸" },
  { id: "breathing", name: "Respiration", emoji: "🧘" },
  { id: "balance", name: "Équilibre", emoji: "⚖️" },
] as const;

export const DIFFICULTIES = [
  { id: "beginner", name: "Débutant", color: "green" },
  { id: "intermediate", name: "Intermédiaire", color: "yellow" },
  { id: "advanced", name: "Avancé", color: "red" },
] as const;
