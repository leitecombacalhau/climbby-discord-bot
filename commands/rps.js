const { MessageEmbed } = require("discord.js");
const Command = require("../structures/Command");

module.exports = new Command({
  commands: ["rps", "rockpaperscissors"],
  help: "Rock, Paper, Scissors! Choose by reacting one of the emojis below the message",
  category: "Fun",
  expectedArgs: "",
  permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS"],
  permissionError: "You do not have permission to run this command.",
  run: async ({ message }) => {
    let embed = new MessageEmbed()
      .setTitle("Rock, Paper, Scissors")
      .setDescription("React to play!")
      .setTimestamp();
    let msg = await message.channel.send({ embeds: [embed] });
    try {
      await msg.react("🪨");
      await msg.react("✂️");
      await msg.react("🧻");
    } catch (err) {
      console.log(err);
    }

    const filter = (reaction, user) => {
      return (
        ["🪨", "✂️", "🧻"].includes(reaction.emoji.name) &&
        user.id === message.author.id
      );
    };

    const choices = ["🪨", "✂️", "🧻"];
    const me = choices[Math.floor(Math.random() * choices.length)];
    msg
      .awaitReactions({ filter, max: 1, time: 60000, error: ["time"] })
      .then(async (collected) => {
        const reaction = collected.first();
        let result = new MessageEmbed()
          .setTitle("RESULT")
          .addField("Your choice", `${reaction.emoji.name}`)
          .addField("My choice", `${me}`);
        await msg.edit(result);
        if (
          (me === "🪨" && reaction.emoji.name === "✂️") ||
          (me === "🧻" && reaction.emoji.name === "🪨") ||
          (me === "✂️" && reaction.emoji.name === "🧻")
        ) {
          message.reply("You lost!");
        } else if (me === reaction.emoji.name) {
          return message.reply("It's a tie!");
        } else {
          return message.reply("You won!");
        }
      })
      .catch(() => {
        message.reply(
          "RPS has been cancelled since you did not respond in time!"
        );
      });
  },
});
