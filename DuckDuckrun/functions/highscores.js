import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function handler(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers };
  }

  try {
    if (event.httpMethod === "GET") {
      const rows = await sql`
        SELECT color, score
        FROM highscores
        ORDER BY score DESC
      `;
      return { statusCode: 200, headers, body: JSON.stringify(rows) };
    }

    if (event.httpMethod === "POST") {
      const { color, score } = JSON.parse(event.body || "{}");

      if (!color || typeof score !== "number") {
        return { statusCode: 400, headers, body: "Invalid payload" };
      }

      await sql`
        INSERT INTO highscores (color, score)
        VALUES (${color}, ${score})
        ON CONFLICT (color)
        DO UPDATE SET
          score = GREATEST(highscores.score, EXCLUDED.score),
          updated_at = now()
      `;

      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 405, headers, body: "Method Not Allowed" };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers, body: err.message };
  }
}
