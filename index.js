const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");
const config = require("./config");

const bot = new Telegraf(config.BOT_TOKEN);

// memory
const users = new Map();
const userVideos = new Map();

/* ================= START ================= */
bot.start(async (ctx) => {
  const id = ctx.from.id;

  if (users.get(id) === "joined") {
    return ctx.reply(
      "✅ Welcome!\n\n🇧🇩 বাংলায়:\nআপনি এখন বট ব্যবহার করতে পারবেন।\nTikTok ভিডিও ডাউনলোড করতে ভিডিও লিংক পাঠান 📩 /caption\n\n🇬🇧 English:\nYou can now use the bot. Send a TikTok link to download video 📩 /caption"
    );
  }

  return ctx.reply(
    "👋 Welcome!\n\nPlease join our channels:",
    Markup.inlineKeyboard([
      [Markup.button.url("🌍 Global Channel", "https://t.me/Global_Method_Channel")],
      [Markup.button.url("🆘 Support Owner", "https://t.me/Smart_Method_Owner")],
      [Markup.button.callback("✅ I Joined", "joined_check")]
    ])
  );
});

/* ================= JOIN ================= */
bot.action("joined_check", (ctx) => {
  users.set(ctx.from.id, "joined");

  return ctx.reply(
    "✅ Joined Successfully!\n\n🇧🇩 আপনি এখন বট ব্যবহার করতে পারবেন /caption\n🇬🇧 You can now use the bot\n\nSend TikTok link 📩"
  );
});

/* ================= TIKTOK API ================= */
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
  } catch (e) {
    console.log(e.message);
    return null;
  }
}

/* ================= VIDEO HANDLER ================= */
bot.on("text", async (ctx) => {
  const id = ctx.from.id;
  const text = ctx.message.text;

  if (text.startsWith("/")) return; // IMPORTANT FIX

  if (users.get(id) !== "joined") {
    return ctx.reply("❌ Please join first!");
  }

  if (!text.includes("tiktok.com")) {
    return ctx.reply("❌ Send valid TikTok link!");
  }

  ctx.reply("⏳ Downloading...");

  const data = await getVideo(text);

  if (!data) {
    return ctx.reply("❌ Failed!");
  }

  userVideos.set(id, data);

  return ctx.replyWithVideo(
    { url: data.video },
    {
      caption:
        "📥 Download Completed Successfully!\n🎬 Ready to save\n🎧 Need MP3? click button",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📩 Support", url: "https://t.me/Smart_Method_Owner" }],
          [{ text: "🟢 MP3", callback_data: "mp3" }]
        ]
      }
    }
  );
});

/* ================= MP3 ================= */
bot.action("mp3", (ctx) => {
  const data = userVideos.get(ctx.from.id);

  if (!data?.audio) {
    return ctx.reply("❌ No audio found");
  }

  return ctx.replyWithAudio({ url: data.audio });
});

/* ================= CAPTION LIBRARY (20x EACH) ================= */

