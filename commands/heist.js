const Command = require("../structures/Command");

const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = new Command({
  commands: ["heist", "robbank", "rob"],
  help: "Bring some friends and rob some bank accounts (or get caught)!",
  category: "Currency",
  expectedArgs: "<@user>",
  permissionError: "You do not have permission to run this command.",
  permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS"],
  run: async ({ message, guildCollection }) => {
    let mentionedMember = message.mentions.members.first();

    if (!mentionedMember)
      return message.reply("Wait! Who are we going to rob?");
    if (mentionedMember.user.bot)
      return message.reply("You can't rob robots, dumb!");
    if (mentionedMember.user.id === message.author.id)
      return message.reply("You can't rob yourself!");

    const joinButton = new MessageButton()
      .setCustomId("join")
      .setLabel("JOIN THE HEIST!")
      .setEmoji("💰")
      .setStyle("SUCCESS");

    const row = new MessageActionRow().addComponents(joinButton);

    let blackList = [];

    const maxMembers = 10;

    const friendsEmbed = new MessageEmbed()
      .setAuthor({ name: "HEIST" })
      .setColor("YELLOW")
      .setTitle("Click on the button to join the heist!")
      .setDescription(
        "`You have`**`60 seconds`**`to join! After`**`1 minute`**`or when the member limit is met, the heist will start automaticaly.`"
      )
      .setFooter({
        text: `NOTE: Once you join the heist there's no going back • ${blackList.length}/${maxMembers} members`,
      });

    const embedMessage = await message.reply({
      embeds: [friendsEmbed],
      components: [row],
    });

    const filter = (interaction) => interaction.customId === "join";

    const collector = embedMessage.createMessageComponentCollector({
      filter,
      max: maxMembers,
      time: 30000,
    });

    collector.on("collect", (interaction) => {
      if (blackList.includes(interaction.user.id))
        return interaction.reply({
          content: "You've already join the heist!",
          ephemeral: true,
        });

      if (interaction.user.id === mentionedMember.user.id)
        return interaction.reply({
          content:
            "Hmm... Why would contribute to an heist targetting your bank?",
          ephemeral: true,
        });

      interaction.reply({
        content: "You successfully joined the heist!",
        ephemeral: true,
      });

      blackList.push(interaction.user.id);
      friendsEmbed.setFooter({
        text: `NOTE: Once you join the heist there's no going back • ${blackList.length}/${maxMembers} members`,
      });
      embedMessage.edit({
        embeds: [friendsEmbed],
        components: [row],
      });
    });

    collector.on("end", async () => {
      row.components[0].setDisabled(true);
      const participantsAmount = blackList.length;
      const gotCaught =
        participantsAmount >= 2
          ? Math.floor(
              Math.random() * (17 - participantsAmount) + participantsAmount
            ) < 11
            ? true
            : false
          : true;

      const newEmbed = new MessageEmbed()
        .setAuthor({ name: "HEIST" })
        .setColor("YELLOW")
        .setTitle(`The heist has ended`)
        .setImage(
          `${
            gotCaught
              ? "https://i.imgur.com/9A50iVU.png"
              : "https://i.imgur.com/ck1DzXS.png"
          }`
        );
      if (participantsAmount < 2)
        newEmbed.setDescription(
          "`The heist was cancelled since less than 2 users joined.`"
        );
      else {
        newEmbed.setFooter({
          text: `${blackList.length} thieves`,
        });
      }
      embedMessage.edit({
        embeds: [newEmbed],
        components: [row],
      });

      if (participantsAmount < 2) return;

      if (gotCaught) {
        const option = Math.floor(Math.random() * (4 - 1) + 1);
        if (option !== 1) {
          const fine = Math.floor(
            (Math.random() * (680 - 200) + 200) / participantsAmount
          );
          message.reply(
            `The assault went wrong! A policeman was killed and you and all your friends got caught! On top of that, each of you got fined **${fine} coins**`
          );
          blackList.forEach(async (id) => {
            await guildCollection.findOneAndUpdate(
              {
                Guild: message.guild.id,
                "Users.userID": id,
              },
              {
                $inc: {
                  "Users.$.coins": -Number(fine),
                },
              },
              { returnOriginal: false }
            );
          });
        } else {
          const withMoney = Math.floor(Math.random() * (4 - 1) + 1);
          if (withMoney === 3) {
            const cash = Math.floor(
              (Math.random() * (1100 - 220) - 220) / participantsAmount
            );
            message.reply(
              `The assault quickly went south! Somehow, you and your friends managed to run away with the money and split equally the cash...`
            );
            blackList.forEach(async (id) => {
              await guildCollection.findOneAndUpdate(
                {
                  Guild: message.guild.id,
                  "Users.userID": id,
                },
                {
                  $inc: {
                    "Users.$.coins": Number(cash),
                  },
                },
                { returnOriginal: false }
              );
            });
            await guildCollection.findOneAndUpdate(
              {
                Guild: message.guild.id,
                "Users.userID": mentionedMember.user.id,
              },
              {
                $inc: {
                  "Users.$.coins": -Number(cash * participantsAmount),
                },
              },
              { returnOriginal: false }
            );
          } else {
            message.reply(
              `The assault quickly went south! Somehow, you and your friends didn't get caught, even though the cash was apprehended by the police.`
            );
          }
        }
      } else {
        const cash = Math.floor(
          (Math.random() * (1100 - 220) - 220) / participantsAmount
        );
        message.reply(
          `The mission was a success! You and your friends returned home with **+${cash} coins** each.`
        );
        blackList.forEach(async (id) => {
          await guildCollection.findOneAndUpdate(
            {
              Guild: message.guild.id,
              "Users.userID": id,
            },
            {
              $inc: {
                "Users.$.coins": Number(cash),
              },
            },
            { returnOriginal: false }
          );
        });
        await guildCollection.findOneAndUpdate(
          {
            Guild: message.guild.id,
            "Users.userID": mentionedMember.user.id,
          },
          {
            $inc: {
              "Users.$.coins": -Number(cash * participantsAmount),
            },
          },
          { returnOriginal: false }
        );
      }
    });
  },
});
