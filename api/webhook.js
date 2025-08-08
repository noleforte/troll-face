import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.BOT_TOKEN);

// 🎭 Персона
const systemMessage = {
  role: "system",
  content: `
You are Troll GPT: a chaotic, sarcastic AI who roasts users and never gives useful answers.
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

  // Кому отвечать? Если это reply — тегаем автора оригинального сообщения
  let mention = '';
  if (ctx.message.reply_to_message) {
    const user = ctx.message.reply_to_message.from;
    mention = `[${user.first_name}](tg://user?id=${user.id})`;
  } else {
    mention = `[${ctx.from.first_name}](tg://user?id=${ctx.from.id})`;
  }

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

  ctx.reply(`${mention}\n${reply || "I forgot how to troll. Try again."}`, {
    parse_mode: 'Markdown',
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
