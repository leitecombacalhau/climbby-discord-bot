const Command = require("../structures/Command");

module.exports = new Command({
  commands: ["setbal", "setbalance", "setbl"],
  help: "Sets mentioned user's balance",
  category: "Currency",
  expectedArgs: "<@user> <amount>",
  permissions: ["ADMINISTRATOR", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
  permissionError: "You do not have permission to run this command.",
  run: async ({ message, args, prefix, guildCollection, client }) => {
    let member = message.mentions.members.first();
    let amount = args.filter((e) => !e.includes(`<@!${member.user.id}>`));
    if (amount.length !== 2)
      return message.channel.send({
        content: `Incorrect syntax! Try \`${prefix}setbalance <@user> <amount>\``,
      });
    amount.shift();
    amount.join("");

    if (!member) return message.reply("Mention someone.");
    if (isNaN(amount)) return message.reply("Provide an amount of coins.");
    if (member.user.id === client.user.id) return;
    if (
      !(
        message.author.id === "464832300627132416" ||
        message.author.id === "447324939968839680"
      )
    )
      return message.reply(
        `You do not have the required permissions to run this command!`
      );
    try {
      const res = await guildCollection.findOneAndUpdate(
        {
          Guild: message.guild.id,
          "Users.userID": member.user.id,
        },
        {
          $set: {
            "Users.$.coins": Number(amount),
          },
        },
        { returnOriginal: false }
      );
      let obj = res["Users"].find((obj) => obj.userID == member.user.id);
      return message.channel.send({
        content: member.user.username + "'s balance is equal to " + obj.coins,
      });
    } catch (err) {
      console.log(err);
    }
  },
});
