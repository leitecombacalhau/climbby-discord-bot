const Command = require("../structures/Command");

module.exports = new Command({
  commands: ["passed"],
  help: "Respect +100!",
  category: "Fun",
  expectedArgs: "[@user]",
  permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
  permissionError: "You do not have permission to run this command.",
  run: async ({ message }) => {
    let mentionedMember = message.mentions.members.first() || message.member;
    message.channel.send({
      content: `https://some-random-api.ml/canvas/passed?avatar=${mentionedMember.user.displayAvatarURL(
        { dynamic: false, format: "png" }
      )}`,
    });
  },
});
