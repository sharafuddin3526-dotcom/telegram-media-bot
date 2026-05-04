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
      "тЬЕ Welcome!\n\nЁЯЗзЁЯЗй ржмрж╛ржВрж▓рж╛рзЯ:\nржЖржкржирж┐ ржПржЦржи ржмржЯ ржмрзНржпржмрж╣рж╛рж░ ржХрж░рждрзЗ ржкрж╛рж░ржмрзЗржиред\nTikTok ржнрж┐ржбрж┐ржУ ржбрж╛ржЙржирж▓рзЛржб ржХрж░рждрзЗ ржнрж┐ржбрж┐ржУ рж▓рж┐ржВржХ ржкрж╛ржарж╛ржи ЁЯУе\n\nЁЯЗмЁЯЗз English:\nYou can now use the bot. Send a TikTok link to download video ЁЯУе"
    );
  }

  return ctx.reply(
    "ЁЯСЛ Welcome!\n\nPlease join our channels to use the bot:",
    Markup.inlineKeyboard([
      [Markup.button.url("ЁЯМН Global Channel", "https://t.me/Global_Method_Channel")],
      [Markup.button.url("ЁЯЖШ Support Owner", "https://t.me/Smart_Method_Owner")],
      [Markup.button.callback("тЬЕ I Joined", "joined_check")]
    ])
  );
});

// JOIN CHECK
bot.action("joined_check", async (ctx) => {
  const id = ctx.from.id;
  users.set(id, "joined");

  return ctx.reply(
    "тЬЕ Welcome!\n\nЁЯЗзЁЯЗй ржмрж╛ржВрж▓рж╛рзЯ:\nржЖржкржирж┐ ржПржЦржи ржмржЯ ржмрзНржпржмрж╣рж╛рж░ ржХрж░рждрзЗ ржкрж╛рж░ржмрзЗржиред\nTikTok ржнрж┐ржбрж┐ржУ ржбрж╛ржЙржирж▓рзЛржб ржХрж░рждрзЗ ржнрж┐ржбрж┐ржУ рж▓рж┐ржВржХ ржкрж╛ржарж╛ржи ЁЯУй\n\nЁЯЗмЁЯЗз English:\nYou can now use the bot. Send a TikTok link to download video ЁЯУе"
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
    return ctx.reply("тЭМ Please join first and click I Joined button!");
  }

  if (!url.includes("tiktok.com")) {
    return ctx.reply("тЭМ Please send a valid TikTok link!");
  }

  ctx.reply("тП│ Downloading TikTok video...");

  const data = await getVideo(url);

  if (!data || !data.video) {
    return ctx.reply("тЭМ Failed to download video!");
  }

  // save for mp3
  userVideos.set(id, data);

  return ctx.replyWithVideo(
    { url: data.video },
    {
      caption:
        "ЁЯУе Download Completed Successfully!\nЁЯОм Your video is ready to watch and save.\n\nЁЯОз Want only the audio (MP3)?\nTap the ЁЯЯв Need MP3 button below to download music.",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "ЁЯУй Support ID тЬЕ", url: "https://t.me/Smart_Method_Owner" }
          ],
          [
            {
              text: "ЁЯСе Support Team",
              url: "https://www.tiktok.com/@mdraju_3m?_r=1&_t=ZS-965HVsM1mte"
            }
          ],
          [
            { text: "ЁЯЯв Need MP3", callback_data: "get_mp3" }
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
    return ctx.reply("тЭМ No audio found! Send video again.");
  }

  try {
    return ctx.replyWithAudio(
      { url: data.audio },
      {
        caption: "ЁЯОз MP3 Downloaded Successfully!"
      }
    );
  } catch (e) {
    return ctx.reply("тЭМ Failed to send MP3!");
  }
});

// ERROR
bot.catch((err) => {
  console.log("Bot Error:", err);
});

bot.launch();

console.log("ЁЯЪА Bot is running...");
