import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe") || "week"; // week, month, year, all

    // Calculate date ranges
    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(0); // All time
    }

    // Get workout sessions
    const sessions = await prisma.workout.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        exercises: true,
      },
    });

    // Calculate stats
    const totalSessions = sessions.length;
    const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const totalCalories = sessions.reduce((sum, s) => sum + (s.calories || 0), 0);
    const totalExercises = sessions.reduce((sum, s) => sum + s.exercises.length, 0);

    // Exercise breakdown by category
    const exercisesByCategory: { [key: string]: number } = {};
    const exercisesByDifficulty: { [key: string]: number } = {};

    sessions.forEach(session => {
      session.exercises.forEach(exercise => {
        // Simplification : catégoriser par nom d'exercice
        const exerciseName = exercise.name.toLowerCase();
        let category = "autres";
        let difficulty = "medium";

        if (exerciseName.includes("burpee")) category = "cardio";
        else if (exerciseName.includes("pompe") || exerciseName.includes("push"))
          category = "strength";
        else if (exerciseName.includes("squat")) category = "strength";
        else if (exerciseName.includes("planche") || exerciseName.includes("plank"))
          category = "core";

        exercisesByCategory[category] = (exercisesByCategory[category] || 0) + 1;
        exercisesByDifficulty[difficulty] = (exercisesByDifficulty[difficulty] || 0) + 1;
      });
    });

    // Daily activity (last 30 days)
    const dailyActivity = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const daySessions = sessions.filter(s => s.createdAt >= dayStart && s.createdAt < dayEnd);

      dailyActivity.push({
        date: dayStart.toISOString().split("T")[0],
        sessions: daySessions.length,
        duration: daySessions.reduce((sum, s) => sum + (s.duration || 0), 0),
        calories: daySessions.reduce((sum, s) => sum + (s.calories || 0), 0),
      });
    }

    // Achievements
    const achievements = [];
    if (totalSessions >= 1) achievements.push("first_workout");
    if (totalSessions >= 10) achievements.push("ten_workouts");
    if (totalSessions >= 50) achievements.push("fifty_workouts");
    if (totalCalories >= 1000) achievements.push("calorie_burner");
    if (totalDuration >= 3600) achievements.push("hour_warrior");

    const stats = {
      summary: {
        totalSessions,
        totalDuration,
        totalCalories,
        totalExercises,
        averageSessionDuration: totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0,
        averageCaloriesPerSession:
          totalSessions > 0 ? Math.round(totalCalories / totalSessions) : 0,
      },
      breakdown: {
        exercisesByCategory,
        exercisesByDifficulty,
      },
      dailyActivity,
      achievements,
      timeframe,
    };

    return NextResponse.json(stats, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500, headers: corsHeaders }
    );
  }
}
