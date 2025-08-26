import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { jsPDF } from "jspdf";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "csv";
    const period = searchParams.get("period") || "30"; // jours

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(period));

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

    if (format === "csv") {
      return generateCSVExport(workouts);
    } else if (format === "pdf") {
      return await generatePDFReport(workouts, session.user);
    } else {
      return NextResponse.json({ error: "Format not supported" }, { status: 400 });
    }
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function generateCSVExport(workouts: any[]) {
  const headers = [
    "Date",
    "Heure",
    "Durée (min)",
    "Nombre d'exercices",
    "Calories estimées",
    "Intensité",
    "Types d'exercices",
    "Détail",
  ];

  const rows = workouts.map(workout => {
    const date = workout.createdAt.toLocaleDateString("fr-FR");
    const time = workout.createdAt.toLocaleTimeString("fr-FR");
    const duration = Math.round(workout.duration / 60) || 0;
    const exerciseCount = workout.exercises.length;
    const calories = exerciseCount * 12;
    const intensity = workout.intensity || 5;

    const exerciseTypes = [...new Set(workout.exercises.map((ex: any) => ex.name))].join(", ");
    const exerciseDetail = workout.exercises
      .map((ex: any) => `${ex.name}: ${ex.reps || 1}`)
      .join(" | ");

    return [
      date,
      time,
      duration.toString(),
      exerciseCount.toString(),
      calories.toString(),
      intensity.toString(),
      exerciseTypes,
      exerciseDetail,
    ];
  });

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(","))
    .join("\n");

  const BOM = "\uFEFF";
  const blob = BOM + csvContent;

  return new NextResponse(blob, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="omnifit-export-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}

async function generatePDFReport(workouts: any[], user: any) {
  const doc = new jsPDF();

  // Configuration
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = 20;

  // Header
  doc.setFontSize(24);
  doc.setTextColor(88, 28, 135); // purple
  doc.text("OmniFit - Rapport de Performance", margin, yPosition);

  yPosition += 15;
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, margin, yPosition);

  yPosition += 20;

  // Statistiques générales
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("📊 Résumé Exécutif", margin, yPosition);
  yPosition += 10;

  const totalWorkouts = workouts.length;
  const totalExercises = workouts.reduce((sum, w) => sum + w.exercises.length, 0);
  const totalCalories = totalExercises * 12;
  const avgExercisesPerWorkout =
    totalWorkouts > 0 ? (totalExercises / totalWorkouts).toFixed(1) : "0";

  const activeDays = new Set(workouts.map(w => w.createdAt.toISOString().split("T")[0])).size;

  doc.setFontSize(11);
  const stats = [
    `• Total des séances: ${totalWorkouts}`,
    `• Total des exercices: ${totalExercises}`,
    `• Calories brûlées: ${totalCalories} kcal`,
    `• Jours actifs: ${activeDays}`,
    `• Moyenne par séance: ${avgExercisesPerWorkout} exercices`,
  ];

  stats.forEach(stat => {
    doc.text(stat, margin + 5, yPosition);
    yPosition += 6;
  });

  yPosition += 15;

  // Analyse des exercices
  doc.setFontSize(16);
  doc.text("💪 Répartition des Exercices", margin, yPosition);
  yPosition += 10;

  const exerciseBreakdown = workouts.reduce(
    (acc, workout) => {
      workout.exercises.forEach((ex: any) => {
        const type = ex.name.toLowerCase();
        if (type.includes("burpee")) acc.burpees += ex.reps || 1;
        else if (type.includes("pompe") || type.includes("push")) acc.pushups += ex.reps || 1;
        else if (type.includes("squat")) acc.squats += ex.reps || 1;
        else acc.others += ex.reps || 1;
      });
      return acc;
    },
    { burpees: 0, pushups: 0, squats: 0, others: 0 }
  );

  doc.setFontSize(11);
  Object.entries(exerciseBreakdown).forEach(([type, count]) => {
    const countValue = count as number;
    if (countValue > 0) {
      const percentage =
        totalExercises > 0 ? ((countValue / totalExercises) * 100).toFixed(1) : "0";
      doc.text(`• ${type}: ${countValue} (${percentage}%)`, margin + 5, yPosition);
      yPosition += 6;
    }
  });

  yPosition += 15;

  // Tendances et insights
  doc.setFontSize(16);
  doc.text("📈 Insights & Tendances", margin, yPosition);
  yPosition += 10;

  // Calculer quelques insights simples
  const recentWorkouts = workouts.slice(0, Math.min(7, workouts.length));
  const olderWorkouts = workouts.slice(7, Math.min(14, workouts.length));

  if (recentWorkouts.length > 0 && olderWorkouts.length > 0) {
    const recentAvg =
      recentWorkouts.reduce((sum, w) => sum + w.exercises.length, 0) / recentWorkouts.length;
    const olderAvg =
      olderWorkouts.reduce((sum, w) => sum + w.exercises.length, 0) / olderWorkouts.length;
    const improvement = ((recentAvg - olderAvg) / olderAvg) * 100;

    doc.setFontSize(11);
    if (improvement > 5) {
      doc.setTextColor(34, 197, 94); // green
      doc.text(
        `✅ Excellente progression: +${improvement.toFixed(1)}% ces derniers jours`,
        margin + 5,
        yPosition
      );
    } else if (improvement < -5) {
      doc.setTextColor(239, 68, 68); // red
      doc.text(
        `⚠️ Baisse de performance: ${improvement.toFixed(1)}% ces derniers jours`,
        margin + 5,
        yPosition
      );
    } else {
      doc.setTextColor(0, 0, 0);
      doc.text(`📊 Performance stable ces derniers jours`, margin + 5, yPosition);
    }
    yPosition += 8;
  }

  doc.setTextColor(0, 0, 0);

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
    doc.text(
      `⏰ Créneau préféré: ${bestHour[0]}h00 (${bestHour[1]} séances)`,
      margin + 5,
      yPosition
    );
    yPosition += 6;
  }

  yPosition += 15;

  // Recommandations
  doc.setFontSize(16);
  doc.text("🎯 Recommandations", margin, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setTextColor(88, 28, 135);

  const recommendations = [];

  if (totalWorkouts < 20) {
    recommendations.push("• Augmente progressivement la fréquence pour créer une habitude solide");
  }

  const avgIntensity =
    workouts.reduce((sum, w) => sum + (w.intensity || 5), 0) / Math.max(workouts.length, 1);
  if (avgIntensity < 6) {
    recommendations.push("• Challenge-toi avec des séances plus intenses");
  }

  if (exerciseBreakdown.burpees / totalExercises < 0.2) {
    recommendations.push("• Ajoute plus de burpees pour un entraînement cardio complet");
  }

  if (recommendations.length === 0) {
    recommendations.push("• Continue sur cette lancée, tes performances sont excellentes!");
  }

  recommendations.forEach(rec => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(rec, margin + 5, yPosition);
    yPosition += 8;
  });

  // Footer
  const pages = doc.internal.pages.length - 1;
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `OmniFit Performance Report - Page ${i}/${pages}`,
      pageWidth - margin - 50,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  const pdfBlob = doc.output("arraybuffer");

  return new NextResponse(pdfBlob, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="omnifit-report-${new Date().toISOString().split("T")[0]}.pdf"`,
    },
  });
}
