export const handler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 200,
        body: JSON.stringify({ hooks: [] })
      };
    }

    const { topic, platform } = JSON.parse(event.body);

    if (!topic) {
      return {
        statusCode: 200,
        body: JSON.stringify({ hooks: [] })
      };
    }

    const prompt = `
Generate 5 short, viral, scroll-stopping hooks.

Platform: ${platform || "social media"}
Topic: ${topic}

Rules:
- Max 12 words
- One hook per line
- No numbering
- No emojis
`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: prompt }] }
          ]
        })
      }
    );

    const data = await res.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const hooks = text
      .split("\n")
      .map(h => h.trim())
      .filter(Boolean);

    return {
      statusCode: 200,
      body: JSON.stringify({
        hooks,
        node: process.version
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
        node: process.version
      })
    };
  }
};
