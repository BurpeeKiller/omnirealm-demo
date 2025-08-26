/**
 * Workout Components - OmniFit
 * Système complet de programmes d'entraînement et timer Apple Watch style
 */

export { WorkoutTimer } from "./WorkoutTimer";
export { WorkoutView } from "./WorkoutView";
export type {
  ProgramDefinition,
  ProgramExercise,
  ProgramCategory,
  ProgramDuration,
  ProgramIntensity,
} from "@/data/programs";
export {
  ALL_PROGRAMS,
  FREE_PROGRAMS,
  PREMIUM_PROGRAMS,
  getProgramById,
  getProgramsByCategory,
  getProgramsByDuration,
  getFreePrograms,
  getPremiumPrograms,
  getBeginnerPrograms,
  getQuickPrograms,
  getRandomProgram,
  canAccessProgram,
  PROGRAM_STATS,
} from "@/data/programs";
