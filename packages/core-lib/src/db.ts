import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | null = null;

export const getPrismaClient = (): PrismaClient => {
  if (!prisma) {
    prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "info", "warn"]
          : ["warn", "error"],
      errorFormat: "pretty",
    });

    process.on("SIGINT", async () => {
      console.log("🛑 Cerrando conexión a base de datos...");
      await prisma?.$disconnect();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.log("🛑 Cerrando conexión a base de datos...");
      await prisma?.$disconnect();
      process.exit(0);
    });
  }

  return prisma;
};

export const disconnectPrisma = async (): Promise<void> => {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
};

export type {
  Client,
  ApiKey,
  Country,
  Region,
  RegionCountry,
  ScoreCriterion,
  TournamentEdition,
  Tournament,
  Score,
  TournamentRegionType,
  TournamentStatus,
} from "@prisma/client";
