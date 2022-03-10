const oneLinerJoke = require("one-liner-joke");
const Command = require("../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = new Command({
  commands: ["joke"],
  help: "Returns a random joke.",
  category: "Fun",
  expectedArgs: "",
  permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS"],
  permissionError: "You do not have permission to run this command.",
  run: async ({ message }) => {
    var joke = oneLinerJoke.getRandomJoke();
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription(joke.body);
    message.channel.send({ embeds: [embed] });
  },
});
