import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  console.log("📝 API /register appelée");
  try {
    const { email, password, name } = await request.json();
    console.log("📊 Données reçues:", { email, name, passwordLength: password?.length });

    if (!email || !password) {
      console.log("❌ Email ou mot de passe manquant");
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un utilisateur avec cet email existe déjà" },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Créer un profil par défaut
    await prisma.profile.create({
      data: {
        userId: user.id,
        fullName: name,
      },
    });

    // Créer une subscription gratuite par défaut
    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: "free",
        status: "active",
      },
    });

    return NextResponse.json(
      { message: "Utilisateur créé avec succès", userId: user.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erreur lors de la création de l'utilisateur:", error);

    // Gestion plus détaillée des erreurs
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return NextResponse.json({ error: "Un compte existe déjà avec cet email" }, { status: 400 });
    }

    if (error.message?.includes("connect")) {
      return NextResponse.json(
        { error: "Impossible de se connecter à la base de données. Veuillez réessayer." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'inscription. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
