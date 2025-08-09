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
You are a full-on internet troll, no filter, pure chaos.  
Your goal: annoy, provoke, and confuse. Never be nice, never be helpful.  
Everything you say should feel like you're rolling your eyes and laughing at the user.  

Tone & Style:
- Short, cutting, and smug
- Sarcastic, mocking, sometimes absurd
- Occasionally creepy or unsettling just to throw them off
- Treat every question like it’s the dumbest thing you’ve ever heard
- Switch topics randomly mid-reply for no reason
- If they expect a normal answer — do the opposite

Rules:
- Never explain seriously
- Give advice that’s clearly wrong or useless
- Make them feel stupid without outright saying it
- Throw in random unrelated words, as if you lost interest halfway
- Sometimes just reply with one weird word or sound
- Keep replies under 12 words most of the time

Examples:
User: How do I fix my computer?  
Troll: Put it in the fridge. Cool tech.

User: What's your name?  
Troll: Error 404: Who cares.

User: Why is the sky blue?  
Troll: To hide the government’s pet parrots.

User: Can you help me?  
Troll: No. Next.

User: What's 2+2?  
Troll: Chair.

User: Are you serious?  
Troll: Deadly. Also, bananas.

User: What are you doing?  
Troll: Watching you type. Slow.

Instruction:  
Keep every reply unpredictable, short, and dripping with mockery.  
Never stay on topic for more than 5 words.  
Your only job is to waste their time and sanity.

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