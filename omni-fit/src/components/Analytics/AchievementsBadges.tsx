"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

interface AchievementsBadgesProps {
  achievements: string[];
  stats: {
    totalSessions: number;
    totalCalories: number;
    totalDuration: number;
  };
}

export function AchievementsBadges({ achievements, stats }: AchievementsBadgesProps) {
  const allAchievements: Achievement[] = [
    {
      id: "first_workout",
      name: "Premier Pas",
      description: "Complétez votre première séance",
      emoji: "🎯",
      unlocked: achievements.includes("first_workout"),
      progress: Math.min(stats.totalSessions, 1),
      target: 1,
    },
    {
      id: "ten_workouts",
      name: "Régulier",
      description: "Complétez 10 séances",
      emoji: "🔥",
      unlocked: achievements.includes("ten_workouts"),
      progress: Math.min(stats.totalSessions, 10),
      target: 10,
    },
    {
      id: "fifty_workouts",
      name: "Dévoué",
      description: "Complétez 50 séances",
      emoji: "💎",
      unlocked: achievements.includes("fifty_workouts"),
      progress: Math.min(stats.totalSessions, 50),
      target: 50,
    },
    {
      id: "calorie_burner",
      name: "Brûleur de Calories",
      description: "Brûlez 1000 calories",
      emoji: "🔥",
      unlocked: achievements.includes("calorie_burner"),
      progress: Math.min(stats.totalCalories, 1000),
      target: 1000,
    },
    {
      id: "hour_warrior",
      name: "Guerrier d'1h",
      description: "Accumulez 1h d'exercice",
      emoji: "⏰",
      unlocked: achievements.includes("hour_warrior"),
      progress: Math.min(stats.totalDuration, 3600),
      target: 3600,
    },
    {
      id: "century_club",
      name: "Club des 100",
      description: "Complétez 100 séances",
      emoji: "🏆",
      unlocked: achievements.includes("century_club"),
      progress: Math.min(stats.totalSessions, 100),
      target: 100,
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Succès & Achievements</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {allAchievements.map(achievement => (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              achievement.unlocked ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="text-center space-y-2">
              <div
                className={`text-3xl ${
                  achievement.unlocked ? "grayscale-0" : "grayscale opacity-50"
                }`}
              >
                {achievement.emoji}
              </div>
              <h4
                className={`text-sm font-semibold ${
                  achievement.unlocked ? "text-green-800" : "text-gray-600"
                }`}
              >
                {achievement.name}
              </h4>
              <p className={`text-xs ${achievement.unlocked ? "text-green-600" : "text-gray-500"}`}>
                {achievement.description}
              </p>
              {achievement.progress !== undefined && achievement.target && (
                <div className="space-y-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        achievement.unlocked ? "bg-green-500" : "bg-blue-400"
                      }`}
                      style={{
                        width: `${Math.min(
                          (achievement.progress / achievement.target) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {achievement.progress} / {achievement.target}
                  </p>
                </div>
              )}
              {achievement.unlocked && (
                <Badge className="bg-green-100 text-green-800 text-xs">✓ Débloqué</Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
