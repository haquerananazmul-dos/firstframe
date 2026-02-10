export async function handler(event) {
  try {
    // Parse request
    const body = JSON.parse(event.body || "{}");
    const topic = body.topic;
    const platform = body.platform;

    if (!topic) {
      return {
        statusCode: 400,
        body: JSON.stringify({ hooks: [] })
      };
    }

    // Prompt for Gemini
    const prompt = `
Generate 5 short, viral, scroll-stopping hooks.

Platform: ${platform}
Topic: ${topic}

Rules:
- First hook is the strongest
- Max 12 words per hook
- One hook per line
`;

    // Call Gemini API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        process.env.GEMINI_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Clean output
    const hooks = text
      .split("\n")
      .map(h => h.replace(/^[\-\d\.\)]\s*/, "").trim())
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
