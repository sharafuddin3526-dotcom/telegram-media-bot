const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");
const config = require("./config");

const bot = new Telegraf(config.BOT_TOKEN);

// simple memory (temporary)
const users = new Map();

// START
bot.start(async (ctx) => {
  const id = ctx.from.id;

  // if already joined
  if (users.get(id) === "joined") {
    return ctx.reply(
      "✅ Welcome!

🇧🇩 বাংলায়:
আপনি এখন বট ব্যবহার করতে পারবেন।
TikTok ভিডিও ডাউনলোড করতে ভিডিও লিংক পাঠান 📥

🇬🇧 English:
You can now use the bot. Send a TikTok link to download video 📥"
    );
  }

  // first time → show buttons
  return ctx.reply(
    "👋 Welcome!\n\nPlease join our channels to use the bot:",
    Markup.inlineKeyboard([
      [Markup.button.url("🌍 Global Channel", "https://t.me/Global_Method_Channel")],
      [Markup.button.url("🆘 Support Owner", "https://t.me/Smart_Method_Owner")],
      [Markup.button.callback("✅ I Joined", "joined_check")]
    ])
  );
});

// JOIN CHECK
bot.action("joined_check", async (ctx) => {
  const id = ctx.from.id;

  users.set(id, "joined");

  return ctx.reply(
    "✅ Welcome!\n\n🇧🇩 বাংলায়:\nআপনি এখন বট ব্যবহার করতে পারবেন।\nTikTok ভিডিও ডাউনলোড করতে ভিডিও লিংক পাঠান 📥\n\n🇬🇧 English:\nYou can now use the bot. Send a TikTok link to download video 📥"
  );
});

// TIKTOK DOWNLOAD
async function getVideo(url) {
  try {
    const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const res = await axios.get(api);

    if (res?.data?.data?.play) {
      return res.data.data.play;
    }

    return null;
  } catch (err) {
    console.log("Download error:", err.message);
    return null;
  }
}

// MESSAGE HANDLER
bot.on("text", async (ctx) => {
  const id = ctx.from.id;
  const url = ctx.message.text;

  // block if not joined
  if (users.get(id) !== "joined") {
    return ctx.reply("❌ Please join first and click I Joined button!");
  }

  if (!url.includes("tiktok.com")) {
    return ctx.reply("❌ Please send a valid TikTok link!");
  }

  ctx.reply("⏳ Downloading TikTok video...");

  const video = await getVideo(url);

  if (!video) {
    return ctx.reply("❌ Failed to download video!");
  }

  return ctx.replyWithVideo(video);
});

// ERROR
bot.catch((err) => {
  console.log("Bot Error:", err);
});

bot.launch();

console.log("🚀 Bot is running...");
