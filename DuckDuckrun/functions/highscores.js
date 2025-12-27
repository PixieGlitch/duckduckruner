export async function handler(event) {
  const API_URL = process.env.NEON_DATA_API_URL;
  const API_KEY = process.env.NEON_API_KEY;

  // GET /highscores?select=color,score&order=score.desc
  const res = await fetch(
    `${API_URL}/highscores?select=color,score&order=score.desc`,
    {
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  const data = await res.json();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(data)
  };
}
