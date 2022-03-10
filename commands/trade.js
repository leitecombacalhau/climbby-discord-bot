const { MessageEmbed } = require("discord.js");
const Command = require("../structures/Command.js");

module.exports = new Command({
  commands: ["trade", "deal"],
  help: "Trade some coins with a user!",
  expectedArgs: "<@user> <your offer> <user's offer>",
  category: "Currency",
  permissionError: "You do not have permission to run this command.",
  permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS"],
  run: async ({ message, args, prefix, guildCollection }) => {
    let mentionedMember = message.mentions.members.first();

    if (!mentionedMember) return message.reply("Please mentione someone.");

    args.shift();

    let filteredArgs = args.filter(
      (e) => !e.includes(`<@!${mentionedMember.user.id}>`) && !isNaN(e)
    );

    if (filteredArgs.length !== 2)
      return message.reply(
        `Incorrect syntax. Try \`${prefix}trade <@user> <your offer> <user's offer>\``
      );

    let res = await guildCollection.findOne({ Guild: message.guild.id });

    let mentionedMembersBalance = res["Users"].find(
      (member) => member.userID === mentionedMember.user.id
    );

    const membersBalance = res["Users"].find(
      (member) => member.userID === message.author.id
    );

    if (!mentionedMembersBalance || mentionedMembersBalance === undefined) {
      let newUser = await guildCollection.findOneAndUpdate(
        { Guild: message.guild.id },
        {
          $push: {
            Users: {
              userID: mentionedMember.user.id,
              coins: 1000,
              bank: 0,
              timers: { beg: null, search: null },
            },
          },
        },
        { returnOriginal: false }
      );

      mentionedMembersBalance = newUser["Users"].find(
        (member) => member.userID === mentionedMember.user.id
      );
    }

    if (membersBalance.coins < filteredArgs[0])
      return message.reply("You can't offer more than you have.");
    if (mentionedMembersBalance.coins < filteredArgs[1])
      return message.reply(
        `${mentionedMember} doesn't have **${filteredArgs[1]} coins**.`
      );
    const tradeEmbed = new MessageEmbed()
      .setAuthor({ name: "TRADE" })
      .setColor("YELLOW")
      .setTitle("React to confirm!")
      .setDescription(`${message.author}\n${mentionedMember}`);

    const embedMessage = await message.channel.send({ embeds: [tradeEmbed] });
    await embedMessage.react("✅");
    await embedMessage.react("❌");

    const reactionFilter = (reaction, user) => {
      return (
        ["✅", "❌"].includes(reaction.emoji.name) &&
        [message.author.id, mentionedMember.user.id].includes(user.id)
      );
    };

    const collector = embedMessage.createReactionCollector({
      filter: reactionFilter,
      time: 30000,
    });

    const response = [];

    collector.on("collect", async (reaction, user) => {
      if (reaction.emoji.name === "❌") {
        message.channel.send(`The trade has been refused by ${user}`);
        return collector.stop();
      }
      if (user.id === message.author.id) {
        response.push(reaction.emoji.name);
      } else if (user.id === mentionedMember.user.id) {
        response.push(reaction.emoji.name);
      }

      if (response.length === 2) {
        try {
          await guildCollection.findOneAndUpdate(
            {
              Guild: message.guild.id,
              "Users.userID": mentionedMember.user.id,
            },
            {
              $inc: {
                "Users.$.coins":
                  Number(filteredArgs[0]) - Number(filteredArgs[1]),
              },
            },
            { returnOriginal: false }
          );
          await guildCollection.findOneAndUpdate(
            {
              Guild: message.guild.id,
              "Users.userID": message.author.id,
            },
            {
              $inc: {
                "Users.$.coins":
                  Number(filteredArgs[1]) - Number(filteredArgs[0]),
              },
            },
            { returnOriginal: false }
          );
          collector.stop();
          return message.channel.send(
            "Trade done sucessfully! Check your balances!"
          );
        } catch (error) {
          message.reply(
            `There was an error while performing the trade: \`${error}\``
          );
          throw error;
        }
      }
    });

    collector.on("end", (collected, reason) => {
      if (reason === "time") {
        if (response[0] === undefined) {
          return message.channel.send(
            `${message.author} didn't react in time.`
          );
        } else {
          return message.channel.send(
            `${mentionedMember} didn't react in time.`
          );
        }
      }
    });
  },
});
