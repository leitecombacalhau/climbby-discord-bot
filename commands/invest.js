const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  Interaction,
  InteractionCollector,
} = require("discord.js");
const Command = require("../structures/Command");

module.exports = new Command({
  commands: ["invest", "crypto"],
  help: "Wanna earn some quick (dangerous) money?",
  category: "Currency",
  expectedArgs: "",
  permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS"],
  permissionError: "You do not have permission to run this command.",
  run: async ({ client, message, args }) => {
    const availableCryptos = [
      { name: "Dogecoin", emoji: "<:dogecoin:951573616208797787>" },
      { name: "Solana", emoji: "<:solana:951573616154263612>" },
      { name: "Ethereum", emoji: "<:ethereum:951573616263303168>" },
      { name: "Bitcoin", emoji: "<:bitcoin:951573616607264768>" },
    ];

    const buttons = availableCryptos.map(({ name, emoji }) =>
      new MessageButton()
        .setEmoji(emoji)
        .setStyle("PRIMARY")
        .setCustomId(name.toLowerCase())
    );

    const rows = [new MessageActionRow().addComponents(buttons)];

    const choiceEmbed = new MessageEmbed()
      .setAuthor({ name: "Invest" })
      .setColor("YELLOW")
      .setTitle("Start by choosing the desired currency")
      .setDescription(
        availableCryptos.reduce(
          (total, { name, emoji }) =>
            emoji.concat(
              " **",
              name,
              `** ([price](https://coinmarketcap.com/currencies/${name.toLowerCase()}/))\n\n`,
              total
            ),
          ""
        )
      )
      .setFooter({
        text: "Note: the higher the price of the currency, the more coins you receive and the higher the risk",
      });

    const response = await message.reply({
      embeds: [choiceEmbed],
      components: rows,
    });

    const filter = (interaction) => interaction.member.id === message.author.id;

    /**
     * @type {InteractionCollector}
     */
    const collector = response.createMessageComponentCollector({
      filter,
      max: 1,
      time: 30000,
    });

    collector.on(
      "collect",
      /**
       * @param {Interaction} interaction
       */ (interaction) => {
        rows.forEach((row) =>
          row.components.forEach((button) =>
            button.setDisabled(!button.disabled)
          )
        );
        response.edit({
          embeds: [choiceEmbed],
          components: rows,
        });
        interaction.reply({
          content: `You chose <:${interaction.customId}:951573616208797787>`,
          ephemeral: true,
        });
      }
    );
  },
});
