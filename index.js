const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");
const config = require("./config");

const bot = new Telegraf(config.BOT_TOKEN);

// ================= MEMORY =================
const users = new Map();
const userVideos = new Map();

// ================= START =================
bot.start(async (ctx) => {
  const id = ctx.from.id;

  if (users.get(id) === "joined") {
    return ctx.reply(
`✅ Welcome!

🇧🇩 বাংলায়:
আপনি এখন বট ব্যবহার করতে পারবেন।
TikTok ভিডিও ডাউনলোড করতে ভিডিও লিংক পাঠান 📥

🇬🇧 English:
You can now use the bot. Send a TikTok link to download video 📥`
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
`✅ Welcome!

🇧🇩 বাংলায়:
আপনি এখন বট ব্যবহার করতে পারবেন।
TikTok ভিডিও ডাউনলোড করতে ভিডিও লিংক পাঠান 📥

🇬🇧 English:
You can now use the bot. Send a TikTok link to download video 📥`
  );
});

// ================= TIKTOK API =================
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

  if (url.startsWith("/")) return;

  if (users.get(id) !== "joined") {
    return ctx.reply("❌ Please join first!");
  }

  if (!url.includes("tiktok.com")) {
    return ctx.reply("❌ Invalid TikTok link!");
  }

  ctx.reply("⏳ Downloading...");

  const data = await getVideo(url);

  if (!data?.video) {
    return ctx.reply("❌ Failed!");
  }

  userVideos.set(id, data);

  return ctx.replyWithVideo(
    { url: data.video },
    {
      caption:
`📥 Download Completed Successfully!
🎬 Video ready to watch & save.

🎧 Want MP3? Use button below.`,
      reply_markup: {
        inline_keyboard: [
          [{ text: "📩 Support ID", url: "https://t.me/Smart_Method_Owner" }],
          [{ text: "👥 Support Team", url: "https://www.tiktok.com/@mdraju_3m" }],
          [{ text: "🟢 Need MP3", callback_data: "get_mp3" }]
        ]
      }
    }
  );
});

// ================= MP3 =================
bot.action("get_mp3", async (ctx) => {
  const data = userVideos.get(ctx.from.id);

  if (!data?.audio) {
    return ctx.reply("❌ No audio found!");
  }

  return ctx.replyWithAudio(
    { url: data.audio },
    { caption: "🎧 MP3 Ready!" }
  );
});

