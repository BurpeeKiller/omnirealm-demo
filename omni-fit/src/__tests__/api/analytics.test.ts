import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET } from "@/app/api/analytics/insights/route";
import {
  prismaMock,
  setupUserMocks,
  setupWorkoutMocks,
  mockUser,
  resetAllMocks,
} from "@/__mocks__/prisma";
import { NextRequest } from "next/server";

// Mock NextAuth
vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(() =>
    Promise.resolve({
      user: {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
      },
    })
  ),
}));

describe("/api/analytics/insights API Route", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("GET /api/analytics/insights", () => {
    it("should return analytics insights for authenticated user", async () => {
      // Setup mocks with workouts data
      const mockWorkouts = [
        {
          id: "workout-1",
          userId: "user-1",
          title: "Morning Workout",
          createdAt: new Date("2024-01-15T09:00:00Z"),
          exercises: [
            { id: "ex-1", name: "Push-ups", workoutId: "workout-1" },
            { id: "ex-2", name: "Squats", workoutId: "workout-1" },
          ],
        },
        {
          id: "workout-2",
          userId: "user-1",
          title: "Evening Workout",
          createdAt: new Date("2024-01-16T18:00:00Z"),
          exercises: [{ id: "ex-3", name: "Burpees", workoutId: "workout-2" }],
        },
      ];

      setupUserMocks();
      prismaMock.workout.findMany.mockResolvedValue(mockWorkouts);

      const request = new NextRequest("http://localhost:3000/api/analytics/insights");

      // Execute
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toHaveProperty("insights");
      expect(data).toHaveProperty("recommendations");
      expect(data).toHaveProperty("predictions");
      expect(data).toHaveProperty("benchmarks");

      expect(Array.isArray(data.insights)).toBe(true);
      expect(Array.isArray(data.recommendations)).toBe(true);

      // Verify Prisma was called
      expect(prismaMock.workout.findMany).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
          createdAt: {
            gte: expect.any(Date),
            lte: expect.any(Date),
          },
        },
        include: {
          exercises: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    });

    it("should return 401 for unauthenticated user", async () => {
      // Override session mock to return null
      vi.mocked(await import("next-auth/next")).getServerSession.mockResolvedValueOnce(null);

      const request = new NextRequest("http://localhost:3000/api/analytics/insights");

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveProperty("error", "Unauthorized");
    });

    it("should handle database errors gracefully", async () => {
      setupUserMocks();
      prismaMock.workout.findMany.mockRejectedValue(new Error("Database error"));

      const request = new NextRequest("http://localhost:3000/api/analytics/insights");

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty("error", "Internal server error");
    });

    it("should generate insights with workout patterns", async () => {
      // Mock workouts with specific patterns for insights
      const mockWorkouts = Array.from({ length: 10 }, (_, i) => ({
        id: `workout-${i}`,
        userId: "user-1",
        title: `Workout ${i}`,
        createdAt: new Date(`2024-01-${10 + i}T09:00:00Z`), // All at 9 AM
        exercises: [
          { id: `ex-${i}-1`, name: "Push-ups", workoutId: `workout-${i}` },
          { id: `ex-${i}-2`, name: "Squats", workoutId: `workout-${i}` },
        ],
      }));

      setupUserMocks();
      prismaMock.workout.findMany.mockResolvedValue(mockWorkouts);

      const request = new NextRequest("http://localhost:3000/api/analytics/insights");

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.insights.length).toBeGreaterThan(0);

      // Should find best hour pattern
      const bestHourInsight = data.insights.find((insight: any) =>
        insight.title.includes("Meilleur moment")
      );
      expect(bestHourInsight).toBeDefined();
    });
  });
});
