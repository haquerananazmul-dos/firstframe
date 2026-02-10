export async function handler(event) {
  try {
    const { topic, platform } = JSON.parse(event.body || "{}");

    if (!topic) {
      return {
        statusCode: 200,
        body: JSON.stringify({ hooks: [] })
      };
    }

    const prompt = `
Generate 5 short, viral, scroll-stopping hooks.

Platform: ${platform}
Topic: ${topic}

Rules:
- First hook is the strongest
- Max 12 words
- One hook per line
- No numbering, no emojis
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return {
        statusCode: 200,
        body: JSON.stringify({ hooks: [] })
      };
    }

    const hooks = text
      .split("\n")
      .map(h => h.trim())
      .filter(Boolean);

    return {
      statusCode: 200,
      body: JSON.stringify({ hooks })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
