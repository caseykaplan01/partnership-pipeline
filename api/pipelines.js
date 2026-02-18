export default async function handler(req, res) {
  const STREAK_API_KEY = process.env.STREAK_API_KEY;
  const STREAK_BASE_URL = 'https://www.streak.com/api/v1';

  try {
    const response = await fetch(`${STREAK_BASE_URL}/pipelines`, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(STREAK_API_KEY + ':').toString('base64'),
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Streak API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching pipelines:', error);
    res.status(500).json({ error: error.message });
  }
}
