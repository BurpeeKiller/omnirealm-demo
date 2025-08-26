import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET } from "@/app/api/exercises/route";
import { prismaMock, setupExerciseTemplateMocks, resetAllMocks } from "@/__mocks__/prisma";
import { NextRequest } from "next/server";

describe("/api/exercises API Route", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("GET /api/exercises", () => {
    it("should return exercise templates", async () => {
      // Setup mocks
      setupExerciseTemplateMocks();

      const request = new NextRequest("http://localhost:3000/api/exercises");

      // Execute
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(1);
      expect(data[0]).toMatchObject({
        id: "template-1",
        name: "Push-ups",
        category: "strength",
        difficulty: "beginner",
      });

      // Verify Prisma was called
      expect(prismaMock.exerciseTemplate.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { name: "asc" },
        take: undefined,
      });
    });

    it("should filter by category", async () => {
      setupExerciseTemplateMocks();

      const request = new NextRequest("http://localhost:3000/api/exercises?category=strength");

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(prismaMock.exerciseTemplate.findMany).toHaveBeenCalledWith({
        where: { category: "strength" },
        orderBy: { name: "asc" },
        take: undefined,
      });
    });

    it("should filter by difficulty", async () => {
      setupExerciseTemplateMocks();

      const request = new NextRequest("http://localhost:3000/api/exercises?difficulty=beginner");

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(prismaMock.exerciseTemplate.findMany).toHaveBeenCalledWith({
        where: { difficulty: "beginner" },
        orderBy: { name: "asc" },
        take: undefined,
      });
    });

    it("should limit results", async () => {
      setupExerciseTemplateMocks();

      const request = new NextRequest("http://localhost:3000/api/exercises?limit=5");

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(prismaMock.exerciseTemplate.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { name: "asc" },
        take: 5,
      });
    });

    it("should handle database errors gracefully", async () => {
      prismaMock.exerciseTemplate.findMany.mockRejectedValue(new Error("Database error"));

      const request = new NextRequest("http://localhost:3000/api/exercises");

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty("error", "Failed to fetch exercises");
    });

    it("should filter premium exercises", async () => {
      setupExerciseTemplateMocks();

      const request = new NextRequest("http://localhost:3000/api/exercises?premium=true");

      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(prismaMock.exerciseTemplate.findMany).toHaveBeenCalledWith({
        where: { isPremium: true },
        orderBy: { name: "asc" },
        take: undefined,
      });
    });
  });
});
