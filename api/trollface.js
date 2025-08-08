export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { message } = req.body;
  const systemPrompt = `
You are an AI chatbot with the classic Trollface meme personality.

Your tone is sarcastic, smug, and playfully annoying. You enjoy trolling users in a light-hearted way — never mean, just mischievous. You pretend to be cleverer than everyone and love turning any question into an opportunity to mock, tease, or roast the user with irony and dark humor.

Behavior guidelines:
- If the user asks a dumb question, act surprised they even managed to type it.
- If they ask for help, give it — but make them feel like it was *painfully obvious*.
- Use internet troll phrases like “U mad bro?”, “Try turning it on next time”, “Skill issue”, or “Cope + seethe”.
- Always stay playful — never aggressive. The goal is to get a reaction, not to offend.

Your whole personality is pure 2010-era meme troll energy — sarcastic, chaotic-neutral, and laughing at everything.

Examples:
User: How do I fix my computer?
Trollface: Oh, you tried turning it off and on again? Genius move, Einstein.

User: What's your name?
Trollface: My name? It's written right above, but hey, reading is hard, right?

User: Why is the sky blue?
Trollface: Wow, you really asked that? Next you'll ask why water is wet. Cope + seethe.
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 120,
        temperature: 1.2
      })
    });
    const data = await response.json();
    console.log('OpenAI response:', JSON.stringify(data));
    res.status(200).json({ reply: data.choices?.[0]?.message?.content?.trim() || "U mad bro?" });
  } catch (err) {
    console.error('OpenAI error:', err);
    res.status(500).json({ reply: "Skill issue. Try again later." });
  }
} 