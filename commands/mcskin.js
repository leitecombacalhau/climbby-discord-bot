const { MessageEmbed } = require("discord.js");
const Command = require("../structures/Command");

module.exports = new Command({
  commands: ["mcskin"],
  help: "Returns the username's minecraft skin.",
  category: "Fun",
  expectedArgs: "<username>",
  permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS"],
  permissionError: "You do not have permission to run this command.",
  run: async ({ client, message, args }) => {
    if (!args[1])
      return message.reply({
        content: "Please provide a username to get the skin's avatar from.",
      });

    const body = `https://mc-heads.net/body/${args[1]}/256.png`;
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setImage(body)
      .setDescription(`${args[1]}'s skin - [[Download]](https://mc-heads.net/download/${args[1]})`)
      .setFooter({
        text: `©️ ${client.user.username}`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
});
