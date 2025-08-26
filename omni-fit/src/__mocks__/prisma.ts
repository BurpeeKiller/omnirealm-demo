import { vi } from "vitest";
import type { PrismaClient } from "@prisma/client";

// Types pour mock data
export const mockUser = {
  id: "user-1",
  email: "test@example.com",
  name: "Test User",
  password: "hashed-password",
  role: "USER",
  isPremium: false,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

export const mockWorkout = {
  id: "workout-1",
  userId: "user-1",
  title: "Test Workout",
  description: "A test workout",
  duration: 30,
  intensity: 5,
  calories: 200,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  exercises: [],
  user: mockUser,
};

export const mockExercise = {
  id: "exercise-1",
  workoutId: "workout-1",
  name: "Push-ups",
  type: "STRENGTH" as const,
  duration: 60,
  repetitions: 10,
  sets: 3,
  weight: null,
  restTime: 30,
  notes: "Test exercise",
  calories: 50,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  workout: mockWorkout,
};

export const mockSession = {
  id: "session-1",
  userId: "user-1",
  sessionToken: "session-token",
  expires: new Date("2025-01-01"),
  user: mockUser,
};

// Mock Prisma Client
export const prismaMock = {
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  workout: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  exercise: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  exerciseTemplate: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  session: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  account: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  verificationToken: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  $connect: vi.fn(),
  $disconnect: vi.fn(),
  $transaction: vi.fn(callback => callback(prismaMock)),
} as unknown as PrismaClient;

// Fonctions helper pour setup des mocks
export const setupUserMocks = (user = mockUser) => {
  prismaMock.user.findUnique.mockResolvedValue(user);
  prismaMock.user.findMany.mockResolvedValue([user]);
  prismaMock.user.create.mockResolvedValue(user);
  prismaMock.user.update.mockResolvedValue(user);
  prismaMock.user.count.mockResolvedValue(1);
};

export const setupWorkoutMocks = (workout = mockWorkout) => {
  prismaMock.workout.findUnique.mockResolvedValue(workout);
  prismaMock.workout.findMany.mockResolvedValue([workout]);
  prismaMock.workout.create.mockResolvedValue(workout);
  prismaMock.workout.update.mockResolvedValue(workout);
  prismaMock.workout.count.mockResolvedValue(1);
};

export const setupExerciseMocks = (exercise = mockExercise) => {
  prismaMock.exercise.findUnique.mockResolvedValue(exercise);
  prismaMock.exercise.findMany.mockResolvedValue([exercise]);
  prismaMock.exercise.create.mockResolvedValue(exercise);
  prismaMock.exercise.update.mockResolvedValue(exercise);
  prismaMock.exercise.count.mockResolvedValue(1);
};

export const setupExerciseTemplateMocks = (
  template = {
    id: "template-1",
    name: "Push-ups",
    category: "strength",
    difficulty: "beginner",
    description: "Basic push-up exercise",
    instructions: "Push up from the ground",
    duration: 60,
    isPremium: false,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  }
) => {
  prismaMock.exerciseTemplate.findUnique.mockResolvedValue(template);
  prismaMock.exerciseTemplate.findMany.mockResolvedValue([template]);
  prismaMock.exerciseTemplate.create.mockResolvedValue(template);
  prismaMock.exerciseTemplate.update.mockResolvedValue(template);
  prismaMock.exerciseTemplate.count.mockResolvedValue(1);
};

export const resetAllMocks = () => {
  vi.clearAllMocks();
};
