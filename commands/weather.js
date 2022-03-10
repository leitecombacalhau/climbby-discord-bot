const weather = require("weather-js");
const { MessageEmbed } = require("discord.js");
const Command = require("../structures/Command");

module.exports = new Command({
  commands: ["weather"],
  help: "Returns information about the weather of the location.",
  category: "Misc",
  expectedArgs: "<location>",
  permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS"],
  permissionError: "You do not have permission to run this command.",
  run: async ({ message, args }) => {
    const local = args[1];
    weather.find({ search: local, degreeType: "C" }, function (error, result) {
      if (!local) {
        const errorEmbed = new MessageEmbed()
          .setDescription("Please specify a location.")
          .setColor("RANDOM");
        return message.channel.send({ embeds: [errorEmbed] });
      }
      if (error) return console.log(error);

      if (result === undefined || result.lenght === 0)
        return message.channel.send({ content: "Invalid Location :x:" });
      var current = result[0].current;
      var location = result[0].location;

      const weatherInfo = new MessageEmbed()
        .setDescription(`**${current.skytext}**`)
        .setAuthor({ name: `Weather Report For ${current.observationpoint}` })
        .setImage(current.imageUrl)
        .setColor("RANDOM")
        .addField("Timezone", `UTC${location.timezone}`, true)
        .addField("Degree Type", "Celcius", true)
        .addField("Temperature", `${current.temperature}`, true)
        .addField("Wind", `${current.winddisplay}`, true)
        .addField("Feels Like", `${current.feelslike}`, true)
        .addField("Humidity", `${current.humidity}`, true)
        .setFooter({
          text: "Data is being provided from weather.service.msn.com, if the data is wrong, please report them and not the bot developer",
        });

      message.channel.send({ embeds: [weatherInfo] });
    });
  },
});
