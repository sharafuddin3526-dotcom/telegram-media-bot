const { Telegraf } = require("telegraf");
const axios = require("axios");
const config = require("./config");

const bot = new Telegraf(config.BOT_TOKEN);

// START MESSAGE
bot.start((ctx) => {
  ctx.reply(
    "👋 Send me TikTok / Facebook / Instagram video link\n\n📥 I will try to download it!"
  );
});

// GET VIDEO FUNCTION (FIXED + WORKING)
async function getVideo(url) {
  try {
    const api = `https://api.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const res = await axios.get(api);

    const data = res.data;

    // TikTok video link extract
    if (data?.data?.play) {
      return data.data.play;
    }

    return null;
  } catch (err) {
    console.log("API Error:", err.message);
    return null;
  }
}

// MESSAGE HANDLER
bot.on("text", async (ctx) => {
  const url = ctx.message.text;

  if (!url.startsWith("http")) {
    return ctx.reply("❌ Please send a valid video link!");
  }

  ctx.reply("⏳ Downloading video...");

  const video = await getVideo(url);

  if (!video) {
    return ctx.reply("❌ Failed to download video. Try another link!");
  }

  try {
    return ctx.replyWithVideo(video);
  } catch (e) {
    return ctx.reply("❌ Error sending video to Telegram!");
  }
});

// ERROR HANDLER
bot.catch((err) => {
  console.log("Bot Error:", err);
});

bot.launch();

console.log("🚀 Bot is running...");
