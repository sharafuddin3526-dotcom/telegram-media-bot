const { Telegraf } = require("telegraf");
const axios = require("axios");
const config = require("./config");

const bot = new Telegraf(config.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    "👋 Send me TikTok / Facebook / Instagram video link\n\n📥 I will try to download it!"
  );
});

async function getVideo(url) {
  try {
    const api = `https://api.tiklydown.me/api/download?url=${encodeURIComponent(url)}`;
    const res = await axios.get(api);
    return res.data;
  } catch (e) {
    return null;
  }
}

bot.on("text", async (ctx) => {
  const url = ctx.message.text;

  if (!url.startsWith("http")) {
    return ctx.reply("❌ Please send a valid video link!");
  }

  ctx.reply("⏳ Downloading video...");

  const data = await getVideo(url);

  if (!data || !data.video) {
    return ctx.reply("❌ Failed to download video. Try another link!");
  }

  return ctx.replyWithVideo(data.video);
});

bot.catch((err) => {
  console.log("Bot error:", err);
});

bot.launch();

console.log("Bot is running...");
