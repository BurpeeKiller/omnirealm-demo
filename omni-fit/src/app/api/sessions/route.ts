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
    const limit = searchParams.get("limit");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build where clause
    const where: any = {
      userId: session.user.id,
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const sessions = await prisma.workout.findMany({
      where,
      include: {
        exercises: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(sessions, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const body = await request.json();
    const {
      exercises, // Array of { exerciseId, actualSets, actualReps, actualDuration, notes }
      totalDuration,
      caloriesBurned,
      notes,
    } = body;

    // Validation
    if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
      return NextResponse.json(
        { error: "At least one exercise is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const workoutSession = await prisma.workout.create({
      data: {
        userId: session.user.id,
        duration: parseInt(totalDuration) || 0,
        calories: parseInt(caloriesBurned) || 0,
        name: notes || "Séance d'entraînement",
        exercises: {
          create: exercises.map((exercise: any) => ({
            name: exercise.name || "Exercice",
            reps: parseInt(exercise.actualReps) || 1,
            sets: parseInt(exercise.actualSets) || 1,
          })),
        },
      },
      include: {
        exercises: true,
      },
    });

    return NextResponse.json(workoutSession, { headers: corsHeaders });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500, headers: corsHeaders }
    );
  }
}
