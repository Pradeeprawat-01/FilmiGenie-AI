import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { initDatabase } from "./db";
import recommendationsRoutes from "./routes/recommendations";

const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
});

fastify.register(recommendationsRoutes);

fastify.get("/health", async () => {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
  };
});

const start = async (): Promise<void> => {
  try {
    await initDatabase();
    console.log("Database initialized");

    const port = parseInt(process.env.PORT || "3001", 10);
    await fastify.listen({ port, host: "0.0.0.0" });
    console.log(`Server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
