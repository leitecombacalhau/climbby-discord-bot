const { MessageEmbed } = require("discord.js");
const Command = require("../structures/Command");

module.exports = new Command({
  commands: ["coinflip"],
  help: "Flips a coin!",
  category: "Fun",
  expectedArgs: "",
  permissions: ["EMBED_LINKS", "SEND_MESSAGES"],
  permissionError: "You do not have permission to run this command.",
  run: async ({ message }) => {
    const choices = ["Heads", "Tails"];
    const choice = choices[Math.floor(Math.random() * choices.length)];
    if (choice === "Tails") {
      let embed = new MessageEmbed()
        .setTitle("Coinflip!")
        .setImage(`https://i.imgur.com/IkfEo01.png`)
        .setDescription(`${message.author.username} flipped **${choice}**!`);
      message.channel.send({ embeds: [embed] });
    } else if (choice === "Heads") {
      let embed = new MessageEmbed()
        .setTitle("Coinflip!")
        .setImage(`https://i.imgur.com/oouXp6F.png`)
        .setDescription(`${message.author.username} flipped **${choice}**!`);
      message.channel.send({ embeds: [embed] });
    }
  },
});
