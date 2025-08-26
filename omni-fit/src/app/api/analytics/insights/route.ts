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

    // Récupérer les données des 90 derniers jours
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 90);

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
        createdAt: "desc",
      },
    });

    // Analyser les patterns
    const insights = await generateInsights(workouts);

    return NextResponse.json({
      insights,
      recommendations: await generateRecommendations(workouts, session.user.id),
      predictions: await generatePredictions(workouts),
      benchmarks: await getBenchmarks(workouts, session.user.id),
    });
  } catch (error) {
    console.error("Analytics insights error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function generateInsights(workouts: any[]) {
  const insights = [];

  // Analyse temporelle
  const workoutsByHour = workouts.reduce(
    (acc, workout) => {
      const hour = workout.createdAt.getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  const bestHour = Object.entries(workoutsByHour).sort(
    ([, a], [, b]) => (b as number) - (a as number)
  )[0];

  if (bestHour) {
    insights.push({
      type: "performance",
      title: "Meilleur moment d'entraînement",
      message: `Tu es plus productif à ${bestHour[0]}h00 avec ${bestHour[1]} séances`,
      impact: "high",
      actionable: true,
      recommendation: `Planifie tes séances autour de ${bestHour[0]}h00 pour maximiser tes performances.`,
    });
  }

  // Analyse des jours de la semaine
  const workoutsByDay = workouts.reduce(
    (acc, workout) => {
      const day = workout.createdAt.toLocaleDateString("fr-FR", { weekday: "long" });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const bestDay = Object.entries(workoutsByDay).sort(
    ([, a], [, b]) => (b as number) - (a as number)
  )[0];

  if (bestDay) {
    insights.push({
      type: "consistency",
      title: "Jour le plus actif",
      message: `${bestDay[0]} est ton jour favori avec ${bestDay[1]} séances`,
      impact: "medium",
      actionable: false,
    });
  }

  // Analyse de progression
  const recentWorkouts = workouts.slice(0, 10);
  const oldWorkouts = workouts.slice(-10);

  if (recentWorkouts.length >= 5 && oldWorkouts.length >= 5) {
    const recentAvg =
      recentWorkouts.reduce((sum, w) => sum + w.exercises.length, 0) / recentWorkouts.length;
    const oldAvg = oldWorkouts.reduce((sum, w) => sum + w.exercises.length, 0) / oldWorkouts.length;

    const improvement = ((recentAvg - oldAvg) / oldAvg) * 100;

    if (improvement > 10) {
      insights.push({
        type: "progress",
        title: "Progression excellente",
        message: `Tu as progressé de ${improvement.toFixed(1)}% ces dernières semaines`,
        impact: "high",
        actionable: false,
      });
    } else if (improvement < -10) {
      insights.push({
        type: "warning",
        title: "Baisse de performance",
        message: `Tes performances ont baissé de ${Math.abs(improvement).toFixed(1)}%`,
        impact: "high",
        actionable: true,
        recommendation: "Essaie de revenir à ton rythme précédent progressivement.",
      });
    }
  }

  // Analyse de régularité
  if (workouts.length >= 7) {
    const activeDays = new Set(workouts.map(w => w.createdAt.toISOString().split("T")[0])).size;

    const consistency = (activeDays / 90) * 100;

    if (consistency > 80) {
      insights.push({
        type: "achievement",
        title: "Régularité exceptionnelle",
        message: `Tu es actif ${consistency.toFixed(0)}% du temps`,
        impact: "high",
        actionable: false,
      });
    }
  }

  return insights;
}

async function generateRecommendations(workouts: any[], userId: string) {
  const recommendations = [];

  // Analyser les types d'exercices
  const exerciseTypes = workouts.reduce(
    (acc, workout) => {
      workout.exercises.forEach((ex: any) => {
        const type = ex.name.toLowerCase();
        if (type.includes("burpee")) acc.burpees++;
        else if (type.includes("pompe") || type.includes("push")) acc.pushups++;
        else if (type.includes("squat")) acc.squats++;
      });
      return acc;
    },
    { burpees: 0, pushups: 0, squats: 0 }
  );

  const total = exerciseTypes.burpees + exerciseTypes.pushups + exerciseTypes.squats;

  if (total > 0) {
    const imbalances = [];
    if (exerciseTypes.burpees / total < 0.2) imbalances.push("burpees");
    if (exerciseTypes.pushups / total < 0.2) imbalances.push("pompes");
    if (exerciseTypes.squats / total < 0.2) imbalances.push("squats");

    if (imbalances.length > 0) {
      recommendations.push({
        type: "balance",
        title: "Équilibre tes entraînements",
        message: `Ajoute plus de ${imbalances.join(", ")} pour un entraînement complet`,
        priority: "medium",
        difficulty: "easy",
        estimatedImpact: "+15% performance globale",
      });
    }
  }

  // Recommandation de fréquence
  const avgWorkoutsPerWeek = workouts.length / 13; // 90 jours / 7

  if (avgWorkoutsPerWeek < 3) {
    recommendations.push({
      type: "frequency",
      title: "Augmente ta fréquence",
      message: "Essaie de faire 4-5 séances par semaine pour de meilleurs résultats",
      priority: "high",
      difficulty: "medium",
      estimatedImpact: "+25% progression",
    });
  }

  // Recommandation de défi
  if (workouts.length >= 21) {
    // 3 semaines
    const recentIntensity =
      workouts.slice(0, 7).reduce((sum, w) => sum + (w.intensity || 5), 0) / 7;

    if (recentIntensity < 6) {
      recommendations.push({
        type: "challenge",
        title: "Augmente l'intensité",
        message: "Tu peux pousser plus fort! Essaie d'ajouter 2-3 exercices par séance",
        priority: "medium",
        difficulty: "hard",
        estimatedImpact: "+30% calories brûlées",
      });
    }
  }

  return recommendations;
}

async function generatePredictions(workouts: any[]) {
  if (workouts.length < 14) return [];

  const predictions = [];

  // Prédiction de progression
  const last14Days = workouts.slice(0, 14);
  const avgExercisesPerDay = last14Days.reduce((sum, w) => sum + w.exercises.length, 0) / 14;
  const trend = calculateTrend(last14Days);

  if (trend > 0) {
    const predicted30DaysOut = avgExercisesPerDay + trend * 30;
    predictions.push({
      type: "progression",
      title: "Projection à 30 jours",
      message: `À ce rythme, tu feras ${predicted30DaysOut.toFixed(0)} exercices par jour dans un mois`,
      confidence: 0.75,
      timeframe: "30 jours",
      metric: "exercices/jour",
    });
  }

  // Prédiction d'objectif
  const currentAverage = avgExercisesPerDay;
  if (currentAverage < 10) {
    const daysToGoal = Math.ceil((10 - currentAverage) / Math.max(trend, 0.1));
    predictions.push({
      type: "goal",
      title: "Objectif quotidien (10 ex/jour)",
      message: `Tu l'atteindras dans environ ${daysToGoal} jours`,
      confidence: 0.6,
      timeframe: `${daysToGoal} jours`,
      metric: "objectif quotidien",
    });
  }

  return predictions;
}

function calculateTrend(workouts: any[]): number {
  if (workouts.length < 7) return 0;

  const recent = workouts.slice(0, 7).reduce((sum, w) => sum + w.exercises.length, 0) / 7;
  const older = workouts.slice(7, 14).reduce((sum, w) => sum + w.exercises.length, 0) / 7;

  return recent - older;
}

async function getBenchmarks(workouts: any[], userId: string) {
  // Simuler des benchmarks communautaires (à remplacer par de vraies données)
  const userTotal = workouts.reduce((sum, w) => sum + w.exercises.length, 0);
  const userDays = new Set(workouts.map(w => w.createdAt.toISOString().split("T")[0])).size;

  const userAverage = userDays > 0 ? userTotal / userDays : 0;

  return {
    userRank: Math.floor(Math.random() * 100) + 1, // Simulé
    percentile: Math.min(95, Math.max(5, (userAverage / 15) * 100)), // Simulé
    communityAverage: 8.5, // Simulé
    userAverage,
    comparison: userAverage > 8.5 ? "above" : userAverage < 6 ? "below" : "average",
    message:
      userAverage > 12
        ? "Tu fais partie du top 10%!"
        : userAverage > 8.5
          ? "Au-dessus de la moyenne"
          : userAverage > 6
            ? "Dans la moyenne"
            : "En dessous de la moyenne",
  };
}
