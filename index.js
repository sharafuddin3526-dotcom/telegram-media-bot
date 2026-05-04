const { Telegraf } = require("telegraf");
const config = require("./config");

const bot = new Telegraf(config.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply("👋 Bot is running!");
});

bot.launch();

console.log("Bot started...");
