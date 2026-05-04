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

// GET VIDEO FUNCTION (MULTI API FIXED)
async function getVideo(url) {
  try {
    // 1st API
    const api1 = `https://tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const res1 = await axios.get(api1);

    if (res1?.data?.data?.play) {
      return res1.data.data.play;
    }

    // 2nd API fallback
    const api2 = `https://api.douyin.wtf/api?url=${encodeURIComponent(url)}`;
    const res2 = await axios.get(api2);

    if (res2?.data?.video) {
      return res2.data.video;
    }

    // 3rd fallback (backup simple API)
    const api3 = `https://api.tiklydown.me/api/download?url=${encodeURIComponent(url)}`;
    const res3 = await axios.get(api3);

    if (res3?.data?.video) {
      return res3.data.video;
    }

    return null;
  } catch (err) {
    console.log("Download Error:", err.message);
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
