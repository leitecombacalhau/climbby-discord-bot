const Command = require("../structures/Command.js");

module.exports = new Command({
  commands: ["climbbyavatar", "climbbyavatarmaker"],
  help: "Climbby avatar maker.",
  category: "Misc",
  expectedArgs: "",
  permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS"],
  permissionError: "You do not have permission to run this command.",
  run: async ({ message }) => {
    message.channel.send({ content: "https://climbby-avatar-maker.surge.sh/" });
  },
});
