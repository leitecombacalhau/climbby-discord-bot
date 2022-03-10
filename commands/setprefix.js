const Command = require("../structures/Command");

module.exports = new Command({
  commands: ["setprefix"],
  help: "Sets the prefix for the current server.",
  category: "Moderation",
  expectedArgs: "<prefix>",
  permissions: ["ADMINISTRATOR", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
  permissionError: "You do not have permission to run this command.",
  run: async ({ message, args, guildCollection }) => {
    const res = args[1];
    console.log(res)
    if (!res) return message.reply("Please specify a prefix to change to.");
    guildCollection.findOne({ Guild: message.guild.id }, async (err, data) => {
      if (!data || err) throw err;

      const { Prefix } = await guildCollection.findOneAndUpdate(
        { Guild: message.guild.id },
        { $set: { Prefix: res } },
        { returnOriginal: false }
      );
      message.channel.send(`The prefix has been updated to **${Prefix}**`);
    });
  },
});
