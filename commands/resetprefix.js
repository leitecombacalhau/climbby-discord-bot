const Command = require("../structures/Command")

module.exports = new Command({
  commands: ["resetprefix", "prefixreset", "prefix-reset", "reset-prefix"],
  help: "Resets the prefix for the current server to the default prefix.",
  category: "Moderation",
  expectedArgs: "",
  permissions: ["ADMINISTRATOR", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
  permissionError: "You do not have permission to run this command.",
  run: async ({ message, guildCollection, defaultPrefix }) => {
    const { Prefix } = await guildCollection.findOneAndUpdate(
      { Guild: message.guild.id },
      { $set: { Prefix: defaultPrefix } },
      { returnOriginal: false }
    );
    message.channel.send(`The prefix has been reset to **${Prefix}**`);
  },
});
