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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const exercise = await prisma.exerciseTemplate.findUnique({
      where: {
        id,
      },
    });

    if (!exercise) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(exercise, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching exercise:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercise" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const { id } = await params;
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

    const exercise = await prisma.exerciseTemplate.update({
      where: {
        id,
      },
      data: {
        ...(name && { name }),
        ...(emoji && { emoji }),
        ...(description && { description }),
        ...(category && { category }),
        ...(difficulty && { difficulty }),
        ...(targetArea && { targetArea }),
        ...(isPremium !== undefined && { isPremium }),
        ...(duration && { duration: parseInt(duration) }),
        ...(restDuration && { restDuration: parseInt(restDuration) }),
        ...(sets && { sets: parseInt(sets) }),
        ...(reps && { reps: parseInt(reps) }),
        ...(instructions && { instructions }),
        ...(tips && { tips }),
        ...(benefits && { benefits }),
        ...(muscles && { muscles }),
        ...(equipment && { equipment }),
        ...(basePoints && { basePoints: parseInt(basePoints) }),
      },
    });

    return NextResponse.json(exercise, { headers: corsHeaders });
  } catch (error) {
    console.error("Error updating exercise:", error);
    return NextResponse.json(
      { error: "Failed to update exercise" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const { id } = await params;
    await prisma.exerciseTemplate.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      { message: "Exercise deleted successfully" },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error deleting exercise:", error);
    return NextResponse.json(
      { error: "Failed to delete exercise" },
      { status: 500, headers: corsHeaders }
    );
  }
}
