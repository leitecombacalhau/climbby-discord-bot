const { MessageEmbed } = require("discord.js");
const fetch = require("snekfetch");
const Command = require("../structures/Command");

module.exports = new Command({
  commands: ["animalfact"],
  help: "Returns a fact + an image about the mentioned animal.",
  category: "Misc",
  expectedArgs: "<animal>",
  permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS"],
  permissionError: "You do not have permission to run this command.",
  run: async ({ message, args }) => {
    var animal = args[1];

    var approved = false;

    var animalAPI = "";

    const animals = [
      "Dog",
      "Cat",
      "Panda",
      "Fox",
      "Koala",
      "Bird",
      "Raccoon",
      "Kangaroo",
      "Redpanda",
    ];

    if (!animal)
      return message.channel.send({
        content: `${message.author}, you need to define the animal you want to get the fact of. Here\'s the list of the available animals:\`\`\`\nDog\nCat\nPanda\nFox\nRed panda\nKoala\nBird\nRaccoon\nKangaroo\`\`\``,
      });

    for (let i of animals) {
      if (animal.toLowerCase() === i.toLowerCase()) {
        approved = true;
        break;
      } else {
        approved = false;
      }
    }

    if (!approved) {
      message.channel.send({
        content: `${message.author}, the animal provided isn\'t valid. Here\'s the list of the available animals:\`\`\`\nDog\nCat\nPanda\nFox\nRed panda\nKoala\nBird\nRaccoon\nKangaroo\`\`\``,
      });
    } else {
      if (animal === "Redpanda".toLowerCase()) {
        animalAPI = "red_panda";
      } else {
        animalAPI = animal;
      }

      const url = `https://some-random-api.ml/animal/${animalAPI}`;

      const foo = animal.charAt(0).toUpperCase();
      const bar = animal.slice(1).toLowerCase();
      animal = foo + bar;

      fetch
        .get(url)
        .then((data) => data.body)
        .then((json) => {
          console.log(json);
          const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(animal)
            .setDescription(`Fact: ${json.fact}`)
            .setImage(json.image);

          message.channel.send({ embeds: [embed] });
        });
    }
  },
});
