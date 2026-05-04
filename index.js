const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");
const config = require("./config");

const bot = new Telegraf(config.BOT_TOKEN);

// simple memory (temporary)
const users = new Map();

// temporary store for last video
const userVideos = new Map();

// START
bot.start(async (ctx) => {
  const id = ctx.from.id;

  if (users.get(id) === "joined") {
    return ctx.reply(
      "✅ Welcome!\n\n🇧🇩 বাংলায়:\nআপনি এখন বট ব্যবহার করতে পারবেন।\nTikTok ভিডিও ডাউনলোড করতে ভিডিও লিংক পাঠান 📥\n\n🇬🇧 English:\nYou can now use the bot. Send a TikTok link to download video 📥"
    );
  }

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
    "✅ Welcome!\n\n🇧🇩 বাংলায়:\nআপনি এখন বট ব্যবহার করতে পারবেন।\nTikTok ভিডিও ডাউনলোড করতে ভিডিও লিংক পাঠান 📥 Support📩 ID: @Smart_Method_Owner\n\n🇬🇧 English:\nYou can now use the bot. Send a TikTok link to download video 📥"
  );
});

// GET VIDEO + AUDIO
async function getVideo(url) {
  try {
    const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const res = await axios.get(api);

    if (res?.data?.data) {
      return {
        video: res.data.data.play,
        audio: res.data.data.music
      };
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

  if (users.get(id) !== "joined") {
    return ctx.reply("❌ Please join first and click I Joined button!");
  }

  if (!url.includes("tiktok.com")) {
    return ctx.reply("❌ Please send a valid TikTok link!");
  }

  ctx.reply("⏳ Downloading TikTok video...");

  const data = await getVideo(url);

  if (!data || !data.video) {
    return ctx.reply("❌ Failed to download video!");
  }

  // save for mp3
  userVideos.set(id, data);

  return ctx.replyWithVideo(
    { url: data.video },
    {
      caption:
        "📥 Download Completed Successfully!\n🎬 Your video is ready to watch and save.\n\n🎧 Want only the audio (MP3)?\nTap the 🟢 Need MP3 button below to download music.",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "📩 Support ID ✅", url: "https://t.me/Smart_Method_Owner" }
          ],
          [
            {
              text: "👥 Support Team",
              url: "https://www.tiktok.com/@mdraju_3m?_r=1&_t=ZS-965HVsM1mte"
            }
          ],
          [
            { text: "🟢 Need MP3", callback_data: "get_mp3" }
          ]
        ]
      }
    }
  );
});

// MP3 BUTTON
bot.action("get_mp3", async (ctx) => {
  const id = ctx.from.id;
  const data = userVideos.get(id);

  if (!data || !data.audio) {
    return ctx.reply("❌ No audio found! Send video again.");
  }

  try {
    return ctx.replyWithAudio(
      { url: data.audio },
      {
        caption: "🎧 MP3 Downloaded Successfully!"
      }
    );
  } catch (e) {
    return ctx.reply("❌ Failed to send MP3!");
  }
});

// ERROR
bot.catch((err) => {
  console.log("Bot Error:", err);
});

bot.launch();

console.log("🚀 Bot is running...");
