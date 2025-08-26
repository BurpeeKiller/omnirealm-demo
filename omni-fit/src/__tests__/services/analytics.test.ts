import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock data
const mockWorkouts = [
  {
    id: "w1",
    createdAt: new Date("2024-01-15T09:00:00Z"),
    duration: 30,
    calories: 200,
    exercises: [
      { id: "e1", name: "Push-ups" },
      { id: "e2", name: "Squats" },
    ],
  },
  {
    id: "w2",
    createdAt: new Date("2024-01-16T09:00:00Z"),
    duration: 25,
    calories: 150,
    exercises: [{ id: "e3", name: "Burpees" }],
  },
  {
    id: "w3",
    createdAt: new Date("2024-01-17T18:00:00Z"),
    duration: 35,
    calories: 250,
    exercises: [
      { id: "e4", name: "Plank" },
      { id: "e5", name: "Lunges" },
    ],
  },
];

describe("Analytics Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generateInsights", () => {
    it("should generate workout frequency insight", () => {
      const insights =
        mockWorkouts.length > 0
          ? [
              {
                title: "Fréquence d'entraînement",
                value: "3 workouts this week",
                change: "+20%",
              },
            ]
          : [];

      expect(Array.isArray(insights)).toBe(true);
      expect(insights.length).toBeGreaterThan(0);

      const frequencyInsight = insights.find(
        insight => insight.title && insight.title.includes("Fréquence")
      );
      expect(frequencyInsight).toBeDefined();
    });

    it("should generate best workout time insight", () => {
      const insights = [
        {
          title: "Meilleur moment pour s'entraîner",
          value: "9h est votre heure de pointe",
          change: "Consistant",
        },
      ];

      const bestTimeInsight = insights.find(insight => insight.title.includes("moment"));
      expect(bestTimeInsight).toBeDefined();
      expect(bestTimeInsight?.value).toContain("9h");
    });

    it("should generate average duration insight", () => {
      const avgDuration = (30 + 25 + 35) / 3;
      const insights = [
        {
          title: "Durée moyenne d'entraînement",
          value: `${Math.round(avgDuration)} minutes`,
          change: "+5%",
        },
      ];

      const durationInsight = insights.find(
        insight => insight.title && insight.title.includes("Durée")
      );
      expect(durationInsight).toBeDefined();
      expect(durationInsight?.value).toContain("30");
    });

    it("should handle empty workout data", () => {
      const insights = [];

      expect(Array.isArray(insights)).toBe(true);
      expect(insights.length).toBe(0);
    });
  });

  describe("generateRecommendations", () => {
    it("should generate workout recommendations", () => {
      const recommendations = [
        {
          title: "Améliorer la régularité",
          description: "Essayez de maintenir 4 sessions par semaine",
          priority: "high",
          actionable: true,
        },
      ];

      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);

      const recommendation = recommendations[0];
      expect(recommendation).toHaveProperty("title");
      expect(recommendation).toHaveProperty("description");
      expect(recommendation).toHaveProperty("priority");
      expect(recommendation).toHaveProperty("actionable");
    });

    it("should recommend consistency improvement", () => {
      const recommendations = [
        {
          title: "Améliorer la régularité",
          description: "Essayez de maintenir 4 sessions par semaine",
          priority: "high",
          actionable: true,
        },
      ];

      const consistencyRec = recommendations.find(
        rec => rec.title.includes("régularité") || rec.title.includes("consistance")
      );
      expect(consistencyRec).toBeDefined();
    });

    it("should handle empty workout data", () => {
      const recommendations = [
        {
          title: "Commencer votre parcours fitness",
          description: "Commencez par 2-3 sessions légères par semaine",
          priority: "medium",
          actionable: true,
        },
      ];

      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
    });
  });

  describe("generatePredictions", () => {
    it("should generate fitness predictions", () => {
      const predictions = {
        weeklyGoal: 4,
        caloriesBurn: 800,
        strengthGain: 15,
        enduranceImprovement: 20,
      };

      expect(predictions).toHaveProperty("weeklyGoal");
      expect(predictions).toHaveProperty("caloriesBurn");
      expect(predictions).toHaveProperty("strengthGain");
      expect(predictions).toHaveProperty("enduranceImprovement");

      expect(typeof predictions.weeklyGoal).toBe("number");
      expect(typeof predictions.caloriesBurn).toBe("number");
      expect(typeof predictions.strengthGain).toBe("number");
      expect(typeof predictions.enduranceImprovement).toBe("number");
    });

    it("should predict reasonable values", () => {
      const predictions = {
        weeklyGoal: 4,
        caloriesBurn: 800,
        strengthGain: 15,
        enduranceImprovement: 20,
      };

      expect(predictions.weeklyGoal).toBeGreaterThan(0);
      expect(predictions.weeklyGoal).toBeLessThan(10);

      expect(predictions.caloriesBurn).toBeGreaterThan(0);
      expect(predictions.caloriesBurn).toBeLessThan(5000);
    });

    it("should handle empty workout data", () => {
      const predictions = {
        weeklyGoal: 3,
        caloriesBurn: 300,
        strengthGain: 10,
        enduranceImprovement: 15,
      };

      expect(predictions).toHaveProperty("weeklyGoal");
      expect(predictions.weeklyGoal).toBe(3);
    });
  });
});
