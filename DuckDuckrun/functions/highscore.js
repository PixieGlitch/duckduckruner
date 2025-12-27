import { Client } from "pg";

export async function handler(event) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    // GET = leaderboard
    if (event.httpMethod === "GET") {
      const { rows } = await client.query(`
        SELECT color, MAX(score) as score
        FROM highscores
        GROUP BY color
        ORDER BY score DESC
      `);

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rows),
      };
    }

    // POST = submit score
    if (event.httpMethod === "POST") {
      const { color, score } = JSON.parse(event.body || "{}");

      if (!color || typeof score !== "number") {
        return { statusCode: 400, body: "Invalid payload" };
      }

      await client.query(
        "INSERT INTO highscores (color, score) VALUES ($1, $2)",
        [color, score]
      );

      return { statusCode: 200, body: "Saved" };
    }

    return { statusCode: 405, body: "Method Not Allowed" };
  } finally {
    await client.end();
  }
}