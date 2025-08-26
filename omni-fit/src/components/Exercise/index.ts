/**
 * Exercise Components - OmniFit
 * Système d'exercices révolutionnaire avec feedback multisensoriel
 */

export { ExerciseCard, ExerciseGrid } from "./ExerciseCard";
export type { ExerciseDefinition } from "@/data/exercises";
export {
  FREE_EXERCISES,
  PREMIUM_EXERCISES,
  getExerciseById,
  getExercisesByCategory,
  getExercisesByDifficulty,
  getFreeExercises,
  getPremiumExercises,
  getAllExercises,
  getExercisesByLevel,
  CATEGORIES,
  DIFFICULTIES,
} from "@/data/exercises";
