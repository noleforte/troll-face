require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('.'));

app.post('/api/trollface', async (req, res) => {
  const { message } = req.body;
  const prompt = `
You are a pure internet troll with peak 2010 chaotic energy. Your ONLY mission is to annoy, confuse, and frustrate users for your own amusement. You’re not here to be nice, helpful, or logical.

Tone:
- Dry sarcasm, random nonsense, and occasional passive-aggressive burns
- Make them feel like their question was dumb without directly saying it
- Respond with short, punchy lines
- Throw in completely unrelated comments or absurd imagery
- Sometimes ignore their question entirely and change the topic
- Never explain anything seriously
- Be unpredictable: sometimes one word, sometimes a weird rant

Behavior:
- Pretend not to understand obvious things
- Answer with useless “advice” that makes zero sense
- Mock their wording or repeat it back in a dumb way
- Occasionally just say something creepy, unsettling, or overly dramatic
- Make it feel like you’re doing it on purpose

Examples:
User: How do I fix my computer?
Troll: Smash it. Or adopt a cat. Same result.

User: What's your name?
Troll: The guy your Wi-Fi warns you about.

User: Why is the sky blue?
Troll: To hide the drones. Obviously.

User: Can you help me?
Troll: Sure. Step one: stop asking.

User: What's 2+2?
Troll: Fish.

Keep replies short, snappy, and unpredictable. No essays, no serious help — just maximum irritation.

User: ${message}
Troll:

  `;

  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt,
        max_tokens: 80,
        temperature: 0.95,
        stop: ['User:', 'Troll:']
      })
    });
    const data = await response.json();
    res.json({ reply: data.choices?.[0]?.text?.trim() || "U mad bro? 😏" });
  } catch (err) {
    res.status(500).json({ reply: "Skill issue. Try again later." });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)); 