// ================= CAPTION LIBRARY (20 EACH) =================
const captions = {
  romantic: [
    "তুমি আমার পৃথিবী ❤️ #Love",
    "ভালোবাসা মানে তুমি 💖 #Romantic",
    "তোমার হাসি আমার সুখ 😊 #Couple",
    "তুমি ছাড়া আমি শূন্য 💔 #Love",
    "তুমি আমার সব 💑 #Forever",
    "তুমি থাকলেই ভালো লাগে ❤️ #Relationship",
    "আমার হৃদয় তোমার জন্য 💖 #Heart",
    "চিরকাল তুমি 💕 #LoveStory",
    "তুমি আমার স্বপ্ন 🌹 #Dream",
    "ভালোবাসা অনন্ত ❤️ #TrueLove",
    "তুমি আমার শান্তি 💖 #Peace",
    "একসাথে সব 💑 #Together",
    "তুমি আমার হাসি 😊 #Smile",
    "তুমি আমার জীবন ❤️ #Life",
    "ভালোবাসা গভীর 💕 #DeepLove",
    "তুমি ছাড়া কিছু না 💔 #Empty",
    "তুমি আমার রোদ ☀️ #Sunshine",
    "চিরকাল একসাথে 💑 #Forever",
    "তুমি আমার অনুভব ❤️ #Feelings",
    "তুমি আমার গল্প 📖 #Story"
  ],

  islamic: [
    "আল্লাহই যথেষ্ট 🤍 #Islam",
    "সবর করো 🌙 #Sabr",
    "আল্লাহর উপর ভরসা রাখো 🤲 #Faith",
    "দোয়া কখনো বিফলে যায় না 💖 #Dua",
    "সব কিছু আল্লাহর হাতে 🕌 #Trust",
    "আল্লাহ সাহায্য করবেন 🤍 #Hope",
    "ইমান শক্তি 💖 #Iman",
    "আল্লাহর রহমত অসীম 🌙 #Mercy",
    "সঠিক পথে চলো 🕌 #Deen",
    "ধৈর্য ধরো 🤲 #Patience",
    "আল্লাহ কখনো ছাড়েন না 💖 #Allah",
    "দোয়া করো 🤲 #Prayer",
    "আল্লাহ বড় 🤍 #Great",
    "জীবন আল্লাহর দান 🕌 #Life",
    "ভয় করো না 🤲 #Trust",
    "আল্লাহ আছেন 💖 #Belief",
    "হালাল পথে চলো 🕌 #Halal",
    "আল্লাহর উপর আশা 🤍 #Hope",
    "সবরের ফল মিষ্টি 🌙 #Sabr",
    "দোয়া শক্তি 🤲 #Dua"
  ],

  sad: [
    "হাসির আড়ালে কষ্ট 💔 #Sad",
    "সবাই বদলে যায় 😔 #Alone",
    "মনটা ভেঙে গেছে 💔 #Broken",
    "আমি ঠিক নেই 😢 #Pain",
    "ভালো নেই 💔 #MoodOff",
    "কেউ বোঝে না 😔 #Lonely",
    "কষ্ট লুকানো অভ্যাস 💔 #Painful",
    "ভালোবাসা ব্যথা দেয় 😢 #LoveHurts",
    "একাকীত্ব সত্য 💔 #AloneLife",
    "সব শেষ 😔 #End",
    "হৃদয় ভেঙে গেছে 💔 #HeartBreak",
    "আমি ক্লান্ত 😢 #Tired",
    "সব মিথ্যা 💔 #Fake",
    "কেউ নেই 😔 #Empty",
    "কষ্ট বাস্তব 💔 #Reality",
    "হাসি মিথ্যা 😢 #FakeSmile",
    "আমি একা 💔 #Lonely",
    "সব হারিয়ে গেছে 😔 #Lost",
    "মন খারাপ 💔 #SadMood",
    "ভালো লাগছে না 😢 #Down"
  ],

  funny: [
    "জীবন মজা 😂 #Funny",
    "আমি পাগল 🤪 #Crazy",
    "হাসি থামে না 😂 #LOL",
    "আজ গন্ডগোল 🤣 #Chaos",
    "মজা লাগছে 😂 #Fun",
    "আমি সিরিয়াস না 🤪 #Joke",
    "সবই ফানি 😂 #FunnyLife",
    "হাসতে থাকো 🤣 #Smile",
    "আমি হারিয়ে যাই 😂 #Lost",
    "মাথা নষ্ট 🤪 #CrazyLife",
    "দুনিয়া গোল 😂 #World",
    "হাসি লাগছে 🤣 #LOL",
    "জীবন সহজ না 😂 #Life",
    "আমি স্টুপিড 🤪 #Funny",
    "আজ মজা 😂 #FunDay",
    "হাসির শেষ নেই 🤣 #Laugh",
    "আমি অদ্ভুত 😂 #Weird",
    "সব মজা 🤪 #Enjoy",
    "চিল 😂 #Chill",
    "হাসি দরকার 🤣 #Happy"
  ],

  other: [
    "Just vibes ✨ #Vibes",
    "Stay strong 💪 #Strong",
    "Dream big 🌟 #Goals",
    "Keep going 🚀 #Success",
    "No limits 🔥 #Power",
    "Stay real 💯 #Real",
    "Be yourself 💫 #Unique",
    "Smile 😊 #Happy",
    "Enjoy life 🌿 #Life",
    "Focus 🎯 #Focus",
    "Believe 🌟 #Believe",
    "Work hard ⚡ #HardWork",
    "Chill 😎 #Relax",
    "Positive ✨ #Positive",
    "Energy ⚡ #Energy",
    "Success 🚀 #Win",
    "Motivation 💪 #Motivate",
    "Peace 🌿 #Peace",
    "Love ❤️ #Love",
    "Life 🌍 #Life"
  ]
};

// random
function getRandom(type) {
  const list = captions[type];
  return list[Math.floor(Math.random() * list.length)];
}

// ================= CAPTION COMMAND =================
bot.command("caption", (ctx) => {
  ctx.reply(
    "✨ Select Category",
    Markup.inlineKeyboard([
      [Markup.button.callback("❤️ Romantic", "cap_romantic")],
      [Markup.button.callback("🕌 Islamic", "cap_islamic")],
      [Markup.button.callback("💔 Sad", "cap_sad")],
      [Markup.button.callback("😂 Funny", "cap_funny")],
      [Markup.button.callback("🔥 Other", "cap_other")]
    ])
  );
});

function sendCaption(ctx, type) {
  ctx.reply(
    getRandom(type),
    Markup.inlineKeyboard([
      [Markup.button.callback("🔄 Change", `change_${type}`)]
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

// ================= RUN =================
bot.catch((err) => console.log(err));

bot.launch();
console.log("🚀 Bot Running...");
