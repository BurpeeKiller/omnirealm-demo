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
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    // Récupérer les données du jour spécifié
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const workouts = await prisma.workout.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        exercises: true,
      },
    });

    // Calculer les métriques
    const totalExercises = workouts.reduce((sum, workout) => sum + workout.exercises.length, 0);

    const exerciseBreakdown = workouts.reduce(
      (acc, workout) => {
        workout.exercises.forEach(exercise => {
          const type = exercise.name.toLowerCase();
          if (type.includes("burpee")) acc.burpees += exercise.reps || 1;
          else if (type.includes("pompe") || type.includes("push"))
            acc.pushups += exercise.reps || 1;
          else if (type.includes("squat")) acc.squats += exercise.reps || 1;
          else acc.others += exercise.reps || 1;
        });
        return acc;
      },
      { burpees: 0, pushups: 0, squats: 0, others: 0 }
    );

    const caloriesBurned = totalExercises * 12; // Estimation moyenne
    const duration = workouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);

    return NextResponse.json({
      date,
      totalWorkouts: workouts.length,
      totalExercises,
      exerciseBreakdown,
      caloriesBurned,
      duration,
      averageIntensity:
        workouts.length > 0
          ? workouts.reduce((sum, w) => sum + (w.intensity || 5), 0) / workouts.length
          : 0,
      goalProgress: Math.min((totalExercises / 10) * 100, 100), // Objectif quotidien: 10 exercices
    });
  } catch (error) {
    console.error("Analytics daily error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { event, data } = await req.json();

    // Enregistrer l'événement analytics
    await prisma.analyticsEvent.create({
      data: {
        userId: session.user.id,
        event,
        data: data || {},
        timestamp: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics event error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