const captions = {
  romantic: [
    "তুমি আমার ভালোবাসা ❤️ #Love",
    "তুমি ছাড়া কিছুই না 💖 #Romantic",
    "তুমি আমার পৃথিবী 🌍 #Couple",
    "তোমাকে ছাড়া অসম্পূর্ণ 😍 #Heart",
    "তুমি আমার হাসির কারণ 😊 #Love",
    "ভালোবাসা মানে তুমি ❤️",
    "তুমি আমার স্বপ্ন 💭",
    "তোমায় ছাড়া কিছুই ভালো লাগে না 💕",
    "তুমি আমার শান্তি 🌸",
    "আমার সবকিছু তুমি 💞",
    "Forever with you 💑",
    "You are my life ❤️",
    "My heart beats for you 💓",
    "Love you endlessly 💘",
    "You complete me 💍",
    "Only you ❤️",
    "My soulmate 💖",
    "Together forever 💞",
    "Pure love ❤️",
    "You + Me = ❤️"
  ],

  islamic: [
    "আল্লাহই যথেষ্ট 🤍",
    "সব আল্লাহর ইচ্ছা ✨",
    "ধৈর্য ধরো 🌙",
    "দোয়া কখনো ব্যর্থ নয় 🤲",
    "আল্লাহর উপর ভরসা 💖",
    "Sabr is beautiful 🌙",
    "Allah knows best 🤍",
    "Trust Allah ✨",
    "Stay patient 🤲",
    "Faith over fear 💖",
    "আল্লাহর রহমত অসীম",
    "দোয়া করো 🤲",
    "ইনশাআল্লাহ ✨",
    "আলহামদুলিল্লাহ 🤍",
    "সবর করো 🌙",
    "আল্লাহ সব দেখেন 👀",
    "Faith is power 💖",
    "Jannah awaits 🌙",
    "Stay blessed 🤲",
    "Remember Allah 🤍"
  ],

  sad: [
    "কষ্ট লুকানো হাসি 💔",
    "সবাই পাশে নেই 😔",
    "একাকীত্ব কষ্ট দেয় 💔",
    "ভালোবাসা ব্যথা দেয় 😢",
    "হারিয়ে যাওয়া অনুভূতি 💔",
    "Broken inside 😢",
    "Nobody cares 💔",
    "Pain is real 😔",
    "Silent tears 😢",
    "Lost feelings 💔",
    "I am alone 💔",
    "Heart broken 💔",
    "No happiness 😢",
    "Empty soul 💔",
    "Sad life 😔",
    "Pain never ends 💔",
    "Crying inside 😢",
    "Broken trust 💔",
    "Alone forever 😔",
    "No one understands 💔"
  ],

  funny: [
    "জীবনটা মজা 😂",
    "আমি আর আমার লাক 🤣",
    "হাসতে থাকো 😆",
    "মাথা গরম 🤪",
    "LOL জীবন 😂",
    "Funny mood 😆",
    "Crazy life 🤣",
    "No tension 😂",
    "Just joke 😆",
    "Haha 😂",
    "Life = meme 🤣",
    "Fun mode 😆",
    "Too funny 😂",
    "Laugh loud 🤣",
    "Crazy brain 🤪",
    "No sense 😂",
    "Funny me 😆",
    "Jokes only 🤣",
    "Haha world 😂",
    "Enjoy life 😆"
  ],

  other: [
    "Just vibes ✨",
    "Stay strong 💪",
    "Keep going 🚀",
    "Dream big 🌟",
    "No limits 🔥",
    "Be real 💯",
    "Chill 😎",
    "Focus 🎯",
    "Motivation ⚡",
    "Life goes on 🌍",
    "Stay positive 😊",
    "Never stop 🚀",
    "Work hard 💪",
    "Believe ✨",
    "Success 🔥",
    "Energy ⚡",
    "Smile 😊",
    "Peace ✌️",
    "Rise up 🚀",
    "Keep fighting 💪"
  ]
};

function getRandom(type) {
  const list = captions[type];
  return list[Math.floor(Math.random() * list.length)];
}

/* ================= CAPTION COMMAND FIX ================= */
bot.command("caption", (ctx) => {
  return ctx.reply(
    "✨ Please Select Category ✨",
    Markup.inlineKeyboard([
      [Markup.button.callback("❤️ Romantic", "cap_romantic")],
      [Markup.button.callback("🕌 Islamic", "cap_islamic")],
      [Markup.button.callback("💔 Sad", "cap_sad")],
      [Markup.button.callback("😂 Funny", "cap_funny")],
      [Markup.button.callback("🔥 Other", "cap_other")]
    ])
  );
});

/* ================= CAPTION ACTION ================= */
function send(ctx, type) {
  return ctx.reply(
    getRandom(type),
    Markup.inlineKeyboard([
      [Markup.button.callback("🔄 Change", `change_${type}`)]
    ])
  );
}

bot.action("cap_romantic", (ctx) => send(ctx, "romantic"));
bot.action("cap_islamic", (ctx) => send(ctx, "islamic"));
bot.action("cap_sad", (ctx) => send(ctx, "sad"));
bot.action("cap_funny", (ctx) => send(ctx, "funny"));
bot.action("cap_other", (ctx) => send(ctx, "other"));

bot.action("change_romantic", (ctx) => send(ctx, "romantic"));
bot.action("change_islamic", (ctx) => send(ctx, "islamic"));
bot.action("change_sad", (ctx) => send(ctx, "sad"));
bot.action("change_funny", (ctx) => send(ctx, "funny"));
bot.action("change_other", (ctx) => send(ctx, "other"));

/* ================= ERROR ================= */
bot.catch((e) => console.log(e));

bot.launch();
console.log("🚀 Bot Running...");
