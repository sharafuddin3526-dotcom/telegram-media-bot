const { Telegraf } = require("telegraf");
const axios = require("axios");

const bot = new Telegraf(process.env.BOT_TOKEN);

// start message
bot.start((ctx) => {
  ctx.reply(
    "👋 Send me TikTok / Facebook / Instagram video link\n\n📥 I will try to download it!"
  );
});

// helper function (API call)
async function getVideo(url) {
  try {
    // example API (you can replace later)
    const api = `https://api.tiklydown.me/api/download?url=${encodeURIComponent(url)}`;

    const res = await axios.get(api);
    return res.data;
  } catch (e) {
    return null;
  }
}

// message handler
bot.on("text", async (ctx) => {
  const url = ctx.message.text;

  if (!url.startsWith("http")) {
    return ctx.reply("❌ Please send a valid video link!");
  }

  ctx.reply("⏳ Downloading video...");

  const data = await getVideo(url);

  if (!data || !data.video) {
    return ctx.reply("❌ Failed to download video. Try another link.");
  }

  return ctx.replyWithVideo(data.video);
});

bot.launch();

console.log("Bot is running...");
