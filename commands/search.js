const Command = require("../structures/Command");

module.exports = new Command({
  commands: ["search"],
  help: "Searches for some coins.",
  category: "Currency",
  expectedArgs: "",
  permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
  permissionError: "You do not have permission to run this command.",
  run: async ({ message, guildCollection }) => {
    const timeout = 2700000;
    let res = await guildCollection.findOne({
      Guild: message.guild.id,
    });
    let obj = res["Users"].find((obj) => obj.userID == message.author.id);
    if (
      obj.timers.search !== null &&
      timeout - (Date.now() - obj.timers.search) > 0
    ) {
      const timeLeft = timeout - (Date.now() - obj.timers.search);
      const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
      const seconds = Math.floor((timeLeft / 1000) % 60);
      return message.reply(
        `You need to wait ${minutes} minute(s) and ${seconds} second(s) before searching again.`
      );
    } else {
      const defaultLocations = [
        {
          name: "car",
          places: [
            "above the steering wheel",
            "under the seat",
            "on the roof of the car",
            "outside the window",
            "attached to the windshield",
            "inside the tire",
          ],
        },
        {
          name: "bathroom",
          places: [
            "on the bathtub",
            "inside the toothpaste",
            "under the toilet",
            "behind the mirror",
            "inside the shower drain",
          ],
        },
        {
          name: "park",
          places: [
            "under a duck",
            "on the grass",
            "inside an old tree",
            "behind the fence",
            "underwater",
            "floating on the lake",
          ],
        },
        {
          name: "truck",
          places: [
            "above the steering wheel",
            "under the seat",
            "on the roof of the truck",
            "outside the window",
            "attached to the windshield",
            "inside the tire",
          ],
        },
        {
          name: "pocket",
          places: [
            "glued to a bubblegum",
            "inside your wallet",
            "merged to the pocket's cloth",
          ],
        },
        {
          name: "computer",
          places: [
            "inside the hardrive",
            "attached to the fan",
            "under your keyboard",
            "below your CPU",
            "on top of the PC case",
            "inside the power supply",
          ],
        },
        {
          name: "computer",
          places: [
            "inside the hardrive",
            "attached to the fan",
            "under your keyboard",
            "below your CPU",
            "on top of the PC case",
            "inside the power supply",
          ],
        },
      ];

      const chosenLocations = defaultLocations
        .sort(() => Math.random() - Math.random())
        .slice(0, 3);

      const filter = ({ author, content }) =>
        message.author == author &&
        chosenLocations.some(
          (location) => location.name.toLowerCase() === content.toLowerCase()
        );

      const collector = message.channel.createMessageCollector({
        filter,
        max: 1,
        time: 25000,
      });

      const earnings = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;

      collector.on("collect", async (m) => {
        const location = defaultLocations.find(
          (local) => local.name.toLowerCase() == m.content.toLowerCase()
        );

        message.reply(
          `You found **${earnings} coins** ${
            location.places[Math.floor(Math.random() * location.places.length)]
          }.`
        );

        await guildCollection.findOneAndUpdate(
          {
            Guild: message.guild.id,
            "Users.userID": message.author.id,
          },
          {
            $inc: {
              "Users.$.coins": earnings,
            },
            $set: {
              "Users.$.timers.search": Date.now(),
            },
          }
        );
      });

      collector.on("end", (collected, reason) => {
        if (reason == "time") {
          message.reply("You ran out of time!");
        }
      });

      chosenLocationNames = chosenLocations.map((l) => l.name);

      message.reply(
        `Which location would you like to search?\n Type the location in this channel\n \`${chosenLocationNames.join(
          "` `"
        )}\``
      );
    }
  },
});
