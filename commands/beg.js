const Command = require("../structures/Command");

module.exports = new Command({
  commands: ["beg"],
  help: "Begs for coins",
  category: "Currency",
  expectedArgs: "",
  permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
  permissionError: "You do not have permission to run this command.",
  run: async ({ message, guildCollection }) => {
    const randomNumber = Math.floor(Math.random() * 500) + 1;
    const timeout = 3600000;
    let res = await guildCollection.findOne({
      Guild: message.guild.id,
    });
    let obj = res["Users"].find((obj) => obj.userID == message.author.id);
    if (
      obj.timers.beg !== null &&
      timeout - (Date.now() - obj.timers.beg) > 0
    ) {
      const timeLeft = timeout - (Date.now() - obj.timers.beg);
      const hours = Math.floor(timeLeft / 1000 / 60 / 60);
      const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
      const seconds = Math.floor((timeLeft / 1000) % 60);
      return message.reply(
        `You've already claimed your prize come back in ${hours === 0 ? '':hours+' hour(s), '}${minutes} minute(s) and ${seconds} second(s).`
      );
    } else {
      await guildCollection.findOneAndUpdate(
        {
          Guild: message.guild.id,
          "Users.userID": message.author.id,
        },
        {
          $inc: {
            "Users.$.coins": randomNumber,
          },
          $set: {
            "Users.$.timers.beg": Date.now(),
          },
        }
      );
      return message.reply(`You begged and received **${randomNumber} coins**.`);
    }
  },
});
