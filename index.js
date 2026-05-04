const { Telegraf } = require("telegraf");
const axios = require("axios");
const config = require("./config");

const bot = new Telegraf(config.BOT_TOKEN);

// START MESSAGE
bot.start((ctx) => {
  ctx.reply(
    "👋 Send me a TikTok video link\n\n📥 I will download it for you!"
  );
});

// ONLY TIKTOK DOWNLOADER (STABLE VERSION)
async function getVideo(url) {
  try {
    const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const res = await axios.get(api);

    const data = res.data;

    if (data?.data?.play) {
      return data.data.play; // video URL
    }

    return null;
  } catch (err) {
    console.log("Download error:", err.message);
    return null;
  }
}

// MESSAGE HANDLER
bot.on("text", async (ctx) => {
  const url = ctx.message.text;

  // only allow TikTok links
  if (!url.includes("tiktok.com")) {
    return ctx.reply("❌ Please send a valid TikTok link!");
  }

  ctx.reply("⏳ Downloading TikTok video...");

  const video = await getVideo(url);

  if (!video) {
    return ctx.reply("❌ Failed to download TikTok video!");
  }

  try {
    return ctx.replyWithVideo(video);
  } catch (e) {
    return ctx.reply("❌ Error sending video!");
  }
});

// ERROR HANDLER
bot.catch((err) => {
  console.log("Bot Error:", err);
});

bot.launch();

console.log("🚀 TikTok Bot is running...");
