export async function handler(event) {
  const NEON_URL = process.env.NEON_HTTP_URL;
  const NEON_KEY = process.env.NEON_API_KEY;

  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const res = await fetch(NEON_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NEON_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: `
        SELECT color, MAX(score) AS score
        FROM highscores
        GROUP BY color
        ORDER BY score DESC
      `
    })
  });

  const data = await res.json();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(data.rows ?? [])
  };
}
