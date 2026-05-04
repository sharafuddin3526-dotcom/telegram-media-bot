const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply("👋 Bot is running on GitHub + Railway!");
});

bot.launch();

console.log("Bot started...");
