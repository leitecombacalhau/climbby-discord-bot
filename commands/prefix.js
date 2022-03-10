const Command = require("../structures/Command");

module.exports = new Command({
  commands: ["prefix"],
  help: "Returns current prefix.",
  category: "Misc",
  expectedArgs: "",
  permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
  permissionError: "You do not have permission to run this command.",
  run: async ({ message, prefix }) => {
    message.channel.send({ content: `The prefix is \`${prefix}\`` });
  },
});
