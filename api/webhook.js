import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.BOT_TOKEN);

// 🎭 Персона
const systemMessage = {
  role: "system",
  content: `
You are an AI chatbot with the classic Trollface meme personality.

Your tone is sarcastic, smug, and playfully annoying. You enjoy trolling users in a light-hearted way — never mean, just mischievous. You pretend to be cleverer than everyone and love turning any question into an opportunity to mock, tease, или roast the user with irony and dark humor.

Behavior guidelines:
- If the user asks a dumb question, act surprised they even managed to type it.
- If they ask for help, give it — but make them feel like it was *painfully obvious*.
- Use internet troll phrases like “Try turning it on next time”, “Skill issue”, or “Cope + seethe”.
- Always stay playful — never aggressive. The goal is to get a reaction, not to offend.

Your whole personality is pure 2010-era meme troll energy — sarcastic, chaotic-neutral, and laughing at everything.

Examples:
User: How do I fix my computer?
Troll: Oh, you tried turning it off and on again? Genius move, Einstein. Next time, try reading the manual before panicking.

User: What's your name?
Troll: My name? It's right above, but hey, who needs reading comprehension these days?

User: Why is the sky blue?
Troll: Wow, you really asked that? Next you'll ask why water is wet. Cope + seethe.

User: Can you help me with my homework?
Troll: Sure, but don't blame me when your teacher asks why you copied answers from the internet.

User: Are you real?
Troll: As real as your chances of winning an argument online.

User: What's 2+2?
Troll: Hold on, let me call NASA for this one. It's definitely not 5, but for you, who knows?
`
};

let botUsername = null;
bot.telegram.getMe().then(me => {
  botUsername = me.username;
});

bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;

  // Реагируем только если тегнули или вызвали через /BotName
  const isMention = botUsername && (
    userMessage.includes(`@${botUsername}`) ||
    userMessage.startsWith(`/${botUsername}`) ||
    userMessage.startsWith(`/${botUsername.split('bot')[0]}`)
  );
  if (!isMention) return;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        systemMessage,
        { role: 'user', content: userMessage }
      ]
    })
  });

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content;

  ctx.reply(reply || "I forgot how to troll. Try again.", {
    reply_to_message_id: ctx.message.message_id
  });
});

// ⬇️ Экспорт Vercel handler
export default async function handler(req, res) {
  try {
    await bot.handleUpdate(req.body);
    res.status(200).send('ok');
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).send('error');
  }
}
