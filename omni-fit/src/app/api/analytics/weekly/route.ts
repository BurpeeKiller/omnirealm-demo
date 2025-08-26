import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const weeks = parseInt(searchParams.get("weeks") || "4");

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - weeks * 7);

    // Récupérer toutes les workouts de la période
    const workouts = await prisma.workout.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        exercises: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Organiser par semaine
    const weeklyData = [];
    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(endDate.getDate() - (i + 1) * 7);
      const weekEnd = new Date();
      weekEnd.setDate(endDate.getDate() - i * 7);

      const weekWorkouts = workouts.filter(w => w.createdAt >= weekStart && w.createdAt < weekEnd);

      const totalExercises = weekWorkouts.reduce((sum, w) => sum + w.exercises.length, 0);
      const totalCalories = totalExercises * 12;
      const activeDays = new Set(weekWorkouts.map(w => w.createdAt.toISOString().split("T")[0]))
        .size;

      weeklyData.push({
        week: `${weekStart.toISOString().split("T")[0]} - ${weekEnd.toISOString().split("T")[0]}`,
        weekNumber: weeks - i,
        workouts: weekWorkouts.length,
        exercises: totalExercises,
        calories: totalCalories,
        activeDays,
        averagePerDay: activeDays > 0 ? totalExercises / activeDays : 0,
      });
    }

    // Calculer les tendances
    const thisWeek = weeklyData[weeklyData.length - 1];
    const lastWeek = weeklyData[weeklyData.length - 2];
    const weekOverWeekGrowth = lastWeek?.exercises
      ? ((thisWeek.exercises - lastWeek.exercises) / lastWeek.exercises) * 100
      : 0;

    // Streak calculation
    const streak = await calculateCurrentStreak(session.user.id);

    return NextResponse.json({
      weeklyData,
      trends: {
        weekOverWeekGrowth,
        averageWorkoutsPerWeek: weeklyData.reduce((sum, w) => sum + w.workouts, 0) / weeks,
        bestWeek: weeklyData.reduce((best, current) =>
          current.exercises > best.exercises ? current : best
        ),
        currentStreak: streak,
      },
      summary: {
        totalWorkouts: weeklyData.reduce((sum, w) => sum + w.workouts, 0),
        totalExercises: weeklyData.reduce((sum, w) => sum + w.exercises, 0),
        totalCalories: weeklyData.reduce((sum, w) => sum + w.calories, 0),
        totalActiveDays: weeklyData.reduce((sum, w) => sum + w.activeDays, 0),
      },
    });
  } catch (error) {
    console.error("Weekly analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function calculateCurrentStreak(userId: string): Promise<number> {
  // Récupérer tous les jours d'activité
  const workouts = await prisma.workout.findMany({
    where: { userId },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  if (workouts.length === 0) return 0;

  const activeDays = [...new Set(workouts.map(w => w.createdAt.toISOString().split("T")[0]))]
    .sort()
    .reverse();

  let streak = 0;
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // Si aujourd'hui ou hier, commencer le comptage
  if (activeDays[0] === today || activeDays[0] === yesterday) {
    for (let i = 0; i < activeDays.length; i++) {
      const expectedDate = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      if (activeDays[i] === expectedDate) {
        streak++;
      } else {
        break;
      }
    }
  }

  return streak;
}
