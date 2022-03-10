const Command = require("../structures/Command");

module.exports = new Command({
  commands: ["deposit"],
  category: "Currency",
  expectedArgs: "<amount>|[all]",
  help: "Deposits the desired quantity to the user's bank account, optionally you can use the all argument to transfer all coins automatically.",
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
        `Incorrect syntax! Try \`${prefix}deposit <amount>\``
      );

    try {
      let amount = Number(args[0]);

      const res = await guildCollection.findOne({
        Guild: guild.id,
      });
      let { coins } = res["Users"].find(
        (obj) => obj.userID == member.user.id
      );
      if (args[0].toLowerCase() === "all") {
        amount = Number(coins);
        if(amount === 0){
          return message.reply(
            "You have 0 coins in your wallet."
          );
        }
      } else {
        if (coins < amount)
          return message.reply(
            "You can't deposit more than what you have in your wallet."
          );
      }
      await guildCollection.findOneAndUpdate(
        {
          Guild: guild.id,
          "Users.userID": member.user.id,
        },
        {
          $inc: {
            "Users.$.coins": -amount,
            "Users.$.bank": amount,
          },
        },
        { returnOriginal: false }
      );
      return message.reply(
        `You sucessfully deposited **${amount} coins** to your bank.`
      );
    } catch (err) {
      console.log(err);
    }
  },
});
