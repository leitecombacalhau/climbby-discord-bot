const { MessageEmbed } = require("discord.js");
const Command = require("../structures/Command");

module.exports = new Command({
  commands: ["bal", "balance", "bl", "coins"],
  help: "Returns message author's balance & bank",
  category: "Currency",
  expectedArgs: "",
  permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS"],
  permissionError: "You do not have permission to run this command.",
  run: async ({ message, guildCollection }) => {
    let res = await guildCollection.findOne({
      Guild: message.guild.id,
    });
    let obj = res["Users"].find((obj) => obj.userID == message.author.id);
    const embed = new MessageEmbed()
      .setTitle(`${message.author.username}'s Balance`)
      .setDescription(`**Coins:** ${obj.coins}\n**Bank:** ${obj.bank}`)
      .setFooter({ text: message.author.tag })
      .setTimestamp()
      .setColor("RANDOM");
    message.channel.send({ embeds: [embed] });
  },
});
