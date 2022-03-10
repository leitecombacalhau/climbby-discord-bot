const Command = require("../structures/Command");

module.exports = new Command({
  commands: ["clear"],
  help: "Deletes a desired amount of messages.",
  category: "Moderation",
  expectedArgs: "<amount>",
  permissions: ["MANAGE_MESSAGES" ,"READ_MESSAGE_HISTORY", "SEND_MESSAGES"],
  permissionError: "You do not have permission to run this command.",
  run: async ({ message, args }) => {
    var purge = args[1];

    if (!purge) {
      message.channel.send({
        content: "Please provide an amount of messages to delete.",
      });
    } else {
      message.delete().then(async (message) => {
        if (isNaN(parseInt(purge)))
          return message.channel.send({
            content: "Please input a valid number of messages to delete!",
          });
        if (parseInt(purge) > 100 || parseInt(purge) < 1)
          return message.channel.send({
            content: "Please input a valid number between 1 to 100",
          });
        const fetched = await message.channel.messages.fetch({ limit: purge });
        console.log(fetched.size + " messages found.");
        message.channel.bulkDelete(fetched);
        message.channel
          .send({
            content: `${fetched.size} messages were deleted successfully!`,
          })
          .then((message) => {
            setTimeout(() => {
              message.delete();
            }, 2000);
          });
        purge = 0;
      });
    }
  },
});
