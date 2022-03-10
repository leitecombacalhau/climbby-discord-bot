const { MessageEmbed } = require("discord.js");

const fs = require("fs");
const Command = require("../structures/Command");

module.exports = new Command({
  commands: ["pokeimg"],
  help: "Returns an image of the mentioned Pokemon, optionally you can type list to get the available Pokemon's list in your DMs.",
  category: "Fun",
  expectedArgs: "<pokemon>|[list]",
  permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS"],
  permissionError: "You do not have permission to run this command.",
  run: async ({ message, args, prefix }) => {
    args.shift();

    var json_data = JSON.parse(fs.readFileSync("./JSONs/pokemon.json", "utf8"));

    if (!args[0])
      return message.reply(`Please mention a Pokemon to get the image of.`);

    var name = args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase();

    if (name.toLowerCase() === "list") {
      await message.react("✅");
      return message.author.send({
        content:
          "Here's the list of the available Pokemons: https://pastebin.com/raw/tzV9nFgr",
      });
    }

    const link = `https://i.some-random-api.ml/pokemon/${name}.png`;

    if (!json_data.includes(name)) {
      message.reply(
        `The Pokemon you defined doesn't exist! Do \`${prefix}pokeimg list\`for the list of the available pokemons.`
      );
    } else {
      const embed = new MessageEmbed()
        .setTitle(`${name}`)
        .setImage(link)
        .setColor("RANDOM");
      message.channel.send({ embeds: [embed] });
    }
  },
});
