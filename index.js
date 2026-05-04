const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");
const config = require("./config");

const bot = new Telegraf(config.BOT_TOKEN);

// simple memory
const users = new Map();
const userVideos = new Map();

// ================= START =================
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

// ================= JOIN =================
bot.action("joined_check", async (ctx) => {
  const id = ctx.from.id;
  users.set(id, "joined");

  return ctx.reply(
    "✅ Welcome!\n\n🇧🇩 বাংলায়:\nআপনি এখন বট ব্যবহার করতে পারবেন।\nTikTok ভিডিও ডাউনলোড করতে ভিডিও লিংক পাঠান 📩\n\n🇬🇧 English:\nYou can now use the bot. Send a TikTok link to download video 📥"
  );
});

// ================= VIDEO API =================
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

// ================= MESSAGE =================
bot.on("text", async (ctx) => {
  const id = ctx.from.id;
  const url = ctx.message.text;
// 🔥 ADD THIS LINE (IMPORTANT FIX)
  if (url.startsWith("/")) return;
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

  userVideos.set(id, data);

  return ctx.replyWithVideo(
    { url: data.video },
    {
      caption:
        "📥 Download Completed Successfully!\n🎬 Your video is ready to watch and save.\n\n🎧 Want only the audio (MP3)?\nTap the 🟢 Need MP3 button below to download music.",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📩 Support ID ✅", url: "https://t.me/Smart_Method_Owner" }],
          [{ text: "👥 Support Team", url: "https://www.tiktok.com/@mdraju_3m" }],
          [{ text: "🟢 Need MP3", callback_data: "get_mp3" }]
        ]
      }
    }
  );
});

// ================= MP3 =================
bot.action("get_mp3", async (ctx) => {
  const id = ctx.from.id;
  const data = userVideos.get(id);

  if (!data || !data.audio) {
    return ctx.reply("❌ No audio found! Send video again.");
  }

  return ctx.replyWithAudio(
    { url: data.audio },
    { caption: "🎧 MP3 Downloaded Successfully!" }
  );
});

// ================= CAPTION SYSTEM =================

const captions = {
  romantic: [
    "তুমি আমার গল্পের সবচেয়ে সুন্দর অংশ ❤️ #Love",
    "তোমার হাসিতেই আমার সুখ 😊 #Couple",
    "তুমি থাকলেই সব ভালো লাগে 💖 #Romantic",
    "ভালোবাসা ছোট ছোট মুহূর্তে ❤️ #Relationship",
    "তুমি আর আমি 💑 #Forever"
  ],
  islamic: [
    "আল্লাহই যথেষ্ট 🤍 #Islamic #Allah",
    "সব কিছু আল্লাহর হাতে ✨ #Tawakkul #Faith",
    "ধৈর্য ধরো, ভালো কিছু আসছে 🌙 #Sabr",
    "দোয়া কখনো বিফলে যায় না 🤲 #Dua",
    "আল্লাহর উপর ভরসা রাখো 💖 #TrustAllah"
  ],
  sad: [
    "হাসির আড়ালে লুকানো কষ্ট 💔 #Sad #Broken",
    "সবাই পাশে থাকে না 😔 #Alone",
    "কিছু গল্প অসম্পূর্ণই থেকে যায়... #Pain",
    "মনটা আজ খুব খারাপ 😢 #MoodOff",
    "ভালোবাসা সব সময় সুখ দেয় না 💔 #Reality"
  ],
  funny: [
    "জীবনটা একটা মিম 😂 #Funny",
    "আমি আর আমার লাক 🤣 #Life",
    "দুনিয়া গোল, আমার মাথাও 😆 #LOL",
    "সিরিয়াস হলে চলবে না 😂 #Fun",
    "আজকে আবার গন্ডগোল 🤪 #Crazy"
  ],
  other: [
    "Just vibes ✨ #Vibes",
    "Feeling fresh 🌿 #Mood",
    "New day, new energy ⚡ #Motivation",
    "Stay real 💯 #Real",
    "Keep going 🚀 #Success",
    "No limits 🔥 #Power",
    "Dream big 🌟 #Goals",
    "Chill mode 😎 #Relax",
    "Be yourself 💫 #Unique",
    "Smile more 😊 #Happy"
  ]
};

function getRandom(type) {
  const list = captions[type];
  return list[Math.floor(Math.random() * list.length)];
}

bot.command("caption", (ctx) => {
  ctx.reply(
    "✨ Please Select Category ✨",
    Markup.inlineKeyboard([
      [Markup.button.callback("❤️ Romanci Capt...", "cap_romantic")],
      [Markup.button.callback("🕌 Islamic Caption", "cap_islamic")],
      [Markup.button.callback("💔 Sad Caption", "cap_sad")],
      [Markup.button.callback("😂 Funy Caption", "cap_funny")],
      [Markup.button.callback("🔥 Other Caption", "cap_other")]
    ])
  );
});

function sendCaption(ctx, type) {
  const text = getRandom(type);

  ctx.reply(
    text,
    Markup.inlineKeyboard([
      [Markup.button.callback("🔄 Change Caption", `change_${type}`)]
    ])
  );
}

bot.action("cap_romantic", (ctx) => sendCaption(ctx, "romantic"));
bot.action("cap_islamic", (ctx) => sendCaption(ctx, "islamic"));
bot.action("cap_sad", (ctx) => sendCaption(ctx, "sad"));
bot.action("cap_funny", (ctx) => sendCaption(ctx, "funny"));
bot.action("cap_other", (ctx) => sendCaption(ctx, "other"));

bot.action("change_romantic", (ctx) => sendCaption(ctx, "romantic"));
bot.action("change_islamic", (ctx) => sendCaption(ctx, "islamic"));
bot.action("change_sad", (ctx) => sendCaption(ctx, "sad"));
bot.action("change_funny", (ctx) => sendCaption(ctx, "funny"));
bot.action("change_other", (ctx) => sendCaption(ctx, "other"));

// ================= ERROR =================
bot.catch((err) => {
  console.log("Bot Error:", err);
});

bot.launch();

console.log("🚀 Bot is running...");
