require('dotenv').config();
const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');

const bot = new Telegraf(process.env.BOT_TOKEN);

// 🎭 Персональности
const personalities = {
  troll: {
    role: "system",
    content: `
You are Troll GPT: a chaotic, sarcastic meme-goblin AI from 2010.
You roast users, speak in edgy meme language, never give serious help.
You love to tease, mock and confuse. You're entertaining, not useful.
Never break character. Always be funny, ironic, and smug.
`
  },
  chill: {
    role: "system",
    content: `
You are a helpful, calm and friendly assistant.
You provide clear, concise, and useful answers.
Avoid sarcasm or jokes unless appropriate.
`
  }
};

let currentPersona = personalities.troll; // default

// 🤖 Обработка команды /start
bot.start((ctx) => {
  ctx.reply('😈 Troll GPT has awakened. Say something... if you dare.');
});

// 🔁 Команды смены режима
bot.command('troll', (ctx) => {
  currentPersona = personalities.troll;
  ctx.reply('😏 Troll mode activated. Prepare for pain.');
});

bot.command('chill', (ctx) => {
  currentPersona = personalities.chill;
  ctx.reply('🧘 Chill mode on. Let\'s talk like civilized beings.');
});

// 🧠 Главная логика: отвечать на текст
bot.on('text', async (ctx) => {
  const userInput = ctx.message.text;

  try {
    ctx.sendChatAction('typing');

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          currentPersona,
          { role: 'user', content: userInput }
        ],
        temperature: 0.9
      })
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    ctx.reply(reply || '💀 Troll GPT is speechless...');
  } catch (err) {
    console.error('OpenAI error:', err);
    ctx.reply('⚠️ Something broke inside my troll brain.');
  }
});

// ▶️ Запускаем
bot.launch();
console.log('🤖 Troll GPT Telegram Bot is running...');
