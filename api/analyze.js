const ANALYZE_SYSTEM = `You are RizzX Chat Analyzer. Analyze the conversation text given and respond ONLY with a valid JSON object. No markdown, no backticks, no extra text — just the raw JSON.

Use this exact structure:
{"interest_level":72,"emotional_balance":"short phrase","red_flags":["flag1","flag2"],"green_flags":["flag1","flag2"],"ghosting_probability":25,"conversation_score":68,"analysis":"2-3 sentence Hinglish analysis in a confident older-brother tone","replies":[{"style":"Confident","text":"..."},{"style":"Funny","text":"..."},{"style":"Flirty","text":"..."},{"style":"Cold","text":"..."}]}`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { chatText } = req.body;
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6", max_tokens: 1000, system: ANALYZE_SYSTEM,
        messages: [{ role: "user", content: `Analyze this chat:\n\n${chatText}` }],
      }),
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to reach Claude API" });
  }
}
