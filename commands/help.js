const {
  MessageEmbed,
  MessageSelectMenu,
  MessageActionRow,
} = require("discord.js");

const Command = require("../structures/Command");

module.exports = new Command({
  commands: ["help", "h"],
  help: "Returns the description of a given command, or the list of available commands.",
  category: "",
  expectedArgs: "[cmd]",
  permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS"],
  permissionError: "You do not have permission to run this command.",
  run: async ({ client, message, args, prefix }) => {
    args.shift();

    if (args[0]) {
      const command = client.commands.find((cmd) =>
        cmd.commands.includes(args[0].toLowerCase())
      );

      if (!command) {
        return message.reply("That command isn't valid or doesn't exist.");
      }

      const aliases = command.commands.filter(
        (cmd) => cmd.toLowerCase() !== args[0].toLowerCase()
      );

      const embed = new MessageEmbed()
        .setTitle(args[0].toUpperCase())
        .setFooter({ text: "<required> [optional] |or|" })
        .setColor("YELLOW");

      if (command.help) embed.addField("Description", command.help, false);
      if (aliases.length > 0)
        embed.addField("Aliases", aliases.join(", "), false);

      embed.addField(
        "Usage",
        `\`${prefix}${command.commands[0]}${
          command.expectedArgs === "" ? "`" : ` ${command.expectedArgs}\``
        }`,
        false
      );

      message.channel.send({ embeds: [embed] });
    } else {
      const menuEmbed = new MessageEmbed()
        .setColor("YELLOW")
        .setAuthor({
          name: `COMMANDS • ${client.user.username}`,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setTitle(`The prefix is \`${prefix}\``)
        .setDescription(
          `**Hello ${message.author} to see what commands are available please select a category from the dropdown menu below:**`
        );

      const funEmbed = new MessageEmbed()
        .setColor("YELLOW")
        .setFooter({ text: "<required> [optional] |or|" })
        .setTitle(`The prefix is \`${prefix}\``);

      const miscEmbed = new MessageEmbed()
        .setColor("YELLOW")
        .setFooter({ text: "<required> [optional] |or|" })
        .setTitle(`The prefix is \`${prefix}\``);

      const modEmbed = new MessageEmbed()
        .setColor("YELLOW")
        .setFooter({ text: "<required> [optional] |or|" })
        .setTitle(`The prefix is \`${prefix}\``);

      const currencyEmbed = new MessageEmbed()
        .setColor("YELLOW")
        .setFooter({ text: "<required> [optional] |or|" })
        .setTitle(`The prefix is \`${prefix}\``);

      const cmdAmount = {
        fun: 0,
        misc: 0,
        mod: 0,
        currency: 0,
      };

      let funEmbedDesc = `For a detailed description of the command try \`${prefix}help [command]\`\n`;
      let miscEmbedDesc = `For a detailed description of the command try \`${prefix}help [command]\`\n`;
      let modEmbedDesc = `For a detailed description of the command try \`${prefix}help [command]\`\n`;
      let currencyEmbedDesc = `For a detailed description of the command try \`${prefix}help [command]\`\n`;

      client.commands.forEach((cmd) => {
        if (cmd.category === undefined) return;
        if (cmd.category.toLowerCase() === "fun") {
          funEmbedDesc = funEmbedDesc.concat(
            `\n**${prefix}${cmd.commands[0]}** ${
              cmd.expectedArgs === "" ? "" : "`" + cmd.expectedArgs + "`"
            }`
          );
          cmdAmount.fun++;
        } else if (
          cmd.category.toLowerCase() === "misc" ||
          cmd.category.toLowerCase() === "miscellaneous"
        ) {
          miscEmbedDesc = miscEmbedDesc.concat(
            `\n**${prefix}${cmd.commands[0]}** ${
              cmd.expectedArgs === "" ? "" : "`" + cmd.expectedArgs + "`"
            }`
          );
          cmdAmount.misc++;
        } else if (
          cmd.category.toLowerCase() === "mod" ||
          cmd.category.toLowerCase() === "moderation"
        ) {
          modEmbedDesc = modEmbedDesc.concat(
            `\n**${prefix}${cmd.commands[0]}** ${
              cmd.expectedArgs === "" ? "" : "`" + cmd.expectedArgs + "`"
            }`
          );
          cmdAmount.mod++;
        } else if (cmd.category.toLowerCase() === "currency") {
          currencyEmbedDesc = currencyEmbedDesc.concat(
            `\n**${prefix}${cmd.commands[0]}** ${
              cmd.expectedArgs === "" ? "" : "`" + cmd.expectedArgs + "`"
            }`
          );
          cmdAmount.currency++;
        }
      });

      funEmbed.setDescription(funEmbedDesc).setAuthor({
        name: `FUN COMMANDS • (${cmdAmount.fun})`,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });
      miscEmbed.setDescription(miscEmbedDesc).setAuthor({
        name: `MISC COMMANDS • (${cmdAmount.misc})`,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });
      modEmbed.setDescription(modEmbedDesc).setAuthor({
        name: `MOD COMMANDS • (${cmdAmount.mod})`,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });
      currencyEmbed.setDescription(currencyEmbedDesc).setAuthor({
        name: `CURRENCY COMMANDS • (${cmdAmount.currency})`,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

      const menu = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("menu")
          .setPlaceholder("Select a category")
          .addOptions([
            {
              label: "Menu",
              description: "Return to the home menu",
              emoji: "👋",
              value: "menu",
            },
            {
              label: "Fun",
              description: "See the fun commands",
              emoji: "😄",
              value: "fun",
            },
            {
              label: "Misc",
              description: "See the miscellaneous commands",
              emoji: "✨",
              value: "misc",
            },
            {
              label: "Moderation",
              description: "See the mod commands",
              emoji: "🛠️",
              value: "mod",
            },
            {
              label: "Currency",
              description: "See the currency commands",
              emoji: "💸",
              value: "currency",
            },
          ])
      );
      message.reply({ embeds: [menuEmbed], components: [menu] }).then((msg) => {
        const filter = (interaction) => interaction.isSelectMenu();

        const collector = msg.createMessageComponentCollector({
          filter,
        });

        collector.on("collect", async (collected) => {
          const value = collected.values[0];
          collected.deferUpdate();

          if (value === "menu") {
            msg.edit({ embeds: [menuEmbed], components: [menu] });
          } else if (value === "fun") {
            msg.edit({ embeds: [funEmbed], components: [menu] });
          } else if (value === "misc") {
            msg.edit({ embeds: [miscEmbed], components: [menu] });
          } else if (value === "mod") {
            msg.edit({ embeds: [modEmbed], components: [menu] });
          } else if (value === "currency") {
            msg.edit({ embeds: [currencyEmbed], components: [menu] });
          }
        });
      });
    }
  },
});
