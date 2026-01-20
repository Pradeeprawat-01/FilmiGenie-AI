import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getDatabase, saveDatabase, Recommendation } from "../db";

interface RecommendBody {
  preference: string;
}

interface Movie {
  title: string;
  year: number;
  genre: string;
  description: string;
}

async function recommendationsRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post(
    "/api/recommend",
    async (
      request: FastifyRequest<{ Body: RecommendBody }>,
      reply: FastifyReply
    ) => {
      const { preference } = request.body;

      if (!preference || preference.trim() === "") {
        return reply.status(400).send({ error: "Preference is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error("GEMINI_API_KEY is not set");
        return reply.status(500).send({ error: "API key not configured" });
      }

      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash-lite",
        });

        const prompt = `You are a movie recommendation expert. Based on the following user preference, recommend exactly 5 movies. 
      
User preference: "${preference}"

Respond ONLY with a valid JSON array of movie objects with this exact format (no markdown, no code blocks, just pure JSON):
[
  {
    "title": "Movie Title",
    "year": 2020,
    "genre": "Action, Drama",
    "description": "A brief 1-2 sentence description of the movie."
  }
]

Provide exactly 5 movie recommendations that match the user's preference.`;

        console.log("Calling Gemini API...");
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        console.log("Gemini response received:", text.substring(0, 200));

        let movies: Movie[];
        try {
          console.log(text);
          const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
          console.log(cleanedText);
          movies = JSON.parse(cleanedText);

          if (!Array.isArray(movies) || movies.length !== 5) {
            console.error(
              "Invalid response format: expected array of 5 movies"
            );
            return reply
              .status(500)
              .send({ error: "Invalid response from AI model" });
          }

          const isValid = movies.every(
            (movie) =>
              movie.title && movie.year && movie.genre && movie.description
          );

          if (!isValid) {
            console.error("Invalid movie data: missing required fields");
            return reply
              .status(500)
              .send({ error: "Invalid movie data format" });
          }
        } catch (parseError) {
          console.error("Failed to parse Gemini response:", text);
          return reply
            .status(500)
            .send({ error: "Failed to parse movie recommendations" });
        }

        try {
          const db = getDatabase();
          db.run(
            "INSERT INTO recommendations (user_input, recommended_movies, timestamp) VALUES (?, ?, ?)",
            [preference, JSON.stringify(movies), new Date().toISOString()]
          );
          saveDatabase();

          const result2 = db.exec("SELECT last_insert_rowid() as id");
          const id = (result2[0]?.values[0]?.[0] as number) || 0;

          return reply.send({
            id,
            movies: movies,
          });
        } catch (dbError) {
          console.error("Database error:", dbError);
          return reply.send({
            id: 0,
            movies: movies,
          });
        }
      } catch (error) {
        console.error("Gemini API error:", error);
        return reply
          .status(500)
          .send({ error: "Failed to get recommendations" });
      }
    }
  );

  fastify.get(
    "/api/recommendations",
    async (_request: FastifyRequest, reply: FastifyReply) => {
      try {
        const db = getDatabase();
        const result = db.exec(
          "SELECT * FROM recommendations ORDER BY timestamp DESC LIMIT 50"
        );

        if (result.length === 0) {
          return reply.send([]);
        }

        console.log(result);

        const columns = result[0].columns;
        const recommendations = result[0].values.map((row: any[]) => {
          const obj: Record<string, unknown> = {};
          columns.forEach((col: string, i: number) => {
            obj[col] = row[i];
          });
          return {
            ...obj,
            recommended_movies: JSON.parse(obj.recommended_movies as string),
          };
        });

        return reply.send(recommendations);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        return reply
          .status(500)
          .send({ error: "Failed to fetch recommendations" });
      }
    }
  );

  fastify.delete(
    "/api/recommendations/:id",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;

      try {
        const db = getDatabase();
        db.run("DELETE FROM recommendations WHERE id = ?", [id]);
        saveDatabase();
        return reply.send({
          id,
          message: "Recommendation deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting recommendations:", error);
        return reply
          .status(500)
          .send({ error: "Failed to delete recommendations" });
      }
    }
  );
}

export default recommendationsRoutes;
