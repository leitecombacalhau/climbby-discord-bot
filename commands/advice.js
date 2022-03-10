const { MessageEmbed } = require("discord.js");
const Command = require("../structures/Command.js");
const fetch = require("node-fetch");

module.exports = new Command({
  commands: ["advice"],
  help: "Returns an advice.",
  category: "Misc",
  expectedArgs: "",
  permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS"],
  permissionError: "You do not have permission to run this command.",
  run: async ({ message }) => {
    const data = await fetch("https://api.adviceslip.com/advice").then((res) =>
      res.json()
    );

    const embed = new MessageEmbed()
      .setDescription(data.slip.advice)
      .setColor("RANDOM");

    message.channel.send({ embeds: [embed] });
  },
});
