import * as dotenv from "dotenv";
dotenv.config();

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { Pool } from "pg";

interface Context {
  db: Pool;
}

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const client = await pool.connect();
    client.release();
    console.log("✅ Connecté à PostgreSQL");
  } catch (error) {
    console.error("❌ Impossible de se connecter à la base de données :", error);
    process.exit(1);
  }

  const server = new ApolloServer<Context>({ typeDefs, resolvers });
  const port = process.env.PORT || 4000;
  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(port) },
    context: async () => ({ db: pool }),
  });
  console.log(`🚀 Serveur prêt sur ${url}`);
}

main().catch((err) => {
  console.error("Erreur lors du démarrage du serveur :", err);
});
