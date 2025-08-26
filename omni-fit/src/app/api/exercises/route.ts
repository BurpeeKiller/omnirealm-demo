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
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const isPremium = searchParams.get("premium");
    const limit = searchParams.get("limit");

    // Build filter object
    const where: any = {};

    if (
      category &&
      ["strength", "cardio", "flexibility", "breathing", "balance"].includes(category)
    ) {
      where.category = category;
    }

    if (difficulty && ["beginner", "intermediate", "advanced"].includes(difficulty)) {
      where.difficulty = difficulty;
    }

    if (isPremium === "true" || isPremium === "false") {
      where.isPremium = isPremium === "true";
    }

    const exercises = await prisma.exerciseTemplate.findMany({
      where,
      orderBy: {
        name: "asc",
      },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(exercises, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercises" },
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
      name,
      emoji,
      description,
      category,
      difficulty,
      targetArea,
      isPremium,
      duration,
      restDuration,
      sets,
      reps,
      instructions,
      tips,
      benefits,
      muscles,
      equipment,
      basePoints,
    } = body;

    // Validation
    if (!name || !category || !difficulty || !duration) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400, headers: corsHeaders }
      );
    }

    const exercise = await prisma.exerciseTemplate.create({
      data: {
        name,
        emoji: emoji || "💪",
        description: description || "",
        category,
        difficulty,
        targetArea: targetArea || "",
        isPremium: isPremium || false,
        duration: parseInt(duration),
        restDuration: parseInt(restDuration) || 30,
        sets: parseInt(sets) || 1,
        reps: parseInt(reps) || 1,
        instructions: instructions || [],
        tips: tips || [],
        benefits: benefits || [],
        muscles: muscles || [],
        equipment: equipment || [],
        basePoints: parseInt(basePoints) || 10,
      },
    });

    return NextResponse.json(exercise, { headers: corsHeaders });
  } catch (error) {
    console.error("Error creating exercise:", error);
    return NextResponse.json(
      { error: "Failed to create exercise" },
      { status: 500, headers: corsHeaders }
    );
  }
}
