const Command = require("../structures/Command");

module.exports = new Command({
  commands: ["reverse"],
  help: "Reverses a desired string.",
  category: "Fun",
  expectedArgs: "<string>",
  permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
  permissionError: "You do not have permission to run this command.",
  run: async ({ message, args }) => {
    let text = args[1];

    if (!text) return message.reply("Please give something to reverse!");
    let result = text.split("").reverse().join("");
    message.channel.send({ content: result });
  },
});
