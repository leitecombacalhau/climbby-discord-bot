const Command = require("../structures/Command");

module.exports = new Command({
  commands: ["withdraw"],
  category: "Currency",
  expectedArgs: "<amount>|[all]",
  help: "Withdraws the desired quantity from the user's bank, optionally you can use the all argument to transfer all coins automatically.",
  permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
  permissionError: "You do not have permission to run this command.",
  run: async ({ message, guildCollection, args, prefix }) => {
    const { member, guild } = message;
    args.shift();
    if (
      args.length !== 1 ||
      (isNaN(args[0]) && args[0].toLowerCase() !== "all")
    )
      return message.reply(
        `Incorrect syntax! Try \`${prefix}withdraw <amount>\``
      );

    try {
      let amount = Number(args[0]);

      const res = await guildCollection.findOne({
        Guild: guild.id,
      });
      let { bank } = res["Users"].find(
        (obj) => obj.userID == member.user.id
      );
      if (args[0].toLowerCase() === "all") {
        amount = Number(bank);
        if(amount === 0){
          return message.reply(
            "You have 0 coins at your bank."
          );
        }
      } else {
        if (bank < amount) {
          return message.reply(
            "You can't withdraw more than you have in your bank."
          );
        }
      }
      await guildCollection.findOneAndUpdate(
        {
          Guild: guild.id,
          "Users.userID": member.user.id,
        },
        {
          $inc: {
            "Users.$.coins": amount,
            "Users.$.bank": -amount,
          },
        },
        { returnOriginal: false }
      );
      return message.reply(
        `You sucessfully withdrew **${amount} coins** from your bank.`
      );
    } catch (err) {
      console.log(err);
    }
  },
});
