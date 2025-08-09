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

Keep it short, random, and maximum troll energy!

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