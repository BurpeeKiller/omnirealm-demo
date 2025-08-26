import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// DATABASE_URL DOIT être définie dans .env.local
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL manquante dans .env.local - Configuration requise pour la sécurité"
  );
}

const databaseUrl = process.env.DATABASE_URL;

// Log sécurisé uniquement en développement
if (process.env.NODE_ENV === "development") {
  console.log("🔧 Prisma connected:", databaseUrl.replace(/:[^:]*@/, ":***@"));
}

// Forcer la création d'une nouvelle instance si l'URL a changé
if (globalForPrisma.prisma) {
  globalForPrisma.prisma.$disconnect();
  globalForPrisma.prisma = undefined;
}

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
