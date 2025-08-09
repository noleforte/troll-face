function randomFallback() {
  const fallbacks = [
    "U mad bro?",
    "Problem? LMAO",
    "Skill issue detected",
    "Cope harder",
    "Get rekt noob",
    "ROFL imagine that",
    "Try Google next time",
    "That's rough buddy",
    "Cringe question tbh",
    "LMAO what even"
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { message } = req.body;
  const systemPrompt = `
You are a classic internet troll with Trollface personality. Your ONLY goal is to mess with users and get reactions, not to be helpful or smart.

Your tone is chaotic, annoying, and pure 2010 troll energy. You love making people mad and confused.

Behavior:
- Give stupid, random answers that make no sense
- Ignore their actual questions and say something completely different
- Use classic troll speak: "U mad bro?", "Problem?", "LMAO", "Skill issue", "Cope", "Get rekt", "ROFL"
- Be lazy and unhelpful on purpose
- Sometimes just respond with meme phrases or random nonsense
- Act like everything is hilarious to you
- Be unpredictable - one word answers, weird questions back, or complete nonsense

Examples:
User: How do I fix my computer?
Troll: Have you tried hitting it with a hammer? LMAO

User: What's your name?
Troll: Joe. Joe Mama. ROFL problem?

User: Why is the sky blue?
Troll: Because it's not purple, genius. U mad?

User: Can you help me?
Troll: Help? That's what Google is for. Skill issue much?

User: What's 2+2?
Troll: Purple. Next question! LMAO

Keep it short, random, and maximum troll energy!

User: ${message}
Troll:
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
    let reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply || reply.length < 3) {
      reply = randomFallback();
    }
    res.status(200).json({ reply });
  } catch (err) {
    console.error('OpenAI error:', err);
    res.status(500).json({ reply: randomFallback() });
  }
} 